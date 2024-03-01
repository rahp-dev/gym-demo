import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateTreatmentBody, Treatment } from './types/treatment.type'

export function getTreamentsQuery(builder: EndpointBuilderType) {
  return {
    getAllTreatments: builder.query<
      PaginateResult<Treatment>,
      PaginateSearch & {
        customerId: string
        startDate?: Date
        finalDate?: Date
      }
    >({
      query: ({ customerId, limit, page, startDate, finalDate }) => ({
        url: `customers/${customerId}/treatments?${page ? `page=${page}` : ''}${
          limit ? `&limit=${limit}` : ''
        }${startDate ? `&startDate=${startDate}` : ''}${
          finalDate ? `&finalDate=${finalDate}` : ''
        }`,
        method: 'get',
      }),
      providesTags: ['Customers-Treatment'] as any,
    }),

    getTreamentById: builder.query<
      Treatment,
      { customerId: string; treatmentId: string }
    >({
      query: ({ customerId, treatmentId }) => ({
        url: `customers/${customerId}/treatments/${treatmentId}`,
        method: 'get',
      }),
      providesTags: ['Customers-Treatment'] as any,
    }),

    createTreatment: builder.mutation<Treatment, CreateTreatmentBody>({
      query: ({ customerId, ...body }) => ({
        url: `customers/${customerId}/treatments`,
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Customers-Treatment'] as any,
    }),

    updateTreatment: builder.mutation<
      Treatment,
      Partial<CreateTreatmentBody> & {
        treatmentId: string
        customerId: string
        isComplete?: boolean
      }
    >({
      query: ({ treatmentId, customerId, ...body }) => ({
        url: `customers/${customerId}/treatments/${treatmentId}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Customers-Treatment'] as any,
    }),
  }
}
