import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Skeleton, toast, Notification } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'

import { HiArrowLeft } from 'react-icons/hi'
import { FaEdit, FaMoneyBill, FaUserInjured } from 'react-icons/fa'

import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TratamientoForm from './TratamientoForm'
import {
  useGetTreamentByIdQuery,
  useUpdateTreatmentMutation,
} from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { Treatment } from '@/services/customers/types/treatment.type'

const PagoDetails = () => {
  const { customerId, treatmentId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)

  const [editingInitialValues, setEditingInitialValues] = useState({
    datetime: null,
    treatedArea: '',
    session: '',
    invoiceNumber: '',
    amount: 0,
    specialistId: 0,
    depilatoryMachineId: 0,
    sedeId: 0,
    machineFinalCounter: '',
  })

  const [balance, setBalance] = useState({
    balancePaid: 0,
    balanceDue: 0,
  })

  const { data, isFetching, isSuccess } = useGetTreamentByIdQuery(
    {
      customerId,
      treatmentId,
    },
    { refetchOnMountOrArgChange: true }
  )

  const [
    updateTreatment,
    {
      isUninitialized: completeTreatmentIsUninitialized,
      isSuccess: completeTreatmentIsSuccess,
      isError: completeTreatmentIsError,
      error: completeTreatmentError,
    },
  ] = useUpdateTreatmentMutation()

  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
  }

  const formatDate = (date: string | null | Date, withTime: boolean = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  const calculateBalancePaid = (payments: Treatment['payments']) => {
    let balancePaid = 0

    for (const payment of payments) {
      balancePaid += payment.amount
    }

    return balancePaid
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

  const markTreatmentComplete = () => {
    const body: {
      isComplete: boolean
      treatmentId: string
      customerId: string
    } = { isComplete: true, treatmentId, customerId }

    updateTreatment(body)
  }

  const getMachineInitialCounter = () => {
    return data?.isComplete
      ? data?.machineInitialCounter
      : data?.depilatory_machine?.counter
  }

  useEffect(() => {
    if (isFetching) return

    const balancePaid = calculateBalancePaid(data?.payments)
    const balanceDue = data.balanceDue

    setBalance({ balancePaid, balanceDue })
  }, [isFetching, isSuccess])

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        datetime: new Date(data?.datetime),
        treatedArea: data?.treatedArea,
        session: data?.session,
        invoiceNumber: data?.invoiceNumber,
        amount: data?.amount,
        specialistId: +data?.specialist?.id,
        depilatoryMachineId: data?.depilatory_machine?.id,
        sedeId: data?.sede?.id,
        machineFinalCounter: data?.machineFinalCounter,
      })
    } else {
      setEditingInitialValues({
        datetime: null,
        treatedArea: '',
        session: '',
        invoiceNumber: '',
        amount: 0,
        specialistId: 0,
        depilatoryMachineId: 0,
        sedeId: 0,
        machineFinalCounter: '',
      })
    }
  }, [data, isFetching])

  useEffect(() => {
    if (completeTreatmentIsSuccess) {
      openNotification(
        'success',
        'Tratamiento Actualizado',
        'Tratamiento actualizado correctamente',
        3
      )

      setIsEditingFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!completeTreatmentIsUninitialized && completeTreatmentIsError) {
      console.log()
      openNotification(
        'warning',
        'Error',
        (completeTreatmentError as any).message ||
          'Ocurrio un error actualizando el Tratamiento, intentalo más tarde',
        3
      )
    }
  }, [completeTreatmentIsSuccess, completeTreatmentIsError])

  const cardFooter = (
    <div className="flex flex-wrap justify-between gap-2">
      <Button
        block
        variant="twoTone"
        color="pink-700"
        icon={<FaEdit />}
        className="xl:w-[48%]"
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
      <Button
        block
        variant="twoTone"
        color="pink-700"
        icon={<FaMoneyBill />}
        className="xl:w-[48%] "
        onClick={() =>
          navigate(
            `/clientes/${customerId}/historial-tratamientos/${treatmentId}/crear-pago`
          )
        }
      >
        Registrar Pago
      </Button>

      <Button
        block
        variant="twoTone"
        color="emerald-700"
        icon={<FaMoneyBill />}
        className="xl:w-[100%]"
        disabled={data?.isComplete}
        onClick={markTreatmentComplete}
      >
        Marcar como terminada
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles del tratamiento</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 h-full">
          <Card className="xl:w-[500px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between h-full mx-auto">
              <div className="flex flex-col items-center mb-6">
                {isFetching ? (
                  <Skeleton width={100} height={25} />
                ) : (
                  <h5 className="font-bold">Tratamiento {data?.id}</h5>
                )}
              </div>

              <div className="grid xl:grid-cols-1 sm:grid-cols-2 gap-y-5 mt-8">
                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Fecha y Hora:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {formatDate(data?.datetime)}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Especialista:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {`${data?.specialist?.name} ${data?.specialist?.lastName}`}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Area Tratada:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {data?.treatedArea}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Sesión:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {data?.session}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Contador Inicial de la Máquina:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {getMachineInitialCounter() || 'N/A'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Contador Final de la Máquina:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {data?.machineFinalCounter || 'N/A'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Número de Factura:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {data?.invoiceNumber}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Monto:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {data?.amount}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Saldo Abonado:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {balance.balancePaid}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/90">
                        Deuda Pendiente:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/90">
                        {balance.balanceDue}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  <Link
                    to={`/clientes/${customerId}/historial-pagos?treatmentId=${treatmentId}`}
                    className="font-bold cursor-pointer text-pink-600 dark:text-pink-400"
                  >
                    Historial de Pagos
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<FaUserInjured />}>
                  Tratamiento
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <TratamientoForm
                    isEditingFields={isEditingFields}
                    setIsEditingFields={setIsEditingFields}
                    initialValues={editingInitialValues}
                    isComplete={data?.isComplete}
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

export default PagoDetails
