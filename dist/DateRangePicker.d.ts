interface DateRangePickerProps {
    value?: {
        from?: Date;
        to?: Date;
    };
    onChange: (value: {
        from?: Date;
        to?: Date;
    }) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    fromDate?: Date;
    toDate?: Date;
}
export declare function DateRangePicker({ value, onChange, label, description, disabled, className, fromDate, toDate }: DateRangePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
