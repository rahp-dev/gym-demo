import { combineReducers } from '@reduxjs/toolkit'
import session, { SessionState } from './sessionSlice'

const reducer = combineReducers({
  session,
})

export type AuthState = {
  session: SessionState
}

export * from './sessionSlice'

export default reducer
