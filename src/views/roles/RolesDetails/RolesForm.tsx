import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre de rol requerido.'),
  description: Yup.string(),
})

type FormModel = {
  name: string
  description?: string
}

const RolesForm = ({
  isEditingFields,
  initialValues,
  rolId,
  isLoading,
  updateRol,
}: {
  isEditingFields: boolean
  initialValues: FormModel
  rolId: string
  isLoading: boolean
  updateRol: any
}) => {
  const onSubmit = (values: FormModel) => {
    updateRol({ ...values, id: rolId })
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ resetForm, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                asterisk
                label="Rol"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  autoComplete="off"
                  name="name"
                  placeholder="Nombre del rol"
                  component={Input}
                  type="text"
                  disabled={!isEditingFields}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Descripción del Rol"
                invalid={errors.description && touched.description}
                errorMessage={errors.description}
              >
                <Field
                  autoComplete="off"
                  name="description"
                  placeholder="Descripción del rol"
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

export default RolesForm
