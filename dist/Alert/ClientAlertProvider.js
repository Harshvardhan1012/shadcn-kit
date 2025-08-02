'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { AlertProvider as OriginalAlertProvider } from '../services/AlertService';
export function ClientAlertProvider({ children }) {
    return _jsx(OriginalAlertProvider, { children: children });
}
