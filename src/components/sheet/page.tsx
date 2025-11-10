import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface SheetDemoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export default function SheetDemo({
  open,
  onOpenChange,
  children,
}: SheetDemoProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <SheetTitle>Panel Title</SheetTitle>
      </VisuallyHidden>
      <SheetContent
        className={`overflow-y-auto p-3 w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl`}>
        {children}
      </SheetContent>
      <VisuallyHidden>
        <SheetFooter>Panel Footer</SheetFooter>
      </VisuallyHidden>
    </Sheet>
  )
}
