import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Skeleton } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'

import { HiArrowLeft } from 'react-icons/hi'
import { FaEdit, FaMoneyBillAlt } from 'react-icons/fa'

import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import PagoForm from './PagoForm'
import { useGetPaymentByIdQuery } from '@/services/RtkQueryService'
import { format } from 'date-fns'

const PagoDetails = () => {
  const { customerId, paymentId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    amount: 0,
    description: '',
    sedeId: 0,
    userReceiverId: 0,
    dateOfPayment: null,
    paymentMethodId: 0,
  })

  const { data, isFetching } = useGetPaymentByIdQuery(
    {
      customerId,
      paymentId,
    },
    { refetchOnMountOrArgChange: true }
  )

  const formatDate = (date: Date | null, withTime: boolean = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  const handleToggleEditing = () => {
    setIsEditingFields((prevIsEditingFields) => !prevIsEditingFields)
  }

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        amount: data?.amount,
        description: data?.description,
        sedeId: data?.sede?.id,
        userReceiverId: +data?.userReceiver?.id,
        dateOfPayment: new Date(data?.dateOfPayment),
        paymentMethodId: data?.paymentMethod?.id,
      })
    } else {
      setEditingInitialValues({
        amount: 0,
        description: '',
        sedeId: 0,
        userReceiverId: 0,
        dateOfPayment: null,
        paymentMethodId: 0,
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div>
      <Button
        block
        variant="twoTone"
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
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles del pago</h3>
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
        <div className="flex flex-col xl:flex-row gap-4">
          <Card className="xl:w-[500px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between mx-auto">
              <div className="flex flex-col items-center mb-6">
                <h4 className="font-bold">Pago {data?.id}</h4>
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
                      <span className="font-semibold dark:text-white/80">
                        Monto:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
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
                      <span className="font-semibold dark:text-white/80">
                        Concepto:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.description || 'N/A'}
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
                      <span className="font-semibold dark:text-white/80">
                        Fecha y hora:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {formatDate(data?.dateOfPayment) || 'N/A'}
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
                      <span className="font-semibold dark:text-white/80">
                        Sede:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.sede?.name || 'N/A'}
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
                      <span className="font-semibold dark:text-white/80">
                        Recibido Por:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {`${data?.userReceiver?.name} ${data?.userReceiver?.lastName}`}
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
                      <span className="font-semibold dark:text-white/80">
                        Método de pago:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.paymentMethod?.name || 'N/A'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  <p
                    onClick={() => {
                      navigate(
                        `/clientes/${customerId}/historial-tratamientos/${data?.treatment?.id}`
                      )
                    }}
                    className="font-bold cursor-pointer text-pink-600"
                  >
                    Tratamiento
                  </p>
                </div>

                <div className="flex flex-col">
                  <p
                    onClick={() => {
                      navigate(`/clientes/${customerId}`)
                    }}
                    className="font-bold cursor-pointer text-pink-600"
                  >
                    Cliente
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<FaMoneyBillAlt />}>
                  Pago
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <PagoForm
                    treatmentId={data?.treatment?.id}
                    isEditingFields={isEditingFields}
                    setIsEditingFields={setIsEditingFields}
                    initialValues={editingInitialValues}
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
