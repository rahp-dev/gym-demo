import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Tabs } from '@/components/ui'
import { Button } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { HiArrowLeft, HiOutlineUserAdd } from 'react-icons/hi'

import PersonalInfo from './tabs/PersonalInfo'
import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import ContactInfo from './tabs/ContactInfo'
import Address from './tabs/Address'

const NewCustomer = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1')
  const [customerData, setCustomerData] = useState<CreateCustomerFormModel>({
    name: '',
    lastName: '',
    email: '',
    height: '',
    weight: '',
    cedula: '',
    phones: [''],
    street: '',
    city: '',
    state: '',
  })

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear cliente</h3>
          <Button
            size="sm"
            variant="solid"
            color="blue-500"
            onClick={() => navigate(-1)}
            icon={<HiArrowLeft />}
          >
            Regresar
          </Button>
        </div>
        <div className="flex justify-center">
          <Card className="xl:w-2/3 lg:w-full sp:w-full mobile:w-full">
            <Tabs
              value={currentTab}
              onChange={(val) => setCurrentTab(val as any)}
            >
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUserAdd />}>
                  Información Básica
                </TabNav>
                <TabNav
                  value="tab2"
                  disabled={currentTab !== 'tab2' && currentTab !== 'tab3'}
                  icon={<HiOutlineUserAdd />}
                >
                  Información de Contacto
                </TabNav>
                <TabNav
                  value="tab3"
                  disabled={currentTab !== 'tab3'}
                  icon={<HiOutlineUserAdd />}
                >
                  Dirección
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <PersonalInfo
                    customerData={customerData}
                    setCustomerData={setCustomerData}
                    setCurrentTab={setCurrentTab}
                  />
                </TabContent>
                <TabContent value="tab2">
                  <ContactInfo
                    customerData={customerData}
                    setCustomerData={setCustomerData}
                    setCurrentTab={setCurrentTab}
                  />
                </TabContent>
                <TabContent value="tab3">
                  <Address
                    customerData={customerData}
                    setCustomerData={setCustomerData}
                    setCurrentTab={setCurrentTab}
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

export default NewCustomer
