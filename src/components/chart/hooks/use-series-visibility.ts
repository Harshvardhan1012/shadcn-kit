import * as React from 'react'

/**
 * Tracks which series the user has hidden via legend clicks. Returns the hidden
 * set and a toggle. Reset when the available keys change so stale hidden keys
 * don't linger.
 */
export function useSeriesVisibility(keys: string[]) {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set())

  const keysSignature = keys.join('|')
  React.useEffect(() => {
    setHidden(new Set())
  }, [keysSignature])

  const toggle = React.useCallback((key: string) => {
    setHidden((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  return { hidden, toggle }
}
