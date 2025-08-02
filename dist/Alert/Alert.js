// Example usage in GlobalAlert.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, Terminal, X } from 'lucide-react';
import { useAlert } from '../services/AlertService';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
export const GlobalAlert = () => {
    const { alerts, closeAlert } = useAlert();
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full text-left", children: alerts.map((alert) => (_jsxs(Alert, { variant: alert.type, className: "relative shadow-lg", children: [_jsx("button", { onClick: () => closeAlert(alert.id), className: "absolute top-1 right-1 text-muted-foreground hover:text-foreground transition-colors", "aria-label": "Close", children: _jsx(X, { className: "w-4 h-4" }) }), alert.type === 'default' && _jsx(Terminal, { className: "h-4 w-4" }), alert.type === 'destructive' && _jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: alert.title }), _jsx(AlertDescription, { children: alert.description })] }, alert.id))) }));
};
