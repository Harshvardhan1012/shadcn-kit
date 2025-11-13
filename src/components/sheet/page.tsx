import React, { useRef, useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { PanelRightClose } from 'lucide-react'

interface SheetDemoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'xl' | '2xl' | '3xl' | string
  minWidth?: number
  maxWidth?: number
  storageKey?: string // Optional key to uniquely identify this sheet's width
}

const sizeMap: Record<string, number | 'full'> = {
  sm: 384,
  md: 512,
  xl: 640,
  '2xl': 768,
  '3xl': 'full',
}

export default function SheetDemo({
  open,
  onOpenChange,
  children,
  size = 'md',
  minWidth = 320,
  maxWidth = 2400,
  storageKey = 'sheet-width', // Default storage key
}: SheetDemoProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const isFullWidth = size === '3xl'
  const shouldPersist = !isFullWidth // Only persist for sizes <= 2xl

  // Calculate initial width with localStorage support
  const getInitialWidth = () => {
    // Check localStorage first if persistence is enabled
    if (shouldPersist) {
      const savedWidth = localStorage.getItem(storageKey)
      if (savedWidth) {
        const parsedWidth = parseInt(savedWidth)
        if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
          return parsedWidth
        }
      }
    }

    // Fall back to size map
    const mappedSize = sizeMap[size]
    if (mappedSize === 'full') {
      return window.innerWidth
    }
    if (mappedSize) {
      return mappedSize
    }
    if (typeof size === 'string') {
      return parseInt(size) || 512
    }
    return 512
  }

  const [width, setWidth] = useState(getInitialWidth())
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.userSelect = 'none'
  }

  const stopResizing = () => {
    setIsResizing(false)
    document.body.style.userSelect = ''
  }

  const handleResizing = (e: MouseEvent) => {
    if (!isResizing || !sheetRef.current) return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth)
    }
  }

  // Save width to localStorage when resizing stops
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizing)
      window.addEventListener('mouseup', stopResizing)

      return () => {
        window.removeEventListener('mousemove', handleResizing)
        window.removeEventListener('mouseup', stopResizing)
      }
    } else if (shouldPersist) {
      // Save to localStorage when resizing stops
      localStorage.setItem(storageKey, width.toString())
    }
  }, [isResizing, minWidth, maxWidth, width, shouldPersist, storageKey])

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}>
      <SheetContent
        ref={sheetRef}
        className="overflow-y-auto p-3"
        style={{
          width: `${width}px`,
          maxWidth: `${width}px`,
          transition: isResizing ? 'none' : 'width 0.15s ease',
        }}>
        {/* Custom Close Button */}
        <div className="absolute top-3 left-1 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}>
                <PanelRightClose className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="text-xs">
              Close
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Resizer Handle - hidden when full width */}
        {!isFullWidth && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 left-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-border/40 transition-colors z-20"
          />
        )}

        <div className="px-5 py-2">{children}</div>

        <VisuallyHidden>
          <SheetFooter>Panel Footer</SheetFooter>
        </VisuallyHidden>
      </SheetContent>
    </Sheet>
  )
}