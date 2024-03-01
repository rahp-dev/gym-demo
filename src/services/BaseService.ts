import axios from 'axios'
import appConfig from '@/configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess } from '../store'

const unauthorizedCode = [401]

const BaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiUrl,
})

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let accessToken = (persistData as any).auth?.session?.token

    if (!accessToken) {
      const { auth } = store.getState()
      accessToken = auth?.session?.token
    }

    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BaseService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error
    const { auth } = store.getState()

    if (response && unauthorizedCode.includes(response.status)) {
      for (const timeout of auth.session.refreshTimeouts) {
        clearTimeout(timeout)
      }

      store.dispatch(signOutSuccess())
    }

    return Promise.reject(error?.response?.data)
  }
)

export default BaseService
