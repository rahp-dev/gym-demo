import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Skeleton } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'

import { HiArrowLeft, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { FaEdit, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import CustomerForm from './CustomerForm'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { CgFacebook } from 'react-icons/cg'
import { useGetCustomerByIdQuery } from '@/services/RtkQueryService'
import { format } from 'date-fns'

const CustomerDetails = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    name: '',
    lastName: '',
    cedula: '',
    sedeId: 1,
    phone: '',
    email: '',
    birthDate: null,
    skinType: '',
    hairColor: '',
    street: '',
    city: '',
    state: '',
  })

  const { data, isFetching } = useGetCustomerByIdQuery(customerId, {
    refetchOnMountOrArgChange: true,
  })

  const formatDate = (date: string | null, withTime: boolean = true) => {
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
        name: data?.name,
        lastName: data?.lastName,
        cedula: data?.cedula || '',
        sedeId: data?.sede?.id,
        phone: data?.phone || '',
        email: data?.session?.email || '',
        birthDate: data?.birthDate ? new Date(data?.birthDate) : null,
        skinType: data?.skinType,
        hairColor: data?.hairColor,
        street: data?.address?.street || '',
        city: data?.address?.city || '',
        state: data?.address?.state || '',
      })
    } else {
      setEditingInitialValues({
        name: '',
        lastName: '',
        cedula: '',
        sedeId: 0,
        phone: '',
        email: '',
        birthDate: null,
        skinType: '',
        hairColor: '',
        street: '',
        city: '',
        state: '',
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div className="flex xl:justify-between gap-4">
      <Button
        block
        variant="solid"
        color="pink-500"
        icon={<FaEdit />}
        className="xl:w-[150px]"
        onClick={() => handleToggleEditing()}
      >
        Editar
      </Button>
      <Button
        block
        variant="solid"
        color="pink-600"
        icon={<HiOutlineTrash />}
        className="xl:w-[150px]"
        onClick={() => handleToggleEditing()}
      >
        Deshabilitar
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles del cliente</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/clientes')}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 h-full">
          <Card className="xl:w-[500px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between mx-auto ">
              <div className="flex flex-col items-center">
                {isFetching ? (
                  <Skeleton width={150} height={20} className="mt-2" />
                ) : (
                  <h4 className="font-bold text-center text-gray-700 antialiased">
                    {data?.name} {data?.lastName}
                  </h4>
                )}
              </div>

              <div className="grid xl:grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mt-8">
                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
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
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
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
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Cédula:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.cedula || 'N/A'}
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
                        Teléfono:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.phone || 'N/A'}
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
                        Correo:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.session?.email || 'N/A'}
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
                        Fecha de nacimiento:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {formatDate(data?.birthDate, false) || 'N/A'}
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
                        Tipo de piel:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.skinType || 'N/A'}
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
                        Color de vello:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.hairColor}
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
                        Dirección:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.address?.street || 'N/A'}
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
                        Ciudad:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.address?.city || 'N/A'}
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
                        Estado:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.address?.state || 'N/A'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold dark:text-white/80">
                    Redes sociales
                  </span>
                  <div className="flex flex-row gap-x-3 mt-2">
                    <Button shape="circle" size="sm" icon={<CgFacebook />} />
                    <Button shape="circle" size="sm" icon={<FaTwitter />} />
                    <Button shape="circle" size="sm" icon={<FaWhatsapp />} />
                    <Button shape="circle" size="sm" icon={<FaInstagram />} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Cliente
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <CustomerForm
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

export default CustomerDetails
