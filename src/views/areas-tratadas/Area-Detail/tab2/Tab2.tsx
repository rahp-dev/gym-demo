import { Field, Form, Formik } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import * as Yup from 'yup'
import openNotification from '@/utils/openNotification'
import { useEffect } from 'react'

import {
  useCreateMonthlyPromotionMutation,
  useUpdateMonthlyPromotionMutation,
} from '@/services/RtkQueryService'
import { CreateMonthlyPromotionFormModel } from '@/services/areas-tratadas/types/monthly-promotion.type'

const validationSchema = Yup.object().shape({
  packageAmount: Yup.number().required('El Monto del paquete es requerido'),
  amountPackOfFour: Yup.number().required(
    'El Monto las 4 sesiones es requerido'
  ),
  individualPrice: Yup.number().required('El Monto individual es obligatorio'),
})

type FormModel = {
  packageAmount: number
  amountPackOfFour: number
  individualPrice: number
}

function Tab2({
  data,
  areaId,
  isEditingFields,
  setIsEditingFields,
}: {
  isEditingFields: boolean
  data: CreateMonthlyPromotionFormModel & { id: number }
  areaId: string
  setIsEditingFields: any
}) {
  const [
    createMonthlyPromotion,
    {
      isSuccess: createIsSuccess,
      isError: createisError,
      isLoading: createIsLoading,
      isUninitialized: createIsUninitialized,
    },
  ] = useCreateMonthlyPromotionMutation()
  const [
    updateMonthlyPromotion,
    {
      isSuccess: updateIsSuccess,
      isError: updateisError,
      isLoading: updateIsLoading,
      isUninitialized: updateIsUninitialized,
    },
  ] = useUpdateMonthlyPromotionMutation()

  const onSubmit = (values: FormModel) => {
    if (!data.id) {
      createMonthlyPromotion({ ...values, treatedAreaId: Number(areaId) })
    } else {
      updateMonthlyPromotion({ ...values, id: data.id })
    }

    setIsEditingFields(false)
  }

  useEffect(() => {
    if (createIsSuccess) {
      openNotification(
        'success',
        'Promoción Creada',
        'Promoción Creada correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!createIsUninitialized && createisError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error creando la promocion, intentalo más tarde',
        3
      )
    }
  }, [createIsSuccess, createisError])

  useEffect(() => {
    if (updateIsSuccess) {
      openNotification(
        'success',
        'Promoción Actualizada',
        'Promoción Actualizada correctamente',
        3
      )
      setIsEditingFields(false)
    }

    if (!updateIsUninitialized && updateisError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error creando la promocion, intentalo más tarde',
        3
      )
    }
  }, [updateIsSuccess, updateisError])

  return (
    <Formik
      initialValues={{
        individualPrice: data.individualPrice,
        amountPackOfFour: data.amountPackOfFour,
        packageAmount: data.packageAmount,
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                label="Precio del paquete"
                invalid={errors.packageAmount && touched.packageAmount}
                errorMessage={errors.packageAmount}
              >
                <Field
                  autoComplete="off"
                  name="packageAmount"
                  placeholder="Precio del paquete"
                  component={Input}
                  disabled={!isEditingFields}
                  type="number"
                />
              </FormItem>

              <FormItem
                label="Precio de 4 sesiones"
                invalid={errors.amountPackOfFour && touched.amountPackOfFour}
                errorMessage={errors.amountPackOfFour}
              >
                <Field
                  autoComplete="off"
                  name="amountPackOfFour"
                  placeholder="Precio de 4 sesiones"
                  component={Input}
                  disabled={!isEditingFields}
                  type="number"
                />
              </FormItem>

              <FormItem
                label="Precio Individual"
                invalid={errors.individualPrice && touched.individualPrice}
                errorMessage={errors.individualPrice}
              >
                <Field
                  autoComplete="off"
                  name="individualPrice"
                  placeholder="Precio individual"
                  component={Input}
                  disabled={!isEditingFields}
                  type="number"
                />
              </FormItem>

              <Button
                type="submit"
                loading={createIsLoading || updateIsLoading}
                disabled={!isEditingFields}
              >
                Aplicar promoción
              </Button>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Tab2
