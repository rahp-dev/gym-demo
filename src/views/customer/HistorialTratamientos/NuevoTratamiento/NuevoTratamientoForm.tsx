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
  CreateTreatmentBody,
  CreateTreatmentFormModel,
} from '@/services/customers/types/treatment.type'
import {
  useCreateTreatmentMutation,
  useGetAllMachinesQuery,
  useGetAllSedesQuery,
  useGetAllUsersQuery,
} from '@/services/RtkQueryService'
import { RolesEnum } from '@/enums/roles.enum'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { StatusEnum } from '@/enums/status.enum'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

type FormModel = CreateTreatmentFormModel

const validationSchema = Yup.object().shape({
  datetime: Yup.date().required('Fecha requerida'),
  treatedArea: Yup.string().required('Ingresa el area tratada'),
  session: Yup.string().required('Ingresa el número de la sesion'),
  invoiceNumber: Yup.string().required('Numero de factura requerido'),
  amount: Yup.number().required('Monto requerido'),
  specialistId: Yup.number().required('Especifique el usuario receptor'),
  sedeId: Yup.number().required('Escoge la sede'),
  depilatoryMachineId: Yup.number().required('Escoge la máquina'),
})

const { DateTimepicker } = DatePicker

const NuevoTratamientoForm = () => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)
  const navigate = useNavigate()
  const { customerId } = useParams()

  const [sedeId, setSedeId] = useState(0)
  const [initialValues, setInitialValues] = useState({
    datetime: null,
    treatedArea: '',
    session: '',
    invoiceNumber: '',
    amount: 0,
    specialistId: 0,
    depilatoryMachineId: 0,
    sedeId: sedeId,
  })

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const { data: userOptions } = useGetAllUsersQuery(
    {
      paginated: false,
      rolId: RolesEnum.ESPECIALISTA,
      transformToSelectOptions: true,
      sedeId: String(sedeId),
      statusId: StatusEnum.ACTIVO,
    },
    { refetchOnMountOrArgChange: true }
  )

  const { data: machinesOptions } = useGetAllMachinesQuery(
    { paginated: false, sedeId, transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const [createTreatment, { data, isSuccess, isError, isUninitialized }] =
    useCreateTreatmentMutation()

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
    const body: CreateTreatmentBody = {
      ...values,
      customerId: customerId,
    }

    createTreatment(body)
  }

  useEffect(() => {
    if (!isSuperAdmin) {
      setSedeId(sede)
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Tratamiento Creado',
        'Tratamiento creado correctamente',
        3
      )

      setTimeout(() => {
        navigate(`/clientes/${customerId}/historial-tratamientos/${data?.id}`)
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al crear el tratamiento, por favor intenta más tarde',
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
                label="Fecha:"
                errorMessage={errors.datetime as any}
              >
                <Field name="datetime">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DateTimepicker
                      placeholder="Selecciona la fecha y la hora"
                      field={field}
                      form={form}
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
                      form={form}
                      isDisabled={!isSuperAdmin}
                      options={sedeOptions as unknown as SelectType[]}
                      placeholder="Selecciona algo..."
                      value={sedeOptions?.filter((option: SelectType) => {
                        if (isSuperAdmin) {
                          return option.value === values.sedeId
                        }

                        return option.value === sede
                      })}
                      onChange={(option: SelectType) => {
                        setSedeId(option.value)
                        form.setFieldValue(field.name, option?.value)
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
                      options={userOptions as unknown as SelectType[]}
                      placeholder="Selecciona algo..."
                      value={(userOptions as unknown as SelectType[])?.filter(
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
                  component={Input}
                  type="text"
                />
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

export default NuevoTratamientoForm
