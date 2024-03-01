import store, {
  addRefreshTimeout,
  signInSuccess,
  signOutSuccess,
} from '@/store'
import deepParseJson from './deepParseJson'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import axios from 'axios'
import { SignInResponse } from '@/@types/auth'
import appConfig from '@/configs/app.config'

export async function refreshSession() {
  const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
  const persistData = deepParseJson(rawPersistData)

  let accessToken = (persistData as any).auth.session.token
  let refreshToken = (persistData as any).auth.session.refreshToken
  let signedIn = (persistData as any).auth.session.token
  const { auth } = store.getState()

  if (!accessToken) {
    accessToken = auth.session.token
  }

  if (!refreshToken) {
    accessToken = auth.session.refreshToken
  }

  if (!signedIn) {
    signedIn = auth.session.signedIn
  }

  if (!refreshToken || !accessToken || !signedIn) {
    for (const timeout of auth.session.refreshTimeouts) {
      clearTimeout(timeout)
    }

    store.dispatch(signOutSuccess())

    window.location.reload()
  }

  const data = {
    access_token: accessToken,
    refresh_token: refreshToken,
  }

  const refreshResponse = await axios.post<SignInResponse>(
    '/auth/refresh',
    data,
    {
      baseURL: appConfig.apiUrl,
      validateStatus: (status) => {
        return status <= 500
      },
    }
  )

  if (refreshResponse.status !== 200) {
    for (const timeout of auth.session.refreshTimeouts) {
      clearTimeout(timeout)
    }

    store.dispatch(signOutSuccess())

    window.location.reload()
  }

  const { access_token, refresh_token, expirationInSeconds, type, rol, sede } =
    refreshResponse.data

  store.dispatch(
    signInSuccess({
      access_token,
      refresh_token,
      expirationInSeconds,
      type,
      rol,
      sede,
    })
  )

  const timeout = setTimeout(async () => {
    await refreshSession()
  }, expirationInSeconds * 1000)

  store.dispatch(addRefreshTimeout({ timeout }))
}
