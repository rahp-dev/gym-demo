import React, { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'

import Input from '@/components/ui/Input'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem } from '@/components/ui'
import { CreatePlanFormModel } from '@/services/customers/types/customer.type'

type FormModel = {
  planName: string
}

const validationSchema = Yup.object().shape({
  planName: Yup.string().required('Coloca el nombre del plan.'),
})

function FinishStep({
  planData,
  setPlanData,
}: {
  planData: CreatePlanFormModel
  setPlanData: Dispatch<SetStateAction<CreatePlanFormModel>>
}) {
  const onSubmit = (values: FormModel) => {
    setPlanData({ ...planData, ...values })
    alert(JSON.stringify(planData, null, 2))
    console.log(planData)
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={planData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors }) => (
          <Form className="xl:w-[450px] lg:w-full mobile:w-full sp:w-full">
            <FormContainer>
              <FormItem
                asterisk
                label="Nombre del plan"
                invalid={errors.planName && touched.planName}
                errorMessage={errors.planName}
              >
                <Field
                  type="text"
                  name="planName"
                  placeholder="Nombre del plan..."
                  component={Input}
                />
              </FormItem>
              <FormItem>
                <div className="flex justify-end">
                  <Button variant="solid" type="submit">
                    Guardar
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default FinishStep
