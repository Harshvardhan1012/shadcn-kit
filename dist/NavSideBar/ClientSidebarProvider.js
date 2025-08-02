'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { SidebarProvider } from '../ui/sidebar';
export function ClientSidebarProvider({ defaultOpen = true, children, }) {
    return _jsx(SidebarProvider, { defaultOpen: defaultOpen, children: children });
}
