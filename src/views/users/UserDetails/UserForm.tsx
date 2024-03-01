import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'

import {
  useGetAllSedesQuery,
  useGetUserRolesQuery,
} from '@/services/RtkQueryService'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { Select as SelectType } from '@/@types/select'
import { Spinner } from '@/components/ui'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import { RolesEnum } from '@/enums/roles.enum'

type FormModel = {
  email: string
  name: string
  lastName: string
  rolId: number
  sedeId: number
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Formato del correo incorrecto')
    .required('Email requerido'),
  name: Yup.string()
    .min(3, 'Nombre de usuario muy corto')
    .required('Usuario requerido'),
  lastName: Yup.string().required('Apellido requerido'),
  rolId: Yup.number().required('Rol requerido'),
  sedeId: Yup.number().nullable(),
})

const UserForm = ({
  isEditingFields,
  initialValues,
  userId,
  isLoading,
  updateUser,
}: {
  isEditingFields: boolean
  initialValues: FormModel
  userId: string
  isLoading: boolean
  updateUser: any
}) => {
  const { isSuperAdmin } = useAuth()
  const { sede } = useAppSelector((state) => state.auth.session)

  const { data: sedeOptions } = useGetAllSedesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )
  const { data: rolOptions } = useGetUserRolesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true }
  )

  const setRolOptions = () => {
    if (isSuperAdmin) {
      return rolOptions
    }

    return rolOptions?.filter(
      (option: SelectType) => option.value !== RolesEnum.GERENTE
    )
  }

  const onSubmit = (values: FormModel) => {
    window.scrollTo(0, 0)
    updateUser({ id: userId, ...values })
  }

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
                label="Nombre"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  component={Input}
                  disabled={!isEditingFields}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Apellido"
                invalid={errors.lastName && touched.lastName}
                errorMessage={errors.lastName}
              >
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  component={Input}
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
                  type="text"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  component={Input}
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
                asterisk
                label="Rol"
                invalid={errors.rolId && touched.rolId}
                errorMessage={errors.rolId}
              >
                <Field name="rolId">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      field={field}
                      form={form}
                      options={setRolOptions()}
                      placeholder="Selecciona algo..."
                      value={rolOptions?.filter(
                        (option: SelectType) => option.value === values.rolId
                      )}
                      isDisabled={!isEditingFields}
                      onChange={(option: SelectType) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
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
        )}
      </Formik>
    </div>
  )
}

export default UserForm
