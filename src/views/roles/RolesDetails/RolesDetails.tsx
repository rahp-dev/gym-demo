import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import RolesForm from './RolesForm'
import { Button, Card, Skeleton, toast, Notification } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'
import { FaEdit } from 'react-icons/fa'
import { HiArrowLeft, HiOutlineUser } from 'react-icons/hi'
import {
  useGetRolByIdQuery,
  useUpdateRolMutation,
} from '@/services/RtkQueryService'

const { TabNav, TabList, TabContent } = Tabs

const RolesDetails = () => {
  const { rolId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    name: '',
    description: '',
  })

  const [
    updateRol,
    {
      isLoading: updateRolIsLoading,
      isError: updateRolIsError,
      isSuccess: updateRolIsSuccess,
      isUninitialized: updateRolIsUninitialized,
    },
  ] = useUpdateRolMutation()

  const { data, isFetching } = useGetRolByIdQuery(rolId, {
    refetchOnMountOrArgChange: true,
  })

  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
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
    if (updateRolIsSuccess) {
      openNotification(
        'success',
        'Rol Actualizado',
        'Rol actualizado correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!updateRolIsUninitialized && updateRolIsError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el rol, intentalo más tarde',
        3
      )
    }
  }, [updateRolIsSuccess, updateRolIsError])

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        name: data.name,
        description: data.description || '',
      })
    } else {
      setEditingInitialValues({
        name: '',
        description: '',
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div>
      <Button
        block
        variant="solid"
        color="pink-500"
        icon={<FaEdit />}
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center justify between mb-4">
        <h3>Detalles del Rol</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/roles')}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row gap-4">
          <Card className="xl:w-[400px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between h-full mx-auto">
              <div className="flex flex-col items-center mb-6">
                {isFetching ? (
                  <Skeleton className="mt-2" width={200} height={15} />
                ) : (
                  <h4 className="font-bold">{data?.name}</h4>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Nombre del rol:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Descripción:
                  </span>
                  {isFetching ? (
                    <Skeleton width={200} height={18} />
                  ) : (
                    <span className="text-gray-700 font-semibold dark:text-white/80">
                      {data?.description || 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Rol
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <RolesForm
                    isEditingFields={isEditingFields}
                    initialValues={editingInitialValues}
                    rolId={rolId}
                    isLoading={updateRolIsLoading}
                    updateRol={updateRol}
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

export default RolesDetails
