interface SingleDatePickerProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    fromDate?: Date;
    toDate?: Date;
}
export declare function SingleDatePicker({ value, onChange, label, description, disabled, className, fromDate, toDate, }: SingleDatePickerProps): import("react/jsx-runtime").JSX.Element;
export {};
