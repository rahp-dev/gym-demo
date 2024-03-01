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
  HiOutlineSearch,
  HiOutlineServer,
  HiOutlineTrash,
  HiOutlineUserAdd,
} from 'react-icons/hi'
import { useNavigate } from 'react-router'
import {
  useGetAllCustomersMetadataQuery,
  useGetAllCustomersQuery,
  useGetAllSedesQuery,
  useGetUserStatusesQuery,
} from '@/services/RtkQueryService'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Select as SelectType } from '@/@types/select'
import { useSearchParams } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
  sedeValue: string | number
  onSedeChange: (value: string | number) => void
  statusValue: string | number
  onStatusChange: (value: string | number) => void
}

const { Tr, Th, Td, THead, TBody } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  sedeValue,
  onSedeChange,
  statusValue,
  onStatusChange,
  ...props
}: DebouncedInputProps) {
  const navigate = useNavigate()
  const { isSuperAdmin } = useAuth()

  const [value, setValue] = useState(initialValue)
  const [statusOptionValue, setStatusOptionValue] = useState(statusValue)
  const [sedeOptionValue, setSedeOptionValue] = useState(sedeValue)
  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )
  const { data: statusesOption } = useGetUserStatusesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const handleResetButtonClick = () => {
    setStatusOptionValue(null)
    setSedeOptionValue(null)
    setValue(null)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  useEffect(() => {
    setSedeOptionValue(sedeValue)
    setStatusOptionValue(statusValue)
  }, [sedeValue, statusValue])

  useEffect(() => {
    onSedeChange(sedeOptionValue)
  }, [sedeOptionValue])

  useEffect(() => {
    onStatusChange(statusOptionValue)
  }, [statusOptionValue])

  return (
    <div className="sm:flex sm:justify-between lg:items-center">
      <div className="xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4 lg:flex lg:items-center lg:justify-center lg:w-[65%] xl:max-w-[600px] xl:gap-4 lg:gap-4">
        <Input
          {...props}
          value={value}
          size="sm"
          placeholder="Buscar cliente..."
          prefix={<HiOutlineSearch className="text-lg" />}
          onChange={(e) => setValue(e.target.value)}
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
        />
        <Select
          options={statusesOption}
          size="sm"
          placeholder="Estatus"
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
          onChange={(e: SelectType) => setStatusOptionValue(e.value)}
          value={statusesOption?.filter(
            (option: SelectType) => option.value === statusOptionValue
          )}
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
        color="blue-500"
        className="w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
        icon={<HiOutlineUserAdd />}
        onClick={() => {
          navigate('/clientes/crear-cliente')
        }}
      >
        Crear cliente
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

const Clientes = () => {
  const navigate = useNavigate()
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [sedeId, setSedeId] = useState(+searchParams.get('sedeId') || '')
  const [statusId, setStatusId] = useState(+searchParams.get('statusId') || '')
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data: metaDataCustomers, isFetching: metaDataCustomersIsFetching } =
    useGetAllCustomersMetadataQuery({}, { refetchOnMountOrArgChange: true })

  const sedeFilter = () => {
    if (isSuperAdmin) {
      return { ...(sedeId && { sedeId: String(sedeId) }) }
    }
    return { sedeId: String(sede) }
  }

  const { data, isFetching } = useGetAllCustomersQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
      ...(statusId && { statusId: String(statusId) }),
      ...sedeFilter(),
    },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
      ...(statusId && { statusId: String(statusId) }),
      ...(sedeId && isSuperAdmin && { sedeId: String(sedeId) }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search, sedeId, statusId])

  const columns = useMemo(
    () => [
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: (cellProps: any) => (
          <div className="flex items-center">
            <span
              onClick={() => {
                navigate(`/clientes/${cellProps.row.original.id}`)
              }}
              className="font-bold cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              {cellProps.row.original.name}
            </span>
          </div>
        ),
      },
      {
        header: 'Apellidos',
        accessorKey: 'lastName',
      },
      {
        header: 'Cédula',
        cell: (cellProps: any) => <>{cellProps.row.original.cedula || 'N/A'}</>,
      },
      {
        header: 'Peso',
        cell: (cellProps: any) => <p>75kg</p>,
      },
      {
        header: 'Altura',
        cell: (cellProps: any) => <p>1.85m</p>,
      },
    ],
    []
  )

  const table = useReactTable({
    data: data?.data,
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
    debugColumns: false,
    debugHeaders: false,
    debugRows: false,
    debugTable: false,
  })

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: SelectType) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  return (
    <div>
      <h3 className="mb-4">Clientes</h3>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-blue-500 rounded items-center justify-center flex">
              <HiOutlineServer className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Clientes</span>
              {metaDataCustomersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataCustomers?.totalCustomers}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-blue-500 rounded items-center justify-center flex">
              <HiOutlineServer className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Clientes Activos</span>
              {metaDataCustomersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataCustomers?.activeCustomers}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-blue-500 rounded items-center justify-center flex">
              <HiOutlineServer className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Nuevos Clientes</span>
              {metaDataCustomersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataCustomers?.newCustomers}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar Cliente..."
          onChange={setSearch}
          sedeValue={sedeId}
          onSedeChange={setSedeId}
          statusValue={statusId}
          onStatusChange={setStatusId}
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
            <TableRowSkeleton columns={5} rows={pageSize} />
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
            currentPage={+data?.meta?.page}
            total={data?.meta.totalItems}
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

export default Clientes
