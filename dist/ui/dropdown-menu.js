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
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "../lib/utils";
function DropdownMenu(_a) {
    var props = __rest(_a, []);
    return _jsx(DropdownMenuPrimitive.Root, Object.assign({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuPortal(_a) {
    var props = __rest(_a, []);
    return (_jsx(DropdownMenuPrimitive.Portal, Object.assign({ "data-slot": "dropdown-menu-portal" }, props)));
}
function DropdownMenuTrigger(_a) {
    var props = __rest(_a, []);
    return (_jsx(DropdownMenuPrimitive.Trigger, Object.assign({ "data-slot": "dropdown-menu-trigger" }, props)));
}
function DropdownMenuContent(_a) {
    var { className, sideOffset = 4 } = _a, props = __rest(_a, ["className", "sideOffset"]);
    return (_jsx(DropdownMenuPrimitive.Portal, { children: _jsx(DropdownMenuPrimitive.Content, Object.assign({ "data-slot": "dropdown-menu-content", sideOffset: sideOffset, className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className) }, props)) }));
}
function DropdownMenuGroup(_a) {
    var props = __rest(_a, []);
    return (_jsx(DropdownMenuPrimitive.Group, Object.assign({ "data-slot": "dropdown-menu-group" }, props)));
}
function DropdownMenuItem(_a) {
    var { className, inset, variant = "default" } = _a, props = __rest(_a, ["className", "inset", "variant"]);
    return (_jsx(DropdownMenuPrimitive.Item, Object.assign({ "data-slot": "dropdown-menu-item", "data-inset": inset, "data-variant": variant, className: cn("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className) }, props)));
}
function DropdownMenuCheckboxItem(_a) {
    var { className, children, checked } = _a, props = __rest(_a, ["className", "children", "checked"]);
    return (_jsxs(DropdownMenuPrimitive.CheckboxItem, Object.assign({ "data-slot": "dropdown-menu-checkbox-item", className: cn("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className), checked: checked }, props, { children: [_jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: _jsx(DropdownMenuPrimitive.ItemIndicator, { children: _jsx(CheckIcon, { className: "size-4" }) }) }), children] })));
}
function DropdownMenuRadioGroup(_a) {
    var props = __rest(_a, []);
    return (_jsx(DropdownMenuPrimitive.RadioGroup, Object.assign({ "data-slot": "dropdown-menu-radio-group" }, props)));
}
function DropdownMenuRadioItem(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (_jsxs(DropdownMenuPrimitive.RadioItem, Object.assign({ "data-slot": "dropdown-menu-radio-item", className: cn("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className) }, props, { children: [_jsx("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: _jsx(DropdownMenuPrimitive.ItemIndicator, { children: _jsx(CircleIcon, { className: "size-2 fill-current" }) }) }), children] })));
}
function DropdownMenuLabel(_a) {
    var { className, inset } = _a, props = __rest(_a, ["className", "inset"]);
    return (_jsx(DropdownMenuPrimitive.Label, Object.assign({ "data-slot": "dropdown-menu-label", "data-inset": inset, className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className) }, props)));
}
function DropdownMenuSeparator(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(DropdownMenuPrimitive.Separator, Object.assign({ "data-slot": "dropdown-menu-separator", className: cn("bg-border -mx-1 my-1 h-px", className) }, props)));
}
function DropdownMenuShortcut(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("span", Object.assign({ "data-slot": "dropdown-menu-shortcut", className: cn("text-muted-foreground ml-auto text-xs tracking-widest", className) }, props)));
}
function DropdownMenuSub(_a) {
    var props = __rest(_a, []);
    return _jsx(DropdownMenuPrimitive.Sub, Object.assign({ "data-slot": "dropdown-menu-sub" }, props));
}
function DropdownMenuSubTrigger(_a) {
    var { className, inset, children } = _a, props = __rest(_a, ["className", "inset", "children"]);
    return (_jsxs(DropdownMenuPrimitive.SubTrigger, Object.assign({ "data-slot": "dropdown-menu-sub-trigger", "data-inset": inset, className: cn("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8", className) }, props, { children: [children, _jsx(ChevronRightIcon, { className: "ml-auto size-4" })] })));
}
function DropdownMenuSubContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(DropdownMenuPrimitive.SubContent, Object.assign({ "data-slot": "dropdown-menu-sub-content", className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className) }, props)));
}
export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, };
