import * as Yup from 'yup'
import { Formik, FormikProps, Form, getIn, Field, FieldArray } from 'formik'
import { HiMinus } from 'react-icons/hi'
import { Dispatch, SetStateAction } from 'react'

import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Formato del correo incorrecto'),
  phones: Yup.array().of(Yup.string()),
})

type FormModel = Pick<CreateCustomerFormModel, 'email' | 'phones'>

const fieldFeedback = (form: FormikProps<FormModel>, name: string) => {
  const error = getIn(form.errors, name)
  const touch = getIn(form.touched, name)
  return {
    errorMessage: error || '',
    invalid: typeof touch === 'undefined' ? false : error && touch,
  }
}

function ContactInfo({
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
    setCurrentTab('tab3')
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={customerData}
      onSubmit={onSubmit}
    >
      {({ touched, errors, values }) => {
        const phones = values.phones

        return (
          <Form>
            <FormContainer>
              <FormItem
                label="Correo eléctronico"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  autoComplete="off"
                  name="email"
                  placeholder="Correo"
                  component={Input}
                  type="text"
                />
              </FormItem>
              <FieldArray name="phones">
                {({ form, remove, push }) => (
                  <div>
                    {phones && phones.length > 0
                      ? phones.map((_, index) => {
                          const phoneFeedBack = fieldFeedback(
                            form,
                            `phones[${index}].phone`
                          )

                          return (
                            <div key={index} className="flex items-center">
                              <FormItem
                                className="mr-2"
                                label={`Teléfono ${index + 1}`}
                                invalid={phoneFeedBack.invalid}
                                errorMessage={phoneFeedBack.errorMessage}
                              >
                                <Field
                                  invalid={phoneFeedBack.invalid}
                                  placeholder="Teléfono"
                                  name={`phones[${index}]`}
                                  type="text"
                                  component={Input}
                                />
                              </FormItem>
                              <Button
                                shape="circle"
                                size="sm"
                                icon={<HiMinus />}
                                onClick={() => remove(index)}
                              />
                            </div>
                          )
                        })
                      : null}
                    <div>
                      <Button
                        type="button"
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => {
                          push('')
                        }}
                      >
                        Agregar Teléfono
                      </Button>
                      <Button type="submit" variant="solid">
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ContactInfo
