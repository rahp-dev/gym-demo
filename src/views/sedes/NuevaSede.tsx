import { Button, Card, toast } from '@/components/ui'
import SedeForm from './SedeForm'
import { useNavigate } from 'react-router'
import { HiArrowLeft } from 'react-icons/hi'
import { useCreateSedeMutation } from '@/services/RtkQueryService'
import { Notification } from '@/components/ui'
import { useEffect } from 'react'

const NuevaSede = () => {
  const navigate = useNavigate()
  const [createSede, { isError, isSuccess, isLoading, isUninitialized }] =
    useCreateSedeMutation()

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
    if (isSuccess) {
      openNotification('success', 'Éxito', 'Sede creada correctamente')
      setTimeout(() => {
        navigate(`/sedes`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al crear la sede, intentalo más tarde'
      )
    }
  }, [isSuccess, isError])

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h3>Crear sede</h3>
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

      <div className="flex items-center justify-center">
        <Card className="xl:w-1/2 lg:w-full mobile:w-full sp:w-full flex flex-col items-center">
          <SedeForm createSede={createSede} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  )
}

export default NuevaSede
