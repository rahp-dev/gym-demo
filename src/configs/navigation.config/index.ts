import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
  {
    key: 'clientes',
    path: '/clientes',
    title: 'Clientes',
    translateKey: '',
    icon: 'customer',
    type: NAV_ITEM_TYPE_ITEM,
    authority: ['1', '2', '3'],
    subMenu: [],
  },
  {
    key: 'trainingPlan',
    path: '/plan-de-entrenamiento',
    title: 'Plan de Entrenamiento',
    translateKey: '',
    icon: 'trainingPlan',
    type: NAV_ITEM_TYPE_ITEM,
    authority: ['1', '2'],
    subMenu: [],
  },
  {
    key: 'payments',
    path: '/pagos',
    title: 'Pagos',
    translateKey: '',
    icon: 'payments',
    type: NAV_ITEM_TYPE_ITEM,
    authority: ['1', '2'],
    subMenu: [],
  },

  // {
  //   key: 'usuarios',
  //   path: '/usuarios',
  //   title: 'Usuarios',
  //   translateKey: '',
  //   icon: 'users',
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: ['1', '2'],
  //   subMenu: [],
  // },
  // {
  //   key: 'sedes',
  //   path: '/sedes',
  //   title: 'Sedes',
  //   translateKey: '',
  //   icon: 'headquarters',
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: ['1'],
  //   subMenu: [],
  // },
  // {
  //   key: 'roles',
  //   path: '/roles',
  //   title: 'Roles',
  //   translateKey: '',
  //   icon: 'roles',
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: ['1'],
  //   subMenu: [],
  // },
  // {
  //   key: 'maquinas',
  //   path: '/maquinas',
  //   title: 'Máquinas',
  //   translateKey: '',
  //   icon: 'maquinas',
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: ['1', '2'],
  //   subMenu: [],
  // },
  // {
  //   key: 'areas-tratadas',
  //   path: '/areas-tratadas',
  //   title: 'Áreas Tratadas',
  //   translateKey: '',
  //   icon: 'treatedAreas',
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [],
  //   subMenu: [],
  // },
]

export default navigationConfig
