import { TokenStatusEnum } from '@/enums/token-status.enum'

export type SignInCredential = {
  username: string
  password: string
}

export type SignInResponse = {
  access_token: string
  refresh_token: string
  expirationInSeconds: number
  type: number
  rol: number
  sede: number
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  userName: string
  email: string
  password: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}

export type ValidateSessionResponse = {
  status: TokenStatusEnum
  expirationInSeconds: number
  type: number
}

export type ValidateSession = {
  at: string
}
