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
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon, } from "lucide-react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";
function Pagination(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("nav", Object.assign({ role: "navigation", "aria-label": "pagination", "data-slot": "pagination", className: cn("mx-auto flex w-full justify-center", className) }, props)));
}
function PaginationContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("ul", Object.assign({ "data-slot": "pagination-content", className: cn("flex flex-row items-center gap-1", className) }, props)));
}
function PaginationItem(_a) {
    var props = __rest(_a, []);
    return _jsx("li", Object.assign({ "data-slot": "pagination-item" }, props));
}
function PaginationLink(_a) {
    var { className, isActive, size = "icon" } = _a, props = __rest(_a, ["className", "isActive", "size"]);
    return (_jsx("a", Object.assign({ "aria-current": isActive ? "page" : undefined, "data-slot": "pagination-link", "data-active": isActive, className: cn(buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
        }), className) }, props)));
}
function PaginationPrevious(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsxs(PaginationLink, Object.assign({ "aria-label": "Go to previous page", size: "default", className: cn("gap-1 px-2.5 sm:pl-2.5", className) }, props, { children: [_jsx(ChevronLeftIcon, {}), _jsx("span", { className: "hidden sm:block", children: "Previous" })] })));
}
function PaginationNext(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsxs(PaginationLink, Object.assign({ "aria-label": "Go to next page", size: "default", className: cn("gap-1 px-2.5 sm:pr-2.5", className) }, props, { children: [_jsx("span", { className: "hidden sm:block", children: "Next" }), _jsx(ChevronRightIcon, {})] })));
}
function PaginationEllipsis(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsxs("span", Object.assign({ "aria-hidden": true, "data-slot": "pagination-ellipsis", className: cn("flex size-9 items-center justify-center", className) }, props, { children: [_jsx(MoreHorizontalIcon, { className: "size-4" }), _jsx("span", { className: "sr-only", children: "More pages" })] })));
}
export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis, };
