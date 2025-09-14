'use client'

import { cn } from '@/lib/utils'
import { ModeToggle } from './../theme/mode-toggle'
import { Separator } from './../ui/separator'
import { SidebarTrigger } from './../ui/sidebar'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <>
      <header
        className={cn(
          'relative flex h-14 items-center gap-4 border-b bg-background px-6',
          className
        )}>
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </header>
      <Separator />
    </>
  )
}
