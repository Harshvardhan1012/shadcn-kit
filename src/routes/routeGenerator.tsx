import { Suspense, type JSX } from 'react'
import { Route } from 'react-router-dom'
import { Loader } from 'lucide-react'
import ProtectedRoute from './ProtectedRoute'
import type { SidebarConfig, SidebarItem } from '../components'

export const generateRoutesFromSidebar = (config: SidebarConfig) => {
  const allRoutes: JSX.Element[] = []

  const processItems = (items: SidebarItem[]) => {
    items.forEach((item) => {
      if (item.url && item.component) {
        const RouteComponent = item.component

        const routeElement = (
          <Route
            key={item.id}
            path={item.url}
            element={
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-full">
                    <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                }>
                {item.isProtected ? (
                  <ProtectedRoute showIf={item.showIf}>
                    <RouteComponent />
                  </ProtectedRoute>
                ) : (
                  <RouteComponent />
                )}
              </Suspense>
            }
          />
        )

        allRoutes.push(routeElement)
      }

      if (item.subItems) {
        processItems(item.subItems)
      }
    })
  }

  // Process all groups
  config.groups.forEach((group) => processItems(group.items))
  if (config.header && Array.isArray(config.header)) {
    config.header.forEach((group) => processItems(group.items))
  }
  if (config.footer && Array.isArray(config.footer)) {
    config.footer.forEach((group) => processItems(group.items))
  }

  return allRoutes
}
