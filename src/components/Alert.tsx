// Example usage in GlobalAlert.tsx
import { AlertCircle, Terminal, X } from "lucide-react";
import { useAlert } from "../app/services/AlertService";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export const GlobalAlert = () => {
  const { alerts, closeAlert } = useAlert();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full text-left">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.type}
          className="relative shadow-lg"
        >
          <button
            onClick={() => closeAlert(alert.id)}
            className="absolute top-1 right-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          {alert.type === "default" && <Terminal className="h-4 w-4" />}
          {alert.type === "destructive" && <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
