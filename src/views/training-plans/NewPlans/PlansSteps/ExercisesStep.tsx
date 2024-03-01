import { Dispatch, SetStateAction, useState } from 'react'
import * as Yup from 'yup'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import { Button, Table } from '@/components/ui'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import { CreatePlanFormModel } from '@/services/customers/types/customer.type'

type Option = {
  value: string
  label: string
}

type FormModel = {
  selectExercise: string
}

const options: Option[] = [
  { value: '1', label: 'Espalda y Tríceps' },
  { value: '2', label: 'Pecho y Bíceps' },
  { value: '3', label: 'Hombro y Pierna' },
  { value: '4', label: 'Pecho y Espalda' },
]

const validationSchema = Yup.object().shape({
  selectExercise: Yup.string().required('Selecciona el ejercicio'),
})

function ExercisesStep({
  planData,
  setPlanData,
  setCurrentStep,
}: {
  planData: CreatePlanFormModel
  setPlanData: Dispatch<SetStateAction<CreatePlanFormModel>>
  setCurrentStep: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3'>>
}) {
  const [selectedOption, setSelectedOption] = useState('')

  const onSubmit = (values: FormModel) => {
    setPlanData({ ...planData, ...values })
    setCurrentStep('tab3')
  }

  const handleSelectChange = (option: any) => {
    setSelectedOption(option?.value || '')
  }
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={planData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors }) => (
          <Form className="xl:w-[700px] lg:w-full mobile:w-full sp:w-full">
            <FormContainer>
              <FormItem
                asterisk
                label="Ejercicios para realizar"
                invalid={errors.selectExercise && touched.selectExercise}
                errorMessage={errors.selectExercise}
              >
                <Field name="selectExercise">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      placeholder="Selecciona uno..."
                      field={field}
                      form={form}
                      options={options}
                      value={options.filter(
                        (option) => option.value === values.selectExercise
                      )}
                      onChange={(option) => {
                        form.setFieldValue(field.name, option?.value)
                        handleSelectChange(option)
                      }}
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem>
                <div className="flex justify-end">
                  <Button variant="solid" type="submit">
                    Siguiente
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>

      {selectedOption && (
        <div>
          {selectedOption === '1' && (
            <>
              <Table compact className="border shadow w-[700px] text-xs">
                <THead>
                  <Tr>
                    <Th>Ejercicio</Th>
                    <Th>Series x Repeticiones</Th>
                  </Tr>
                </THead>
                <THead>
                  <Tr>
                    <Th>Espalda</Th>
                    <Th>Semana 1</Th>
                    <Th>Semana 2</Th>
                    <Th>Semana 3</Th>
                    <Th>Semana 4</Th>
                  </Tr>
                </THead>
                <TBody>
                  <Tr>
                    <Td>Jalones Frontales en polea</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                  <Tr>
                    <Td>Jalones en polea agarre V</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                  <Tr>
                    <Td>Remo con Barra</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                  <Tr>
                    <Td>Remo en polea</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                </TBody>
                <THead>
                  <Tr>
                    <Th>Tríceps</Th>
                    <Th>Semana 1</Th>
                    <Th>Semana 2</Th>
                    <Th>Semana 3</Th>
                    <Th>Semana 4</Th>
                  </Tr>
                </THead>
                <TBody>
                  <Tr>
                    <Td>Press Francés</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                  <Tr>
                    <Td>Fondos de Tríceps</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                  <Tr>
                    <Td>Jalones en polea</Td>
                    <Td>4 x 6-8</Td>
                    <Td>4 x 8-10</Td>
                    <Td>4 x 10-12</Td>
                    <Td>2 x 5-6, 2 x 10-12</Td>
                  </Tr>
                </TBody>
              </Table>
            </>
          )}
          {selectedOption === '2' && <></>}
        </div>
      )}
    </div>
  )
}

export default ExercisesStep
