import {
  HiOutlineFingerPrint,
  HiOutlineHome,
  HiOutlineMap,
  HiOutlineServer,
} from 'react-icons/hi'
import { FaList, FaHandFist, FaUsers, FaMoneyBills } from 'react-icons/fa6'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  headquarters: <HiOutlineMap />,
  customer: <FaUsers />,
  users: <FaUsers />,
  roles: <HiOutlineFingerPrint />,
  maquinas: <HiOutlineServer />,
  treatedAreas: <FaList />,
  trainingPlan: <FaHandFist />,
  payments: <FaMoneyBills />,
}

export default navigationIcon
