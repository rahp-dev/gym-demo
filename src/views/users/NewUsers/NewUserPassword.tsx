import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Dispatch, SetStateAction } from 'react'
import { Spinner } from '@/components/ui'

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Contraseña requerida.'),
  confirmPassword: Yup.string()
    .required('Confirmar contraseña.')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.'),
})

const NewUserPassword = ({
  setNewUserData,
  newUserData,
  createUser,
  isLoading,
  isSuccess,
}: {
  setNewUserData: Dispatch<
    SetStateAction<{
      name: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
      rolId: number
    }>
  >
  newUserData: {
    name: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    rolId: number | null
  }
  createUser: any
  isLoading: boolean
  isSuccess: boolean
}) => {
  const onSubmit = (values: { password: string; confirmPassword: string }) => {
    const { confirmPassword, ...body } = newUserData

    createUser(body)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        password: newUserData.password,
        confirmPassword: newUserData.confirmPassword,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
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
                  onChange={(event) => {
                    setNewUserData({
                      ...newUserData,
                      password: event.target.value,
                    })
                  }}
                  type="password"
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
                  onChange={(event) => {
                    setNewUserData({
                      ...newUserData,
                      confirmPassword: event.target.value,
                    })
                  }}
                  type="password"
                />
              </FormItem>
              <FormItem>
                <Button
                  variant="solid"
                  type="submit"
                  color="pink-500"
                  className="font-semibold flex items-center justify-center transition-colors shadow duration-300 max-w-[125px] min-w-[125px]"
                  disabled={!isLoading && isSuccess}
                >
                  {isLoading ? (
                    <Spinner color="white" size={30} />
                  ) : (
                    <span>Guardar</span>
                  )}
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default NewUserPassword
