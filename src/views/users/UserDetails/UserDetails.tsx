import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { format } from 'date-fns'
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Notification,
  Skeleton,
  Spinner,
  toast,
} from '@/components/ui'
import UserForm from './UserForm'
import FormPassword from './UserPasswordForm'
import Tabs from '@/components/ui/Tabs'

import { HiOutlineUser, HiOutlineLockClosed, HiArrowLeft } from 'react-icons/hi'
import {
  useDisableUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '@/services/RtkQueryService'
import { FaEdit, FaTrash } from 'react-icons/fa'

const { TabNav, TabList, TabContent } = Tabs

const UserDetails = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    email: '',
    lastName: '',
    name: '',
    rolId: 0,
    sedeId: 0,
  })

  const { data, isFetching } = useGetUserByIdQuery(userId, {
    refetchOnMountOrArgChange: true,
  })

  const [
    disableUserMutation,
    {
      isError: disableUserIsError,
      isLoading: disableUserIsLoading,
      isSuccess: disableUserIsSuccess,
      isUninitialized: disableUserisUninitialized,
    },
  ] = useDisableUserMutation()
  const [
    updateUser,
    {
      isLoading: updateIsLoading,
      isError: updateIsError,
      isSuccess: updateIsSuccess,
      isUninitialized: updateIsUninitialized,
    },
  ] = useUpdateUserMutation()

  const formatDate = (date: Date | null) => {
    if (!date) return

    return format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
  }

  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
  }

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = (e: any) => {
    setIsOpen(false)
  }

  const disableUser = async () => {
    disableUserMutation({ id: userId })
  }

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration: number = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  useEffect(() => {
    if (updateIsSuccess) {
      openNotification(
        'success',
        'Usuario Actualizado',
        'Usuario actualizado correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!updateIsUninitialized && updateIsError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el usuario, intentalo más tarde',
        3
      )
    }

    if (disableUserIsSuccess) {
      openNotification(
        'success',
        'Usuario Deshabilitado',
        'El Usuario ha sido deshabilitado correctamente',
        3
      )

      setIsOpen(false)
      window.scrollTo(0, 0)
    }

    if (!disableUserisUninitialized && disableUserIsError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error deshabilitando el usuario, intentalo más tarde',
        3
      )
    }
  }, [updateIsSuccess, updateIsError, disableUserIsSuccess, disableUserIsError])

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        email: data?.session?.email || '',
        lastName: data?.lastName || '',
        name: data?.name || '',
        rolId: +data?.session?.rol?.id || 0,
        sedeId: +data?.sede?.id || 0,
      })
    } else {
      setEditingInitialValues({
        email: '',
        lastName: '',
        name: '',
        rolId: 0,
        sedeId: 0,
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div className="flex xl:justify-between gap-6">
      <Button
        variant="solid"
        color="pink-500"
        className="xl:w-[150px]"
        icon={<FaEdit />}
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
      <Button
        variant="solid"
        color="pink-600"
        className="xl:w-[150px]"
        icon={<FaTrash />}
        onClick={() => openDialog()}
      >
        Deshabilitar
      </Button>

      <Dialog
        isOpen={dialogIsOpen}
        contentClassName="pb-0 px-0"
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <div className="px-6 pb-6">
          <h5 className="mb-4">Deshabilitar usuario</h5>
          <p className="dark:text-white/90">
            ¿Está seguro de que desea Deshabilitar este usuario?, ten en cuenta
            que solo los administradores del sistema pueden volver activar a
            este usuario, tampoco se borrará ningun registro que este vinculado
            a el mismo.
          </p>
        </div>

        <div className="flex items-center justify-end px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            size="sm"
            variant="solid"
            color="pink-500"
            onClick={onDialogClose}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="red-600"
            size="sm"
            onClick={disableUser}
          >
            {disableUserIsLoading ? <Spinner color="red-100" /> : 'Confirmar'}
          </Button>
        </div>
      </Dialog>
    </div>
  )

  const cardHeader = (
    <div className="flex flex-col items-center">
      {isFetching ? (
        <Skeleton variant="circle" width={100} height={100} />
      ) : (
        <>
          <Avatar shape="circle" src={data?.image} size={90} className="mb-4" />
          <h4 className="font-bold">{data?.name}</h4>
        </>
      )}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles del Usuario</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/usuarios')}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row gap-4">
          <Card
            className="xl:max-w-[360px]"
            header={cardHeader}
            footer={cardFooter}
          >
            <div className="grid xl:grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 xl:h-[642px]">
              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Nombre:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.name}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Apellido:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.lastName}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Fecha de creación:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {formatDate(data?.createdAt)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Fecha de actualización:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {formatDate(data?.updatedAt)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Correo:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.session.email}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Rol:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.session.rol.name}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Estatus:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.session.status.name}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Veces que ha ingresado:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.session.timesLoggedIn}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold dark:text-white/80">
                      Ultima vez que ingresó:
                    </span>
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {formatDate(data?.session?.lastAccess) || 'Nunca'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="w-full xl:h-[120%]">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Perfil
                </TabNav>
                <TabNav value="tab2" icon={<HiOutlineLockClosed />}>
                  Contraseña
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <UserForm
                    initialValues={editingInitialValues}
                    isEditingFields={isEditingFields}
                    userId={userId}
                    isLoading={updateIsLoading}
                    updateUser={updateUser}
                  />
                </TabContent>
                <TabContent value="tab2">
                  <FormPassword
                    userId={userId}
                    isEditingFields={isEditingFields}
                  />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
