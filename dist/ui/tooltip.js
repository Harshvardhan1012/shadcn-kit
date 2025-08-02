"use client";
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
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";
function TooltipProvider(_a) {
    var { delayDuration = 0 } = _a, props = __rest(_a, ["delayDuration"]);
    return (_jsx(TooltipPrimitive.Provider, Object.assign({ "data-slot": "tooltip-provider", delayDuration: delayDuration }, props)));
}
function Tooltip(_a) {
    var props = __rest(_a, []);
    return (_jsx(TooltipProvider, { children: _jsx(TooltipPrimitive.Root, Object.assign({ "data-slot": "tooltip" }, props)) }));
}
function TooltipTrigger(_a) {
    var props = __rest(_a, []);
    return _jsx(TooltipPrimitive.Trigger, Object.assign({ "data-slot": "tooltip-trigger" }, props));
}
function TooltipContent(_a) {
    var { className, sideOffset = 0, children } = _a, props = __rest(_a, ["className", "sideOffset", "children"]);
    return (_jsx(TooltipPrimitive.Portal, { children: _jsxs(TooltipPrimitive.Content, Object.assign({ "data-slot": "tooltip-content", sideOffset: sideOffset, className: cn("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className) }, props, { children: [children, _jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })] })) }));
}
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
