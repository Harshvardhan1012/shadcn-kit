import { ErrorBoundary } from '@/components/ErrorBoundary'
import { FeatureFlagsProvider } from '@/components/master-table/feature-flags-provider'
import { ClientSidebarProvider } from '@/components/NavSideBar/ClientSidebarProvider'
import { AlertProvider } from '@/components/services/toastService'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { generateRoutesFromSidebar } from '@/routes/routeGenerator'
import { sidebarConfig } from '@/sidebar/sidebarConfig'
import { SidebarExample } from '@/sidebar/SidebarExample'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './../index.css'
import { QueryClientWrapper } from './QueryClientProvider'
import { TableProvider } from '@/app/custom-table/card-builder'
import { Suspense } from 'react'
import LoginPage from '@/app/custom-chart/login'

function AppProvider() {
  const routes = generateRoutesFromSidebar(sidebarConfig)
  return (
    <ErrorBoundary>
      <Router>
        <NuqsAdapter>
          <TableProvider>
            <FeatureFlagsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem>
                <AlertProvider>
                  <AuthProvider>
                    <QueryClientWrapper>
                      <ClientSidebarProvider>
                        <Routes>
                          <Route
                            path="/login"
                            element={
                              <Suspense fallback={<div>Loading...</div>}>
                                <LoginPage />
                              </Suspense>
                            }
                          />
                          {/* Add any additional routes here if needed */}
                          {/* Routes with sidebar */}
                          <Route
                            path="/*"
                            element={
                              <div className="flex flex-col h-screen w-full overflow-hidden">
                                <div className="absolute right-4 top-2 z-50 flex items-center gap-4">
                                  <ThemeSelector />
                                  <ModeToggle />
                                </div>
                                <div className="flex flex-1 w-full overflow-hidden">
                                  <SidebarExample>
                                    <Routes>{routes}</Routes>
                                  </SidebarExample>
                                </div>
                              </div>
                            }
                          />
                        </Routes>
                      </ClientSidebarProvider>
                      <Toaster />
                    </QueryClientWrapper>
                  </AuthProvider>
                </AlertProvider>
              </ThemeProvider>
            </FeatureFlagsProvider>
          </TableProvider>
        </NuqsAdapter>
      </Router>
    </ErrorBoundary>
  )
}
export default AppProvider
