import { Button, Card, toast } from '@/components/ui'
import EditForm from './EditForm'
import { useNavigate } from 'react-router'
import { HiArrowLeft } from 'react-icons/hi'
import { useParams } from 'react-router-dom'
import {
  useGetSedeByIdQuery,
  useUpdateSedeMutation,
} from '@/services/RtkQueryService'
import { Notification } from '@/components/ui'
import { useEffect } from 'react'

const EditarSede = () => {
  const { sedeId } = useParams()
  const navigate = useNavigate()
  const { data, isFetching, isError } = useGetSedeByIdQuery(
    { id: sedeId },
    { refetchOnMountOrArgChange: true }
  )
  const [
    updateSede,
    { isError: IsErrorInUpdate, isSuccess, isLoading, isUninitialized },
  ] = useUpdateSedeMutation()

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
      openNotification('success', 'Éxito', 'Sede actualizada correctamente')
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al actualizar la sede, intentalo más tarde'
      )
    }
  }, [IsErrorInUpdate, isSuccess])

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h3>Editar sede</h3>
        <Button
          size="sm"
          variant="solid"
          color="pink-500"
          onClick={() => navigate('/sedes')}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>

      <div className="flex justify-center items-center">
        <Card className="xl:w-1/2 lg:w-full mobile:w-full sp:w-full flex flex-col items-center">
          <EditForm
            updateSede={updateSede}
            data={data}
            isFetching={isFetching}
            isLoading={isLoading}
            sedeId={sedeId}
          />
        </Card>
      </div>
    </div>
  )
}

export default EditarSede
