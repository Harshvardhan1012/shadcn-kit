import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../ui/alert-dialog";
import { cn } from "../lib/utils";
export function AlertDialogDemo({ title, description, cancelText, confirmText, onConfirm, openState, onCancel, classNameContent, classNameCancel, classNameConfirm, }) {
    return (_jsx(AlertDialog, { open: openState, children: _jsxs(AlertDialogContent, { className: cn(classNameContent), children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: title }), _jsx(AlertDialogDescription, { children: description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { className: cn(classNameCancel), onClick: onCancel, children: cancelText }), _jsx(AlertDialogAction, { onClick: onConfirm, className: cn(classNameConfirm), children: confirmText })] })] }) }));
}
