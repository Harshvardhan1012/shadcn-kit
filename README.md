# json-reactify Documentation

A comprehensive React component library for building dynamic forms, charts,sidebars and alerts from JSON configuration.

---

## Form Component

The Form component is a flexible, type-safe React form builder that supports multiple field types with built-in validation using React Hook Form and Zod.

<details>
<summary><strong>Quick Start</strong></summary>

```tsx
import { Form } from 'json-reactify'

// Define your form schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
})

type UserFormData = z.infer<typeof userSchema>

// Configure your form fields
const formConfig = [
  {
    fieldType: FormFieldType.TEXT,
    fieldName: 'name',
    fieldLabel: 'Full Name',
    placeholder: 'Enter your full name',
    description: 'Your legal first and last name',
  },
  {
    fieldType: FormFieldType.EMAIL,
    fieldName: 'email',
    fieldLabel: 'Email Address',
    placeholder: 'you@example.com',
  },
  {
    fieldType: FormFieldType.NUMBER,
    fieldName: 'age',
    fieldLabel: 'Age',
    placeholder: '25',
  },
]

// Use the component
function MyForm() {
  const handleSubmit = (data: UserFormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formConfig={formConfig}
      schema={userSchema}
      onSubmit={handleSubmit}
      defaultValues={{ name: '', email: '', age: 0 }}
    />
  )
}
```

</details>

<details>
<summary><strong>Field Types</strong></summary>

### Text Input Fields

```tsx
{
  fieldType: FormFieldType.TEXT,
  fieldName: 'username',
  fieldLabel: 'Username',
  placeholder: 'Enter username',
  icon: User, // Optional icon from lucide-react
}
```

**Supported types:** `TEXT`, `PASSWORD`, `EMAIL`, `NUMBER`

### Textarea

```tsx
{
  fieldType: FormFieldType.TEXTAREA,
  fieldName: 'description',
  fieldLabel: 'Description',
  placeholder: 'Enter description...',
  rows: 4,
}
```

### Checkbox

```tsx
{
  fieldType: FormFieldType.CHECKBOX,
  fieldName: 'agreeToTerms',
  fieldLabel: 'I agree to the terms and conditions',
  description: 'You must agree to continue',
}
```

### Switch

```tsx
{
  fieldType: FormFieldType.SWITCH,
  fieldName: 'notifications',
  fieldLabel: 'Enable Notifications',
  description: 'Receive email notifications',
}
```

### Select Dropdown

```tsx
{
  fieldType: FormFieldType.SELECT,
  fieldName: 'country',
  fieldLabel: 'Country',
  placeholder: 'Select your country',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ],
}
```

### Radio Group

```tsx
{
  fieldType: FormFieldType.RADIO,
  fieldName: 'plan',
  fieldLabel: 'Subscription Plan',
  options: [
    { value: 'basic', label: 'Basic ($9/month)' },
    { value: 'pro', label: 'Pro ($19/month)' },
    { value: 'enterprise', label: 'Enterprise ($49/month)' },
  ],
  orientation: 'vertical', // or 'horizontal'
}
```

### Combobox (Searchable Select)

```tsx
{
  fieldType: FormFieldType.COMBOBOX,
  fieldName: 'language',
  fieldLabel: 'Programming Language',
  placeholder: 'Select a language',
  searchPlaceholder: 'Search languages...',
  emptyMessage: 'No language found.',
  options: [
    { value: 'js', label: 'JavaScript', icon: Code },
    { value: 'ts', label: 'TypeScript', icon: Code },
    { value: 'py', label: 'Python', icon: Code },
  ],
}
```

### Multi-Select

```tsx
{
  fieldType: FormFieldType.MULTISELECT,
  fieldName: 'skills',
  fieldLabel: 'Skills',
  placeholder: 'Select your skills',
  maxSelectedDisplay: 3,
  options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'node', label: 'Node.js' },
  ],
}
```

### Date Picker

```tsx
{
  fieldType: FormFieldType.DATE,
  fieldName: 'birthDate',
  fieldLabel: 'Birth Date',
  mode: 'single', // 'single', 'multiple', or 'range'
  fromDate: new Date(1900, 0, 1),
  toDate: new Date(),
}
```

### DateTime Picker

```tsx
{
  fieldType: FormFieldType.DATETIME,
  fieldName: 'appointmentTime',
  fieldLabel: 'Appointment Date & Time',
  timeFormat: '12', // '12' or '24'
  timeStructure: 'hh:mm', // 'hh', 'hh:mm', or 'hh:mm:ss'
  fromDate: new Date(),
  toDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
}
```

### File Upload

```tsx
{
  fieldType: FormFieldType.FILE,
  fieldName: 'avatar',
  fieldLabel: 'Profile Picture',
  accept: 'image/*',
  multiple: false,
  icon: Upload,
}
```

</details>

<details>
<summary><strong>Advanced Features</strong></summary>

### Conditional Fields

Show/hide fields based on other field values:

```tsx
{
  fieldType: FormFieldType.TEXT,
  fieldName: 'otherReason',
  fieldLabel: 'Please specify',
  showIf: (formValues) => formValues.reason === 'other',
  dependsOn: ['reason'],
}
```

### Field Validation

Use Zod for powerful validation:

```tsx
const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

### Event Callbacks

Handle field-level events:

```tsx
{
  fieldType: FormFieldType.EMAIL,
  fieldName: 'email',
  fieldLabel: 'Email',
  onChangeField: (value) => {
    console.log('Email changed:', value)
  },
  onBlurField: (value) => {
    // Validate email exists
    checkEmailExists(value)
  },
  onErrorField: (error) => {
    console.error('Email field error:', error)
  },
}
```

### Custom Submit Button

```tsx
<Form
  formConfig={formConfig}
  schema={schema}
  onSubmit={handleSubmit}
  customSubmitButton={
    <div className="flex gap-2">
      <Button type="submit" className="bg-blue-600">
        Save Changes
      </Button>
    </div>
  }
/>
```

</details>

<details>
<summary><strong>Props Reference</strong></summary>

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formConfig` | `FormFieldConfig[]` | ✅ | Array of field configurations |
| `onSubmit` | `SubmitHandler<T>` | ✅ | Form submission handler |
| `schema` | `z.ZodSchema<T>` | ✅ | Zod validation schema |
| `defaultValues` | `DefaultValues<T>` | ❌ | Default form values |
| `customSubmitButton` | `React.ReactNode` | ❌ | Custom submit button component |
| `className` | `string` | ❌ | CSS classes for form container |
| `loading` | `boolean` | ❌ | Show loading skeletons |

### Field Configuration Options

All field types support these common properties:

| Property | Type | Description |
|----------|------|-------------|
| `fieldType` | `FormFieldType` | The type of field to render |
| `fieldName` | `string` | Field name (must match schema) |
| `fieldLabel` | `string` | Display label for the field |
| `description` | `string` | Optional help text |
| `placeholder` | `string` | Placeholder text |
| `disabled` | `boolean` | Disable the field |
| `hidden` | `boolean` | Hide the field |
| `showIf` | `(values) => boolean` | Conditional visibility |
| `dependsOn` | `string[]` | Fields this depends on |
| `onChangeField` | `(value) => void` | Change event handler |
| `onBlurField` | `(value) => void` | Blur event handler |
| `onErrorField` | `(error) => void` | Error event handler |

</details>

<details>
<summary><strong>Complete Example</strong></summary>

```tsx
import { Form, FormFieldType, FormOption } from 'json-reactify'
import * as z from 'zod'
import { User, Mail, Phone, MapPin } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select a country'),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  availability: z.enum(['full-time', 'part-time', 'contract']),
  newsletter: z.boolean(),
  profilePicture: z.instanceof(File).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const countryOptions: FormOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
]

const skillOptions: FormOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
]

const formConfig = [
  {
    fieldType: FormFieldType.TEXT,
    fieldName: 'firstName',
    fieldLabel: 'First Name',
    placeholder: 'John',
    icon: User,
  },
  {
    fieldType: FormFieldType.TEXT,
    fieldName: 'lastName',
    fieldLabel: 'Last Name',
    placeholder: 'Doe',
    icon: User,
  },
  {
    fieldType: FormFieldType.EMAIL,
    fieldName: 'email',
    fieldLabel: 'Email Address',
    placeholder: 'john@example.com',
    icon: Mail,
  },
  {
    fieldType: FormFieldType.TEXT,
    fieldName: 'phone',
    fieldLabel: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    icon: Phone,
  },
  {
    fieldType: FormFieldType.SELECT,
    fieldName: 'country',
    fieldLabel: 'Country',
    placeholder: 'Select your country',
    options: countryOptions,
    icon: MapPin,
  },
  {
    fieldType: FormFieldType.TEXTAREA,
    fieldName: 'bio',
    fieldLabel: 'Bio',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    description: 'Optional: Share a brief description about yourself',
  },
  {
    fieldType: FormFieldType.MULTISELECT,
    fieldName: 'skills',
    fieldLabel: 'Skills',
    placeholder: 'Select your skills',
    options: skillOptions,
    maxSelectedDisplay: 3,
  },
  {
    fieldType: FormFieldType.RADIO,
    fieldName: 'availability',
    fieldLabel: 'Availability',
    options: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
    ],
  },
  {
    fieldType: FormFieldType.SWITCH,
    fieldName: 'newsletter',
    fieldLabel: 'Newsletter Subscription',
    description: 'Receive updates and news via email',
  },
  {
    fieldType: FormFieldType.FILE,
    fieldName: 'profilePicture',
    fieldLabel: 'Profile Picture',
    accept: 'image/*',
    description: 'Upload a profile picture (optional)',
  },
]

export default function ProfileForm() {
  const handleSubmit = (data: ProfileFormData) => {
    console.log('Profile data:', data)
    // Handle form submission
  }

  const defaultValues: Partial<ProfileFormData> = {
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    skills: [],
    availability: 'full-time',
    newsletter: false,
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Profile</h1>
      <Form
        formConfig={formConfig}
        schema={profileSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        className="space-y-4"
      />
    </div>
  )
}
```

</details>

---

## Chart Component

A flexible React chart component built with Recharts and shadcn/ui. Supports multiple chart types, zoom, export, and table view.

<details>
<summary><strong>Features</strong></summary>

- **6 Chart Types**: Area, Line, Bar, Pie, Donut, Table
- **Interactive**: Zoom, click handlers, type switching
- **Responsive**: Auto-sizing and mobile-friendly
- **Export**: CSV download functionality
- **Customizable**: Themes, colors, styling

</details>

<details>
<summary><strong>Quick Start</strong></summary>

```tsx
import { Chart } from 'json-reactify'

const data = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
]

<Chart
  title="Sales Dashboard"
  data={data}
  chartType="line"
  xAxisKey="name"
  yAxisKeys={['sales', 'revenue']}
/>
```

</details>

<details>
<summary><strong>Chart Types</strong></summary>

```tsx
// Line Chart
<Chart chartType="line" data={data} xAxisKey="date" yAxisKeys={['value']} />

// Bar Chart  
<Chart chartType="bar" data={data} xAxisKey="category" yAxisKeys={['amount']} />

// Pie Chart
<Chart chartType="pie" data={data} xAxisKey="name" yAxisKeys={['value']} />

// Table View
<Chart 
  chartType="table" 
  data={data}
  tableConfig={{ sortable: true, showRowNumbers: true }}
/>
```

</details>

<details>
<summary><strong>Customization</strong></summary>

```tsx
<Chart
  data={data}
  config={{
    sales: { label: 'Sales', color: '#8884d8' },
    revenue: { label: 'Revenue', color: '#82ca9d' }
  }}
  pieColors={['#8884d8', '#82ca9d', '#ffc658']}
  autoSize={{ minHeight: 300, maxHeight: 600 }}
  zoom={{ enabled: true, showControls: true }}
  onDataPointClick={(data) => console.log('Clicked:', data)}
/>
```

</details>

<details>
<summary><strong>Examples</strong></summary>
/>
```

</details>

<details>
<summary><strong>Props Reference</strong></summary>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | `[]` | Chart data |
| `chartType` | `'area' \| 'line' \| 'bar' \| 'pie' \| 'donut' \| 'table'` | `'line'` | Chart type |
| `xAxisKey` | `string` | `'name'` | X-axis data key |
| `yAxisKeys` | `string[]` | `['value']` | Y-axis data keys |
| `title` | `ReactNode` | - | Chart title |
| `showTypeSelector` | `boolean` | `true` | Show type dropdown |
| `showDownload` | `boolean` | `true` | Show download button |
| `zoom` | `ZoomConfig` | - | Zoom configuration |
| `tableConfig` | `TableConfig` | - | Table settings |
| `onDataPointClick` | `(data) => void` | - | Click handler |

</details>

<details>
<summary><strong>Examples</strong></summary>

### Dashboard Widget
```tsx
<Chart
  title="Revenue"
  data={revenueData}
  chartType="area" 
  height={200}
  showTypeSelector={false}
/>
```

### Interactive Report
```tsx
const [chartType, setChartType] = useState('bar')

<Chart
  data={salesData}
  chartType={chartType}
  onChartTypeChange={setChartType}
  onDataPointClick={(data) => setSelected(data)}
/>
```

### Sortable Table
```tsx
<Chart
  chartType="table"
  data={tableData}
  tableConfig={{
    sortable: true,
    columnHeaders: { sales: 'Sales ($)' },
    cellRenderer: (value, key) => 
      key === 'sales' ? `$${value.toLocaleString()}` : value
  }}
/>
```

</details>

<details>
<summary><strong>TypeScript Support</strong></summary>

```tsx
import type { ChartType, ChartDataPoint } from 'json-reactify'

interface MyData extends ChartDataPoint {
  date: string
  value: number
}
```

</details>

---

## Alert Service

A simple alert/notification system with auto-dismiss and TypeScript support.

```tsx
import { AlertProvider, useAlert } from 'json-reactify'

// 1. Wrap your app
function App() {
  return (
    <AlertProvider>
      <MyComponent />
    </AlertProvider>
  )
}

// 2. Use in components
function MyComponent() {
  const { showAlert } = useAlert()

  const handleSuccess = () => {
    showAlert('default', 'Success!', 'Action completed successfully.')
  }

  const handleError = () => {
    showAlert('destructive', 'Error!', 'Something went wrong.')
  }

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  )
}
```

**Available Methods:**
- `showAlert(type, title, description)` - Show alert (auto-dismisses in 3s)
- `closeAlert(id)` - Manually close alert
- `alerts` - Array of current alerts

**Alert Types:** `'default'` | `'destructive'`

---

## Sidebar Component

A flexible, configurable sidebar component system built with React and TypeScript that allows you to create dynamic navigation sidebars from JSON configuration.

<details>
<summary><strong>Installation</strong></summary>

```bash
npm install json-reactify
```

</details>

<details>
<summary><strong>Quick Start</strong></summary>

```tsx
import { Sidebar, SideBarProvider } from 'json-reactify'
import { Home, Settings, Users } from 'lucide-react'

function App() {
  const sidebarConfig = {
    groups: [
      {
        id: 'main',
        label: 'Navigation',
        items: [
          {
            id: 'home',
            title: 'Home',
            icon: Home,
            url: '/'
          },
          {
            id: 'users',
            title: 'Users',
            icon: Users,
            url: '/users'
          }
        ]
      }
    ]
  }

  return (
    <SideBarProvider>
      <div className="flex">
        <Sidebar config={sidebarConfig} />
        <main className="flex-1 p-6">
          {/* Your main content */}
        </main>
      </div>
    </SideBarProvider>
  )
}
```

</details>

<details>
<summary><strong>Components</strong></summary>

### Sidebar

The main sidebar component that renders a configurable navigation menu.

```tsx
import { Sidebar } from 'json-reactify'

<Sidebar 
  config={sidebarConfig}
  enableSearch={true}
  isLoading={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `SidebarConfig` | **required** | Configuration object defining the sidebar structure |
| `enableSearch` | `boolean` | `true` | Enable/disable search functionality |
| `isLoading` | `boolean` | `false` | Show loading skeleton when true |

### SideBarProvider

A provider component that wraps your application to provide sidebar context.

```tsx
import { SideBarProvider } from 'json-reactify'

<SideBarProvider>
  <App />
</SideBarProvider>
```

</details>

<details>
<summary><strong> Configuration</strong></summary>

### SidebarConfig

The main configuration object that defines your sidebar structure.

```tsx
interface SidebarConfig {
  groups: SidebarGroup[]
  header?: ReactNode | SidebarHeaderConfig | SidebarGroup[]
  footer?: ReactNode | SidebarFooterConfig | SidebarGroup[]
}
```

### SidebarGroup

Defines a group of related sidebar items.

```tsx
interface SidebarGroup {
  id: string | number
  label?: string
  items: SidebarItem[]
}
```

### SidebarItem

Defines an individual sidebar menu item.

```tsx
interface SidebarItem {
  id: string | number
  title: string
  icon?: React.ElementType | React.ReactNode
  url?: string
  onClick?: () => void
  badge?: ReactNode | string | number
  subItems?: SidebarSubItem[]
  disabled?: boolean
  defaultOpen?: boolean
  showIf?: boolean | (() => boolean)
}
```

### SidebarSubItem

Defines a sub-item within a sidebar item (for nested menus).

```tsx
interface SidebarSubItem {
  id: string | number
  title: string
  icon?: React.ElementType | React.ReactNode
  url?: string
  onClick?: () => void
  badge?: ReactNode | string | number
  disabled?: boolean
  showIf?: boolean | (() => boolean)
}
```

### SidebarHeaderConfig

Configuration for the sidebar header section.

```tsx
interface SidebarHeaderConfig {
  logo?: {
    text?: string
    iconUrl?: string
    iconComponent?: React.ElementType
  }
  user?: {
    name?: string
    email?: string
    avatarUrl?: string
    avatarComponent?: React.ElementType
  }
  className?: string
}
```

### SidebarFooterConfig

Configuration for the sidebar footer section.

```tsx
interface SidebarFooterConfig {
  buttons?: Array<{
    id: string | number
    label: string
    icon?: React.ElementType
    onClick?: () => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  }>
  className?: string
}
```

</details>

<details>
<summary><strong> Examples</strong></summary>

### Basic Sidebar

```tsx
const basicConfig = {
  groups: [
    {
      id: 'main',
      label: 'Main Navigation',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          icon: LayoutDashboard,
          url: '/dashboard'
        },
        {
          id: 'analytics',
          title: 'Analytics',
          icon: BarChart,
          url: '/analytics',
          badge: 'New'
        }
      ]
    }
  ]
}
```

### Sidebar with Header and Footer

```tsx
const configWithHeaderFooter = {
  groups: [
    // ... your groups
  ],
  header: {
    logo: {
      text: 'MyApp',
      iconComponent: Logo
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: '/avatar.jpg'
    }
  },
  footer: {
    buttons: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        onClick: () => navigate('/settings')
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: LogOut,
        variant: 'destructive',
        onClick: handleLogout
      }
    ]
  }
}
```

### Nested Menu Items

```tsx
const nestedConfig = {
  groups: [
    {
      id: 'management',
      label: 'Management',
      items: [
        {
          id: 'users',
          title: 'User Management',
          icon: Users,
          defaultOpen: true,
          subItems: [
            {
              id: 'all-users',
              title: 'All Users',
              url: '/users'
            },
            {
              id: 'user-roles',
              title: 'User Roles',
              url: '/users/roles'
            },
            {
              id: 'permissions',
              title: 'Permissions',
              url: '/users/permissions'
            }
          ]
        }
      ]
    }
  ]
}
```

### Conditional Items

```tsx
const conditionalConfig = {
  groups: [
    {
      id: 'admin',
      label: 'Admin',
      items: [
        {
          id: 'admin-panel',
          title: 'Admin Panel',
          icon: Shield,
          url: '/admin',
          showIf: () => user?.role === 'admin'
        },
        {
          id: 'beta-features',
          title: 'Beta Features',
          icon: Zap,
          url: '/beta',
          showIf: user?.betaAccess === true,
          badge: 'Beta'
        }
      ]
    }
  ]
}
```

### Custom Header Component

```tsx
const CustomHeader = () => (
  <div className="flex flex-col items-center p-4">
    <img src="/logo.png" alt="Logo" className="w-8 h-8 mb-2" />
    <h2 className="text-lg font-bold">My Application</h2>
  </div>
)

const customHeaderConfig = {
  groups: [
    // ... your groups
  ],
  header: <CustomHeader />
}
```

### With Search Functionality

```tsx
<Sidebar 
  config={sidebarConfig}
  enableSearch={true} // Search is enabled by default
/>
```

The search functionality automatically indexes all sidebar items and sub-items, allowing users to quickly find and navigate to specific pages.

### Loading State

```tsx
<Sidebar 
  config={sidebarConfig}
  isLoading={loading}
/>
```

When `isLoading` is true, the sidebar displays a skeleton loading state.

</details>

<details>
<summary><strong>Features</strong></summary>

- **Fully Customizable** - Configure every aspect through JSON
- **Built-in Search** - Automatic search functionality across all menu items
- **Responsive Design** - Collapsible sidebar with icon-only mode
- **TypeScript Support** - Full type safety and IntelliSense
- **Flexible Icons** - Support for icon components or custom React nodes
- **Conditional Rendering** - Show/hide items based on conditions
- **Badges & Notifications** - Add badges to highlight important items
- **Nested Menus** - Support for multi-level navigation
- **Loading States** - Built-in skeleton loading animation
- **Theming** - Works with your existing CSS/Tailwind theme

</details>

