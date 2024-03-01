import { useMemo, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { FilterFn, ColumnFiltersState } from '@tanstack/react-table'

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
import { rankItem } from '@tanstack/match-sorter-utils'
import { HiArrowLeft, HiOutlineCalendar } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { useGetMachineByIdQuery } from '@/services/RtkQueryService'
import { useParams } from 'react-router-dom'

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

  const { machineId } = useParams()
  const { data: dataMachine } = useGetMachineByIdQuery(machineId)

  return (
    <>
      <div className="flex justify-between">
        <h3 className="xl:text-2xl lg:text-xl mb-4">
          Historial de "{(dataMachine as any)?.name}"
        </h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="mb-6">
        <span className="text-sm font-semibold">Filtrar por fecha:</span>
        <DatePicker
          size="sm"
          inputPrefix={<HiOutlineCalendar className="text-xl" />}
          inputSuffix={null}
          className="xl:w-1/5 lg:w-1/3 md:w-1/3"
        />
      </div>
    </>
  )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const dataFake = () => {
  const arr = [
    {
      id: 1,
      dateOfPayment: new Date().toLocaleDateString(),
      initialCounter: '0',
      finalCounter: '1000',
    },
    {
      id: 2,
      dateOfPayment: new Date().toLocaleDateString(),
      initialCounter: '0',
      finalCounter: '1000',
    },
    {
      id: 3,
      dateOfPayment: new Date().toLocaleDateString(),
      initialCounter: '0',
      finalCounter: '1000',
    },
    {
      id: 4,
      dateOfPayment: new Date().toLocaleDateString(),
      initialCounter: '0',
      finalCounter: '1000',
    },
    {
      id: 5,
      dateOfPayment: new Date().toLocaleDateString(),
      initialCounter: '0',
      finalCounter: '1000',
    },
  ]

  return arr
}

const totalData = dataFake().length

const pageSizeOption = [
  { value: 10, label: '10 / por página' },
  { value: 20, label: '20 / por página' },
]

const HistorialMaquina = () => {
  const navigate = useNavigate()
  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
  }
  const onSelectChange = (value = 0) => {
    table.setPageSize(Number(value))
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      {
        header: 'Fecha:',
        accessorKey: 'dateOfPayment',
      },
      {
        header: 'Contador inicial:',
        accessorKey: 'initialCounter',
      },
      {
        header: 'Contador final:',
        accessorKey: 'finalCounter',
      },
    ],
    []
  )

  const [data] = useState(() => dataFake())

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugHeaders: false,
    debugColumns: false,
  })

  return (
    <div>
      <>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
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
        </Table>

        <div className="flex items-center justify-between mt-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            total={totalData}
            currentPage={table.getState().pagination.pageIndex + 1}
            onChange={onPaginationChange}
          />
          <div style={{ minWidth: 130 }}>
            <Select<Option>
              size="sm"
              isSearchable={false}
              value={pageSizeOption.filter(
                (option) =>
                  option.value === table.getState().pagination.pageSize
              )}
              options={pageSizeOption}
              onChange={(option) => onSelectChange(option?.value)}
            />
          </div>
        </div>
      </>
    </div>
  )
}

export default HistorialMaquina
