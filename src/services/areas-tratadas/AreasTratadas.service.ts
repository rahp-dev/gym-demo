import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateTreatedAreaBody, TreatedArea } from './types/areas-tratadas.type'
import {
  CreateMonthlyPromotionBody,
  MonthlyPromotion,
} from './types/monthly-promotion.type'
import { Select } from '@/@types/select'

export function getAreasTratadasQuery(builder: EndpointBuilderType) {
  return {
    getAllAreasTratadas: builder.query<
      PaginateResult<TreatedArea> | Select[],
      PaginateSearch & {
        search?: string
        paginated?: boolean
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, search, paginated }) => ({
        url: `treated-areas?${page ? `page=${page}` : ''}${
          limit ? `&limit=${limit}` : ''
        }${search ? `&search=${search}` : ''}${
          paginated !== undefined ? `&paginated=${paginated}` : ''
        }`,
        method: 'get',
      }),

      transformResponse: (
        baseQueryReturnValue: PaginateResult<TreatedArea> | Select[],
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as unknown as TreatedArea[]).map(
            (item) => ({
              value: parseInt(item.id),
              label: `${item.name}`,
            })
          )
        }

        return baseQueryReturnValue
      },

      providesTags: ['AreasTratadas'] as any,
    }),

    getAreaTratadaById: builder.query<TreatedArea, string>({
      query: (id: string) => ({ url: `treated-areas/${id}`, method: 'get' }),
      providesTags: ['AreasTratadas'] as any,
    }),

    updateAreaTratada: builder.mutation<
      TreatedArea,
      CreateTreatedAreaBody & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `treated-areas/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['AreasTratadas'] as any,
    }),

    createAreaTratada: builder.mutation<TreatedArea, CreateTreatedAreaBody>({
      query: (body) => ({ url: 'treated-areas', method: 'post', data: body }),
      invalidatesTags: ['AreasTratadas'] as any,
    }),

    createMonthlyPromotion: builder.mutation<
      MonthlyPromotion,
      CreateMonthlyPromotionBody
    >({
      query: (body) => ({
        url: 'treated-areas/create-monthly-promotion',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['AreasTratadas'] as any,
    }),

    updateMonthlyPromotion: builder.mutation<
      MonthlyPromotion,
      Omit<CreateMonthlyPromotionBody, 'treatedAreaId'> & { id: number }
    >({
      query: (body) => ({
        url: 'treated-areas/update-monthly-promotion',
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['AreasTratadas'] as any,
    }),
  }
}
