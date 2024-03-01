import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateCustomerBody, Customer } from './types/customer.type'

export function getCustomersQuery(builder: EndpointBuilderType) {
  return {
    getAllCustomers: builder.query<
      PaginateResult<Customer>,
      PaginateSearch & { search: string; sedeId: string; statusId: string }
    >({
      query: ({ limit, page, search, sedeId, statusId }) => ({
        url: `customers?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ''
        }${sedeId ? `&sedeId=${sedeId}` : ''}${
          statusId ? `&statusId=${statusId}` : ''
        }`,
        method: 'get',
      }),
      providesTags: ['Customers'] as any,
    }),

    getAllCustomersMetadata: builder.query<
      {
        totalCustomers: number
        activeCustomers: number
        newCustomers: number
      },
      {}
    >({ query: () => ({ url: 'customers/metadata', method: 'get' }) }),

    getCustomerById: builder.query<Customer, string>({
      query: (id: string) => ({ url: `customers/${id}`, method: 'get' }),
      providesTags: ['Customers'] as any,
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerBody>({
      query: (body) => ({ url: 'customers', method: 'post', data: body }),
      invalidatesTags: ['Customers'] as any,
    }),

    updateCustomer: builder.mutation<
      Customer,
      Partial<CreateCustomerBody> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `customers/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Customers'] as any,
    }),
  }
}
