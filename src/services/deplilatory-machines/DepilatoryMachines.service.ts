export function getMachinesQuery(builder: any) {
  return {
    getAllMachines: builder.query({
      query: ({ limit, page, search, sedeId, paginated }) => ({
        url: `depilatory-machines?${page ? `page=${page}` : ''}${
          limit ? `&limit=${limit}` : ''
        }${search ? `&search=${search}` : ''}${
          sedeId || sedeId === 0 ? `&sedeId=${sedeId}` : ''
        }${paginated !== undefined ? `&paginated=${paginated}` : ''}`,
        method: 'get',
      }),

      transformResponse: (baseQueryReturnValue: any, meta, arg: any) => {
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: parseInt(item.id),
            label: item.name,
          }))
        }

        return baseQueryReturnValue
      },

      providesTags: ['Machines'] as any,
    }),

    getMachineById: builder.query({
      query: (id: string) => ({
        url: `depilatory-machines/${id}`,
        method: 'get',
      }),
      providesTags: ['Machines'] as any,
    }),

    updateMachine: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/depilatory-machines/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Machines'] as any,
    }),

    createMachine: builder.mutation({
      query: (body) => ({
        url: 'depilatory-machines',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Machines'] as any,
    }),
  }
}
