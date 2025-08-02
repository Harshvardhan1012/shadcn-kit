// import { Button } from "@/components/ui/button";
import { Button } from '@/components/ui/button'
import { useAlert } from 'json-reactify'
import React from 'react'
// import { useAlert } from "./services/AlertService";

export const App = () => {
  const { showAlert } = useAlert()
  return (
    <Button
      onClick={() => {
        showAlert(
          'default',
          'Default Alert',
          'This is a default alert message.'
        )
      }}>
      Show Default Alert
    </Button>
  )
}
