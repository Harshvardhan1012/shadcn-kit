'use client';
import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";

type AlertType = "default" | "destructive";

interface AlertState {
  id: number;
  type: AlertType;
  title: string;
  description: string;
}

interface AlertContextProps {
  alerts: AlertState[];
  showAlert: (type: AlertType, title: string, description: string) => void;
  closeAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const timeouts = useRef<{ [key: number]: NodeJS.Timeout }>({});

  const showAlert = (type: AlertType, title: string, description: string) => {
    const id = Date.now() + Math.random(); // Unique id
    setAlerts((prev) => [...prev, { id, type, title, description }]);
    
    timeouts.current[id] = setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      delete timeouts.current[id];
    }, 3000);
  };

  const closeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
  };

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};