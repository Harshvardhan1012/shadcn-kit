// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

// Alert Components
export { GlobalAlert as Alert } from "./Alert/Alert"
export { AlertDialogDemo as AlertDialog } from "./Alert/AlertDialog"

// Chart Components
export { DynamicChart as Chart } from "./chart/DynamicChart"

// Form Components - Main Form
export {
  default as Form,
  FormFieldType,
  type DynamicFormRef,
} from "./Form/DynamicForm"

// Form Components - Individual Input Components
export { CheckboxInput } from "./Form/CheckBoxInput"
export { ComboBox } from "./Form/ComboBox"
export { SingleDatePicker } from "./Form/DatePicker"
export { DateRangePicker } from "./Form/DateRangePicker"
export {
  DateTimeInput,
  DateTimeMode,
  TimeFormat,
  TimeStructure,
} from "./Form/DateTime"
export { FileInput } from "./Form/FileInput"
export { RadioGroupInput } from "./Form/RadioGroupInput"
export { SelectInput } from "./Form/SelectInput"
export { SwitchInput } from "./Form/SwitchInput"
export { TextareaInput } from "./Form/TextAreaInput"
export { TextInput } from "./Form/TextInput"

// Sidebar and Navigation Components
export { ClientSidebarProvider as SideBarProvider } from "./NavSideBar/ClientSidebarProvider"
export { DynamicSidebar as Sidebar } from "./NavSideBar/DynamicSidebar"

// Service Components
export {
  ClientAlertProvider as AlertProvider,
  useAlert,
} from "./services/AlertService"

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Chart Types
export type { ChartDataPoint, ChartType } from "./chart/DynamicChart"

// Form Types - Core
export type { FormFieldConfig, FormOption } from "./Form/DynamicForm"
export type {
  BaseComponentProps,
  BooleanComponentProps,
  DateComponentProps,
  FileComponentProps,
  FormValue,
  NumberComponentProps,
  StringArrayComponentProps,
  StringComponentProps,
  StringOrNumberComponentProps,
} from "./Form/type"

// Form Types - Component Specific
export type { CheckBoxProps } from "./Form/CheckBoxInput"
export type { DateTimeFieldConfig } from "./Form/DateTime"
export type { TextAreaProps, TextareaFieldConfig } from "./Form/TextAreaInput"
export type { InputFieldConfig, TextInputProps } from "./Form/TextInput"

// Sidebar Types
export type {
  SidebarConfig,
  SidebarFooterConfig,
  SidebarGroup,
  SidebarHeaderConfig,
  SidebarItem,
  SidebarSubItem,
} from "./NavSideBar/DynamicSidebar"
