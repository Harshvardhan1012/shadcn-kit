import { useEffect } from "react"

export function useCustomTheme() {
  useEffect(() => {
    // Load custom theme from localStorage on mount
    const savedCustomTheme = localStorage.getItem("customThemeCSS")

    if (savedCustomTheme) {
      // Check if style element already exists
      const existingStyle = document.getElementById("custom-theme-style")

      if (!existingStyle) {
        // Create and inject the custom theme
        const styleElement = document.createElement("style")
        styleElement.id = "custom-theme-style"

        let processedCSS = savedCustomTheme.trim()

        // Check if CSS contains :root or .dark/.light selectors
        if (
          !processedCSS.includes(":root") &&
          !processedCSS.includes(".dark") &&
          !processedCSS.includes(".light")
        ) {
          // If it's just CSS variables, wrap them
          processedCSS = `:root {\n${processedCSS}\n}`
        }

        styleElement.textContent = processedCSS
        document.head.appendChild(styleElement)
      }
    }
  }, [])

  const saveCustomTheme = (css: string) => {
    localStorage.setItem("customThemeCSS", css)
  }

  const getCustomTheme = (): string | null => {
    return localStorage.getItem("customThemeCSS")
  }

  const clearCustomTheme = () => {
    localStorage.removeItem("customThemeCSS")
    const existingStyle = document.getElementById("custom-theme-style")
    if (existingStyle) {
      existingStyle.remove()
    }
  }

  return {
    saveCustomTheme,
    getCustomTheme,
    clearCustomTheme,
  }
}
