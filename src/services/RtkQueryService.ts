import { createApi } from '@reduxjs/toolkit/query/react'
import BaseService from './BaseService'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { ValidateSessionResponse } from '@/@types/auth'
import { refreshSession } from '@/utils/refresh-session'
import { addRefreshTimeout } from '@/store'
import { getUsersQuery } from './user/User.service'
import { getSedesQuery } from './sedes/Sede.service'
import { getRolesQuery } from './roles/Roles.service'
import { getMachinesQuery } from './deplilatory-machines/DepilatoryMachines.service'
import { getCustomersQuery } from './customers/Customer.service'
import { EndpointBuilderType } from './core-entities/paginated-result.entity'
import { getTreamentsQuery } from './customers/TreatmentHistory'
import { getPaymentsQuery } from './customers/Payment.service'
import { getMeQuery } from './me/Me.service'
import { getAreasTratadasQuery } from './areas-tratadas/AreasTratadas.service'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async (request) => {
    try {
      const response = BaseService(request)
      return response
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

const RtkQueryService = createApi({
  reducerPath: 'rtkApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Users',
    'Sedes',
    'Roles',
    'Machines',
    'Customers',
    'Customers-Treatment',
    'Customers-Payment',
    'AreasTratadas',
  ],
  endpoints: (builder: EndpointBuilderType) => ({
    ...getUsersQuery(builder),
    ...getSedesQuery(builder),
    ...getRolesQuery(builder),
    ...getMachinesQuery(builder),
    ...getCustomersQuery(builder),
    ...getTreamentsQuery(builder),
    ...getPaymentsQuery(builder),
    ...getMeQuery(builder),
    ...getAreasTratadasQuery(builder),

    validateSession: builder.query<ValidateSessionResponse, {}>({
      query: () => {
        return {
          url: 'auth/validate',
          method: 'get',
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const timeout = setTimeout(async () => {
            await refreshSession()
          }, data.expirationInSeconds * 1000)

          dispatch(addRefreshTimeout({ timeout }))
        } catch (error) {
          console.log('Error validando session')
        }
      },
    }),
  }),
})

export default RtkQueryService
export const {
  useValidateSessionQuery,
  useGetAllUsersQuery,
  useGetAllUsersMetaDataQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useCreateUserMutation,
  useDisableUserMutation,
  useGetAllSedesQuery,
  useGetSedeByIdQuery,
  useUpdateSedeMutation,
  useCreateSedeMutation,
  useGetUserRolesQuery,
  useGetUserStatusesQuery,
  useGetAllRolesQuery,
  useGetAllRolesMetaDataQuery,
  useGetRolByIdQuery,
  useUpdateRolMutation,
  useCreateRolMutation,
  useGetAllMachinesQuery,
  useGetMachineByIdQuery,
  useUpdateMachineMutation,
  useCreateMachineMutation,
  useGetAllCustomersQuery,
  useGetAllCustomersMetadataQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetAllTreatmentsQuery,
  useCreateTreatmentMutation,
  useGetTreamentByIdQuery,
  useUpdateTreatmentMutation,
  useCreatePaymentMutation,
  useGetAllPaymentMethodsQuery,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useGetMyInfoQuery,
  useGetAllAreasTratadasQuery,
  useGetAreaTratadaByIdQuery,
  useUpdateAreaTratadaMutation,
  useCreateAreaTratadaMutation,
  useCreateMonthlyPromotionMutation,
  useUpdateMonthlyPromotionMutation,
} = RtkQueryService
