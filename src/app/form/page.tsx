import DynamicForm from '@/components/form/DynamicForm'
import type { FormContextType } from '@/components/form/FormContext'
import { useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { exampleFormConfig, formSchema } from './form_config'

// Define form configuration as a function to accept variables

const parseUTCToLocal = (utcString: string) => {
  const date = new Date(utcString)
  // Extract the time components from UTC string
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  // Create new date with local time
  return new Date(year, month, day, hours, minutes, seconds)
}

const FormPage = () => {
  const formRef = useRef<FormContextType>(null)

  const onSubmit = (data: FieldValues) => {
    console.log(data)
  }
  return (
    <DynamicForm
      ref={formRef}
      formConfig={exampleFormConfig}
      onSubmit={(data: any) => onSubmit(data)}
      schema={formSchema}
      loading={false}
      defaultValues={{
        username: 'dsfdsf',
        email: 'dsfds@gmail.com',
        password: 'dsdsfsdfd',
        age: 18,
        bio: 'dsfsdf',
        agreeToTerms: false,
        birthDateRange: {
          from: new Date(2025, 7, 1),
          to: new Date(2025, 7, 20),
        },
        gender: 'male',
        department: new Date(),
        favoriteFruit: 'apple',
        newsletter: parseUTCToLocal('2025-08-09T10:10:10.000Z'),
        items: ['orange', 'apple'],
        itemss: ['orange'],
      }}
    />
  )
}

export default FormPage
