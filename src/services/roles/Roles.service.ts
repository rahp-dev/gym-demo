import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Rol } from './types/Rol.types'
import { PaginateSearch } from '@/@types/pagination'

export function getRolesQuery(builder: EndpointBuilderType) {
  return {
    getAllRoles: builder.query<
      PaginateResult<Rol>,
      PaginateSearch & { search: string }
    >({
      query: ({ limit, page, search }) => ({
        url: `roles?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ''
        }`,
        method: 'get',
      }),
      providesTags: ['Roles'] as any,
    }),

    getAllRolesMetaData: builder.query<{ totalRoles: number }, {}>({
      query: () => ({ url: 'roles/metadata', method: 'get' }),
    }),

    getRolById: builder.query<Rol, string>({
      query: (id: string) => ({ url: `roles/${id}`, method: 'get' }),
      providesTags: ['Roles'] as any,
    }),

    updateRol: builder.mutation<
      Rol,
      { id: string; name?: string; description?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `roles/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Roles'] as any,
    }),

    createRol: builder.mutation<Rol, { name: string; description?: string }>({
      query: (body) => ({ url: 'roles', method: 'post', data: body }),
      invalidatesTags: ['Roles'] as any,
    }),
  }
}
