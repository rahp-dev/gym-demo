import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type SignUpFormSchema = {
  userName: string
  password: string
  email: string
}

const validationSchema = Yup.object().shape({
  userName: Yup.string().required(
    'Por favor, introduzca su nombre de usuario.'
  ),
  email: Yup.string()
    .email('Email no válido.')
    .required('Por favor, introduzca su email.'),
  password: Yup.string().required('Por favor, introduzca su contraseña.'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Tus contraseñas no coinciden.'
  ),
})

const SignUpForm = (props: SignUpFormProps) => {
  const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

  const { signUp } = useAuth()

  const [message, setMessage] = useTimeOutMessage()

  const onSignUp = async (
    values: SignUpFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const { userName, password, email } = values
    setSubmitting(true)
    const result = await signUp({ userName, password, email })

    if (result?.status === 'failed') {
      setMessage(result.message)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          userName: 'admin1',
          password: '123Qwe1',
          confirmPassword: '123Qwe1',
          email: 'test@testmail.com',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignUp(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Usuario"
                invalid={errors.userName && touched.userName}
                errorMessage={errors.userName}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="userName"
                  placeholder="Ingresa tu usuario"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Correo electrónico"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Ingresa tu email"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Contraseña"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  component={PasswordInput}
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
                  component={PasswordInput}
                />
              </FormItem>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
              </Button>
              <div className="mt-4 text-center">
                <span>¿Ya tiene una cuenta? </span>
                <ActionLink to={signInUrl}>Acceder</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignUpForm
