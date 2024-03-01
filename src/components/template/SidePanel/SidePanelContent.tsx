import type { ThemeConfiguratorProps } from '@/components/template/ThemeConfigurator'
import ModeSwitcher from '../ThemeConfigurator/ModeSwitcher'
import NavModeSwitcher from '../ThemeConfigurator/NavModeSwitcher'

export type SidePanelContentProps = ThemeConfiguratorProps

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SidePanelContent = (props: SidePanelContentProps) => {
  return (
    <div className="flex flex-col">
      <div>
        <span>Modo oscuro</span>
        <ModeSwitcher />
      </div>
      <span className="mt-5">Colores</span>
      <NavModeSwitcher />
    </div>
  )
}

export default SidePanelContent
