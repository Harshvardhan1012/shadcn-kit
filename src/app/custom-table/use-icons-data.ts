import { useEffect, useState } from "react"

export interface IconsData {
  [key: string]: string // icon name -> SVG data
}

export function useIconsData() {
  const [iconsData, setIconsData] = useState<IconsData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/lucide-static/tags.json"
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setIconsData(data)
        console.log(`✅ Loaded ${Object.keys(data).length} icons from Lucide`)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred"
        console.error("❌ Error loading icons:", err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchIcons()
  }, [])

  return { iconsData, loading, error }
}
