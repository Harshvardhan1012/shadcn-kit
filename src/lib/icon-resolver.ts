import * as LucideIcons from "lucide-react"

/**
 * Dynamically resolves a Lucide icon name to the actual component
 * @param iconName - Icon name in kebab-case (e.g., 'arrow-up', 'activity')
 * @returns The Lucide icon component or null if not found
 */
export function resolveLucideIcon(
  iconName: string
): React.FC<React.SVGProps<SVGSVGElement>> | null {
  if (!iconName) return null

  // Convert kebab-case to PascalCase
  // e.g., 'arrow-up' -> 'ArrowUp', 'a-arrow-up' -> 'AArrowUp'
  const pascalCaseName = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")

  // Get the icon from Lucide
  const Icon = (LucideIcons as Record<string, any>)[pascalCaseName] || null

  return Icon || null
}

/**
 * Resolves multiple icon names to components
 * @param iconNames - Array of icon names
 * @returns Object mapping icon names to components
 */
export function resolveLucideIcons(
  iconNames: string[]
): Record<string, React.FC<React.SVGProps<SVGSVGElement>> | null> {
  const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>> | null> =
    {}

  iconNames.forEach((name) => {
    icons[name] = resolveLucideIcon(name)
  })

  return icons
}
