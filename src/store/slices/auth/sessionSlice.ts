import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
  signedIn: boolean
  token: string | null
  refreshToken: string | null
  expirationInSeconds: number
  type: number
  rol: number
  sede: number
  refreshTimeouts: Array<NodeJS.Timeout>
}

const initialState: SessionState = {
  signedIn: false,
  token: null,
  refreshToken: null,
  expirationInSeconds: 0,
  type: 0,
  rol: 0,
  sede: 0,
  refreshTimeouts: [],
}

const sessionSlice = createSlice({
  name: `${SLICE_BASE_NAME}/session`,
  initialState,
  reducers: {
    signInSuccess(
      state,
      action: PayloadAction<{
        access_token: string
        refresh_token: string
        expirationInSeconds: number
        type: number
        rol: number
        sede: number
      }>
    ) {
      return {
        ...state,
        signedIn: true,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        expirationInSeconds: action.payload.expirationInSeconds,
        type: action.payload.type,
        rol: action.payload.rol,
        sede: action.payload.sede,
      }
    },
    signOutSuccess(state) {
      return { ...state, ...initialState }
    },
    addRefreshTimeout(
      state,
      action: PayloadAction<{ timeout: NodeJS.Timeout }>
    ) {
      return {
        ...state,
        refreshTimeouts: [...state.refreshTimeouts, action.payload.timeout],
      }
    },
  },
})

export const { signInSuccess, signOutSuccess, addRefreshTimeout } =
  sessionSlice.actions
export default sessionSlice.reducer
