import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
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
import Pagination from '@/components/ui/Pagination'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi'
import { Avatar, Button, Card, Select, Spinner } from '@/components/ui'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  useGetAllSedesQuery,
  useGetAllUsersMetaDataQuery,
  useGetAllUsersQuery,
  useGetUserStatusesQuery,
} from '@/services/RtkQueryService'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Select as SelectType } from '@/@types/select'
import { PaginateResult } from '@/services/core-entities/paginated-result.entity'
import { User } from '@/services/user/types/user.type'
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
  statusValue: string | number
  onStatusChange: (value: string | number) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput({
  value: initialValue,
  onChange,
  sedeValue,
  onSedeChange,
  statusValue,
  onStatusChange,
  debounce = 700,
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
          placeholder="Buscar usuario..."
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
        color="pink-500"
        className="w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
        icon={<HiOutlineUserAdd />}
        onClick={() => {
          navigate('/usuarios/crear')
        }}
      >
        Crear usuario
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

const Usuarios = () => {
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

  const { data: metaDataUsers, isFetching: metaDataUsersIsFetching } =
    useGetAllUsersMetaDataQuery({}, { refetchOnMountOrArgChange: true })

  const sedeFilter = () => {
    if (isSuperAdmin) {
      return { ...(sedeId && { sedeId: String(sedeId) }) }
    }
    return { sedeId: String(sede) }
  }

  const { data, isFetching } = useGetAllUsersQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search: search }),
      ...(statusId && { statusId: +statusId }),
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
            <Avatar
              shape="circle"
              size="sm"
              className="mr-4"
              src={cellProps.row.original.image}
            />
            <span
              className="font-bold cursor-pointer hover:text-pink-700 transition-colors duration-200"
              onClick={() => {
                navigate(`/usuarios/${cellProps.row.original.id}`)
              }}
            >
              {cellProps.row.original.name}
            </span>
          </div>
        ),
      },
      { header: 'Apellidos', accessorKey: 'lastName' },
      {
        header: 'Sede',
        accessorKey: 'sede.name',
        cell: (cellProps: any) => (
          <div>{cellProps.row.original.sede?.name || 'Sin Sede'}</div>
        ),
      },
      { header: 'Rol', accessorKey: 'session.rol.name' },
      { header: 'Estatus', accessorKey: 'session.status.name' },
    ],
    []
  )

  const table = useReactTable({
    data: (data as PaginateResult<User>)?.data,
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

  const searchUser = (search: string) => {
    setSearch(search)
  }

  return (
    <div>
      <h3 className="mb-4">Usuarios</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-pink-500 rounded items-center justify-center flex">
              <HiOutlineUserGroup className="text-2xl text-white" />
            </span>
            <div className="flex flex-col h-14">
              <span className="dark:text-white">Total de Usuarios</span>
              {metaDataUsersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataUsers?.totalUsers}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-pink-500 rounded items-center justify-center flex">
              <HiOutlineUsers className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Usuarios activos</span>
              {metaDataUsersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataUsers?.activeUsers}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-pink-500 rounded items-center justify-center flex">
              <HiOutlineUserAdd className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Usuarios nuevos</span>
              {metaDataUsersIsFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{metaDataUsers?.newUsers}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar por nombre, email..."
          onChange={searchUser}
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
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {<Sorter sort={header.column.getIsSorted()} />}
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
            currentPage={+(data as PaginateResult<User>)?.meta?.page}
            total={(data as PaginateResult<User>)?.meta.totalItems}
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

export default Usuarios
