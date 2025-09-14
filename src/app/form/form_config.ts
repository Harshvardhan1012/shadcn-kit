import {
  FormFieldType,
  type FormFieldConfig,
} from "@/components/form/DynamicForm"
import { TimeFormat } from "@/components/form/type"
import { CalendarDays, FileText, Lock, Mail } from "lucide-react"
import { z } from "zod"

export const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  age: z.number().min(1, { message: "Age must be at least 1." }),
  bio: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
  birthDateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  // Type: { from?: Date; to?: Date } Type: [Date, Date]
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  department: z.date().optional(), // Changed to date type for date input
  favoriteFruit: z.enum(["apple", "banana", "orange"], {
    errorMap: () => ({ message: "Please select a fruit." }),
  }),
  newsletter: z.date().optional(), // Changed to date type for datetime input
  items: z.array(z.string()).optional(),
})

export const exampleFormConfig: FormFieldConfig[] = [
  {
    fieldName: "username",
    fieldLabel: "Username",
    fieldType: FormFieldType.TEXT,
    placeholder: `Enter your username`,
    description: "This is your public display name.",
    disabled: false,
  },
  {
    fieldName: "email",
    fieldLabel: "Email",
    fieldType: FormFieldType.EMAIL,
    placeholder: "your@email.com",
    icon: Mail,
    description: "We'll never share your email.",
  },
  {
    fieldName: "password",
    fieldLabel: "Password",
    fieldType: FormFieldType.PASSWORD,
    placeholder: "••••••••",
    icon: Lock,
    description: "Choose a strong password.",
  },
  {
    fieldName: "age",
    fieldLabel: "Age",
    fieldType: FormFieldType.NUMBER,
    placeholder: "Enter your age",
    description: "You must be at least 1 year old.",
    hidden: false,
    max: 120,
    min: 10,
  },
  {
    fieldName: "agreeToTerms",
    fieldLabel: "I agree to the terms and conditions",
    fieldType: FormFieldType.CHECKBOX,
    description: "You must agree before submitting.",
  },
  {
    fieldName: "birthDateRange",
    fieldLabel: "Date of Birth",
    fieldType: FormFieldType.DATE,
    icon: CalendarDays,
    mode: "range",
    description: "Pick your date of birth.",
    onChangeField(value) {
      console.log("Birth date range changed:", value)
    },
  },
  {
    fieldName: "gender",
    fieldLabel: "Gender",
    fieldType: FormFieldType.SELECT,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    description: "Select your gender.",
  },
  {
    fieldName: "bio",
    fieldLabel: "Biography",
    fieldType: FormFieldType.TEXTAREA,
    placeholder: "Tell us about yourself",
    icon: FileText,
    description: "A short bio about you.",
  },
  {
    fieldName: "department",
    fieldLabel: "Department",
    fieldType: FormFieldType.DATE,
    mode: "single",
    minDate: new Date(2025, 8, 1), // September 1, 2025 (month is 0-indexed)
    maxDate: new Date(2025, 11, 31), // December 31, 2025

    description: "Select your department.",
  },
  {
    fieldName: "favoriteFruit",
    fieldLabel: "Favorite Fruit",
    fieldType: FormFieldType.COMBOBOX,
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
    description: "Pick your favorite fruit.",
  },
  {
    fieldType: FormFieldType.MULTISELECT,
    fieldName: "itemss",
    fieldLabel: "Items",
    enableSearch: false, // Disables search completely
    emptyMessage: "No items found",
    value: ["orange"],
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    fieldType: FormFieldType.MULTISELECT,
    fieldName: "items",
    fieldLabel: "Items",
    placeholder: "Select items",
    enableSearch: true, // Disables search completely
    searchPlaceholder: "Search items...",
    emptyMessage: "No items found",
    onChangeField(value: unknown) {
      console.log(value)
    },
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    fieldName: "newsletter",
    fieldLabel: "Newsletter Subscription",
    fieldType: FormFieldType.DATETIME,
    description: "Select date and time for newsletter.",
    onChangeField(value) {
      console.log("Newsletter datetime changed:", value)
    },
    timeFormat: TimeFormat.TWELVE_HOUR,
    minDate: new Date(2025, 8, 1), // September 1, 2025 (month is 0-indexed)
    maxDate: new Date(2025, 11, 31), // December 31, 2025
  },
]
