'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../lib/utils';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
export function DatePickerWithRange({ className, date, setDate, }) {
    const today = new Date();
    return (_jsx("div", { className: cn('grid gap-2', className), children: _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { id: "date", variant: 'outline', className: cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground'), children: [_jsx(CalendarIcon, {}), (date === null || date === void 0 ? void 0 : date.from) ? (date.to ? (_jsxs(_Fragment, { children: [format(date.from, 'MM/dd/yyyy'), " -", ' ', format(date.to, 'MM/dd/yyyy')] })) : (format(date.from, 'MM/dd/yyyy'))) : (_jsx("span", { children: "Pick a date" }))] }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx(Calendar, { initialFocus: true, mode: "range", defaultMonth: date === null || date === void 0 ? void 0 : date.from, selected: date, onSelect: setDate, numberOfMonths: 2, toDate: today }) })] }) }));
}
