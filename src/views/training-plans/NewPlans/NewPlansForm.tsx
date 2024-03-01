import { useState } from 'react'
import { CreatePlanFormModel } from '@/services/customers/types/customer.type'

import { Card, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import DurationStep from './PlansSteps/DurationStep'
import ExercisesStep from './PlansSteps/ExercisesStep'
import FinishStep from './PlansSteps/FinishStep'

const NewPlansForm = () => {
  const [currentStep, setCurrentStep] = useState<'tab1' | 'tab2' | 'tab3'>(
    'tab1'
  )
  const [planData, setPlanData] = useState<CreatePlanFormModel>({
    planName: '',
    selectExercise: '',
    selectTime: '',
  })

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <Card className="xl:w-2/3 lg:w-full sp:w-full mobile:w-full">
          <Tabs
            value={currentStep}
            onChange={(val) => setCurrentStep(val as any)}
          >
            <TabList>
              <TabNav value="tab1">Planificacion diaria</TabNav>
              <TabNav
                value="tab2"
                disabled={currentStep !== 'tab2' && currentStep !== 'tab3'}
              >
                Ejercicios
              </TabNav>
              <TabNav value="tab3" disabled={currentStep !== 'tab3'}>
                Finalizacion
              </TabNav>
            </TabList>

            <div className="mt-6 py-6 h-auto bg-gray-50/40 dark:bg-gray-700 rounded flex items-center justify-center">
              <TabContent value="tab1">
                <DurationStep
                  planData={planData}
                  setCurrentStep={setCurrentStep}
                  setPlanData={setPlanData}
                />
              </TabContent>
              <TabContent value="tab2">
                <ExercisesStep
                  planData={planData}
                  setCurrentStep={setCurrentStep}
                  setPlanData={setPlanData}
                />
              </TabContent>
              <TabContent value="tab3">
                <FinishStep planData={planData} setPlanData={setPlanData} />
              </TabContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default NewPlansForm
