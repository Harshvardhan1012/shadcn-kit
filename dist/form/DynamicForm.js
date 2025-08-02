var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { cn } from '../lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm, } from 'react-hook-form';
// UI Components (assuming these are properly typed)
import { SingleDatePicker } from '../DatePicker';
import { DateRangePicker } from '../DateRangePicker';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from '../ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger, } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { CalendarIcon, Check, FileText } from 'lucide-react';
// Form field types enum
export var FormFieldType;
(function (FormFieldType) {
    FormFieldType["TEXT"] = "text";
    FormFieldType["PASSWORD"] = "password";
    FormFieldType["EMAIL"] = "email";
    FormFieldType["NUMBER"] = "number";
    FormFieldType["FILE"] = "file";
    FormFieldType["CHECKBOX"] = "checkbox";
    FormFieldType["SWITCH"] = "switch";
    FormFieldType["DATE"] = "date";
    FormFieldType["DATETIME"] = "datetime";
    FormFieldType["RADIO"] = "radio";
    FormFieldType["SELECT"] = "select";
    FormFieldType["TEXTAREA"] = "textarea";
    FormFieldType["COMBOBOX"] = "combobox";
    FormFieldType["MULTISELECT"] = "multiselect";
})(FormFieldType || (FormFieldType = {}));
const DynamicForm = ({ formConfig, onSubmit, defaultValues, schema, customSubmitButton, className, loading = false, }) => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });
    const [filePreviews, setFilePreviews] = useState({});
    const formValues = form.watch();
    // Common event handlers
    const handleValueChange = (fieldConfig, value) => {
        var _a, _b;
        try {
            (_a = fieldConfig.onChangeField) === null || _a === void 0 ? void 0 : _a.call(fieldConfig, value);
        }
        catch (error) {
            (_b = fieldConfig.onErrorField) === null || _b === void 0 ? void 0 : _b.call(fieldConfig, error);
        }
    };
    const handleBlur = (fieldConfig, value) => {
        var _a, _b;
        try {
            (_a = fieldConfig.onBlurField) === null || _a === void 0 ? void 0 : _a.call(fieldConfig, value);
        }
        catch (error) {
            (_b = fieldConfig.onErrorField) === null || _b === void 0 ? void 0 : _b.call(fieldConfig, error);
        }
    };
    const handleFilePreview = (name, file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews((prev) => (Object.assign(Object.assign({}, prev), { [name]: reader.result })));
            };
            reader.readAsDataURL(file);
        }
        else {
            setFilePreviews((prev) => (Object.assign(Object.assign({}, prev), { [name]: '' })));
        }
    };
    // Render field based on type
    const renderField = (fieldConfig) => {
        const { fieldLabel: label, fieldType, description, hidden, showIf, fieldName: name, options } = fieldConfig, props = __rest(fieldConfig
        // Handle visibility
        , ["fieldLabel", "fieldType", "description", "hidden", "showIf", "fieldName", "options"]);
        // Handle visibility
        if (hidden || (showIf && !showIf(formValues)))
            return null;
        switch (fieldType) {
            case FormFieldType.TEXT:
            case FormFieldType.PASSWORD:
            case FormFieldType.EMAIL:
            case FormFieldType.NUMBER:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const inputProps = props;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsxs("div", { className: "relative", children: [inputProps.icon &&
                                                React.createElement(inputProps.icon, {
                                                    className: 'absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400',
                                                }), _jsx(Input, Object.assign({}, inputProps, { type: fieldType, value: field.value, onChange: (e) => {
                                                    const value = fieldType === FormFieldType.NUMBER
                                                        ? Number(e.target.value)
                                                        : e.target.value;
                                                    field.onChange(value);
                                                    handleValueChange(fieldConfig, value);
                                                }, onBlur: (e) => {
                                                    field.onBlur();
                                                    const value = fieldType === FormFieldType.NUMBER
                                                        ? Number(e.target.value)
                                                        : e.target.value;
                                                    handleBlur(fieldConfig, value);
                                                }, className: cn(inputProps.icon ? 'pl-10' : '', inputProps.className), ref: field.ref }))] }) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.TEXTAREA:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const textareaProps = props;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsx(Textarea, Object.assign({}, textareaProps, { value: field.value, onChange: (e) => {
                                            field.onChange(e.target.value);
                                            handleValueChange(fieldConfig, e.target.value);
                                        }, onBlur: (e) => {
                                            field.onBlur();
                                            handleBlur(fieldConfig, e.target.value);
                                        }, ref: field.ref })) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.CHECKBOX:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const checkboxProps = props;
                        return (_jsxs(FormItem, { className: cn('flex flex-row items-start space-x-3 space-y-0 rounded-md p-4', className), children: [_jsx(FormControl, { children: _jsx(Checkbox, Object.assign({}, checkboxProps, { checked: field.value, onCheckedChange: (checked) => {
                                            field.onChange(checked);
                                            handleValueChange(fieldConfig, checked);
                                        }, onBlur: () => handleBlur(fieldConfig, field.value) })) }), _jsxs("div", { className: "space-y-1 leading-none", children: [_jsx(FormLabel, { children: label }), description && (_jsx(FormDescription, { children: description }))] }), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.SWITCH:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const switchProps = props;
                        return (_jsxs(FormItem, { className: cn('flex flex-row items-center justify-between rounded-lg border p-4', className), children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(FormLabel, { children: label }), description && (_jsx(FormDescription, { children: description }))] }), _jsx(FormControl, { children: _jsx(Switch, Object.assign({}, switchProps, { checked: field.value, onCheckedChange: (checked) => {
                                            field.onChange(checked);
                                            handleValueChange(fieldConfig, checked);
                                        }, onBlur: () => handleBlur(fieldConfig, field.value) })) }), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.DATE:
                const dateConfig = fieldConfig;
                if (dateConfig.mode === 'range')
                    return (_jsx(DateRangePicker, Object.assign({ value: form.watch(name), onChange: (value) => {
                            form.setValue(name, value);
                            handleValueChange(fieldConfig, value);
                        }, label: label, description: description, className: className, disabled: dateConfig.disabled }, (dateConfig.fromDate && { fromDate: dateConfig.fromDate }), (dateConfig.toDate && { toDate: dateConfig.toDate })), name));
                if (dateConfig.mode === 'single')
                    return (_jsx(SingleDatePicker, Object.assign({ value: form.watch(name), onChange: (value) => {
                            form.setValue(name, value);
                            handleValueChange(fieldConfig, value);
                        }, label: label, description: description, className: className, disabled: dateConfig.disabled }, (dateConfig.fromDate && { fromDate: dateConfig.fromDate }), (dateConfig.toDate && { toDate: dateConfig.toDate })), name));
            case FormFieldType.RADIO:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const radioProps = props;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsx(RadioGroup, Object.assign({}, radioProps, { onValueChange: (value) => {
                                            field.onChange(value);
                                            handleValueChange(fieldConfig, value);
                                        }, defaultValue: field.value, className: cn('flex-row space-x-4 space-y-0', className), children: options === null || options === void 0 ? void 0 : options.map((option) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: option.value, id: `${name}-${option.value}`, disabled: option.disabled }), _jsxs(FormLabel, { htmlFor: `${name}-${option.value}`, className: "flex items-center", children: [option.icon && (_jsx(option.icon, { className: "mr-2 h-4 w-4" })), option.label] })] }, String(option.value)))) })) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.SELECT:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const selectProps = props;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsxs(Select, Object.assign({}, selectProps, { onValueChange: (value) => {
                                            field.onChange(value);
                                            handleValueChange(fieldConfig, value);
                                        }, defaultValue: field.value, value: field.value, children: [_jsx(SelectTrigger, { onBlur: () => handleBlur(fieldConfig, field.value), children: _jsx(SelectValue, { placeholder: fieldConfig.placeholder }) }), _jsx(SelectContent, { children: options === null || options === void 0 ? void 0 : options.map((option) => (_jsx(SelectItem, { value: String(option.value), disabled: option.disabled, children: _jsxs("div", { className: "flex items-center", children: [option.icon && (_jsx(option.icon, { className: "mr-2 h-4 w-4" })), option.label] }) }, String(option.value)))) })] })) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.FILE:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const fileProps = props;
                        const currentFile = field.value;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsxs("div", { className: "flex items-center space-x-2", children: [filePreviews[name] ? (_jsx(Image, { width: 40, height: 40, src: filePreviews[name], alt: "Preview", className: "h-10 w-10 rounded-md object-cover" })) : fieldConfig.icon ? (React.createElement(fieldConfig.icon, {
                                                className: 'h-10 w-10 text-gray-400',
                                            })) : (_jsx(FileText, { className: "h-10 w-10 text-gray-400" })), _jsx(Input, Object.assign({}, fileProps, { type: "file", accept: fileProps === null || fileProps === void 0 ? void 0 : fileProps.accept, multiple: fileProps === null || fileProps === void 0 ? void 0 : fileProps.multiple, ref: field.ref, className: "flex-1", onChange: (e) => {
                                                    var _a;
                                                    const file = ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null;
                                                    field.onChange(file);
                                                    handleValueChange(fieldConfig, file);
                                                    handleFilePreview(name, file);
                                                }, onBlur: (e) => {
                                                    var _a;
                                                    field.onBlur();
                                                    handleBlur(fieldConfig, (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]);
                                                } }))] }) }), currentFile && !(fileProps === null || fileProps === void 0 ? void 0 : fileProps.multiple) && (_jsxs(FormDescription, { children: ["Selected file: ", currentFile.name] })), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.COMBOBOX:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const commandProps = props;
                        const selectedValue = field.value;
                        const allOptions = options || [];
                        const selectedOption = allOptions.find((opt) => opt.value === selectedValue);
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", role: "combobox", className: cn('w-full justify-between', !selectedValue && 'text-muted-foreground'), onBlur: () => handleBlur(fieldConfig, selectedValue), children: [(selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label) ||
                                                            fieldConfig.placeholder ||
                                                            `Select ${label.toLowerCase()}`, _jsx(Check, { className: cn('ml-2 h-4 w-4 shrink-0 opacity-50') })] }) }), _jsx(PopoverContent, { className: "w-full p-0", children: _jsxs(Command, Object.assign({}, commandProps, { children: [_jsx(CommandInput, { placeholder: commandProps.searchPlaceholder ||
                                                                `Search ${label.toLowerCase()}...`, className: "h-9", onValueChange: (value) => { var _a; return (_a = commandProps.onSearchChange) === null || _a === void 0 ? void 0 : _a.call(commandProps, name, value); } }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: commandProps.emptyMessage || 'No option found.' }), _jsx(CommandGroup, { children: allOptions.map((option) => (_jsxs(CommandItem, { value: option.label, disabled: option.disabled, onSelect: () => {
                                                                            const newValue = String(selectedValue) ===
                                                                                String(option.value)
                                                                                ? ''
                                                                                : option.value;
                                                                            field.onChange(newValue);
                                                                            handleValueChange(fieldConfig, newValue);
                                                                        }, children: [_jsxs("div", { className: "flex items-center", children: [option.icon && (_jsx(option.icon, { className: "mr-2 h-4 w-4" })), option.label] }), _jsx(Check, { className: cn('ml-auto h-4 w-4', String(selectedValue) ===
                                                                                    String(option.value)
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0') })] }, String(option.value)))) })] })] })) })] }) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            case FormFieldType.DATETIME:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const dateTimeConfig = fieldConfig;
                        const selectedDate = field.value
                            ? new Date(field.value)
                            : undefined;
                        const is24Hour = dateTimeConfig.timeFormat === '24';
                        const timeStructure = dateTimeConfig.timeStructure || 'hh:mm:ss';
                        const handleTimeChange = (type, value) => {
                            const newDate = selectedDate
                                ? new Date(selectedDate)
                                : new Date();
                            switch (type) {
                                case 'hour':
                                    const hour = parseInt(value);
                                    newDate.setHours(hour);
                                    break;
                                case 'minute':
                                    newDate.setMinutes(parseInt(value));
                                    break;
                                case 'second':
                                    newDate.setSeconds(parseInt(value));
                                    break;
                                case 'ampm':
                                    const currentHour = newDate.getHours();
                                    if (value === 'AM' && currentHour >= 12) {
                                        newDate.setHours(currentHour - 12);
                                    }
                                    else if (value === 'PM' && currentHour < 12) {
                                        newDate.setHours(currentHour + 12);
                                    }
                                    break;
                            }
                            // Set default values based on timeStructure
                            if (timeStructure === 'hh') {
                                newDate.setMinutes(0);
                                newDate.setSeconds(0);
                            }
                            else if (timeStructure === 'hh:mm') {
                                newDate.setSeconds(0);
                            }
                            // Create a properly formatted local datetime string
                            const year = newDate.getFullYear();
                            const month = String(newDate.getMonth() + 1).padStart(2, '0');
                            const day = String(newDate.getDate()).padStart(2, '0');
                            const hours = String(newDate.getHours()).padStart(2, '0');
                            const minutes = String(newDate.getMinutes()).padStart(2, '0');
                            const seconds = String(newDate.getSeconds()).padStart(2, '0');
                            const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                            field.onChange(localDateTimeString);
                            handleValueChange(fieldConfig, localDateTimeString);
                        };
                        const handleDateSelect = (date) => {
                            if (!date)
                                return;
                            // Preserve existing time if available
                            if (selectedDate) {
                                date.setHours(selectedDate.getHours(), selectedDate.getMinutes(), timeStructure === 'hh:mm:ss'
                                    ? selectedDate.getSeconds()
                                    : 0, selectedDate.getMilliseconds());
                            }
                            else {
                                // Default to current time if no time is selected
                                const now = new Date();
                                date.setHours(now.getHours(), timeStructure === 'hh' ? 0 : now.getMinutes(), timeStructure === 'hh:mm:ss' ? now.getSeconds() : 0, 0);
                            }
                            // Ensure proper defaults based on timeStructure
                            if (timeStructure === 'hh') {
                                date.setMinutes(0);
                                date.setSeconds(0);
                            }
                            else if (timeStructure === 'hh:mm') {
                                date.setSeconds(0);
                            }
                            // Create a properly formatted local datetime string
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            const seconds = String(date.getSeconds()).padStart(2, '0');
                            const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                            field.onChange(localDateTimeString);
                            handleValueChange(fieldConfig, localDateTimeString);
                        };
                        const formatDisplay = (date) => {
                            switch (timeStructure) {
                                case 'hh':
                                    return is24Hour
                                        ? format(date, 'MM/dd/yyyy HH')
                                        : format(date, 'MM/dd/yyyy hh aa');
                                case 'hh:mm':
                                    return is24Hour
                                        ? format(date, 'MM/dd/yyyy HH:mm')
                                        : format(date, 'MM/dd/yyyy hh:mm aa');
                                case 'hh:mm:ss':
                                default:
                                    return is24Hour
                                        ? format(date, 'MM/dd/yyyy HH:mm:ss')
                                        : format(date, 'MM/dd/yyyy hh:mm:ss aa');
                            }
                        };
                        const getPlaceholder = () => {
                            if (dateTimeConfig.placeholder)
                                return dateTimeConfig.placeholder;
                            switch (timeStructure) {
                                case 'hh':
                                    return is24Hour ? 'MM/DD/YYYY HH' : 'MM/DD/YYYY hh aa';
                                case 'hh:mm':
                                    return is24Hour ? 'MM/DD/YYYY HH:mm' : 'MM/DD/YYYY hh:mm aa';
                                case 'hh:mm:ss':
                                default:
                                    return is24Hour
                                        ? 'MM/DD/YYYY HH:mm:ss'
                                        : 'MM/DD/YYYY hh:mm:ss aa';
                            }
                        };
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", className: cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground'), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), selectedDate ? (formatDisplay(selectedDate)) : (_jsx("span", { children: getPlaceholder() }))] }) }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsxs("div", { className: "flex flex-col sm:flex-row", children: [_jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: handleDateSelect, disabled: dateTimeConfig.disabled, fromDate: dateTimeConfig.fromDate, toDate: dateTimeConfig.toDate, initialFocus: true }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x", children: [_jsxs(ScrollArea, { className: "w-64 sm:w-auto", children: [_jsx("div", { className: "flex sm:flex-col p-2 gap-1", children: Array.from({ length: is24Hour ? 24 : 12 }, (_, i) => (is24Hour ? i : i + 1)).map((hour) => {
                                                                            const isSelected = selectedDate
                                                                                ? is24Hour
                                                                                    ? selectedDate.getHours() === hour
                                                                                    : (selectedDate.getHours() % 12 || 12) ===
                                                                                        hour
                                                                                : false;
                                                                            return (_jsx(Button, { size: "sm", variant: isSelected ? 'default' : 'ghost', className: "sm:w-full justify-center", onClick: () => {
                                                                                    if (is24Hour) {
                                                                                        handleTimeChange('hour', hour.toString());
                                                                                    }
                                                                                    else {
                                                                                        // For 12-hour format, convert display hour to 24-hour
                                                                                        const currentDate = selectedDate || new Date();
                                                                                        const isPM = currentDate.getHours() >= 12;
                                                                                        let hourValue;
                                                                                        if (hour === 12) {
                                                                                            // 12 AM = 0, 12 PM = 12
                                                                                            hourValue = isPM ? 12 : 0;
                                                                                        }
                                                                                        else {
                                                                                            // 1-11 AM = 1-11, 1-11 PM = 13-23
                                                                                            hourValue = isPM ? hour + 12 : hour;
                                                                                        }
                                                                                        handleTimeChange('hour', hourValue.toString());
                                                                                    }
                                                                                }, children: hour }, hour));
                                                                        }) }), _jsx(ScrollBar, { orientation: "horizontal", className: "sm:hidden" })] }), (timeStructure === 'hh:mm' ||
                                                                timeStructure === 'hh:mm:ss') && (_jsxs(ScrollArea, { className: "w-64 sm:w-auto", children: [_jsx("div", { className: "flex sm:flex-col p-2 gap-1", children: Array.from({ length: 60 }, (_, i) => i * 1).map((minute) => {
                                                                            const isSelected = (selectedDate === null || selectedDate === void 0 ? void 0 : selectedDate.getMinutes()) === minute;
                                                                            return (_jsx(Button, { size: "sm", variant: isSelected ? 'default' : 'ghost', className: "sm:w-full justify-center", onClick: () => handleTimeChange('minute', minute.toString()), children: minute.toString().padStart(2, '0') }, minute));
                                                                        }) }), _jsx(ScrollBar, { orientation: "horizontal", className: "sm:hidden" })] })), timeStructure === 'hh:mm:ss' && (_jsxs(ScrollArea, { className: "w-64 sm:w-auto", children: [_jsx("div", { className: "flex sm:flex-col p-2 gap-1", children: Array.from({ length: 60 }, (_, i) => i * 1).map((second) => {
                                                                            const isSelected = (selectedDate === null || selectedDate === void 0 ? void 0 : selectedDate.getSeconds()) === second;
                                                                            return (_jsx(Button, { size: "sm", variant: isSelected ? 'default' : 'ghost', className: "sm:w-full justify-center", onClick: () => handleTimeChange('second', second.toString()), children: second.toString().padStart(2, '0') }, second));
                                                                        }) }), _jsx(ScrollBar, { orientation: "horizontal", className: "sm:hidden" })] })), !is24Hour && (_jsx(ScrollArea, { children: _jsx("div", { className: "flex sm:flex-col p-2 gap-1", children: ['AM', 'PM'].map((ampm) => {
                                                                        const isSelected = selectedDate
                                                                            ? (ampm === 'AM' &&
                                                                                selectedDate.getHours() < 12) ||
                                                                                (ampm === 'PM' &&
                                                                                    selectedDate.getHours() >= 12)
                                                                            : false;
                                                                        return (_jsx(Button, { size: "sm", variant: isSelected ? 'default' : 'ghost', className: "sm:w-full justify-center", onClick: () => handleTimeChange('ampm', ampm), children: ampm }, ampm));
                                                                    }) }) }))] })] }) })] }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            // ...existing code...
            case FormFieldType.MULTISELECT:
                return (_jsx(FormField, { control: form.control, name: name, render: ({ field }) => {
                        const commandProps = props;
                        const selectedValues = Array.isArray(field.value)
                            ? field.value
                            : field.value
                                ? [field.value]
                                : [];
                        const allOptions = options || [];
                        const maxDisplay = props.maxSelectedDisplay || 5;
                        return (_jsxs(FormItem, { className: cn(className), children: [_jsx(FormLabel, { children: label }), _jsx(FormControl, { children: _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", role: "combobox", className: cn('w-full justify-between', selectedValues.length === 0 &&
                                                        'text-muted-foreground'), onBlur: () => handleBlur(fieldConfig, selectedValues), children: selectedValues.length === 0 ? (fieldConfig.placeholder ||
                                                        `Select ${label.toLowerCase()}`) : (_jsxs("div", { className: "flex flex-wrap gap-1", children: [selectedValues
                                                                .slice(0, maxDisplay)
                                                                .map((val) => {
                                                                const option = allOptions.find((opt) => opt.value === val);
                                                                return (_jsx(Badge, { variant: "outline", className: "text-xs", children: (option === null || option === void 0 ? void 0 : option.label) || val }, String(val)));
                                                            }), selectedValues.length > maxDisplay && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", selectedValues.length - maxDisplay, " more"] }))] })) }) }), _jsx(PopoverContent, { className: "w-full p-0", children: _jsxs(Command, Object.assign({}, commandProps, { children: [_jsx(CommandInput, { placeholder: commandProps.searchPlaceholder ||
                                                                `Search ${label.toLowerCase()}...`, className: "h-9", onValueChange: (value) => { var _a; return (_a = commandProps.onSearchChange) === null || _a === void 0 ? void 0 : _a.call(commandProps, name, value); } }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: commandProps.emptyMessage || 'No option found.' }), _jsx(CommandGroup, { children: allOptions.map((option) => (_jsxs(CommandItem, { value: option.label, disabled: option.disabled, onSelect: () => {
                                                                            const isSelected = selectedValues.some((v) => String(v) === String(option.value));
                                                                            const newValues = isSelected
                                                                                ? selectedValues.filter((v) => String(v) !== String(option.value))
                                                                                : [...selectedValues, option.value];
                                                                            field.onChange(newValues);
                                                                            handleValueChange(fieldConfig, newValues);
                                                                        }, children: [_jsxs("div", { className: "flex items-center", children: [option.icon && (_jsx(option.icon, { className: "mr-2 h-4 w-4" })), option.label] }), _jsx(Check, { className: cn('ml-auto h-4 w-4', selectedValues.some((v) => String(v) === String(option.value))
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0') })] }, String(option.value)))) })] })] })) })] }) }), description && (_jsx(FormDescription, { children: description })), _jsx(FormMessage, {})] }));
                    } }, name));
            default:
                return (_jsxs("p", { children: ["Unsupported field type: ", fieldConfig.fieldType] }, name));
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6", children: [formConfig.map((field, idx) => (_jsxs("div", { className: className || '', children: [_jsx("div", { className: "mb-2", children: _jsx(Skeleton, { className: "h-4 w-32 rounded" }) }), _jsx(Skeleton, { className: cn('h-10 w-full rounded', className) })] }, field.fieldName || idx))), _jsx(Skeleton, { className: "h-10 w-32 rounded-md" })] }));
    }
    return (_jsx(Form, Object.assign({}, form, { children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: cn('space-y-6', className), children: [formConfig.map(renderField), customSubmitButton || _jsx(Button, { type: "submit", children: "Submit" })] }) })));
};
export default DynamicForm;
