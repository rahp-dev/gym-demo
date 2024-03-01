import { Button, Card, Tabs, toast } from '@/components/ui'
import NewUserForm from './NewUserForm'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { HiArrowLeft, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'
import TabContent from '@/components/ui/Tabs/TabContent'
import NewUserPassword from './NewUserPassword'
import { useEffect, useState } from 'react'
import { useCreateUserMutation } from '@/services/RtkQueryService'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

const NewUser = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('tab1')
  const [newUserData, setNewUserData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rolId: null,
    sedeId: null,
  })
  const [createUser, { isError, isLoading, isSuccess, data, isUninitialized }] =
    useCreateUserMutation()

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
        'Usuario Creado',
        'Usuario creado correctamente',
        3
      )

      setTimeout(() => {
        navigate(`/usuarios/${data?.id}`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al crear el usuario, por favor intenta más tarde',
        3
      )
    }
  }, [isError, isSuccess])

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear usuario</h3>
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
          <Card className="xl:w-1/2 mobile:w-full sp:w-full">
            <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Perfil
                </TabNav>
                <TabNav value="tab2" disabled icon={<HiOutlineLockClosed />}>
                  Contraseña
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <NewUserForm
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    navigationTabs={setCurrentTab}
                  />
                </TabContent>
                <TabContent value="tab2">
                  <NewUserPassword
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    createUser={createUser}
                    isLoading={isLoading}
                    isSuccess={isSuccess}
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

export default NewUser
