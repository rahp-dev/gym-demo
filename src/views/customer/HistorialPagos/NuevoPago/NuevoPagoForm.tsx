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
import {
  useCreatePaymentMutation,
  useGetAllPaymentMethodsQuery,
  useGetAllSedesQuery,
  useGetAllUsersQuery,
} from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusEnum } from '@/enums/status.enum'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

type FormModel = CreateCustomerPaymentFormModel

const validationSchema = Yup.object().shape({
  amount: Yup.number().required('Monto requerido'),
  description: Yup.string(),
  sedeId: Yup.number()
    .required('Selecciona la sede')
    .min(1, 'Selecciona la sede'),
  userReceiverId: Yup.number().required('Selecciona el usuario receptor'),
  dateOfPayment: Yup.date().required('Ingresa la fecha del pago'),
  paymentMethodId: Yup.number().required('Selecciona un método de pago'),
})

const NuevoPagoForm = () => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const navigate = useNavigate()
  const { treatmentId } = useParams()

  const [sedeId, setSedeId] = useState(0)
  const [initialValues, setInitialValues] = useState({
    amount: 0,
    description: '',
    sedeId: sedeId,
    userReceiverId: 0,
    dateOfPayment: null,
    paymentMethodId: 0,
  })

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

  const [createPayment, { data, isUninitialized, isSuccess, isError, error }] =
    useCreatePaymentMutation()

  const onSubmit = (values: FormModel) => {
    const body: CreateCustomerPaymentBody = {
      ...values,
      treatmentId,
    }

    createPayment(body)
  }

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

  useEffect(() => {
    if (!isSuperAdmin) {
      setSedeId(sede)
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      openNotification('success', 'Pago Creado', 'Pago creado correctamente', 3)

      setTimeout(() => {
        navigate(`/clientes/${data?.customer?.id}/historial-pagos/${data?.id}`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        (error as any).message ||
          'Ocurrio un error al crear el pago, por favor intenta más tarde',
        3
      )
    }
  }, [isError, isSuccess])

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
                      isDisabled={!isSuperAdmin}
                      placeholder="Selecciona algo..."
                      value={sedeOptions?.filter((option: SelectType) => {
                        if (isSuperAdmin) {
                          return option.value === values.sedeId
                        }

                        return option.value === sede
                      })}
                      onChange={(option: SelectType) => {
                        setSedeId(option?.value)
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

              <FormItem asterisk label="Fecha de pago:">
                <Field name="dateOfPayment">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DateTimepicker
                      placeholder="Selecciona la fecha y la hora"
                      field={field}
                      form={form}
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
                label="Método de pago:"
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
                <Button variant="solid" type="submit">
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

export default NuevoPagoForm
