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

const SedeForm = ({ updateSede, data, isFetching, isLoading, sedeId }) => {
  const [imageToUpdload, setImageToUpdload] = useState('')

  const beforeUpload = (file: FileList | null, fileList: File[]) => {
    let valid: string | boolean = true

    const allowedFileType = ['image/jpeg', 'image/png']
    const MAX_FILE_SIZE = 5 * 1000000

    if (fileList.length >= MAX_UPLOAD) {
      return `You can only image ${MAX_UPLOAD} file(s)`
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
      setImageToUpdload(URL.createObjectURL(files[0]))
    } else {
      setImageToUpdload(null)
    }
  }

  const onSubmit = (values: { name: string; image: Array<File> }) => {
    const body = { id: sedeId, ...values }

    updateSede(body)
  }

  return (
    <div>
      {isFetching && (
        <div className="flex items-center justify-center xl:w-[320px] h-[432px] lg:w-full mobile:w-full sp:w-full">
          <Spinner size={50} />
        </div>
      )}
      {!isFetching && (
        <Formik
          enableReinitialize
          initialValues={{ name: data?.name || '', image: [] }}
          validationSchema={formSchema}
          onSubmit={onSubmit}
        >
          {({ values, touched, errors }) => (
            <Form className="xl:w-[400px] lg:w-full mobile:w-full sp:w-full">
              <FormContainer>
                <FormItem
                  asterisk
                  label="Sede"
                  invalid={errors.name && (touched.name as any)}
                  errorMessage={errors.name as any}
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
                        {data?.image || imageToUpdload ? (
                          <img
                            className="h-[180px] w-full avatar-img object-cover shadow rounded-md"
                            src={imageToUpdload || data?.image}
                          />
                        ) : (
                          <Button
                            variant="twoTone"
                            color="pink-800"
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
                    {isLoading ? (
                      <Spinner size={30} color="white" />
                    ) : (
                      'Guardar'
                    )}
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default SedeForm
