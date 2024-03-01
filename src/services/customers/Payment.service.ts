import { Select } from '@/@types/select'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  CreateCustomerPaymentBody,
  CustomerPayment,
} from './types/customer-payment.type'
import { PaginateSearch } from '@/@types/pagination'

export function getPaymentsQuery(builder: EndpointBuilderType) {
  return {
    getAllPaymentMethods: builder.query<
      Array<Select>,
      { transformToSelectOptions: boolean }
    >({
      query: ({}) => ({ url: '/customers/payment-methods', method: 'get' }),

      transformResponse: (baseQueryReturnValue: any, meta, arg: any) => {
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: parseInt(item.id),
            label: item.name,
          }))
        }

        return baseQueryReturnValue
      },
    }),

    createPayment: builder.mutation<CustomerPayment, CreateCustomerPaymentBody>(
      {
        query: ({ treatmentId, ...body }) => ({
          url: `/customers/treatments/${treatmentId}/payments`,
          method: 'post',
          data: body,
        }),

        invalidatesTags: ['Customers-Payment'] as any,
      }
    ),

    updatePayment: builder.mutation<
      CustomerPayment,
      Partial<Omit<CreateCustomerPaymentBody, 'treatmentId'>> & {
        paymentId: number
        treatmentId: string
      }
    >({
      query: ({ treatmentId, paymentId, ...body }) => ({
        url: `/customers/treatments/${treatmentId}/payments/${paymentId}`,
        method: 'patch',
        data: body,
      }),
    }),

    getAllPayments: builder.query<
      PaginateResult<CustomerPayment>,
      PaginateSearch & { customerId: string; treatmentId?: string }
    >({
      query: ({ customerId, treatmentId, limit, page }) => ({
        url: `customers/${customerId}/payments?page=${page}&limit=${limit}${
          treatmentId ? `&treatmentId=${treatmentId}` : ''
        }`,
        method: 'get',
      }),
      providesTags: ['Customers-Payment'] as any,
    }),

    getPaymentById: builder.query<
      CustomerPayment,
      { customerId: string; paymentId: string }
    >({
      query: ({ customerId, paymentId }) => ({
        url: `/customers/${customerId}/payments/${paymentId}`,
        method: 'get',
      }),
      providesTags: ['Customers-Payment'] as any,
    }),
  }
}
