import {
    Sheet, SheetContent,
    SheetTitle,
    SheetFooter
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function SheetDemo({
  open,
  onOpenChange,
  children,
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <SheetTitle>Panel Title</SheetTitle>
      </VisuallyHidden>
      <SheetContent
        className={`overflow-y-auto p-3`}>
        {children}
      </SheetContent>
      <VisuallyHidden>
        <SheetFooter>Panel Footer</SheetFooter>
      </VisuallyHidden>
    </Sheet>
  )
}
