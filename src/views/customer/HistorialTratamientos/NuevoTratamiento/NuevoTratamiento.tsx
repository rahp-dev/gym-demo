import { useNavigate } from 'react-router-dom'

import { Card, Tabs } from '@/components/ui'
import { Button } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'

import { HiArrowLeft } from 'react-icons/hi'
import { FaUserInjured } from 'react-icons/fa'
import NuevoTratamientoForm from './NuevoTratamientoForm'

const NuevoTratamiento = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between sp:gap-4 mb-4">
          <h3>Crear historial de tratamientos</h3>
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
                <TabNav value="tab1" icon={<FaUserInjured />}>
                  Tratamiento
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <NuevoTratamientoForm />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NuevoTratamiento
