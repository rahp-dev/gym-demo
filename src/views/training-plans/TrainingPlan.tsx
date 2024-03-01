import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Card, Select, Spinner } from '@/components/ui'
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
  HiOutlineFingerPrint,
  HiOutlinePlus,
  HiOutlineSearch,
} from 'react-icons/hi'
import { Button } from '@/components/ui/Button'
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import {
  useGetAllRolesMetaDataQuery,
  useGetAllRolesQuery,
} from '@/services/RtkQueryService'
import { FaHandFist } from 'react-icons/fa6'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

type Option = {
  value: number
  label: string
}

const { Tr, Th, Td, THead, TBody } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()

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
    <div className="flex xl:items-center xl:justify-between lg:flex-row lg:justify-between xl:flex-row mobile:flex-col sp:flex-col md:flex-row md:justify-between">
      <div className="flex items-center mb-4">
        <Input
          {...props}
          value={value}
          size="sm"
          prefix={<HiOutlineSearch className="text-lg" />}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="flex items-center mb-4">
        <Button
          size="sm"
          variant="solid"
          color="blue-500"
          className="mobile:w-full sp:w-full"
          icon={<HiOutlinePlus />}
          onClick={() => {
            navigate('crear')
          }}
        >
          Crear plan
        </Button>
      </div>
    </div>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const TrainingPlan = () => {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data: metaDataRoles, isFetching: metaDataRolesIsFetching } =
    useGetAllRolesMetaDataQuery({}, { refetchOnMountOrArgChange: true })
  const { data, isFetching } = useGetAllRolesQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
    },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

  const columns = useMemo(
    () => [
      {
        header: 'Plan de Entrenamiento',
        accessorKey: 'plan',
        cell: (cellProps: any) => (
          <span className="font-bold cursor-pointer hover:text-blue-700 transition-colors duration-200">
            {cellProps.row.original.plan}
          </span>
        ),
      },
      {
        header: 'Ejercicios',
        accessorKey: 'training',
      },
      {
        header: 'Detalles',
        cell: (cellProps: any) => (
          <span className="font-bold cursor-pointer hover:text-blue-500 transition-colors duration-200">
            Ver detalles
          </span>
        ),
      },
    ],
    []
  )

  const dataFake = [
    {
      id: 1,
      plan: 'Espalda – Tríceps – Cardio',
      training: 'Espalda, Triceps',
    },
    {
      id: 1,
      plan: 'Pecho – Bíceps – Abdomen – Cardio',
      training: 'Pecho, Biceps, Abdomen',
    },
    {
      id: 1,
      plan: 'Hombro – Pierna',
      training: 'Hombros, Piernas',
    },
  ]

  const table = useReactTable({
    data: dataFake,
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

  const onPageSelect = ({ value }: Option) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  return (
    <div>
      <h3 className="mb-4">Planes de Entrenamiento</h3>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-blue-500 rounded items-center justify-center flex">
              <FaHandFist className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Planes</span>
              {metaDataRolesIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataRoles?.totalRoles}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar por nombre de rol"
          onChange={setSearch}
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
              columns={3}
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
                        <Td key={cell.id} className="w-1/4">
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
              onChange={(selected) => onPageSelect(selected as Option)}
            />
          </div>
        </div>
      </>
    </div>
  )
}

export default TrainingPlan
