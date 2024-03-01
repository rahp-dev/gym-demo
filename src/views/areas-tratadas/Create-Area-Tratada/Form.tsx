import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import {
  CreateTreatedAreaBody,
  CreateTreatedAreaFormModel,
} from '@/services/areas-tratadas/types/areas-tratadas.type'
import { useCreateAreaTratadaMutation } from '@/services/RtkQueryService'
import { useEffect } from 'react'
import openNotification from '@/utils/openNotification'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre de rol requerido.'),
  packageAmount: Yup.number().required('El Monto del paquete es requerido'),
  individualPrice: Yup.number().required('El Monto individual es obligatorio'),
})

const CreateAreaTratadaForm = () => {
  const navigate = useNavigate()
  const [
    createAreaTratada,
    { data, isError, isSuccess, isLoading, isUninitialized },
  ] = useCreateAreaTratadaMutation()

  const onSubmit = (values: CreateTreatedAreaFormModel) => {
    const body: CreateTreatedAreaBody = values

    createAreaTratada(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Área Tratada creada',
        'Área Tratada creada correctamente',
        3
      )

      setTimeout(() => {
        navigate(`/areas-tratadas/${data?.id}`)
      }, 2 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error creando el el área tratada, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: '',
        individualPrice: 0,
        packageAmount: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, isSubmitting }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                asterisk
                label="Nombre"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  autoComplete="off"
                  name="name"
                  placeholder="Nombre del Área"
                  component={Input}
                  type="text"
                />
              </FormItem>
              <FormItem
                asterisk
                label="Precio del paquete"
                invalid={errors.packageAmount && touched.packageAmount}
                errorMessage={errors.packageAmount}
              >
                <Field
                  autoComplete="off"
                  name="packageAmount"
                  placeholder="Precio del paquete"
                  component={Input}
                  type="number"
                />
              </FormItem>
              <FormItem
                asterisk
                label="Precio del Individual"
                invalid={errors.individualPrice && touched.individualPrice}
                errorMessage={errors.individualPrice}
              >
                <Field
                  autoComplete="off"
                  name="individualPrice"
                  placeholder="Precio del Individual"
                  component={Input}
                  type="number"
                />
              </FormItem>
              <FormItem>
                <div className="flex gap-2">
                  <Button variant="solid" type="submit" loading={isLoading}>
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

export default CreateAreaTratadaForm
