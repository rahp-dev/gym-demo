import { Dispatch, SetStateAction, useState } from 'react'
import * as Yup from 'yup'
import Select from '@/components/ui/Select'
import { Avatar, Button, Timeline } from '@/components/ui'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import type { AvatarProps } from '@/components/ui/Avatar'
import { CreatePlanFormModel } from '@/services/customers/types/customer.type'

type Option = {
  value: string
  label: string
}

type FormModel = {
  selectTime: string
}

const options: Option[] = [
  { value: '1', label: 'Distribución de entrenamiento recomendada' },
  { value: '2', label: 'Distribución de entrenamiento alternativa' },
]

const validationSchema = Yup.object().shape({
  selectTime: Yup.string().required('Selecciona la duración del plan'),
})

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
  return (
    <Avatar {...rest} size={25} shape="circle">
      {children}
    </Avatar>
  )
}

function DurationStep({
  planData,
  setPlanData,
  setCurrentStep,
}: {
  planData: CreatePlanFormModel
  setPlanData: Dispatch<SetStateAction<CreatePlanFormModel>>
  setCurrentStep: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3'>>
}) {
  const [selectedOption, setSelectedOption] = useState('')
  const [selectTime, setSelectTime] = useState(planData.selectTime || '')

  const onSubmit = () => {
    setPlanData({ ...planData, selectTime })
    setCurrentStep('tab2')
  }

  const handleSelectChange = (option: any) => {
    setSelectTime(option?.value || '')
    setSelectedOption(option?.value || '')
  }

  const renderSelectedOption = () => {
    if (selectedOption === '1') {
      return (
        <Timeline>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">L</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Lunes - Día 1
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">M</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Martes - Día 2
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">M</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Miércoles - Descanso
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">J</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Jueves - Día 3
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">V</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Viernes - Día 4
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">S/D</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Sábado y Domingo - Descanso
              </span>
            </p>
          </Timeline.Item>
        </Timeline>
      )
    } else if (selectedOption === '2') {
      return (
        <Timeline>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">L</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Lunes - Día 1
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">M</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Martes - Día 2
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">M</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Miércoles - Día 3
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">J</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Jueves - Descanso
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">V</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Viernes - Día 4
              </span>
            </p>
          </Timeline.Item>
          <Timeline.Item
            media={<TimelineAvatar className="bg-blue-400">S/D</TimelineAvatar>}
          >
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Sábado y Domingo - Descanso
              </span>
            </p>
          </Timeline.Item>
        </Timeline>
      )
    }

    return null
  }

  return (
    <>
      <Formik
        initialValues={planData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors }) => (
          <Form className="xl:w-[450px] lg:w-full mobile:w-full sp:w-full">
            <FormContainer>
              <FormItem
                asterisk
                label="Duración del plan"
                invalid={errors.selectTime && touched.selectTime}
                errorMessage={errors.selectTime}
              >
                <Field name="selectTime">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      placeholder="Selecciona uno..."
                      field={field}
                      form={form}
                      options={options}
                      value={options.filter(
                        (option) => option.value === selectTime
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
      <div>{selectedOption && renderSelectedOption()}</div>
    </>
  )
}

export default DurationStep
