import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import { apiForgotPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface ForgotPasswordFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type ForgotPasswordFormSchema = {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Please enter your email'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

  const [emailSent, setEmailSent] = useState(false)

  const [message, setMessage] = useTimeOutMessage()

  const onSendMail = async (
    values: ForgotPasswordFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)
    try {
      const resp = await apiForgotPassword(values)
      if (resp.data) {
        setSubmitting(false)
        setEmailSent(true)
      }
    } catch (errors) {
      setMessage(
        (errors as AxiosError<{ message: string }>)?.response?.data?.message ||
          (errors as Error).toString()
      )
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Comprueba tu correo electrónico</h3>
            <p>
              Hemos enviado una instrucción de recuperación de contraseña a su
              correo electrónico.
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1">¿Ha olvidado su contraseña?</h3>
            <p className="line-clamp-3">
              Introduzca su dirección de correo electrónico para recibir un
              código de verificación.
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: 'admin@mail.com',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? 'hidden' : ''}>
                <FormItem
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {emailSent ? 'Reenviar código' : 'Enviar código'}
              </Button>
              <div className="mt-4 text-center">
                <span>Volver a </span>
                <ActionLink to={signInUrl}>Acceder</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ForgotPasswordForm
