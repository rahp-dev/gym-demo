import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'

import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  useGetAllSedesQuery,
  useGetUserRolesQuery,
} from '@/services/RtkQueryService'
import { Select as SelectType } from '@/@types/select'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import { RolesEnum } from '@/enums/roles.enum'

type FormModel = {
  name: string
  lastName: string
  email: string
  rolId: number
  sedeId?: number
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  lastName: Yup.string(),
  email: Yup.string().email('Email erroneo').required('Email requerido'),
  rolId: Yup.number().required('Rol requerido'),
  sedeId: Yup.number().nullable(),
})

const NewUserForm = ({
  navigationTabs,
  setNewUserData,
  newUserData,
}: {
  navigationTabs: Dispatch<SetStateAction<string>>
  setNewUserData: any
  newUserData: {
    name: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    rolId: number | null
    sedeId: number | null
  }
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

  useEffect(() => {
    if (!isSuperAdmin) {
      setNewUserData({ ...newUserData, sedeId: sede })
    }
  }, [])

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={newUserData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setNewUserData(values)
          navigationTabs('tab2')
        }}
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
                  placeholder="Correo"
                  component={Input}
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
                      isDisabled={!isSuperAdmin}
                      form={form}
                      options={sedeOptions}
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
                      onChange={(option: SelectType) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
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
                >
                  Siguiente
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NewUserForm
