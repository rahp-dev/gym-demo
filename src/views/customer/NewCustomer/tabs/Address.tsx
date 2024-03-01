import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import { Field, Form, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
})

type FormModel = Pick<CreateCustomerFormModel, 'street' | 'city' | 'state'>

function Address({
  customerData,
  setCustomerData,
  setCurrentTab,
}: {
  customerData: CreateCustomerFormModel
  setCustomerData: Dispatch<SetStateAction<CreateCustomerFormModel>>
  setCurrentTab: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3'>>
}) {
  const onSubmit = (values: FormModel) => {
    setCustomerData({ ...customerData, ...values })
    alert(JSON.stringify(customerData))
  }

  return (
    <Formik
      initialValues={customerData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                label="Dirección"
                invalid={errors.street && touched.street}
                errorMessage={errors.street}
              >
                <Field
                  autoComplete="off"
                  name="street"
                  placeholder="Dirección"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem
                label="Ciudad"
                invalid={errors.street && touched.street}
                errorMessage={errors.street}
              >
                <Field
                  autoComplete="off"
                  name="city"
                  placeholder="Ciudad"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem
                label="Estado"
                invalid={errors.street && touched.street}
                errorMessage={errors.street}
              >
                <Field
                  autoComplete="off"
                  name="state"
                  placeholder="Estado"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem>
                <div className="flex gap-2 mt-4">
                  <Button variant="solid" type="submit">
                    Guardar
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Address
