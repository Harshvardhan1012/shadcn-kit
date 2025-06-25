'use client'
import Link from 'next/link'
import { App } from './App'
import { H3, P } from '@/components/ui/Typography'

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <section className="mb-8">
        <H3 className="mb-4">Next.js Professional Application</H3>
        <P className="mb-6">
          Welcome to your application enhanced with professional typography and
          design.
        </P>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Typography & Theme Demo</H3>
            <P className="mb-4">
              Explore our professional typography system with consistent font
              usage and dynamic theming across the application.
            </P>
            <Link
              href="/theme"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Typography
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Data Table Demo</H3>
            <P className="mb-4">
              Try the advanced data table with multi-row selection capabilities,
              export options, and pagination.
            </P>
            <Link
              href="/table"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Table Demo
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Dynamic Charts</H3>
            <P className="mb-4">
              Interactive chart components with multiple types, themes, and
              real-time data visualization capabilities.
            </P>
            <Link
              href="/charts"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Charts
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Dynamic Forms</H3>
            <P className="mb-4">
              Comprehensive form builder with validation, multiple input types,
              and conditional rendering capabilities.
            </P>
            <Link
              href="/form"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Forms
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Sidebar Navigation</H3>
            <P className="mb-4">
              Dynamic sidebar component with search, collapsible groups,
              and persistent state management.
            </P>
            <Link
              href="/sidebar-example"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Sidebar
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Components Showcase</H3>
            <P className="mb-4">
              Enhanced shadcn-kit components: DynamicBreadcrumb, DynamicCarousel, and DynamicBadge.
            </P>
            <Link
              href="/components-showcase"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Components
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Application Demo</H3>
            <P className="mb-4">
              Try the original application functionality with improved styles.
            </P>
            <div className="mt-2">
              <App />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
