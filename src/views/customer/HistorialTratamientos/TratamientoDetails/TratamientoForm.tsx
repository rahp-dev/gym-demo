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
import DatePicker from '@/components/ui/DatePicker'

import { Select as SelectType } from '@/@types/select'
import {
  CreateTreatmentFormModel,
  CreateTreatmentBody,
} from '@/services/customers/types/treatment.type'
import { RolesEnum } from '@/enums/roles.enum'
import {
  useGetAllMachinesQuery,
  useGetAllSedesQuery,
  useGetAllUsersQuery,
  useUpdateTreatmentMutation,
} from '@/services/RtkQueryService'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

type FormModel = Omit<Partial<CreateTreatmentFormModel>, 'customerId'> & {
  machineFinalCounter: string
}

const validationSchema = Yup.object().shape({
  datetime: Yup.date().required('Fecha requerida'),
  treatedArea: Yup.string().required('Ingresa el area tratada'),
  session: Yup.string().required('Ingresa el número de la sesion'),
  machineFinalCounter: Yup.string().nullable(),
  invoiceNumber: Yup.string().required('Numero de factura requerido'),
  amount: Yup.number().required('Monto requerido'),
  specialistId: Yup.number().required('Especifique el usuario receptor'),
  sedeId: Yup.number().required('Escoge la sede'),
  depilatoryMachineId: Yup.number().required('Escoge la máquina'),
})

const { DateTimepicker } = DatePicker

const TratamientoForm = ({
  initialValues,
  isEditingFields,
  setIsEditingFields,
  isComplete,
}: {
  initialValues: FormModel
  setIsEditingFields: any
  isEditingFields: boolean
  isComplete: boolean
}) => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const { customerId, treatmentId } = useParams()
  const [sedeId, setSedeId] = useState(0)

  const { data: userOptions } = useGetAllUsersQuery(
    {
      paginated: false,
      rolId: RolesEnum.ESPECIALISTA,
      transformToSelectOptions: true,
      sedeId: String(sedeId),
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const { data: machinesOptions } = useGetAllMachinesQuery(
    {
      paginated: false,
      sedeId: sedeId,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  const [updateTreatment, { isUninitialized, isSuccess, isError }] =
    useUpdateTreatmentMutation()

  const onSubmit = (values: FormModel) => {
    const body: Partial<CreateTreatmentBody> & {
      treatmentId: string
      customerId: string
    } = {
      ...values,
      customerId,
      treatmentId,
    }

    if (isComplete) {
      delete body.specialistId
      delete body.sedeId
      delete body.depilatoryMachineId
    }

    updateTreatment(body)
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
    setSedeId(initialValues?.sedeId)
  }, [initialValues?.sedeId])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Tratamiento Actualizado',
        'Tratamiento actualizado correctamente',
        3
      )

      setIsEditingFields(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el tratamiento, intentalo más tarde',
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
                label="Fecha:"
                errorMessage={errors.datetime as any}
              >
                <Field name="datetime">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DateTimepicker
                      placeholder="Selecciona la fecha y la hora"
                      field={field}
                      form={form}
                      disabled={!isEditingFields}
                      value={values.datetime}
                      onChange={(date) => {
                        form.setFieldValue(field.name, date)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Sede:"
                invalid={errors.sedeId && touched.sedeId}
                errorMessage={errors.sedeId}
              >
                <Field name="sedeId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      isDisabled={
                        !isEditingFields || !isSuperAdmin || isComplete
                      }
                      form={form}
                      options={sedeOptions as unknown as SelectType[]}
                      placeholder="Selecciona algo..."
                      value={(sedeOptions as unknown as SelectType[])?.filter(
                        (option: SelectType) => option.value === values.sedeId
                      )}
                      onChange={(option: SelectType) => {
                        setSedeId(option.value)
                        form.setFieldValue(field.name, option?.value)
                        form.setFieldValue('depilatoryMachineId', null)
                        form.setFieldValue('specialistId', null)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                asterisk
                label="Maquina:"
                invalid={
                  errors.depilatoryMachineId && touched.depilatoryMachineId
                }
                errorMessage={errors.depilatoryMachineId}
              >
                <Field name="depilatoryMachineId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      isDisabled={!isEditingFields || isComplete}
                      options={machinesOptions as unknown as SelectType[]}
                      placeholder="Selecciona algo..."
                      value={(
                        machinesOptions as unknown as SelectType[]
                      )?.filter(
                        (option: SelectType) =>
                          option.value === values.depilatoryMachineId
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
                label="Especialista:"
                invalid={errors.specialistId && touched.specialistId}
                errorMessage={errors.specialistId}
              >
                <Field name="specialistId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      options={userOptions as SelectType[]}
                      placeholder="Selecciona algo..."
                      isDisabled={!isEditingFields || isComplete}
                      value={(userOptions as SelectType[])?.filter(
                        (option: SelectType) =>
                          option.value === values.specialistId
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
                label="Area tratada:"
                invalid={errors.treatedArea && touched.treatedArea}
                errorMessage={errors.treatedArea}
              >
                <Field
                  autoComplete="off"
                  name="treatedArea"
                  placeholder="Area tratada..."
                  component={Input}
                  disabled={!isEditingFields}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Sesión:"
                invalid={errors.session && touched.session}
                errorMessage={errors.session}
              >
                <Field
                  autoComplete="off"
                  name="session"
                  placeholder="Sesion..."
                  component={Input}
                  disabled={!isEditingFields}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Contador Final:"
                invalid={
                  errors.machineFinalCounter && touched.machineFinalCounter
                }
                errorMessage={errors.machineFinalCounter}
              >
                <Field
                  autoComplete="off"
                  name="machineFinalCounter"
                  placeholder="Contador final de la máquina"
                  component={Input}
                  disabled={!isEditingFields || isComplete}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Número de factura:"
                invalid={errors.invoiceNumber && touched.invoiceNumber}
                errorMessage={errors.invoiceNumber}
              >
                <Field
                  autoComplete="off"
                  name="invoiceNumber"
                  placeholder="#0000"
                  component={Input}
                  disabled={!isEditingFields}
                  type="text"
                />
              </FormItem>

              <FormItem
                asterisk
                label="Monto:"
                invalid={errors.amount && touched.amount}
                errorMessage={errors.amount}
              >
                <Field
                  autoComplete="off"
                  name="amount"
                  placeholder="Monto cancelado"
                  disabled={!isEditingFields}
                  component={Input}
                  type="text"
                />
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

export default TratamientoForm
