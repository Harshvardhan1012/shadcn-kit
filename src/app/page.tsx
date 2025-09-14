'use client'
import Link from 'next/link'
import { App } from './App'
import { H3, P } from '@/components/ui/Typography'

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <section className="mb-8">
        <H3 className="mb-4">Next.js Professional Application</H3>
        <P className="mb-6">
          Welcome to your application enhanced with professional typography and
          design.
        </P>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Typography Demo</H3>
            <P className="mb-4">
              Explore our professional typography system with consistent font
              usage across the application.
            </P>
            <Link
              href="/typography"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Typography
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <H3 className="mb-3">Table Selection Demo</H3>
            <P className="mb-4">
              Try the advanced data table with multi-row selection capabilities.
            </P>
            <Link
              href="/table-demo"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Table Demo
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
