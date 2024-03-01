import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useUpdateUserPasswordMutation } from '@/services/RtkQueryService'

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Contraseña requerida.'),
  confirmPassword: Yup.string()
    .required('Confirmar contraseña.')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.'),
})

type FormModel = {
  password: string
  confirmPassword: string
}

const FormPassword = ({
  isEditingFields,
  userId,
}: {
  isEditingFields: boolean
  userId: string
}) => {
  const [updatePassword, { error, isLoading, isSuccess }] =
    useUpdateUserPasswordMutation()

  const onSubmit = (values: FormModel, { resetForm }) => {
    updatePassword({ id: userId, ...values })
    resetForm()
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, isSubmitting }) => {
        return (
          <Form>
            <FormContainer>
              <FormItem
                label="Contraseña"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  component={Input}
                  type="password"
                  disabled={!isEditingFields}
                />
              </FormItem>
              <FormItem
                label="Confirmar contraseña"
                invalid={errors.confirmPassword && touched.confirmPassword}
                errorMessage={errors.confirmPassword}
              >
                <Field
                  autoComplete="off"
                  name="confirmPassword"
                  placeholder="Confirme su contraseña"
                  component={Input}
                  type="password"
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
                  Guardar
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default FormPassword
