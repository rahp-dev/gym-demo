import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { User } from '../user/types/user.type'

export function getMeQuery(builder: EndpointBuilderType) {
  return {
    getMyInfo: builder.query<User, {}>({
      query: ({}) => ({ url: 'me', method: 'get' }),
    }),
  }
}
