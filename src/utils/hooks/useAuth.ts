import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  addRefreshTimeout,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

import { refreshSession } from '../refresh-session'
import { RolesEnum } from '@/enums/roles.enum'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const query = useQuery()

  const { token, signedIn, refreshTimeouts, rol } = useAppSelector(
    (state) => state.auth.session
  )

  const handleSignOut = () => {
    for (const timeout of refreshTimeouts) {
      clearTimeout(timeout)
    }

    dispatch(signOutSuccess())

    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values)
      if (!resp.data) {
        return
      }

      const {
        access_token,
        refresh_token,
        expirationInSeconds,
        type,
        rol,
        sede,
      } = resp.data
      dispatch(
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

      dispatch(addRefreshTimeout({ timeout }))

      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
      return {
        status: 'success',
        message: '',
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values)
      if (resp.data) {
        const {
          access_token,
          refresh_token,
          expirationInSeconds,
          type,
          rol,
          sede,
        } = resp.data
        dispatch(
          signInSuccess({
            access_token,
            refresh_token,
            expirationInSeconds,
            type,
            rol,
            sede,
          })
        )

        const redirectUrl = query.get(REDIRECT_URL_KEY)
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
        return {
          status: 'success',
          message: '',
        }
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signOut = async () => {
    await apiSignOut()

    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    isSuperAdmin: rol === RolesEnum.GERENTE,
    signIn,
    signUp,
    signOut,
  }
}

export default useAuth
