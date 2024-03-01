import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { Select, Button, DatePicker } from '@/components/ui'
import Table from '@/components/ui/Table'
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
import { HiArrowLeft, HiOutlineCalendar, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { Select as SelectType } from '@/@types/select'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  useGetAllPaymentsQuery,
  useGetCustomerByIdQuery,
} from '@/services/RtkQueryService'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { format } from 'date-fns'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

const { Tr, Th, Td, THead, TBody } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)

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
    <>
      <div className="sm:flex sm:justify-between lg:items-center">
        <div className="xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4 lg:flex lg:items-center lg:w-[65%] xl:max-w-[600px] xl:gap-4 lg:gap-4">
          <div>
            <span className="text-sm font-semibold">Desde:</span>
            <DatePicker
              size="sm"
              inputPrefix={<HiOutlineCalendar className="text-xl" />}
              inputSuffix={null}
              className="xl:w-[200px] lg:w-[180px] md:w-full sp:w-full mobile:w-full"
            />
          </div>

          <div>
            <span className="text-sm font-semibold">Hasta:</span>
            <DatePicker
              size="sm"
              inputPrefix={<HiOutlineCalendar className="text-xl" />}
              inputSuffix={null}
              className="xl:w-[200px] lg:w-[180px] md:w-full sp:w-full mobile:w-full"
            />
          </div>
        </div>

        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/clientes/historial-pagos/crear-pagos')}
          icon={<HiPlusCircle />}
          className="xl:w-[166px] md:w-[166px] mobile:w-full sp:w-full xl:mb-0 lg:mb-0 md:mb-0 mobile:mb-6 sp:mb-6"
        >
          Crear nuevo pago
        </Button>
      </div>
    </>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const HistorialPagos = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [treatmentId, setTreatmentId] = useState(
    searchParams.get('treatmentId') || ''
  )
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data: payments, isFetching } = useGetAllPaymentsQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      customerId,
      ...(treatmentId && { treatmentId: treatmentId }),
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: customerData } = useGetCustomerByIdQuery(customerId)

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(treatmentId && { treatmentId: treatmentId }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, treatmentId])

  const columns = useMemo(
    () => [
      {
        header: 'Fecha de pago:',
        cell: (cellProps: any) => (
          <>{formatDate(cellProps.row.original.dateOfPayment)}</>
        ),
      },
      {
        header: 'Monto pagado:',
        accessorKey: 'amount',
      },
      {
        header: 'Concepto:',
        accessorKey: 'description',
      },
      {
        header: 'Método de pago:',
        accessorKey: `paymentMethod.name`,
      },
      {
        header: 'Detalles',
        cell: (cellProps: any) => (
          <span
            className="font-bold cursor-pointer hover:text-pink-500 transition-colors duration-200"
            onClick={() => {
              const paymentId = cellProps.row.original.id
              navigate(`/clientes/${customerId}/historial-pagos/${paymentId}`)
            }}
          >
            Ver detalles
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: payments?.data,
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

  const formatDate = (date: Date | null, withTime: boolean = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="xl:text-2xl lg:text-xl md:text-xl mobile:text-xl sp:text-xl">
          Historial de Pagos -{' '}
          {customerData ? `${customerData.name} ${customerData.lastName}` : ''}
        </h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate(`/clientes/${customerId}`)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>
      <>
        <DebouncedInput value={''} onChange={() => {}} />
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
            currentPage={+payments?.meta?.page}
            total={payments?.meta.totalItems}
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

export default HistorialPagos
