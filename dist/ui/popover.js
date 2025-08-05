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
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";
function Popover(_a) {
    var props = __rest(_a, []);
    return _jsx(PopoverPrimitive.Root, Object.assign({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
    var props = __rest(_a, []);
    return _jsx(PopoverPrimitive.Trigger, Object.assign({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
    var { className, align = "center", sideOffset = 4 } = _a, props = __rest(_a, ["className", "align", "sideOffset"]);
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, Object.assign({ "data-slot": "popover-content", align: align, sideOffset: sideOffset, className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className) }, props)) }));
}
function PopoverAnchor(_a) {
    var props = __rest(_a, []);
    return _jsx(PopoverPrimitive.Anchor, Object.assign({ "data-slot": "popover-anchor" }, props));
}
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
