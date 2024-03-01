import { useNavigate } from 'react-router-dom'

import { Card, Notification, Tabs, toast } from '@/components/ui'
import { Button } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { HiArrowLeft, HiOutlineServer } from 'react-icons/hi'
import NewMaquinasForm from './NewMaquinasForm'
import { useCreateMachineMutation } from '@/services/RtkQueryService'
import { useEffect } from 'react'

const NewMachine = () => {
  const navigate = useNavigate()
  const [createMachine, { isSuccess, isError, isUninitialized, data }] =
    useCreateMachineMutation()

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
      openNotification(
        'success',
        'Maquina Creada',
        'Maquina creada correctamente',
        3
      )

      setTimeout(() => {
        navigate(`/maquinas/${(data as any)?.id}`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al crear la maquina, por favor intenta más tarde',
        3
      )
    }
  }, [isSuccess, isError])
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear máquina</h3>
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
        <div className="flex justify-center">
          <Card className="xl:w-1/2 lg:w-full sp:w-full mobile:w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineServer />}>
                  Máquina
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <NewMaquinasForm
                    createMachine={createMachine}
                    newMachineData={{
                      name: '',
                      brand: '',
                      model: '',
                      serial: '',
                      counter: 0,
                      sedeId: 0,
                    }}
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

export default NewMachine
