import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Select } from '@/components/ui'
import { useGetAllSedesQuery } from '@/services/RtkQueryService'
import { Select as SelectType } from '@/@types/select'
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
  counter: number
  sedeId: number
}

const NewMaquinasForm = ({
  newMachineData,
  createMachine,
}: {
  newMachineData: FormModel
  createMachine: any
}) => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const onSubmit = (values: FormModel) => {
    createMachine(values)
  }
  return (
    <Formik
      enableReinitialize
      initialValues={newMachineData}
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
                      isDisabled={!isSuperAdmin}
                      placeholder="Selecciona algo..."
                      value={sedeOptions?.filter((option: SelectType) => {
                        if (isSuperAdmin) {
                          return option.value === values.sedeId
                        }

                        return option.value === sede
                      })}
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
                  type="number"
                />
              </FormItem>

              <FormItem>
                <div className="flex gap-2">
                  <Button variant="solid" type="submit">
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

export default NewMaquinasForm
