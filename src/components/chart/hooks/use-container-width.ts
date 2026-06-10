import * as React from 'react'

/**
 * Track the width of a container element via ResizeObserver. Returns a ref to
 * attach and the current measured width (falls back to `fallback`).
 */
export function useContainerWidth(fallback = 500) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(fallback)

  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
