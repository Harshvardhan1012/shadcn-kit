'use client'
import { X } from "lucide-react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SheetDemo({ open, onOpenChange, children, columns = 1 }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <SheetTitle>Panel Title</SheetTitle>
            </VisuallyHidden>
            <SheetContent
                className={`${columns === 1 ? 'w-full md:w-[75%]' : 'w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl'
                    } h-full sm:h-auto overflow-y-auto p-0`}>
                {/* Premium Close Button */}
                <div className="absolute top-4 right-4 z-50">
                    <SheetClose asChild>
                        <button
                            className="relative group bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 rounded-xl p-2.5 shadow-lg shadow-gray-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-50/30 before:via-transparent before:to-purple-50/20 before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
                        </button>
                    </SheetClose>
                </div>

                {/* Content with padding */}
                <div className="h-full">
                    {children}
                </div>
            </SheetContent>
            <VisuallyHidden>
                <SheetFooter>Panel Footer</SheetFooter>
            </VisuallyHidden>
        </Sheet>
    )
}
