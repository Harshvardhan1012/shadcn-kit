'use client'
import { type DynamicFormRef, Form } from 'json-reactify'
import { useRef } from 'react'
import { FieldValues } from 'react-hook-form'
import { H3 } from '../../components/ui/Typography'
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
  const formRef = useRef<DynamicFormRef>(null)

  const onSubmit = (data: FieldValues) => {
    console.log(data)
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <H3 className="mb-8">Dynamic Form Example</H3>
      <Form
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
    </div>
  )
}

export default FormPage
