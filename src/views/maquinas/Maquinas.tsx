import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { Card, Select, Button, Spinner } from '@/components/ui'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineServer,
  HiOutlineTrash,
  HiOutlineUserAdd,
} from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { Select as SelectType } from '@/@types/select'
import {
  useGetAllMachinesQuery,
  useGetAllSedesQuery,
} from '@/services/RtkQueryService'
import { useSearchParams } from 'react-router-dom'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  sedeValue: string | number
  onSedeChange: (value: string | number) => void
}

const { Tr, Th, Td, THead, TBody } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 700,
  onSedeChange,
  sedeValue,
  ...props
}: DebouncedInputProps) {
  const { isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const [value, setValue] = useState(initialValue)
  const [sedeOptionValue, setSedeOptionValue] = useState(sedeValue)
  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const handleResetButtonClick = () => {
    setSedeOptionValue(null)
    setValue(null)
  }

  useEffect(() => {
    setSedeOptionValue(sedeValue)
  }, [sedeValue])

  useEffect(() => {
    onSedeChange(sedeOptionValue)
  }, [sedeOptionValue])

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="sm:flex sm:justify-between lg:items-center">
      <div className="xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4 lg:flex lg:items-center lg:w-[65%] xl:max-w-[600px] xl:gap-4 lg:gap-4">
        <Input
          {...props}
          value={value}
          size="sm"
          placeholder="Buscar maquina..."
          prefix={<HiOutlineSearch className="text-lg" />}
          onChange={(e) => setValue(e.target.value)}
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
        />

        {isSuperAdmin && (
          <Select
            options={sedeOptions}
            placeholder="Sede"
            size="sm"
            className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
            onChange={(e: SelectType) => setSedeOptionValue(e.value)}
            value={sedeOptions?.filter(
              (option: SelectType) => option.value === sedeOptionValue
            )}
          />
        )}

        <Button
          size="sm"
          className="xl:w-[10%] lg:w-[15%] md:w-full mobile:w-full sp:w-full mb-0 md:mb-2 text-xl"
          icon={<HiOutlineTrash />}
          onClick={handleResetButtonClick}
        />
      </div>

      <Button
        variant="solid"
        size="sm"
        color="pink-500"
        className="w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
        icon={<HiOutlineUserAdd />}
        onClick={() => {
          navigate('/maquinas/crear')
        }}
      >
        Crear máquina
      </Button>
    </div>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const Maquinas = () => {
  const navigate = useNavigate()
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [sedeId, setSedeId] = useState(+searchParams.get('sedeId') || '')
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const sedeFilter = () => {
    if (isSuperAdmin) {
      return { ...(sedeId && { sedeId: String(sedeId) }) }
    }
    return { sedeId: String(sede) }
  }

  const { data: dataMachine, isFetching } = useGetAllMachinesQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
      ...sedeFilter(),
    },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
      ...(sedeId && isSuperAdmin && { sedeId: String(sedeId) }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search, sedeId])

  const columns = useMemo(
    () => [
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: (cellProps: any) => (
          <span
            onClick={() => {
              navigate(`${cellProps.row.original.id}`)
            }}
            className="font-bold cursor-pointer hover:text-pink-500 transition-colors duration-200"
          >
            {cellProps.row.original.name}
          </span>
        ),
      },
      {
        header: 'Marca',
        accessorKey: 'brand',
      },
      {
        header: 'Serial',
        accessorKey: 'serial',
      },
      {
        header: 'Contador',
        accessorKey: 'counter',
      },
      {
        header: 'Sede',
        accessorKey: 'sede.name',
      },
    ],
    []
  )

  const table = useReactTable({
    data: (dataMachine as any)?.data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: SelectType) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  const searchMachine = (search: string) => {
    setSearch(search)
  }

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-pink-500 rounded items-center justify-center flex">
              <HiOutlineServer className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Maquinas</span>
              {isFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{(dataMachine as any)?.meta.totalItems}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar por máquina, marca..."
          onChange={searchMachine}
          sedeValue={sedeId}
          onSedeChange={setSedeId}
        />
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </THead>
          {isFetching ? (
            <TableRowSkeleton
              columns={5}
              rows={pageSize}
              avatarInColumns={[0]}
            />
          ) : (
            <TBody className="dark:text-white/90 dark:font-semibold">
              {table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </TBody>
          )}
        </Table>

        <div className="flex items-center mt-5">
          <Pagination
            currentPage={+(dataMachine as any)?.meta?.page}
            total={(dataMachine as any)?.meta.totalItems}
            pageSize={pageSize}
            onChange={onPaginationChange}
          />
          <div style={{ minWidth: 120 }}>
            <Select
              size="sm"
              isSearchable={false}
              defaultValue={pageSizeOption[0]}
              options={pageSizeOption}
              onChange={(selected) => onPageSelect(selected as SelectType)}
            />
          </div>
        </div>
      </>
    </div>
  )
}

export default Maquinas
