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
import { jsx as _jsx } from "react/jsx-runtime";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../lib/utils";
function Separator(_a) {
    var { className, orientation = "horizontal", decorative = true } = _a, props = __rest(_a, ["className", "orientation", "decorative"]);
    return (_jsx(SeparatorPrimitive.Root, Object.assign({ "data-slot": "separator-root", decorative: decorative, orientation: orientation, className: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className) }, props)));
}
export { Separator };
