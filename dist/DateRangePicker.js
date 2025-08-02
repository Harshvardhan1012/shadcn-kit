import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form";
import { cn } from "./lib/utils";
export function DateRangePicker({ value, onChange, label, description, disabled = false, className, fromDate, toDate }) {
    const from = (value === null || value === void 0 ? void 0 : value.from) ? new Date(value.from) : undefined;
    const to = (value === null || value === void 0 ? void 0 : value.to) ? new Date(value.to) : undefined;
    return (_jsxs(FormItem, { className: cn(className), children: [label && _jsx(FormLabel, { children: label }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(FormControl, { children: _jsxs(Button, { variant: "outline", disabled: disabled, className: cn("w-full justify-start text-left font-normal", !(value === null || value === void 0 ? void 0 : value.from) && "text-muted-foreground"), children: [_jsx(CalendarDays, { className: "mr-2 h-4 w-4" }), from && to ? (`${format(from, "PPP")} - ${format(to, "PPP")}`) : (_jsx("span", { children: "Pick a date range" }))] }) }) }), _jsx(PopoverContent, { className: "w-auto p-0", children: _jsx(Calendar, { mode: "range", selected: { from, to }, onSelect: (range) => {
                                if ((range === null || range === void 0 ? void 0 : range.from) && (range === null || range === void 0 ? void 0 : range.to)) {
                                    onChange({
                                        from: range.from,
                                        to: range.to
                                    });
                                }
                            }, disabled: disabled, fromDate: fromDate, toDate: toDate, initialFocus: true, numberOfMonths: 2 }) })] }), description && _jsx(FormDescription, { children: description }), _jsx(FormMessage, {})] }));
}
