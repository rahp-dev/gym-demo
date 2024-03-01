import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import {
  CreateTreatedAreaBody,
  CreateTreatedAreaFormModel,
} from '@/services/areas-tratadas/types/areas-tratadas.type'
import { useUpdateAreaTratadaMutation } from '@/services/RtkQueryService'
import { useEffect } from 'react'
import openNotification from '@/utils/openNotification'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre de rol requerido.'),
  packageAmount: Yup.number().required('El Monto del paquete es requerido'),
  amountPackOfFour: Yup.number().required(
    'El Monto de las 4 sesiones es requerido'
  ),
  individualPrice: Yup.number().required('El Monto individual es obligatorio'),
})

function Tab1({
  isEditingFields,
  initialValues,
  areaId,
  setIsEditingFields,
}: {
  isEditingFields: boolean
  initialValues: CreateTreatedAreaFormModel
  areaId: string
  setIsEditingFields: any
}) {
  const [updateArea, { isLoading, isError, isSuccess, isUninitialized }] =
    useUpdateAreaTratadaMutation()

  const onSubmit = (values: CreateTreatedAreaFormModel) => {
    const body: CreateTreatedAreaBody & { id: string } = {
      id: areaId,
      ...values,
    }

    updateArea(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Área Tratada Actualizada',
        'Área Tratada actualizada correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el el área tratada, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
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
                  placeholder="Nombre del área tratada"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
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
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Precio de 4 Sesiones"
                invalid={errors.amountPackOfFour && touched.amountPackOfFour}
                errorMessage={errors.amountPackOfFour}
              >
                <Field
                  autoComplete="off"
                  name="amountPackOfFour"
                  placeholder="Precio de 4 Sesiones"
                  component={Input}
                  type="number"
                  disabled={!isEditingFields}
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
                  disabled={!isEditingFields}
                />
              </FormItem>
              <FormItem>
                <div className="flex gap-2">
                  <Button
                    variant="solid"
                    type="submit"
                    loading={isLoading}
                    disabled={!isEditingFields}
                  >
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

export default Tab1
