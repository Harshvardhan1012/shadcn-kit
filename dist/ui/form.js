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
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, useFormState, } from "react-hook-form";
import { cn } from "../lib/utils";
import { Label } from "../ui/label";
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = (_a) => {
    var props = __rest(_a, []);
    return (_jsx(FormFieldContext.Provider, { value: { name: props.name }, children: _jsx(Controller, Object.assign({}, props)) }));
};
const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    const { id } = itemContext;
    return Object.assign({ id, name: fieldContext.name, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message` }, fieldState);
};
const FormItemContext = React.createContext({});
function FormItem(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    const id = React.useId();
    return (_jsx(FormItemContext.Provider, { value: { id }, children: _jsx("div", Object.assign({ "data-slot": "form-item", className: cn("grid gap-2", className) }, props)) }));
}
function FormLabel(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { error, formItemId } = useFormField();
    return (_jsx(Label, Object.assign({ "data-slot": "form-label", "data-error": !!error, className: cn("data-[error=true]:text-destructive", className), htmlFor: formItemId }, props)));
}
function FormControl(_a) {
    var props = __rest(_a, []);
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (_jsx(Slot, Object.assign({ "data-slot": "form-control", id: formItemId, "aria-describedby": !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`, "aria-invalid": !!error }, props)));
}
function FormDescription(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { formDescriptionId } = useFormField();
    return (_jsx("p", Object.assign({ "data-slot": "form-description", id: formDescriptionId, className: cn("text-muted-foreground text-sm", className) }, props)));
}
function FormMessage(_a) {
    var _b;
    var { className } = _a, props = __rest(_a, ["className"]);
    const { error, formMessageId } = useFormField();
    const body = error ? String((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "") : props.children;
    if (!body) {
        return null;
    }
    return (_jsx("p", Object.assign({ "data-slot": "form-message", id: formMessageId, className: cn("text-destructive text-sm", className) }, props, { children: body })));
}
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, };
