import React from 'react';
import { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Checkbox } from '../ui/checkbox';
import { Command } from '../ui/command';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { DayPicker } from 'react-day-picker';
export declare enum FormFieldType {
    TEXT = "text",
    PASSWORD = "password",
    EMAIL = "email",
    NUMBER = "number",
    FILE = "file",
    CHECKBOX = "checkbox",
    SWITCH = "switch",
    DATE = "date",
    DATETIME = "datetime",
    RADIO = "radio",
    SELECT = "select",
    TEXTAREA = "textarea",
    COMBOBOX = "combobox",
    MULTISELECT = "multiselect"
}
export interface FormOption {
    value: string | boolean | number;
    label: string;
    icon?: React.ElementType;
    disabled?: boolean;
}
export interface FileConfig {
    accept?: string;
    multiple?: boolean;
}
export interface BaseFormFieldConfig<T extends FormFieldType = FormFieldType> {
    fieldName: string;
    fieldLabel: string;
    description?: string;
    validation?: z.ZodTypeAny;
    options?: FormOption[];
    icon?: React.ElementType;
    fileConfig?: FileConfig;
    hidden?: boolean;
    showIf?: (formValues: Record<string, unknown>) => boolean;
    dependsOn?: string[];
    disabled?: boolean;
    placeholder?: string;
    onChangeField?: (value: unknown) => void;
    onBlurField?: (value?: unknown) => void;
    onErrorField?: (error: unknown) => void;
}
interface InputFieldConfig extends BaseFormFieldConfig<FormFieldType.TEXT | FormFieldType.PASSWORD | FormFieldType.EMAIL | FormFieldType.NUMBER>, Omit<React.ComponentProps<typeof Input>, 'ref'> {
    fieldType: FormFieldType.TEXT | FormFieldType.PASSWORD | FormFieldType.EMAIL | FormFieldType.NUMBER;
    ref?: React.Ref<HTMLInputElement>;
}
interface TextareaFieldConfig extends BaseFormFieldConfig<FormFieldType.TEXTAREA>, Omit<React.ComponentProps<typeof Textarea>, 'ref'> {
    fieldType: FormFieldType.TEXTAREA;
    ref?: React.Ref<HTMLTextAreaElement>;
}
interface CheckboxFieldConfig extends BaseFormFieldConfig<FormFieldType.CHECKBOX>, Omit<React.ComponentProps<typeof Checkbox>, 'ref'> {
    fieldType: FormFieldType.CHECKBOX;
    ref?: React.Ref<HTMLButtonElement>;
}
interface SwitchFieldConfig extends BaseFormFieldConfig<FormFieldType.SWITCH>, Omit<React.ComponentProps<typeof Switch>, 'ref'> {
    fieldType: FormFieldType.SWITCH;
    ref?: React.Ref<HTMLButtonElement>;
}
type DateFieldConfig = BaseFormFieldConfig<FormFieldType.DATE> & React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATE;
    mode?: 'single' | 'multiple' | 'range';
    fromDate?: Date;
    toDate?: Date;
};
type DateTimeFieldConfig = BaseFormFieldConfig<FormFieldType.DATETIME> & React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATETIME;
    mode?: 'single' | 'multiple' | 'range';
    timeFormat?: '12' | '24';
    timeStructure?: 'hh:mm:ss' | 'hh:mm' | 'hh';
    fromDate?: Date;
    toDate?: Date;
};
interface RadioFieldConfig extends BaseFormFieldConfig<FormFieldType.RADIO>, Omit<React.ComponentProps<typeof RadioGroup>, 'name' | 'onValueChange' | 'defaultValue'> {
    fieldType: FormFieldType.RADIO;
    orientation?: 'horizontal' | 'vertical';
}
interface SelectFieldConfig extends BaseFormFieldConfig<FormFieldType.SELECT>, Omit<React.ComponentProps<typeof Select>, 'onValueChange' | 'defaultValue' | 'value'> {
    fieldType: FormFieldType.SELECT;
}
interface ComboboxFieldConfig extends BaseFormFieldConfig<FormFieldType.COMBOBOX>, Omit<React.ComponentProps<typeof Command>, 'children'> {
    fieldType: FormFieldType.COMBOBOX;
    searchPlaceholder?: string;
    emptyMessage?: string;
    onSearchChange?: (name: string, value: string) => void;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
}
interface MultiselectFieldConfig extends BaseFormFieldConfig<FormFieldType.MULTISELECT>, Omit<React.ComponentProps<typeof Command>, 'children' | 'value' | 'defaultValue'> {
    fieldType: FormFieldType.MULTISELECT;
    searchPlaceholder?: string;
    emptyMessage?: string;
    maxSelectedDisplay?: number;
    onSearchChange?: (name: string, value: string) => void;
    value?: string[];
    defaultValue?: string[];
    placeholder?: string;
}
interface FileFieldConfig extends BaseFormFieldConfig<FormFieldType.FILE>, Omit<React.ComponentProps<typeof Input>, 'type' | 'onChange' | 'onBlur' | 'ref'> {
    fieldType: FormFieldType.FILE;
    buttonText?: string;
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    ref?: React.Ref<HTMLInputElement>;
}
export type FormFieldConfig = InputFieldConfig | TextareaFieldConfig | CheckboxFieldConfig | SwitchFieldConfig | DateFieldConfig | DateTimeFieldConfig | RadioFieldConfig | SelectFieldConfig | ComboboxFieldConfig | MultiselectFieldConfig | FileFieldConfig;
interface DynamicFormProps<T extends FieldValues = FieldValues> {
    formConfig: FormFieldConfig[];
    onSubmit: SubmitHandler<T>;
    defaultValues?: DefaultValues<T>;
    schema: z.ZodSchema<T>;
    customSubmitButton?: React.ReactNode;
    className?: string;
    loading?: boolean;
}
declare const DynamicForm: <T extends FieldValues = FieldValues>({ formConfig, onSubmit, defaultValues, schema, customSubmitButton, className, loading, }: DynamicFormProps<T>) => import("react/jsx-runtime").JSX.Element;
export default DynamicForm;
