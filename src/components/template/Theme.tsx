import ConfigProvider from '@/components/ui/ConfigProvider'
import useDarkMode from '@/utils/hooks/useDarkmode'
import type { CommonProps } from '@/@types/common'
import { themeConfig } from '@/configs/theme.config'
import store, { useAppSelector } from '@/store'
import { useValidateSessionQuery } from '@/services/RtkQueryService'
import deepParseJson from '@/utils/deepParseJson'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import { Loading } from '../shared'

const Theme = (props: CommonProps) => {
  const theme = useAppSelector((state) => state.theme)
  const locale = useAppSelector((state) => state.locale.currentLang)
  useDarkMode()

  const currentTheme = {
    ...themeConfig,
    ...theme,
    ...{ locale },
  }

  const { auth } = store.getState()
  const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
  const persistData = deepParseJson(rawPersistData)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let signedIn = (persistData as any)?.auth?.session?.token
  let sessionInfo: any = { isLoading: false }

  if (!signedIn) {
    signedIn = auth?.session?.signedIn
  }

  sessionInfo = useValidateSessionQuery({})

  return (
    <>
      {sessionInfo.isLoading ? (
        <div className="flex flex-auto flex-col h-[100vh] text-center justify-center items-center">
          <Loading
            loading={true}
            spinnerClass={`text-${currentTheme.themeColor}-${currentTheme.primaryColorLevel}`}
            text="Verificando Sesión..."
          />
        </div>
      ) : (
        <ConfigProvider value={currentTheme}>{props.children}</ConfigProvider>
      )}
    </>
  )
}

export default Theme
