import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger, } from './ui/popover';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, } from './ui/form';
import { cn } from './lib/utils';
import { CalendarIcon } from 'lucide-react';
export function SingleDatePicker({ value, onChange, label, description, disabled = false, className, fromDate, toDate, }) {
    return (_jsxs(FormItem, { className: cn(className), children: [label && _jsx(FormLabel, { children: label }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", disabled: disabled, className: cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground'), children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), value ? format(new Date(value), 'PPP') : 'Pick a date'] }) }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(Calendar, { mode: "single", selected: value ? new Date(value) : undefined, onSelect: (date) => date && onChange(date.toISOString()), disabled: disabled, fromDate: fromDate, toDate: toDate, initialFocus: true }) })] }), description && _jsx(FormDescription, { children: description }), _jsx(FormMessage, {})] }));
}
