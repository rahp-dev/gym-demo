import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { AxiosRequestConfig } from 'axios'

export type PaginateResultMeta = {
  totalItems: number
  limit: number
  page: number
  totalPages: number
  previousPageUrl: string
  nextPageUrl: string
  lastPageUrl: string
  firstPageUrl: string
}

export type PaginateResult<T> = {
  data: Array<T>
  meta: PaginateResultMeta
}

export type EndpointBuilderType = EndpointBuilder<
  BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  >,
  never,
  'rtkApi'
>
