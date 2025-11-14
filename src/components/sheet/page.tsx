import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { PanelRightClose } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface SheetDemoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'xl' | '2xl' | '3xl' | string
  storageKey?: string // Optional key to uniquely identify this sheet's width
}

// Size map as percentages of screen width
const sizeMap: Record<string, number> = {
  sm: 0.3, // 30% of screen width
  md: 0.5, // 50% of screen width
  xl: 0.65, // 65% of screen width
  '2xl': 0.8, // 80% of screen width
  '3xl': 0.95, // 95% of screen width (almost full)
}

export default function SheetDemo({
  open,
  onOpenChange,
  children,
  size = 'md',
  storageKey = 'sheet-width', // Default storage key
}: SheetDemoProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const isFullWidth = size === '3xl'
  const shouldPersist = !isFullWidth // Only persist for sizes <= 2xl

  // Calculate min and max widths based on screen size
  const getMinWidth = () => window.innerWidth * 0.25 // 1/4 of screen
  const getMaxWidth = () => window.innerWidth * 0.95 // Almost full screen

  // Calculate initial width with localStorage support
  const getInitialWidth = () => {
    const minWidth = getMinWidth()
    const maxWidth = getMaxWidth()

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

    // Fall back to size map (now as percentage of screen width)
    const sizePercentage = sizeMap[size] || 0.5
    const calculatedWidth = window.innerWidth * sizePercentage

    // Ensure width is within bounds
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth))
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
    const minWidth = getMinWidth()
    const maxWidth = getMaxWidth()
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
  }, [isResizing, width, shouldPersist, storageKey])

  // Handle window resize to adjust width constraints
  useEffect(() => {
    const handleWindowResize = () => {
      const minWidth = getMinWidth()
      const maxWidth = getMaxWidth()
      setWidth((currentWidth) => {
        // Adjust width to stay within new bounds
        return Math.max(minWidth, Math.min(maxWidth, currentWidth))
      })
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

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
