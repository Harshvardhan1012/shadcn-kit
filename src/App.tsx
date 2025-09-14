import { GlobalAlert } from '@/components/Alert/Alert'
import { FeatureFlagsProvider } from '@/components/master-table/feature-flags-provider'
import { ClientSidebarProvider } from '@/components/NavSideBar/ClientSidebarProvider'
import { ClientAlertProvider } from '@/components/services/AlertService'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { SidebarExample } from './app/SidebarExample'
import './index.css'
import { generateRoutesFromSidebar } from './routes/routeGenerator'
import { sidebarConfig } from './app/sidebarConfig'

function App() {
  const routes = generateRoutesFromSidebar(sidebarConfig)
  return (
    <Router>
      <NuqsAdapter>
        <FeatureFlagsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <ClientAlertProvider>
              <ClientSidebarProvider>
                <GlobalAlert />
                <div className="flex flex-col h-screen w-full">
                  <div className="absolute right-4 top-4 z-50 flex items-center gap-4">
                    <ThemeSelector />
                    <ModeToggle />
                  </div>
                  <div className="flex flex-1 w-full">
                    <SidebarExample>
                      <Routes>
                        {routes}
                        <Route
                          path="/"
                          element={
                            <Navigate
                              to="/form"
                              replace
                            />
                          }
                        />
                      </Routes>
                    </SidebarExample>
                  </div>
                </div>
              </ClientSidebarProvider>
            </ClientAlertProvider>
          </ThemeProvider>
        </FeatureFlagsProvider>
      </NuqsAdapter>
    </Router>
  )
}

export default App
