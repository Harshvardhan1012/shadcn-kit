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
import { cn } from "../lib/utils";
function Table(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: _jsx("table", Object.assign({ "data-slot": "table", className: cn("w-full caption-bottom text-sm", className) }, props)) }));
}
function TableHeader(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("thead", Object.assign({ "data-slot": "table-header", className: cn("[&_tr]:border-b", className) }, props)));
}
function TableBody(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("tbody", Object.assign({ "data-slot": "table-body", className: cn("[&_tr:last-child]:border-0", className) }, props)));
}
function TableFooter(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("tfoot", Object.assign({ "data-slot": "table-footer", className: cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className) }, props)));
}
function TableRow(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("tr", Object.assign({ "data-slot": "table-row", className: cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className) }, props)));
}
function TableHead(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("th", Object.assign({ "data-slot": "table-head", className: cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className) }, props)));
}
function TableCell(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("td", Object.assign({ "data-slot": "table-cell", className: cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className) }, props)));
}
function TableCaption(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("caption", Object.assign({ "data-slot": "table-caption", className: cn("text-muted-foreground mt-4 text-sm", className) }, props)));
}
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, };
