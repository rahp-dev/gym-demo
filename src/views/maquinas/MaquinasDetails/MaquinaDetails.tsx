import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Notification, Skeleton, toast } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'
import {
  HiArrowLeft,
  HiOutlineAnnotation,
  HiOutlineServer,
  HiPencil,
} from 'react-icons/hi'
import {
  useGetMachineByIdQuery,
  useUpdateMachineMutation,
} from '@/services/RtkQueryService'
import MachineForm from './MaquinaForm'

const { TabNav, TabList, TabContent } = Tabs

const MaquinasDetails = () => {
  const { machineId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
  }
  const [editingInitialValues, setEditingInitialValues] = useState({
    name: '',
    brand: '',
    model: '',
    serial: '',
    counter: '',
    sedeId: 0,
  })

  const [
    updateMachine,
    {
      isLoading: updateIsLoading,
      isError: updateIsError,
      isSuccess: updateIsSuccess,
      isUninitialized: updateIsUninitialized,
    },
  ] = useUpdateMachineMutation()

  const { data, isFetching } = useGetMachineByIdQuery(machineId, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (updateIsSuccess) {
      openNotification(
        'success',
        'Maquina Actualizada',
        'Maquina actualizada correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!updateIsUninitialized && updateIsError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando la maquina, intentalo más tarde',
        3
      )
    }
  }, [updateIsSuccess, updateIsError])

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
    if (data && !isFetching) {
      setEditingInitialValues({
        name: (data as any)?.name || '',
        brand: (data as any)?.brand || '',
        model: (data as any)?.model || '',
        serial: (data as any)?.serial || '',
        counter: (data as any)?.counter || '',
        sedeId: +(data as any)?.sede?.id || 0,
      })
    } else {
      setEditingInitialValues({
        name: '',
        brand: '',
        model: '',
        serial: '',
        counter: '',
        sedeId: 0,
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div className="flex gap-4">
      <Button
        block
        variant="solid"
        color="pink-500"
        icon={<HiPencil />}
        className="xl:w-full lg:w-1/2 md:w-1/2 mobile:w-1/2 sp:w-1/2"
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
      <Button
        variant="solid"
        color="red-600"
        onClick={() => navigate(`/maquinas/${machineId}/historial-maquina`)}
        icon={<HiOutlineAnnotation />}
        className="xl:w-full lg:w-1/2 md:w-1/2 mobile:w-1/2 sp:w-1/2"
      >
        Historial
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="xl:text-2xl mobile:text-xl">Detalles de la Máquina</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/maquinas')}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-4">
          <Card className="xl:w-2/6 xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between mx-auto">
              <div className="flex flex-col items-center">
                {isFetching ? (
                  <Skeleton width={150} height={20} className="mt-2" />
                ) : (
                  <h4 className="text-gray-700 font-bold dark:text-white">
                    {(data as any)?.name}
                  </h4>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[30%]" />
                      <Skeleton className="mt-1 w-[50%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Nombre:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.name}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[30%]" />
                      <Skeleton className="mt-1 w-[50%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Marca:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.brand}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[25%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Modelo:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.model}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[25%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Serial:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.serial}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[25%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Contador:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.counter || 'N/A'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[25%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white">
                        Sede actual:
                      </span>
                      <span className="text-gray-700 font-bold dark:text-white">
                        {(data as any)?.sede.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineServer />}>
                  Máquinas
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <MachineForm
                    isEditingFields={isEditingFields}
                    initialValues={editingInitialValues}
                    machineId={machineId}
                    isLoading={updateIsLoading}
                    updateMachine={updateMachine}
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

export default MaquinasDetails
