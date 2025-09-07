'use client'
import { type DynamicFormRef, Form, FormFieldType } from 'json-reactify'
import { TimeFormat, TimeStructure } from '@/components/form/DateTime'
import {
  CalendarDays,
  FileText,
  ImageIcon,
  Lock,
  Mail,
  User,
} from 'lucide-react' // Import appropriate icons
import { useRef } from 'react'
import { FieldValues } from 'react-hook-form'
import * as z from 'zod'
import { H3 } from '../../components/ui/Typography'
import { FormFieldConfig } from './../../components/form/DynamicForm'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' }),
  age: z.number().min(1, { message: 'Age must be at least 1.' }),
  bio: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
  birthDateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // Type: { from?: Date; to?: Date } Type: [Date, Date]
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender.' }),
  }),
  department: z.date().optional(), // Changed to date type for date input
  favoriteFruit: z.enum(['apple', 'banana', 'orange'], {
    errorMap: () => ({ message: 'Please select a fruit.' }),
  }),
  newsletter: z.date().optional(), // Changed to date type for datetime input
  items: z.array(z.string()).optional(),
})

// Define form configuration as a function to accept variables

const FormPage = () => {
  const formRef = useRef<DynamicFormRef>(null)

  const onSubmit = (data: FieldValues) => {
    console.log(data)
    // showAlert('default', 'Form Submitted', 'Your form has been submitted successfully.')
    console.log(
      'Form submitted!',
      data.newsletter.getDate(),
      data.newsletter.getHours(),
      data.newsletter.getMinutes(),
      data.newsletter.getSeconds()
    )
  }

  const exampleFormConfig: FormFieldConfig[] = [
    {
      fieldName: 'username',
      fieldLabel: 'Username',
      fieldType: FormFieldType.TEXT,
      placeholder: `Enter your username`,
      icon: User,
      validation: formSchema.shape.username,
      description: 'This is your public display name.',
      disabled: false,
    },
    {
      fieldName: 'email',
      fieldLabel: 'Email',
      fieldType: FormFieldType.EMAIL,
      placeholder: 'your@email.com',
      icon: Mail,
      validation: formSchema.shape.email,
      description: "We'll never share your email.",
    },
    {
      fieldName: 'password',
      fieldLabel: 'Password',
      fieldType: FormFieldType.PASSWORD,
      placeholder: '••••••••',
      icon: Lock,
      validation: formSchema.shape.password,
      description: 'Choose a strong password.',
    },
    {
      fieldName: 'age',
      fieldLabel: 'Age',
      fieldType: FormFieldType.NUMBER,
      placeholder: 'Enter your age',
      validation: formSchema.shape.age,
      description: 'You must be at least 1 year old.',
      hidden: false,
      max: 120,
      min: 10,
    },
    {
      fieldName: 'agreeToTerms',
      fieldLabel: 'I agree to the terms and conditions',
      fieldType: FormFieldType.CHECKBOX,
      validation: formSchema.shape.agreeToTerms,
      description: 'You must agree before submitting.',
    },
    {
      fieldName: 'birthDateRange',
      fieldLabel: 'Date of Birth',
      fieldType: FormFieldType.DATE,
      icon: CalendarDays,
      mode: 'range',
      description: 'Pick your date of birth.',
      onChangeField(value) {
        console.log('Birth date range changed:', value)
      },
      validation: formSchema.shape.birthDateRange,
    },
    {
      fieldName: 'gender',
      fieldLabel: 'Gender',
      fieldType: FormFieldType.SELECT,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
      validation: formSchema.shape.gender,
      description: 'Select your gender.',
    },
    {
      fieldName: 'bio',
      fieldLabel: 'Biography',
      fieldType: FormFieldType.TEXTAREA,
      placeholder: 'Tell us about yourself',
      icon: FileText,
      validation: formSchema.shape.bio,
      description: 'A short bio about you.',
    },
    {
      fieldName: 'department',
      fieldLabel: 'Department',
      fieldType: FormFieldType.DATE,
      mode: 'single',
      minDate: new Date(2025, 8, 1), // September 1, 2025 (month is 0-indexed)
      maxDate: new Date(2025, 11, 31), // December 31, 2025
      // validation: formSchema.shape.department,
      description: 'Select your department.',
    },
    {
      fieldName: 'favoriteFruit',
      fieldLabel: 'Favorite Fruit',
      fieldType: FormFieldType.COMBOBOX,
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
      ],
      validation: formSchema.shape.favoriteFruit,
      description: 'Pick your favorite fruit.',
    },
    {
      fieldType: FormFieldType.MULTISELECT,
      fieldName: 'itemss',
      fieldLabel: 'Items',
      enableSearch: false, // Disables search completely
      emptyMessage: 'No items found',
      value: ['orange'],
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
      ],
    },
    {
      fieldType: FormFieldType.MULTISELECT,
      fieldName: 'items',
      fieldLabel: 'Items',
      placeholder: 'Select items',
      enableSearch: true, // Disables search completely
      searchPlaceholder: 'Search items...',
      emptyMessage: 'No items found',
      onChangeField(value: unknown) {
        console.log(value)
      },
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
      ],
    },
    {
      fieldName: 'newsletter',
      fieldLabel: 'Newsletter Subscription',
      fieldType: FormFieldType.DATETIME,
      description: 'Select date and time for newsletter.',
      icon: ImageIcon,
      validation: formSchema.shape.newsletter,
      onChangeField(value) {
        console.log('Newsletter datetime changed:', value)
        handleItemsChange(value)
      },
      timeFormat: TimeFormat.TWELVE_HOUR,
      timeStructure: TimeStructure.HOUR_ONLY,
      minDate: new Date(2025, 8, 1), // September 1, 2025 (month is 0-indexed)
      maxDate: new Date(2025, 11, 31), // December 31, 2025
    },
  ]

  // const { showAlert } = useAlert()
  const handleItemsChange = (value: unknown) => {
    console.log(formRef.current?.getFieldValue('items'))
    console.log(formRef.current?.getFieldValue('itemss'))
    console.log(formRef.current?.getFieldValue('newsletter'))
    if (Array.isArray(value)) {
      // When items changes, update itemss using formRef
      formRef.current?.setFieldValue('itemss', value)
      console.log('Items changed:', value)
    }
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
          newsletter: new Date(),
          items: ['orange', 'apple'],
          itemss: ['orange'],
        }}
      />
    </div>
  )
}

export default FormPage
