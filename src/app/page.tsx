'use client';
import { AlertProvider } from "@/app/services/AlertService";
import { GlobalAlert } from "./../components/Alert";
import { App } from "./App";

export default function Home() {
  
  return (
    <>
      <AlertProvider>
        <GlobalAlert />
          <App/>
        sdfd
      </AlertProvider>
    </>
  );
}
