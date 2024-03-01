import classNames from 'classnames'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Select } from '../ui'
import { useGetAllSedesQuery } from '@/services/RtkQueryService'
import { Select as SelectType } from '@/@types/select'
import { useAppSelector } from '@/store'

interface HeaderProps extends CommonProps {
  headerStart?: ReactNode
  headerEnd?: ReactNode
  headerMiddle?: ReactNode
  container?: boolean
}

const Header = (props: HeaderProps) => {
  const { headerStart, headerEnd, headerMiddle, className, container } = props

  const { data: sedeOptions } = useGetAllSedesQuery(
    {
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  const { sede } = useAppSelector((state) => state.auth.session)

  return (
    <header className={classNames('header', className)}>
      <div
        className={classNames(
          'header-wrapper',
          HEADER_HEIGHT_CLASS,
          container && 'container mx-auto'
        )}
      >
        <div className="header-action header-action-start md:block">
          {headerStart}
        </div>
        {headerMiddle && (
          <div className="header-action header-action-middle">
            {headerMiddle}
          </div>
        )}
        <div className="header-action header-action-end">
          {/* <div className="header-action">
            <Select
              size="sm"
              isDisabled={true}
              placeholder="Todas las sedes"
              value={sedeOptions?.filter(
                (option: SelectType) => option.value === sede
              )}
              options={sedeOptions}
              className="mr-4 w-[190px]"
            ></Select>
          </div> */}
          {headerEnd}
        </div>
      </div>
    </header>
  )
}

export default Header
