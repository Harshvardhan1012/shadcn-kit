'use client'

import { Dashboard } from '@/components/dashboard/Dashboard'
import { useParams } from 'react-router-dom'

/**
 * Read-only analytics dashboard page. Reads the `:dashboardKey` route param
 * (defaults to "demo") and renders the backend-driven dashboard.
 */
export default function DashboardPage() {
  const { dashboardKey } = useParams()
  return <Dashboard dashboardKey={dashboardKey || 'demo'} />
}
