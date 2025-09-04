import { cn } from './../lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './../ui/alert-dialog'

interface AlertDialogProps {
  title: string
  description: string
  cancelText: string
  confirmText: string
  onConfirm: () => void
  openState: boolean
  onCancel: () => void
  classNameContent?: string
  classNameCancel?: string
  classNameConfirm?: string
}

export function AlertDialogDemo({
  title,
  description,
  cancelText,
  confirmText,
  onConfirm,
  openState,
  onCancel,
  classNameContent,
  classNameCancel,
  classNameConfirm,
}: AlertDialogProps) {
  return (
    <AlertDialog open={openState}>
      <AlertDialogContent className={cn(classNameContent)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(classNameCancel)}
            onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(classNameConfirm)}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
