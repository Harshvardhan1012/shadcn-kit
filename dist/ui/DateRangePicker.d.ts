import * as React from 'react';
import { type DateRange } from 'react-day-picker';
export declare function DatePickerWithRange({ className, date, setDate, }: React.HTMLAttributes<HTMLDivElement> & {
    date: DateRange | undefined;
    setDate: (range: DateRange | undefined) => void;
}): import("react/jsx-runtime").JSX.Element;
