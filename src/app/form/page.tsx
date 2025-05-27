"use client";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Lock,
  Mail,
  User,
} from "lucide-react"; // Import appropriate icons
import { FieldValues } from "react-hook-form";
import * as z from "zod";
import DynamicForm, { FormFieldConfig } from "./DynamicForm";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  age: z.number().min(1, { message: "Age must be at least 1." }),
  bio: z.string().optional(),
  role: z.enum(["admin", "user", "editor"], {
    errorMap: () => ({ message: "Please select a role." }),
  }),
  profilePicture: z
    .custom<File | null | undefined>((val) => val instanceof File, {
      message: "Profile picture is required.",
    })
    .refine((file) => !!file, "Profile picture is required.")
    .refine(
      (file) => (file ? file.size <= 5000000 : true), // 5MB, skip if no file
      `Max file size is 5MB.`
    )
    .refine(
      (file) =>
        file
          ? ["image/png", "image/svg+xml", "image/jpeg", "image/jpg"].includes(
              file.type
            )
          : true, // Skip if no file
      "Only .png, .svg, and .jpeg/.jpg formats are accepted."
    ),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
  newsletter: z.boolean().optional(),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  department: z.enum(["engineering", "marketing", "hr"], {
    errorMap: () => ({ message: "Please select a department." }),
  }),
  favoriteFruit: z.string().min(1, { message: "Please select a fruit." }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill." }),
});

// Define form configuration
const exampleFormConfig: FormFieldConfig[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    icon: User,
    validation: formSchema.shape.username,
    description: "This is your public display name.",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "your@email.com",
    icon: Mail,
    validation: formSchema.shape.email,
    description: "We'll never share your email.",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    icon: Lock,
    validation: formSchema.shape.password,
    description: "Choose a strong password.",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    validation: formSchema.shape.age,
    description: "You must be at least 1 year old.",
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "file",
    icon: ImageIcon,
    fileConfig: {
      accept: "image/png, image/svg+xml, image/jpeg",
      multiple: false,
    },
    validation: formSchema.shape.profilePicture,
    description: "Upload a profile image (png, svg, jpeg, max 5MB).",
  },
  {
    name: "agreeToTerms",
    label: "I agree to the terms and conditions",
    type: "checkbox",
    validation: formSchema.shape.agreeToTerms,
    description: "You must agree before submitting.",
  },
  {
    name: "birthDate",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select your birth date",
    icon: CalendarDays,
    validation: formSchema.shape.birthDate,
    description: "Pick your date of birth.",
  },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    validation: formSchema.shape.gender,
    description: "Select your gender.",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Select your role",
    icon: Briefcase,
    options: [
      { value: "admin", label: "Administrator" },
      { value: "user", label: "User" },
      { value: "editor", label: "Editor" },
    ],
    validation: formSchema.shape.role,
    description: "Choose your role in the system.",
  },
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Tell us about yourself",
    icon: FileText,
    validation: formSchema.shape.bio,
    description: "A short bio about you.",
  },
  {
    name: "department",
    label: "Department",
    type: "combobox",
    placeholder: "Select department",
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
      { value: "hr", label: "HR" },
    ],
    validation: formSchema.shape.department,
    description: "Select your department.",
    className: "w-full",
  },
  {
    name: "favoriteFruit",
    label: "Favorite Fruit",
    type: "combobox",
    placeholder: "Select fruit",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
    validation: formSchema.shape.favoriteFruit,
    description: "Pick your favorite fruit.",
    className: "w-full",
  },
  {
    name: "skills",
    label: "Skills",
    type: "multiselect",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "angular", label: "Angular" },
      { value: "node", label: "Node.js" },
      { value: "python", label: "Python" },
      { value: "typescript", label: "TypeScript" },
    ],
    validation: formSchema.shape.skills,
    description: "Select all skills that apply to you.",
  },
  {
    name: "newsletter",
    label: "Subscribe to newsletter",
    type: "switch",
    validation: formSchema.shape.newsletter,
    description: "Get updates in your inbox.",
  },
  // Add more fields as needed for Combobox, Radio Group etc.
];

const FormPage = () => {
  const onSubmit = (data: FieldValues) => {
    console.log("Form submitted!", data);
    alert("Form Submitted! Check the console for data.");
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-8 text-3xl font-bold">Dynamic Form Example</h1>
      <DynamicForm
        formConfig={exampleFormConfig}
        onSubmit={onSubmit}
        schema={formSchema}
        defaultValues={{
          email: "",
          password: "",
          username: "",
          age: 18,
          bio: "",
          role: undefined,
          profilePicture: null,
          agreeToTerms: false,
          birthDate: "",
          gender: undefined,
          department: undefined,
          favoriteFruit: "",
          skills: [],
          newsletter: true,
        }}
        customSubmitButton={
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        }
      />
    </div>
  );
};

export default FormPage;
