import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  HiOutlineUserGroup,
  HiOutlinePlus,
} from 'react-icons/hi'

import { Card, Select, Spinner } from '@/components/ui'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { useGetAllAreasTratadasQuery } from '@/services/RtkQueryService'
import { TreatedArea } from '@/services/areas-tratadas/types/areas-tratadas.type'
import { PaginateResult } from '@/services/core-entities/paginated-result.entity'

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
          color="pink-500"
          className="mobile:w-full sp:w-full"
          icon={<HiOutlinePlus />}
          onClick={() => {
            navigate('/areas-tratadas/crear')
          }}
        >
          Crear Nueva Área Tratada
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

function AllAreas() {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data, isFetching } = useGetAllAreasTratadasQuery(
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

  const getLabelIsInPromotion = (data: TreatedArea) => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return ''
    }

    return '(En Promoción)'
  }

  const getpackageAmount = (data: TreatedArea) => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.packageAmount
    }

    return monthlyPromotion.packageAmount
  }

  const getAmountPackOfFour = (data: TreatedArea) => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.amountPackOfFour
    }

    return monthlyPromotion.amountPackOfFour
  }

  const getIndividualPrice = (data: TreatedArea) => {
    const [monthlyPromotion] = data.monthlyPromotion

    if (!monthlyPromotion) {
      return data.individualPrice
    }

    return monthlyPromotion.individualPrice
  }

  const columns = useMemo(
    () => [
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: (cellProps: any) => (
          <span
            className="font-bold cursor-pointer hover:text-pink-700 transition-colors duration-200"
            onClick={() => {
              navigate(`/areas-tratadas/${cellProps.row.original.id}`)
            }}
          >
            {`${cellProps.row.original.name} ${getLabelIsInPromotion(
              cellProps.row.original
            )}`}
          </span>
        ),
      },
      {
        header: 'Precio del paquete',
        cell: (cellProps: any) => (
          <>{getpackageAmount(cellProps.row.original)}</>
        ),
      },
      {
        header: 'Precio de 4 Sesiones',
        cell: (cellProps: any) => (
          <>{getAmountPackOfFour(cellProps.row.original)}</>
        ),
      },
      {
        header: 'Precio individual',
        cell: (cellProps: any) => (
          <>{getIndividualPrice(cellProps.row.original)}</>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: (data as PaginateResult<TreatedArea>)?.data,
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
      <h3 className="mb-4">Areas Tratadas</h3>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-pink-500 rounded items-center justify-center flex">
              <HiOutlineUserGroup className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Areas Tratadas</span>
              {false ? <Spinner size={30} className="mt-1" /> : <h3>5</h3>}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar Área Tratada"
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
            currentPage={+(data as PaginateResult<TreatedArea>)?.meta?.page}
            total={(data as PaginateResult<TreatedArea>)?.meta.totalItems}
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

export default AllAreas
