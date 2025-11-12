# Shadcn-Kit Documentation

Complete documentation for Forms, Tables, and Charts components.

---

## Table of Contents

1. [Dynamic Form](#dynamic-form)
2. [Master Table](#master-table)
3. [Dynamic Chart](#dynamic-chart)

---

## Dynamic Form

A flexible, type-safe form builder with validation, conditional fields, and custom components.

### Features

- Multiple field types (text, email, password, number, select, multiselect, combobox, date, datetime, file, checkbox, switch, radio, textarea)
- Zod schema validation
- Conditional field visibility
- Custom field validation
- File upload with preview
- Multi-select with search
- Combobox with search
- Date and DateTime pickers
- Form context API for programmatic control

### Basic Usage

```tsx
import { DynamicForm, FormFieldType } from '@/components/form'
import { z } from 'zod'

// Define schema
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older'),
  role: z.string(),
})

// Define form configuration
const formConfig = [
  {
    fieldName: 'name',
    fieldLabel: 'Full Name',
    fieldType: FormFieldType.TEXT,
    placeholder: 'Enter your name',
    description: 'Your full legal name',
  },
  {
    fieldName: 'email',
    fieldLabel: 'Email',
    fieldType: FormFieldType.EMAIL,
    placeholder: 'your.email@example.com',
  },
  {
    fieldName: 'age',
    fieldLabel: 'Age',
    fieldType: FormFieldType.NUMBER,
    placeholder: '18',
  },
  {
    fieldName: 'role',
    fieldLabel: 'Role',
    fieldType: FormFieldType.SELECT,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
  },
]

function MyForm() {
  const handleSubmit = (data) => {
    console.log('Form data:', data)
  }

  return (
    <DynamicForm
      formConfig={formConfig}
      schema={schema}
      onSubmit={handleSubmit}
      submitButtonText="Submit"
      showResetButton={true}
    />
  )
}
```

### Field Types

#### Text Input

```tsx
{
  fieldName: 'username',
  fieldLabel: 'Username',
  fieldType: FormFieldType.TEXT,
  placeholder: 'Enter username',
  description: 'Choose a unique username',
  disabled: false,
}
```

#### Email Input

```tsx
{
  fieldName: 'email',
  fieldLabel: 'Email Address',
  fieldType: FormFieldType.EMAIL,
  placeholder: 'your.email@example.com',
}
```

#### Password Input

```tsx
{
  fieldName: 'password',
  fieldLabel: 'Password',
  fieldType: FormFieldType.PASSWORD,
  placeholder: 'Enter password',
  description: 'Must be at least 8 characters',
}
```

#### Number Input

```tsx
{
  fieldName: 'age',
  fieldLabel: 'Age',
  fieldType: FormFieldType.NUMBER,
  placeholder: '18',
}
```

#### Select Dropdown

```tsx
{
  fieldName: 'country',
  fieldLabel: 'Country',
  fieldType: FormFieldType.SELECT,
  placeholder: 'Select country',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'India', value: 'in' },
  ],
}
```

#### Multi-Select

```tsx
{
  fieldName: 'skills',
  fieldLabel: 'Skills',
  fieldType: FormFieldType.MULTISELECT,
  placeholder: 'Select skills',
  options: [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'node' },
  ],
  enableSearch: true,
  maxSelectedDisplay: 3,
  creatable: true, // Allow custom values
}
```

#### Combobox (Searchable Select)

```tsx
{
  fieldName: 'city',
  fieldLabel: 'City',
  fieldType: FormFieldType.COMBOBOX,
  placeholder: 'Select city',
  searchPlaceholder: 'Search cities...',
  emptyMessage: 'No city found',
  options: [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
    { label: 'Chicago', value: 'chi' },
  ],
  onSearchChange: (name, value) => {
    console.log('Searching:', value)
  },
}
```

#### Date Picker

```tsx
{
  fieldName: 'birthDate',
  fieldLabel: 'Birth Date',
  fieldType: FormFieldType.DATE,
  mode: 'single',
  minDate: new Date('1900-01-01'),
  maxDate: new Date(),
}
```

#### Date Range Picker

```tsx
{
  fieldName: 'dateRange',
  fieldLabel: 'Date Range',
  fieldType: FormFieldType.DATE,
  mode: 'range',
}
```

#### DateTime Picker

```tsx
{
  fieldName: 'appointmentTime',
  fieldLabel: 'Appointment Time',
  fieldType: FormFieldType.DATETIME,
  timeFormat: 12, // or 24
  timeStructure: 'hour-minute', // or 'hour-minute-second'
  minDate: new Date(),
}
```

#### Checkbox

```tsx
{
  fieldName: 'terms',
  fieldLabel: 'Accept Terms and Conditions',
  fieldType: FormFieldType.CHECKBOX,
  description: 'You must accept the terms to continue',
}
```

#### Switch

```tsx
{
  fieldName: 'notifications',
  fieldLabel: 'Enable Notifications',
  fieldType: FormFieldType.SWITCH,
  description: 'Receive email notifications',
}
```

#### Radio Group

```tsx
{
  fieldName: 'gender',
  fieldLabel: 'Gender',
  fieldType: FormFieldType.RADIO,
  options: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
}
```

#### Textarea

```tsx
{
  fieldName: 'bio',
  fieldLabel: 'Biography',
  fieldType: FormFieldType.TEXTAREA,
  placeholder: 'Tell us about yourself',
  description: 'Maximum 500 characters',
}
```

#### File Upload

```tsx
{
  fieldName: 'avatar',
  fieldLabel: 'Profile Picture',
  fieldType: FormFieldType.FILE,
  accept: 'image/*',
  buttonText: 'Upload Image',
  description: 'Max size: 5MB',
}
```

### Conditional Fields

Show/hide fields based on other field values:

```tsx
const formConfig = [
  {
    fieldName: 'hasExperience',
    fieldLabel: 'Do you have experience?',
    fieldType: FormFieldType.SWITCH,
  },
  {
    fieldName: 'yearsOfExperience',
    fieldLabel: 'Years of Experience',
    fieldType: FormFieldType.NUMBER,
    showIf: (formValues) => formValues.hasExperience === true,
  },
]
```

### Field Events

Handle field-level events:

```tsx
{
  fieldName: 'email',
  fieldLabel: 'Email',
  fieldType: FormFieldType.EMAIL,
  onChangeField: (value) => {
    console.log('Email changed:', value)
  },
  onBlurField: (value) => {
    console.log('Email blurred:', value)
  },
  onErrorField: (error) => {
    console.error('Email error:', error)
  },
}
```

### Form Context API

Access form methods programmatically:

```tsx
import { useFormContext } from '@/components/form'

function MyComponent() {
  const formContext = useFormContext()

  const handleCustomAction = () => {
    // Get field value
    const email = formContext.getFieldValue('email')
    
    // Set field value
    formContext.setFieldValue('name', 'John Doe')
    
    // Validate specific field
    formContext.validateField('email')
    
    // Validate entire form
    formContext.validateForm()
    
    // Reset form
    formContext.resetForm()
    
    // Get all form values
    const allValues = formContext.getFormValues()
    
    // Check if form is valid
    const isValid = formContext.isValid()
    
    // Get errors
    const errors = formContext.getErrors()
  }

  return <button onClick={handleCustomAction}>Custom Action</button>
}
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formConfig` | `FormFieldConfig[]` | Required | Array of field configurations |
| `schema` | `ZodSchema` | Required | Zod validation schema |
| `onSubmit` | `(data) => void` | Required | Form submission handler |
| `defaultValues` | `object` | `{}` | Default form values |
| `submitButtonText` | `string` | `'Submit'` | Submit button text |
| `showResetButton` | `boolean` | `false` | Show reset button |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `className` | `string` | `''` | Additional CSS classes |
| `customSubmitButton` | `ReactNode` | `null` | Custom submit button component |

---

## Master Table

A powerful data table component with client-side filtering, sorting, pagination, and bulk operations.

### Features

- Column sorting
- Pagination
- Row selection
- Bulk actions
- Column visibility toggle
- Export to Excel
- Customizable columns
- Multiple Filter management
- Bulk upload from Excel


### Column Configuration

#### Text Column

```tsx
{
  field: 'name',
  headerName: 'Name',
  enableSorting: true,
  enableHiding: true,
  options: {
    variant: 'text',
  },
}
```

#### Number Column

```tsx
{
  field: 'age',
  headerName: 'Age',
  enableSorting: true,
  options: {
    variant: 'number',
  },
}
```

#### Select/Enum Column

```tsx
{
  field: 'status',
  headerName: 'Status',
  enableSorting: true,
  options: {
    variant: 'select',
    selectOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
}
```

#### Date Column

```tsx
{
  field: 'createdAt',
  headerName: 'Created At',
  enableSorting: true,
  options: {
    variant: 'date',
  },
}
```


### Row Actions

Define actions for each row:

```tsx
const columnActions = [
  {
    label: 'View',
    key: 'view' 
  },
]
```

### Bulk Actions

Define actions for multiple selected rows:

```tsx
const actionConfig = {
  bulkActions: [
    {
      label: 'Delete Selected',
      key: "delete"
    },
    {
      label: 'Export Selected',
      key: "export"
    },
  ],
}
```

### Add Item Button

Add a button to create new items:

```tsx
const addItemData = {
  title: 'Add New User',
}

function MyTable() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <DynamicMaster
      datatableConfig={{
        columnsConfig,
        columnActions,
        tableConfig: {},
        actionConfig: {},
        addItemData,
      }}
      data={data}
      sheetOpen={sheetOpen}
      onSheetOpenChange={setSheetOpen}
      onClickAddItem={() => {
        console.log('Add new item')
      }}>
      {/* Your form or content for the sheet */}
      <div>Add User Form</div>
    </DynamicMaster>
  )
}
```

### Bulk Upload

Enable bulk upload from Excel:

```tsx
import { z } from 'zod'

const bulkUploadConfig = {
  template: {
    columns: [
      { key: 'name', label: 'Name', type: FormFieldType.TEXT },
      { key: 'email', label: 'Email', type: FormFieldType.EMAIL },
      { 
        key: 'role', 
        label: 'Role', 
        type: FormFieldType.SELECT,
        dropdownOptions: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
  },
  schema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['admin', 'user']),
  }),
  onUpload: async (data) => {
    console.log('Upload data:', data)
    // Make API call to save data
  },
  buttonTitle: 'Bulk Upload Users',
  emptyRowCount: 10,
}

function MyTable() {
  return (
    <DynamicMaster
      datatableConfig={{...}}
      data={data}
      bulkUploadConfig={bulkUploadConfig}
    />
  )
}
```

### Loading State

Show loading skeleton:

```tsx
<DynamicMaster
  datatableConfig={{...}}
  data={data}
  isLoading={true}
/>
```

### Error State

Show error message:

```tsx
<DynamicMaster
  datatableConfig={{...}}
  data={data}
  errorMessage="Failed to load data. Please try again."
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `datatableConfig` | `DatatableConfig` | Required | Table configuration object |
| `data` | `any[]` | `[]` | Table data |
| `sheetOpen` | `boolean` | `false` | Control sheet visibility |
| `onSheetOpenChange` | `(open: boolean) => void` | `undefined` | Sheet state change handler |
| `isLoading` | `boolean` | `false` | Show loading state |
| `errorMessage` | `string` | `undefined` | Error message to display |
| `onClickAddItem` | `() => void` | `() => {}` | Add item button handler |
| `bulkUploadConfig` | `BulkUploadConfig` | `undefined` | Bulk upload configuration |

---

## Dynamic Chart

A flexible charting component supporting multiple chart types with filtering and export capabilities.

### Features

- Multiple chart types (line, area, bar, pie, donut, table)
- Dynamic data visualization
- Chart type switching
- Zoom controls
- Export to CSV
- Global and series-specific filtering
- Value operation for raw data display
- Aggregation operations (sum, avg, min, max, count, uniqueCount)
- Loading state
- Customizable styling

### Basic Usage

```tsx
import { DynamicChart } from '@/components/chart'

const data = [
  { month: 'Jan', revenue: 1000, expenses: 800 },
  { month: 'Feb', revenue: 1500, expenses: 900 },
  { month: 'Mar', revenue: 1200, expenses: 850 },
]

const config = {
  revenue: { label: 'Revenue' },
  expenses: { label: 'Expenses' },
}

function MyChart() {
  return (
    <DynamicChart
      title="Monthly Revenue"
      description="Revenue and expenses over time"
      chartType="bar"
      data={data}
      config={config}
      xAxisKey="month"
      yAxisKeys={['revenue', 'expenses']}
      height={400}
    />
  )
}
```

### Chart Types

#### Line Chart

```tsx
<DynamicChart
  chartType="line"
  data={data}
  xAxisKey="month"
  yAxisKeys={['sales']}
  config={{ sales: { label: 'Sales' } }}
/>
```

#### Area Chart

```tsx
<DynamicChart
  chartType="area"
  data={data}
  xAxisKey="month"
  yAxisKeys={['sales']}
  config={{ sales: { label: 'Sales' } }}
/>
```

#### Bar Chart

```tsx
<DynamicChart
  chartType="bar"
  data={data}
  xAxisKey="month"
  yAxisKeys={['revenue', 'expenses']}
  config={{
    revenue: { label: 'Revenue' },
    expenses: { label: 'Expenses' },
  }}
/>
```

#### Pie Chart

```tsx
<DynamicChart
  chartType="pie"
  data={data}
  xAxisKey="category"
  yAxisKeys={['value']}
  config={{ value: { label: 'Sales by Category' } }}
/>
```

#### Donut Chart

```tsx
<DynamicChart
  chartType="donut"
  data={data}
  xAxisKey="category"
  yAxisKeys={['value']}
  config={{ value: { label: 'Market Share' } }}
/>
```

#### Table View

```tsx
<DynamicChart
  chartType="table"
  data={data}
  xAxisKey="product"
  yAxisKeys={['sales', 'profit']}
  tableConfig={{
    showRowNumbers: true,
    sortable: true,
    columnHeaders: {
      product: 'Product Name',
      sales: 'Total Sales',
      profit: 'Net Profit',
    },
    hiddenColumns: ['id'],
  }}
/>
```

### Zoom Controls

```tsx
<DynamicChart
  data={data}
  xAxisKey="date"
  yAxisKeys={['value']}
  zoom={{
    enabled: true,
    factor: 0.2,
    minZoom: 0.5,
    maxZoom: 3,
    initialZoom: 1,
    showControls: true,
  }}
/>
```

### Export to CSV

```tsx
<DynamicChart
  data={data}
  xAxisKey="month"
  yAxisKeys={['sales']}
  showDownload={true}
  downloadFilename="sales-report"
/>
```

### Loading State

```tsx
<DynamicChart
  data={[]}
  xAxisKey="month"
  yAxisKeys={['sales']}
  loading={true}
/>
```

### Custom Styling

```tsx
<DynamicChart
  data={data}
  xAxisKey="month"
  yAxisKeys={['sales']}
  className="my-chart"
  classNames={{
    card: 'border-2',
    cardHeader: 'bg-gray-100',
    cardTitle: 'text-xl font-bold',
    cardContent: 'p-6',
  }}
  height={500}
/>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | `undefined` | Chart title |
| `description` | `ReactNode` | `undefined` | Chart description |
| `footer` | `ReactNode` | `undefined` | Chart footer |
| `chartType` | `ChartType` | `'line'` | Type of chart to display |
| `data` | `ChartDataPoint[]` | Required | Chart data |
| `config` | `ChartConfig` | `{}` | Chart configuration |
| `xAxisKey` | `string` | `'name'` | X-axis data key |
| `yAxisKeys` | `string[]` | `['value']` | Y-axis data keys |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showTooltip` | `boolean` | `true` | Show tooltip |
| `showLegend` | `boolean` | `true` | Show legend |
| `height` | `number \| string` | `400` | Chart height |
| `showTypeSelector` | `boolean` | `true` | Show chart type selector |
| `showDownload` | `boolean` | `true` | Show download button |
| `downloadFilename` | `string` | `'chart-data'` | Download filename |
| `loading` | `boolean` | `false` | Show loading state |
| `zoom` | `ZoomConfig` | `{}` | Zoom configuration |
| `tableConfig` | `TableConfig` | `{}` | Table view configuration |
| `onDataPointClick` | `(data) => void` | `undefined` | Data point click handler |

---

## Complete Example

Here's a complete example combining all three components:

```tsx
import { useState } from 'react'
import { DynamicForm, FormFieldType } from '@/components/form'
import DynamicMaster from '@/components/master-table'
import { DynamicChart } from '@/components/chart'
import { z } from 'zod'

// Form schema
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  department: z.string(),
})

// Form configuration
const formConfig = [
  {
    fieldName: 'name',
    fieldLabel: 'Full Name',
    fieldType: FormFieldType.TEXT,
    placeholder: 'John Doe',
  },
  {
    fieldName: 'email',
    fieldLabel: 'Email',
    fieldType: FormFieldType.EMAIL,
    placeholder: 'john@example.com',
  },
  {
    fieldName: 'role',
    fieldLabel: 'Role',
    fieldType: FormFieldType.SELECT,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
  },
  {
    fieldName: 'department',
    fieldLabel: 'Department',
    fieldType: FormFieldType.COMBOBOX,
    searchPlaceholder: 'Search departments...',
    options: [
      { label: 'Engineering', value: 'eng' },
      { label: 'Sales', value: 'sales' },
      { label: 'Marketing', value: 'marketing' },
    ],
  },
]

// Table columns
const columnsConfig = [
  { field: 'id', headerName: 'ID', enableSorting: true },
  { field: 'name', headerName: 'Name', enableSorting: true },
  { field: 'email', headerName: 'Email', enableSorting: true },
  {
    field: 'role',
    headerName: 'Role',
    enableSorting: true,
    options: {
      variant: 'select',
      selectOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' },
      ],
    },
  },
  { field: 'department', headerName: 'Department', enableSorting: true },
]

function Dashboard() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', department: 'eng' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', department: 'sales' },
  ])
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleSubmit = (data) => {
    const newUser = { id: users.length + 1, ...data }
    setUsers([...users, newUser])
    setSheetOpen(false)
  }

  // Chart data by department
  const chartData = users.reduce((acc, user) => {
    const existing = acc.find(d => d.department === user.department)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ department: user.department, count: 1 })
    }
    return acc
  }, [])

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">User Management Dashboard</h1>

      {/* Chart */}
      <DynamicChart
        title="Users by Department"
        description="Distribution of users across departments"
        chartType="bar"
        data={chartData}
        xAxisKey="department"
        yAxisKeys={['count']}
        config={{ count: { label: 'User Count' } }}
        height={300}
      />

      {/* Table */}
      <DynamicMaster
        datatableConfig={{
          columnsConfig,
          columnActions: [
            {
              label: 'Edit',
              onClick: (row) => console.log('Edit:', row),
            },
          ],
          tableConfig: {},
          actionConfig: {},
          addItemData: { title: 'Add User' },
        }}
        data={users}
        sheetOpen={sheetOpen}
        onSheetOpenChange={setSheetOpen}
        onClickAddItem={() => setSheetOpen(true)}>
        {/* Form */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Add New User</h2>
          <DynamicForm
            formConfig={formConfig}
            schema={userSchema}
            onSubmit={handleSubmit}
            submitButtonText="Add User"
          />
        </div>
      </DynamicMaster>
    </div>
  )
}

export default Dashboard
```


## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type { FormFieldConfig, FormFieldType } from '@/components/form'
import type { ColumnConfig } from '@/components/master-table'
import type { ChartDataPoint, ChartType, ChartConfig } from '@/components/chart'
```

---

## Troubleshooting

### Form not validating

- Ensure Zod schema matches field names
- Check that validation rules are correct
- Verify required fields have values

### Table not filtering

- This component supports client-side filtering only
- Check that column variants are correctly set
- Ensure data is properly formatted

### Chart showing 0 values with "value" operation

- "Value" operation works best with distinct X-axis values
- For duplicate X-axis values, the last value is used
- Consider using aggregation operations (sum, avg) instead

### Chart not displaying data

- Verify xAxisKey and yAxisKeys match data keys
- Check that data is in correct format
- Ensure chart type supports your data structure

---