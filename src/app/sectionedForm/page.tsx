import { FormFieldType } from '@/components/form/DynamicForm'
import SectionedDynamicForm, {
  type SectionConfig,
} from '@/components/form/SectionedDynamicForm'
import z from 'zod'

const sectionConfig: SectionConfig = {
  title: 'User Information Sections',
  description: 'Add multiple user entries',
  fields: [
    {
      fieldName: 'name',
      fieldLabel: 'Full Name',
      fieldType: FormFieldType.TEXT,
      placeholder: 'Enter name...',
    },
    {
      fieldName: 'email',
      fieldLabel: 'Email',
      fieldType: FormFieldType.EMAIL,
      placeholder: 'Enter email...',
    },
  ],
  defaultValues: [
    { name: 'Admin', email: 'admin@example.com' }, // Section 1 defaults
    { name: 'Manager', email: 'manager@example.com' }, // Section 2 defaults
    { name: 'Guest', email: 'guest@example.com' }, // Section 3 defaults
  ],
  minSections: 1,
  maxSections: 5,
  allowCopy: true,
  allowReset: true,
  collapsible: true,
}

const yourZodSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
}) // Define your Zod schema here

const handleSubmit = (data: any[]) => {
  console.log('All sections data:', data)
  // data will be an array like:
  // [
  //   { name: "John", email: "john@example.com" },
  //   { name: "Jane", email: "jane@example.com" }
  // ]
}

const SectionedFormPage = () => {
  return (
    <SectionedDynamicForm
      sectionConfig={sectionConfig}
      schema={yourZodSchema}
      onSubmit={handleSubmit}
      submitButtonText="Submit All Users"
      showResetAllButton={true}
      sectionTitlePrefix='User'
    />
  )
}

export default SectionedFormPage
