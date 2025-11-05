import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface FormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function FormDialog({
  open,
  onClose,
  title,
  description,
  children,
}: FormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}>
      <DialogContent
        className={cn('sm:max-w-2xl max-h-[90vh] overflow-y-auto')}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
