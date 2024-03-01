import { Sede } from './types/sede.types'
import { Select } from '@/@types/select'
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getSedesQuery(builder: EndpointBuilderType) {
  return {
    getAllSedes: builder.query<
      Array<Sede | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({
        url: 'sedes',
        method: 'get',
      }),

      transformResponse: (
        baseQueryReturnValue: Array<Sede>,
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        }

        return baseQueryReturnValue
      },

      providesTags: ['Sedes'] as any,
    }),

    getSedeById: builder.query<Sede, { id: string }>({
      query: ({ id }) => ({ url: `sedes/${id}`, method: 'get' }),
      providesTags: ['Sedes'] as any,
    }),

    updateSede: builder.mutation<
      Sede,
      { name: string; image: Array<File>; id: string }
    >({
      query: ({ id, ...body }) => {
        const { name, image } = body
        const formdata = new FormData()

        formdata.append('name', name)

        if (image.length) {
          formdata.append('image', image[0])
        }

        return {
          url: `sedes/${id}`,
          method: 'patch',
          data: formdata,
        }
      },
      invalidatesTags: ['Sedes'] as any,
    }),

    createSede: builder.mutation<Sede, { name: string; image: Array<File> }>({
      query: (body: { name: string; image: Array<File> }) => {
        const { name, image } = body
        const formdata = new FormData()

        formdata.append('name', name)

        if (image.length) {
          formdata.append('image', image[0])
        }

        return {
          url: 'sedes',
          method: 'post',
          data: formdata,
        }
      },
    }),
  }
}
