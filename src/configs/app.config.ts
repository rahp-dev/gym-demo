export type AppConfig = {
  apiUrl: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  tourPath: string
  locale: string
  enableMock: boolean
}

const appConfig: AppConfig = {
  apiUrl: `${import.meta.env.VITE_API_URL}/`,
  authenticatedEntryPath: '/clientes',
  unAuthenticatedEntryPath: '/sign-in',
  tourPath: '/',
  locale: 'en',
  enableMock: false,
}

export default appConfig
