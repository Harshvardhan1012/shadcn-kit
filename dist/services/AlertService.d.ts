import { type ReactNode } from "react";
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
export declare const AlertProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAlert: () => AlertContextProps;
export {};
