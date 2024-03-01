import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { Select, Spinner } from '@/components/ui'
import { Select as SelectType } from '@/@types/select'
import { useGetAllSedesQuery } from '@/services/RtkQueryService'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre de la maquina requerido.'),
  brand: Yup.string(),
  model: Yup.string(),
  serial: Yup.string(),
  counter: Yup.number().required('Contador requerido.'),
  sedeId: Yup.number().nullable(),
})

type FormModel = {
  name: string
  brand: string
  model: string
  serial: string
  counter: string
  sedeId: number
}

const MachineForm = ({
  isEditingFields,
  initialValues,
  machineId,
  isLoading,
  updateMachine,
}: {
  isEditingFields: boolean
  initialValues: FormModel
  machineId: string
  isLoading: boolean
  updateMachine: any
}) => {
  const { isSuperAdmin } = useAuth()

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const onSubmit = (values: FormModel) => {
    updateMachine({ id: machineId, ...values })
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
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
                  placeholder="Nombre de la máquina"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
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
                label="Marca"
                invalid={errors.brand && touched.brand}
                errorMessage={errors.brand}
              >
                <Field
                  autoComplete="off"
                  name="brand"
                  placeholder="Marca de la máquina"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                label="Modelo"
                invalid={errors.model && touched.model}
                errorMessage={errors.model}
              >
                <Field
                  autoComplete="off"
                  name="model"
                  placeholder="Modelo de la máquina"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                label="Serial"
                invalid={errors.serial && touched.serial}
                errorMessage={errors.serial}
              >
                <Field
                  autoComplete="off"
                  name="serial"
                  placeholder="Serial de la máquina"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Contador"
                invalid={errors.counter && touched.counter}
                errorMessage={errors.counter}
              >
                <Field
                  autoComplete="off"
                  name="counter"
                  placeholder="Contador de la máquina"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem>
                <Button
                  variant="solid"
                  type="submit"
                  color="pink-500"
                  className="font-semibold text-base transition-colors shadow duration-300"
                  disabled={!isEditingFields}
                >
                  {isLoading ? <Spinner size={30} color="white" /> : 'Guardar'}
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default MachineForm
