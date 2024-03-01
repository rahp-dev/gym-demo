import { Dispatch, SetStateAction, useState } from 'react'
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import './PersonalInfo.css'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido.'),
  lastName: Yup.string().required('Apellido requerido.'),
  cedula: Yup.string().required('La cedula es obligatoria.'),
  weight: Yup.string().required('Introduce tu peso corporal.'),
  height: Yup.string().required('Introduce tu altura.'),
})

type Option = {
  value: string
  label: string
}

type FormModel = Pick<
  CreateCustomerFormModel,
  'name' | 'lastName' | 'cedula' | 'weight' | 'height'
>

function PersonalInfo({
  customerData,
  setCustomerData,
  setCurrentTab,
}: {
  customerData: CreateCustomerFormModel
  setCustomerData: Dispatch<SetStateAction<CreateCustomerFormModel>>
  setCurrentTab: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
}) {
  const [cedulaPreffix, setCedulaPreffix] = useState('V')

  const onSubmit = (values: FormModel) => {
    console.log(values)
    setCustomerData({ ...customerData, ...values })
    setCurrentTab('tab2')
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
                asterisk
                label="Nombres"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  autoComplete="off"
                  name="name"
                  placeholder="Nombres"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Apellidos"
                invalid={errors.lastName && touched.lastName}
                errorMessage={errors.lastName}
              >
                <Field
                  autoComplete="off"
                  name="lastName"
                  placeholder="Apellidos"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                className="z-[10] elber"
                label="Cédula"
                invalid={errors.cedula && touched.cedula}
                errorMessage={errors.cedula}
              >
                <Field
                  prefix={
                    <Select
                      className="w-[70px]"
                      defaultValue={{ value: 'V', label: 'V' }}
                      options={[
                        { value: 'V', label: 'V' },
                        { value: 'E', label: 'E' },
                      ]}
                      onChange={(option: Option) => {
                        setCedulaPreffix(option.value)
                      }}
                    ></Select>
                  }
                  autoComplete="off"
                  name="cedula"
                  placeholder="Cédula"
                  component={Input}
                  type="number"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Peso corporal"
                invalid={errors.weight && touched.weight}
                errorMessage={errors.weight}
              >
                <Field
                  autoComplete="off"
                  name="weight"
                  placeholder="10kg"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Altura"
                invalid={errors.height && touched.height}
                errorMessage={errors.height}
              >
                <Field
                  autoComplete="off"
                  name="height"
                  placeholder="1.90"
                  component={Input}
                  type="text"
                />
              </FormItem>

              <FormItem>
                <div className="flex gap-2 mt-4">
                  <Button variant="solid" type="submit">
                    Siguiente
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

export default PersonalInfo
