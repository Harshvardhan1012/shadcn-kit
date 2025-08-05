interface AlertDialogProps {
    title: string;
    description: string;
    cancelText: string;
    confirmText: string;
    onConfirm: () => void;
    openState: boolean;
    onCancel: () => void;
    classNameContent?: string;
    classNameCancel?: string;
    classNameConfirm?: string;
}
export declare function AlertDialogDemo({ title, description, cancelText, confirmText, onConfirm, openState, onCancel, classNameContent, classNameCancel, classNameConfirm, }: AlertDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
