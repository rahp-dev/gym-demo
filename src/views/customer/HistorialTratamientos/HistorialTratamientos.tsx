import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { ColumnFiltersState, Row } from '@tanstack/react-table'

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
import {
  HiArrowLeft,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiPlusCircle,
} from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { useParams, useSearchParams } from 'react-router-dom'
import { Select as SelectType } from '@/@types/select'
import {
  useGetAllTreatmentsQuery,
  useGetCustomerByIdQuery,
} from '@/services/RtkQueryService'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { format } from 'date-fns'
import { ReactElement } from 'react-markdown/lib/react-markdown'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string | number
  onChange: (value: string | number) => void
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
  const { customerId } = useParams()
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
        className="xl:w-[15%] lg:w-[30%] md:w-[30%] mobile:w-full sp:w-full xl:mb-0 lg:mb-0 md:mb-0 mobile:mb-4 sp:mb-4"
        onClick={() =>
          navigate(
            `/clientes/${customerId}/historial-tratamientos/crear-tratamientos`
          )
        }
        icon={<HiPlusCircle />}
      >
        Nuevo Tratamiento
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

type ReactTableProps<T> = {
  renderRowSubComponent: (props: { row: Row<T> }) => ReactElement
  getRowCanExpand: (row: Row<T>) => boolean
}

const ReactTable = ({ renderRowSubComponent, getRowCanExpand }) => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const { data, isFetching } = useGetAllTreatmentsQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      customerId,
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: customerData } = useGetCustomerByIdQuery(customerId)

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage])

  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        header: () => null, // No header
        id: 'expander', // It needs an ID
        cell: ({ row }) => (
          <>
            {row.getCanExpand() ? (
              <button
                className="text-lg"
                {...{ onClick: row.getToggleExpandedHandler() }}
              >
                {row.getIsExpanded() ? (
                  <HiOutlineChevronDown />
                ) : (
                  <HiOutlineChevronRight />
                )}
              </button>
            ) : null}
          </>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        subCell: () => null, // No expander on an expanded row
      },
      {
        header: 'Fecha de Creación:',
        cell: (cellProps: any) => (
          <>{formatDate(cellProps.row.original.createdAt)}</>
        ),
      },
      {
        header: 'Area tratada:',
        accessorKey: 'treatedArea',
      },
      {
        header: 'Sessiones:',
        accessorKey: 'totalSessions',
      },
      {
        header: 'Detalles',
        cell: (cellProps: any) => (
          <span
            className="font-bold cursor-pointer hover:text-pink-500 transition-colors duration-200"
            onClick={() => {
              navigate(`${cellProps.row.original.id}`)
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
    data: data?.data,
    columns,
    getRowCanExpand,
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

  const formatDate = (date: string | null, withTime: boolean = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="xl:text-2xl lg:text-xl md:text-xl mobile:text-xl sp:text-xl">
          Historial de Tratamientos -{' '}
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
        <DebouncedInput
          value={''}
          placeholder="Buscar por máquina, marca..."
          onChange={(value) => {}}
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
                  <>
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
                    {row.getIsExpanded() && (
                      <Tr>
                        {/* 2nd row is a custom 1 cell row */}
                        <Td colSpan={row.getVisibleCells().length}>
                          {renderRowSubComponent({ row })}
                        </Td>
                      </Tr>
                    )}
                  </>
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

const Simple = () => {
  return (
    <div className="flex flex-col">
      <Table className="">
        <THead>
          <Tr>
            <Th>Número de Sesión</Th>
            <Th>Fecha</Th>
            <Th>frecuencia</Th>
            <Th>Observación</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td>1</Td>
            <Td>11/01/2024</Td>
            <Td>500</Td>
            <Td>Primera session, todo correcto</Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>11/01/2024</Td>
            <Td>500</Td>
            <Td>Segunda session, todo correcto</Td>
          </Tr>
        </TBody>
      </Table>
      <Button size="sm" variant="solid" className="w-[320px] m-auto mt-[30px]">
        Crear Siguiente Sesión
      </Button>
    </div>
  )
}

const renderSubComponent = ({ row }: { row: Row<any> }) => {
  return <Simple />
}

const HistorialTratamientos = () => {
  return (
    <ReactTable
      renderRowSubComponent={renderSubComponent}
      getRowCanExpand={() => true}
    />
  )
}

export default HistorialTratamientos
