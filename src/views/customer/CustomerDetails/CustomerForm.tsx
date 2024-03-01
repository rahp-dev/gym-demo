import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { DatePicker, Select, toast, Notification } from '@/components/ui'
import { Select as SelectType } from '@/@types/select'
import {
  CreateCustomerBody,
  CreateCustomerFormModel,
} from '@/services/customers/types/customer.type'
import {
  useGetAllSedesQuery,
  useUpdateCustomerMutation,
} from '@/services/RtkQueryService'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido.'),
  lastName: Yup.string().required('Apellido requerido.'),
  cedula: Yup.string(),
  sedeId: Yup.number().required('Sede requerida'),
  phone: Yup.string(),
  email: Yup.string().email('Formato del correo incorrecto'),
  birthDate: Yup.date().nullable(),
  skinType: Yup.string(),
  hairColor: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
})

type Option = {
  value: string
  label: string
}

type FormModel = Partial<CreateCustomerFormModel>

const skinTypeOption: Option[] = [
  { value: 'Blanca', label: 'Blanca' },
  { value: 'Morena', label: 'Morena' },
  { value: 'Negro', label: 'Negro' },
]

const hairColorOption: Option[] = [
  { value: 'Negro', label: 'Negro' },
  { value: 'Castaño', label: 'Castaño' },
  { value: 'Canoso', label: 'Canoso' },
]

const CustomerForm = ({
  isEditingFields,
  setIsEditingFields,
  initialValues,
}: {
  isEditingFields: boolean
  setIsEditingFields: any
  initialValues: FormModel
}) => {
  const { customerId } = useParams()
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const [updateCustomer, { isLoading, isSuccess, isError, isUninitialized }] =
    useUpdateCustomerMutation()

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
    if (isSuccess) {
      openNotification(
        'success',
        'Cliente Actualizado',
        'Cliente actualizado correctamente',
        3
      )

      setIsEditingFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el cliente, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  const onSubmit = (values: FormModel) => {
    const { street, city, state, email, ...customerData } = values
    const body: Partial<CreateCustomerBody> = {
      ...customerData,
      ...(email && { email }),
      address: { street, city, state },
    }

    updateCustomer({ id: customerId, ...body })
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, isSubmitting }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                asterisk
                label="Nombre del cliente"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  autoComplete="off"
                  name="name"
                  placeholder="Nombre"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Apellido del cliente"
                invalid={errors.lastName && touched.lastName}
                errorMessage={errors.lastName}
              >
                <Field
                  autoComplete="off"
                  name="lastName"
                  placeholder="Apellido"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Cédula de identidad"
                invalid={errors.cedula && touched.cedula}
                errorMessage={errors.cedula}
              >
                <Field
                  autoComplete="off"
                  name="cedula"
                  placeholder="cedula"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
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
                      value={sedeOptions?.filter(
                        (option: SelectType) => option.value === values.sedeId
                      )}
                      isDisabled={!isEditingFields || !isSuperAdmin}
                      onChange={(option: SelectType) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Teléfono"
                invalid={errors.phone && touched.phone}
                errorMessage={errors.phone}
              >
                <Field
                  autoComplete="off"
                  name="phone"
                  placeholder="Teléfono"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Correo"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  autoComplete="off"
                  name="email"
                  placeholder="Correo"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem asterisk label="Fecha de nacimiento:">
                <Field name="birthDate">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={values.birthDate}
                      onChange={(day) => {
                        form.setFieldValue(field.name, day)
                      }}
                      disabled={!isEditingFields}
                      inputFormat="DD-MM-YYYY"
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Tipo de Piel:"
                invalid={errors.skinType && touched.skinType}
                errorMessage={errors.skinType}
              >
                <Field name="skinType">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      isDisabled={!isEditingFields}
                      field={field}
                      form={form}
                      options={skinTypeOption}
                      placeholder="Selecciona algo..."
                      value={skinTypeOption?.filter(
                        (option: Option) => option.value === values.skinType
                      )}
                      onChange={(option: Option) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Color de vello:"
                invalid={errors.hairColor && touched.hairColor}
                errorMessage={errors.hairColor}
              >
                <Field name="hairColor">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      isDisabled={!isEditingFields}
                      field={field}
                      form={form}
                      options={hairColorOption}
                      placeholder="Selecciona algo..."
                      value={hairColorOption?.filter(
                        (option: Option) => option.value === values.hairColor
                      )}
                      onChange={(option: Option) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
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
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Ciudad"
                invalid={errors.city && touched.city}
                errorMessage={errors.city}
              >
                <Field
                  autoComplete="off"
                  name="city"
                  placeholder="Ciudad"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Estado"
                invalid={errors.state && touched.state}
                errorMessage={errors.state}
              >
                <Field
                  autoComplete="off"
                  name="state"
                  placeholder="Estado"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem>
                <div className="flex gap-2">
                  <Button
                    variant="solid"
                    type="submit"
                    disabled={!isEditingFields}
                    loading={isLoading}
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

export default CustomerForm
