'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ModeToggle } from '../theme/mode-toggle';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { cn } from '../lib/utils';
export function Navbar({ className }) {
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: cn('relative flex h-14 items-center gap-4 border-b bg-background px-6', className), children: [_jsx("div", { className: "flex flex-1 items-center gap-2", children: _jsx(SidebarTrigger, {}) }), _jsx("div", { className: "flex items-center", children: _jsx(ModeToggle, {}) })] }), _jsx(Separator, {})] }));
}
