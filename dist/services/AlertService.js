'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useRef, useEffect } from "react";
const AlertContext = createContext(undefined);
export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const timeouts = useRef({});
    const showAlert = (type, title, description) => {
        const id = Date.now() + Math.random(); // Unique id
        setAlerts((prev) => [...prev, { id, type, title, description }]);
        timeouts.current[id] = setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
            delete timeouts.current[id];
        }, 3000);
    };
    const closeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        if (timeouts.current[id]) {
            clearTimeout(timeouts.current[id]);
            delete timeouts.current[id];
        }
    };
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            Object.values(timeouts.current).forEach(clearTimeout);
        };
    }, []);
    return (_jsx(AlertContext.Provider, { value: { alerts, showAlert, closeAlert }, children: children }));
};
export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context)
        throw new Error("useAlert must be used within AlertProvider");
    return context;
};
