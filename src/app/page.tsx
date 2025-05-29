'use client'
import Link from 'next/link'
import { App } from './App'

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <section className="mb-8">
        <h1 className="heading-1 mb-4">Next.js Professional Application</h1>
        <p className="body-large mb-6">
          Welcome to your application enhanced with professional typography and
          design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="heading-3 mb-3">Typography Demo</h2>
            <p className="body-medium mb-4">
              Explore our professional typography system with consistent font
              usage across the application.
            </p>
            <Link
              href="/typography"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Typography
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="heading-3 mb-3">Table Selection Demo</h2>
            <p className="body-medium mb-4">
              Try the advanced data table with multi-row selection capabilities.
            </p>
            <Link
              href="/table-demo"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-ui inline-block">
              View Table Demo
            </Link>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="heading-3 mb-3">Application Demo</h2>
            <p className="body-medium mb-4">
              Try the original application functionality with improved styles.
            </p>
            <div className="mt-2">
              <App />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
