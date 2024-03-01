import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'

import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Spinner } from '@/components/ui'
import { HiOutlineCloudUpload } from 'react-icons/hi'

type FormModel = {
  image: File[]
  input: string
}

const MIN_UPLOAD = 0
const MAX_UPLOAD = 1

const formSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, introduzca el nombre de la sede'),
  image: Yup.array().min(MIN_UPLOAD, 'Debe añadir un solo archivo'),
})

const SedeForm = ({ createSede, isLoading }) => {
  const [avatarImg, setAvatarImg] = useState<string | null>(null)

  const beforeUpload = (file: FileList | null, fileList: File[]) => {
    let valid: string | boolean = true

    const allowedFileType = ['image/jpeg', 'image/png']
    const MAX_FILE_SIZE = 5 * 1000000

    if (fileList.length >= MAX_UPLOAD) {
      return `You can only upload ${MAX_UPLOAD} file(s)`
    }

    if (file) {
      for (const f of file) {
        if (!allowedFileType.includes(f.type)) {
          valid = 'Please upload a .jpeg or .png file!'
        }

        if (f.size >= MAX_FILE_SIZE) {
          valid = 'Upload image cannot more then 5MB!'
        }
      }
    }

    return valid
  }

  const onFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setAvatarImg(URL.createObjectURL(files[0]))
    } else {
      setAvatarImg(null)
    }
  }

  const onSubmit = (values: { name: string; image: Array<File> }) => {
    createSede(values)
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          name: '',
          image: [],
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors }) => (
          <Form className="xl:w-[400px] lg:w-full mobile:w-full sp:w-full">
            <FormContainer>
              <FormItem
                asterisk
                label="Sede"
                invalid={errors.name && touched.name}
              >
                <Field
                  type="text"
                  name="name"
                  placeholder="Ingresa el nombre de la sede"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Imagen de la Sede"
                invalid={Boolean(errors.image && touched.image)}
                errorMessage={errors.image as string}
              >
                <Field name="image">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Upload
                      className="cursor-pointer w-full"
                      beforeUpload={beforeUpload}
                      fileList={values.image}
                      onChange={(files) => {
                        form.setFieldValue(field.name, files)
                        onFileUpload(files)
                      }}
                      onFileRemove={(files) => {
                        form.setFieldValue(field.name, files)
                        onFileUpload(files)
                      }}
                    >
                      {avatarImg ? (
                        <img
                          className="h-[180px] w-full avatar-img object-cover shadow rounded-lg"
                          src={avatarImg}
                        />
                      ) : (
                        <Button
                          variant="twoTone"
                          color="pink-700"
                          type="button"
                          className="w-full border-dashed border-2 hover:border-dashed"
                          icon={<HiOutlineCloudUpload />}
                        >
                          Cargar archivo
                        </Button>
                      )}
                    </Upload>
                  )}
                </Field>
              </FormItem>
              <FormItem>
                <Button
                  variant="solid"
                  className="w-full flex items-center justify-center"
                  type="submit"
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

export default SedeForm
