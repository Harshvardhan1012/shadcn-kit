// ============================================================================
// COMPONENT EXPORTS
// ============================================================================

// Alert Components
export { GlobalAlert as Alert } from "./Alert/Alert"
export { AlertDialogDemo as AlertDialog } from "./Alert/AlertDialog"

// Chart Components
export { DynamicChart as Chart } from "./chart/DynamicChart"

// Form Components - Main Form
export { default as Form, FormFieldType } from "./form/DynamicForm"

// Form Components - Individual Input Components
export { CheckboxInput } from "./form/CheckBoxInput"
export { ComboBox } from "./form/ComboBox"
export { SingleDatePicker } from "./form/DatePicker"
export { DateRangePicker } from "./form/DateRangePicker"
export {
  DateTimeInput,
  DateTimeMode,
  TimeFormat,
  TimeStructure,
} from "./form/DateTime"
export { FileInput } from "./form/FileInput"
export { RadioGroupInput } from "./form/RadioGroupInput"
export { SelectInput } from "./form/SelectInput"
export { SwitchInput } from "./form/SwitchInput"
export { TextareaInput } from "./form/TextAreaInput"
export { TextInput } from "./form/TextInput"

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
export type { FormFieldConfig, FormOption } from "./form/DynamicForm"
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
} from "./form/type"

// Form Types - Component Specific
export type { CheckBoxProps } from "./form/CheckBoxInput"
export type { DateTimeFieldConfig } from "./form/DateTime"
export type { TextareaFieldConfig, TextAreaProps } from "./form/TextAreaInput"
export type { InputFieldConfig, TextInputProps } from "./form/TextInput"

// Sidebar Types
export type {
  SidebarConfig,
  SidebarFooterConfig,
  SidebarGroup,
  SidebarHeaderConfig,
  SidebarItem,
  SidebarSubItem,
} from "./NavSideBar/DynamicSidebar"
