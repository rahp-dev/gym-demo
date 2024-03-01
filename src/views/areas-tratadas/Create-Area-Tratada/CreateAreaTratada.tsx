import { useNavigate } from 'react-router-dom'
import { Card, Tabs } from '@/components/ui'
import { Button } from '@/components/ui'
import { HiArrowLeft, HiOutlineUser } from 'react-icons/hi'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'

import CreateAreaTratadaForm from './Form'

function CreateAreaTratada() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear Area Tratada</h3>
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
          <Card className="xl:w-1/2 lg:w-full mobile:w-full sp:w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Información
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <CreateAreaTratadaForm />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateAreaTratada
