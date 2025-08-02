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
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";
function AlertDialog(_a) {
    var props = __rest(_a, []);
    return _jsx(AlertDialogPrimitive.Root, Object.assign({ "data-slot": "alert-dialog" }, props));
}
function AlertDialogTrigger(_a) {
    var props = __rest(_a, []);
    return (_jsx(AlertDialogPrimitive.Trigger, Object.assign({ "data-slot": "alert-dialog-trigger" }, props)));
}
function AlertDialogPortal(_a) {
    var props = __rest(_a, []);
    return (_jsx(AlertDialogPrimitive.Portal, Object.assign({ "data-slot": "alert-dialog-portal" }, props)));
}
function AlertDialogOverlay(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(AlertDialogPrimitive.Overlay, Object.assign({ "data-slot": "alert-dialog-overlay", className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className) }, props)));
}
function AlertDialogContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, {}), _jsx(AlertDialogPrimitive.Content, Object.assign({ "data-slot": "alert-dialog-content", className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className) }, props))] }));
}
function AlertDialogHeader(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("div", Object.assign({ "data-slot": "alert-dialog-header", className: cn("flex flex-col gap-2 text-center sm:text-left", className) }, props)));
}
function AlertDialogFooter(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("div", Object.assign({ "data-slot": "alert-dialog-footer", className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className) }, props)));
}
function AlertDialogTitle(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(AlertDialogPrimitive.Title, Object.assign({ "data-slot": "alert-dialog-title", className: cn("text-lg font-semibold", className) }, props)));
}
function AlertDialogDescription(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(AlertDialogPrimitive.Description, Object.assign({ "data-slot": "alert-dialog-description", className: cn("text-muted-foreground text-sm", className) }, props)));
}
function AlertDialogAction(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(AlertDialogPrimitive.Action, Object.assign({ className: cn(buttonVariants(), className) }, props)));
}
function AlertDialogCancel(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(AlertDialogPrimitive.Cancel, Object.assign({ className: cn(buttonVariants({ variant: "outline" }), className) }, props)));
}
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
