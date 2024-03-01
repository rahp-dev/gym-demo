import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'sedes',
    path: '/sedes',
    component: lazy(() => import('@/views/sedes/Sedes')),
    authority: ['1'],
  },
  {
    key: 'crear-sede',
    path: '/sedes/crear',
    component: lazy(() => import('@/views/sedes/NuevaSede')),
    authority: ['1'],
  },
  {
    key: 'editar-sede',
    path: '/sedes/editar-sede/:sedeId',
    component: lazy(() => import('@/views/sedes/EditarSede/EditarSede')),
    authority: ['1'],
  },
  {
    key: 'clientes',
    path: '/clientes',
    component: lazy(() => import('@/views/customer/Clientes')),
    authority: ['1', '2', '3'],
  },
  {
    key: 'crear-cliente',
    path: '/clientes/crear-cliente',
    component: lazy(() => import('@/views/customer/NewCustomer/NewCustomer')),
    authority: ['1', '2', '3'],
  },
  {
    key: 'clientes-details',
    path: '/clientes/:customerId',
    component: lazy(
      () => import('@/views/customer/CustomerDetails/CustomerDetails')
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'historial-pagos',
    path: '/clientes/:customerId/historial-pagos',
    component: lazy(
      () => import('@/views/customer/HistorialPagos/HistorialPagos')
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'crear-pago',
    path: '/clientes/:customerId/historial-tratamientos/:treatmentId/crear-pago',
    component: lazy(
      () => import('@/views/customer/HistorialPagos/NuevoPago/NuevoPago')
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'pago-details',
    path: '/clientes/:customerId/historial-pagos/:paymentId',
    component: lazy(
      () => import('@/views/customer/HistorialPagos/PagoDetails/PagoDetails')
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'historial-tratamientos',
    path: '/clientes/:customerId/historial-tratamientos',
    component: lazy(
      () =>
        import('@/views/customer/HistorialTratamientos/HistorialTratamientos')
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'tratamientos-details',
    path: '/clientes/:customerId/historial-tratamientos/:treatmentId',
    component: lazy(
      () =>
        import(
          '@/views/customer/HistorialTratamientos/TratamientoDetails/TratamientoDetails'
        )
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'crear-tratamientos',
    path: '/clientes/:customerId/historial-tratamientos/crear-tratamientos',
    component: lazy(
      () =>
        import(
          '@/views/customer/HistorialTratamientos/NuevoTratamiento/NuevoTratamiento'
        )
    ),
    authority: ['1', '2', '3'],
  },
  {
    key: 'usuarios',
    path: '/usuarios',
    component: lazy(() => import('@/views/users/Usuarios')),
    authority: ['1', '2', '3'],
  },
  {
    key: 'detalle-usuarios',
    path: '/usuarios/:userId',
    component: lazy(() => import('@/views/users/UserDetails/UserDetails')),
    authority: ['1', '2', '3'],
  },
  {
    key: 'crear-usuario',
    path: '/usuarios/crear',
    component: lazy(() => import('@/views/users/NewUsers/NewUser')),
    authority: ['1', '2', '3'],
  },
  {
    key: 'roles',
    path: '/roles',
    component: lazy(() => import('@/views/roles/Roles')),
    authority: ['1', '2'],
  },
  {
    key: 'crear-rol',
    path: '/roles/crear',
    component: lazy(() => import('@/views/roles/NewRoles/NewRoles')),
    authority: ['1', '2'],
  },
  {
    key: 'detalles-rol',
    path: '/roles/:rolId',
    component: lazy(() => import('@/views/roles/RolesDetails/RolesDetails')),
    authority: ['1', '2'],
  },
  {
    key: 'maquinas',
    path: '/maquinas',
    component: lazy(() => import('@/views/maquinas/Maquinas')),
    authority: ['1', '2'],
  },
  {
    key: 'crear-maquina',
    path: '/maquinas/crear',
    component: lazy(() => import('@/views/maquinas/NewMaquinas/NewMaquinas')),
    authority: ['1', '2'],
  },
  {
    key: 'detalles-maquina',
    path: '/maquinas/:machineId',
    component: lazy(
      () => import('@/views/maquinas/MaquinasDetails/MaquinaDetails')
    ),
    authority: ['1', '2'],
  },
  {
    key: 'historial-maquina',
    path: '/maquinas/:machineId/historial-maquina',
    component: lazy(
      () => import('@/views/maquinas/HistorialMaquina/HistorialMaquina')
    ),
    authority: ['1', '2'],
  },
  {
    key: 'areas-tratadas',
    path: '/areas-tratadas',
    component: lazy(() => import('@/views/areas-tratadas/All-Areas/AllAreas')),
    authority: [],
  },
  {
    key: 'areas-tratadas-detalle',
    path: '/areas-tratadas/:areaId',
    component: lazy(
      () => import('@/views/areas-tratadas/Area-Detail/AreaDetail')
    ),
    authority: [],
  },
  {
    key: 'areas-tratadas-crear',
    path: '/areas-tratadas/crear',
    component: lazy(
      () =>
        import('@/views/areas-tratadas/Create-Area-Tratada/CreateAreaTratada')
    ),
    authority: [],
  },
  // GYM
  {
    key: 'trainingPlan',
    path: '/plan-de-entrenamiento',
    component: lazy(() => import('@/views/training-plans/TrainingPlan')),
    authority: [],
  },
  {
    key: 'planCreate',
    path: '/plan-de-entrenamiento/crear',
    component: lazy(() => import('@/views/training-plans/NewPlans/NewPlans')),
    authority: [],
  },
  {
    key: 'payments',
    path: '/pagos',
    component: lazy(() => import('@/views/payments/Payments')),
    authority: [],
  },
  // GYM
  {
    key: 'access-denied',
    path: '/access-denied',
    component: lazy(() => import('@/views/access-denied/AccessDenied')),
    authority: [],
  },
]
