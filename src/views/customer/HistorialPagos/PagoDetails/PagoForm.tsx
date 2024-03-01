import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Select,
  toast,
  Notification,
} from '@/components/ui'
import { Select as SelectType } from '@/@types/select'
import {
  CreateCustomerPaymentBody,
  CreateCustomerPaymentFormModel,
} from '@/services/customers/types/customer-payment.type'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  useGetAllPaymentMethodsQuery,
  useGetAllSedesQuery,
  useGetAllUsersQuery,
  useUpdatePaymentMutation,
} from '@/services/RtkQueryService'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import { StatusEnum } from '@/enums/status.enum'

type FormModel = Partial<CreateCustomerPaymentFormModel>

const validationSchema = Yup.object().shape({
  amount: Yup.number().required('Monto requerido'),
  description: Yup.string(),
  sedeId: Yup.number().required('Selecciona la sede'),
  userReceiverId: Yup.number().required('Selecciona el usuario receptor'),
  dateOfPayment: Yup.date().required('Ingresa la fecha del pago'),
  paymentMethodId: Yup.number().required('Selecciona un método de pago'),
})

const PagoForm = ({
  isEditingFields,
  initialValues,
  setIsEditingFields,
  treatmentId,
}: {
  isEditingFields: boolean
  setIsEditingFields: any
  initialValues: FormModel
  treatmentId: string
}) => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)
  const { paymentId, customerId } = useParams()

  const [sedeId, setSedeId] = useState(0)

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const { data: userOptions } = useGetAllUsersQuery(
    {
      paginated: false,
      transformToSelectOptions: true,
      sedeId: String(sedeId),
      statusId: StatusEnum.ACTIVO,
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: paymentOptions } = useGetAllPaymentMethodsQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const [updatePayment, { isUninitialized, isSuccess, isError, error }] =
    useUpdatePaymentMutation()

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration: number = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const onSubmit = (values: FormModel) => {
    const body: Partial<Omit<CreateCustomerPaymentBody, 'treatmentId'>> & {
      paymentId: number
      treatmentId: string
    } = {
      ...values,
      paymentId: +paymentId,
      treatmentId,
    }

    updatePayment(body)
  }

  useEffect(() => {
    setSedeId(initialValues?.sedeId)
  }, [initialValues?.sedeId])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Pago Actualizado',
        'Pago actualizado correctamente',
        3
      )

      setIsEditingFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        (error as any)?.message ||
          'Ocurrio un error actualizando el Pago, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors }) => (
          <Form>
            <FormContainer>
              <FormItem
                asterisk
                label="Monto:"
                invalid={errors.amount && touched.amount}
                errorMessage={errors.amount}
              >
                <Field
                  autoComplete="off"
                  name="amount"
                  placeholder="Monto..."
                  component={Input}
                  disabled={!isEditingFields}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Concepto:"
                invalid={errors.description && touched.description}
                errorMessage={errors.description}
              >
                <Field
                  autoComplete="off"
                  name="description"
                  placeholder="Descripcion detallada"
                  component={Input}
                  disabled={!isEditingFields}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Sede"
                invalid={errors.sedeId && touched.sedeId}
                errorMessage={errors.sedeId}
              >
                <Field name="sedeId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      options={sedeOptions}
                      placeholder="Selecciona algo..."
                      isDisabled={!isEditingFields || !isSuperAdmin}
                      value={sedeOptions?.filter(
                        (option: SelectType) => option.value === values.sedeId
                      )}
                      onChange={(option: SelectType) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Recibido por:"
                invalid={errors.userReceiverId && touched.userReceiverId}
                errorMessage={errors.userReceiverId}
              >
                <Field name="userReceiverId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      options={userOptions as SelectType[]}
                      placeholder="Selecciona algo..."
                      isDisabled={!isEditingFields}
                      value={(userOptions as SelectType[])?.filter(
                        (option: SelectType) =>
                          option.value === values.userReceiverId
                      )}
                      onChange={(option: SelectType) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Fecha de pago:"
                invalid={
                  Boolean(errors.dateOfPayment) &&
                  Boolean(touched.dateOfPayment)
                }
                errorMessage={errors.dateOfPayment as any}
              >
                <Field name="dateOfPayment">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DateTimepicker
                      placeholder="Selecciona la fecha y la hora"
                      field={field}
                      form={form}
                      disabled={!isEditingFields}
                      value={values.dateOfPayment}
                      onChange={(date) => {
                        form.setFieldValue(field.name, date)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Tipo de pago:"
                invalid={errors.paymentMethodId && touched.paymentMethodId}
                errorMessage={errors.paymentMethodId}
              >
                <Field name="paymentMethodId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      options={paymentOptions}
                      placeholder="Selecciona algo..."
                      isDisabled={!isEditingFields}
                      value={paymentOptions?.filter(
                        (option: SelectType) =>
                          option.value === values.paymentMethodId
                      )}
                      onChange={(option: SelectType) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem>
                <Button
                  variant="solid"
                  type="submit"
                  disabled={!isEditingFields}
                >
                  Guardar
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PagoForm
