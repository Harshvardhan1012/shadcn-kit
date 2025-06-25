'use client'

import { DynamicBreadcrumb } from '@/components/DynamicBreadcrumb'
import { DynamicCarousel } from '@/components/DynamicCarousel'
import { DynamicBadge, StatusBadge, TrendingBadge } from '@/components/DynamicBadge'
import { H1, H2, P } from '@/components/ui/Typography'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, FileText, Star } from 'lucide-react'

export default function ComponentShowcasePage() {
  // Sample data for breadcrumbs
  const breadcrumbItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
    },
    {
      id: 'components',
      label: 'Components',
      href: '/components',
      icon: FileText,
    },
    {
      id: 'showcase',
      label: 'Showcase',
      isCurrent: true,
    },
  ]

  const longBreadcrumbItems = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'projects', label: 'Projects', href: '/projects' },
    { id: 'web-app', label: 'Web Application', href: '/projects/web-app' },
    { id: 'frontend', label: 'Frontend', href: '/projects/web-app/frontend' },
    { id: 'components', label: 'Components', href: '/projects/web-app/frontend/components' },
    { id: 'showcase', label: 'Component Showcase', isCurrent: true },
  ]

  // Sample data for carousel
  const carouselItems = [
    {
      id: 1,
      title: 'Modern Dashboard',
      description: 'Beautiful analytics dashboard with real-time data',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      alt: 'Dashboard screenshot',
      content: (
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" 
            alt="Dashboard screenshot"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-semibold">Modern Dashboard</h3>
              <p className="text-sm opacity-90">Beautiful analytics dashboard with real-time data</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Mobile App Design',
      description: 'Clean and intuitive mobile application interface',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      alt: 'Mobile app mockup',
      content: (
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" 
            alt="Mobile app mockup"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-semibold">Mobile App Design</h3>
              <p className="text-sm opacity-90">Clean and intuitive mobile application interface</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'E-commerce Platform',
      description: 'Full-featured online store with advanced filtering',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      alt: 'E-commerce interface',
      content: (
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop" 
            alt="E-commerce interface"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-semibold">E-commerce Platform</h3>
              <p className="text-sm opacity-90">Full-featured online store with advanced filtering</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Data Visualization',
      description: 'Interactive charts and graphs for data analysis',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      alt: 'Data visualization charts',
      content: (
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" 
            alt="Data visualization charts"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-semibold">Data Visualization</h3>
              <p className="text-sm opacity-90">Interactive charts and graphs for data analysis</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const cardCarouselItems = [
    {
      id: 1,
      content: (
        <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
          <h3 className="text-xl font-bold mb-2">Feature 1</h3>
          <p className="text-blue-100">Advanced analytics and reporting capabilities</p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg">
          <h3 className="text-xl font-bold mb-2">Feature 2</h3>
          <p className="text-green-100">Real-time collaboration tools</p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg">
          <h3 className="text-xl font-bold mb-2">Feature 3</h3>
          <p className="text-orange-100">Seamless integrations with popular tools</p>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-12">
      <section>
        <H1 className="mb-4">Components Showcase</H1>
        <P>
          Enhanced shadcn-kit components: DynamicBreadcrumb, DynamicCarousel, and DynamicBadge.
        </P>
      </section>

      {/* Breadcrumb Examples */}
      <section className="space-y-8">
        <div>
          <H2 className="mb-4">Dynamic Breadcrumb</H2>
          <P className="mb-6">
            Configurable breadcrumb with icons, custom separators, and smart collapsing.
          </P>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Breadcrumb</CardTitle>
              <CardDescription>
                Simple breadcrumb with icons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicBreadcrumb
                items={breadcrumbItems}
                showHomeIcon={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collapsed Breadcrumb</CardTitle>
              <CardDescription>
                Long paths with smart collapsing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicBreadcrumb
                items={longBreadcrumbItems}
                maxItems={4}
                collapseMode="middle"
                showHomeIcon={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Separator</CardTitle>
              <CardDescription>
                Breadcrumb with custom separator styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <P className="text-sm text-muted-foreground mb-2">Slash separator:</P>
                <DynamicBreadcrumb
                  items={breadcrumbItems}
                  separatorType="slash"
                  showHomeIcon={false}
                />
              </div>
              <div>
                <P className="text-sm text-muted-foreground mb-2">Dot separator:</P>
                <DynamicBreadcrumb
                  items={breadcrumbItems}
                  separatorType="dot"
                  showHomeIcon={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Carousel Examples */}
      <section className="space-y-8">
        <div>
          <H2 className="mb-4">Dynamic Carousel</H2>
          <P className="mb-6">
            Responsive carousel with multiple viewing modes and auto-play.
          </P>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Image Carousel</CardTitle>
              <CardDescription>
                Responsive image carousel with navigation and auto-play
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicCarousel
                items={carouselItems}
                showNavigation={true}
                showDots={true}
                autoPlay={true}
                autoPlayInterval={4000}
                aspectRatio="video"
                className="max-w-2xl mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Item Carousel</CardTitle>
              <CardDescription>
                Show multiple items at once with responsive breakpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicCarousel
                items={carouselItems}
                itemsPerView={2}
                gap="lg"
                showNavigation={true}
                loop={true}
                variant="card"
                className="max-w-4xl mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Content Carousel</CardTitle>
              <CardDescription>
                Carousel with custom React content instead of images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicCarousel
                items={cardCarouselItems}
                showNavigation={true}
                showDots={true}
                aspectRatio="auto"
                className="max-w-lg mx-auto"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badge Examples */}
      <section className="space-y-8">
        <div>
          <H2 className="mb-4">Dynamic Badge</H2>
          <P className="mb-6">
            Enhanced badges with icons, interactions, and status indicators.
          </P>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Badges</CardTitle>
              <CardDescription>
                Different variants and sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <DynamicBadge variant="default">Default</DynamicBadge>
                <DynamicBadge variant="secondary">Secondary</DynamicBadge>
                <DynamicBadge variant="success" icon={Star}>Success</DynamicBadge>
                <DynamicBadge variant="warning">Warning</DynamicBadge>
                <DynamicBadge variant="destructive">Error</DynamicBadge>
                <DynamicBadge variant="outline">Outline</DynamicBadge>
                <DynamicBadge variant="gradient" icon={Star}>Gradient</DynamicBadge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Badges</CardTitle>
              <CardDescription>
                Badges with dismiss and click actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <DynamicBadge 
                  variant="info" 
                  dismissible 
                  icon={FileText}
                  onDismiss={() => alert('Badge dismissed!')}
                >
                  Dismissible
                </DynamicBadge>
                <DynamicBadge 
                  variant="secondary" 
                  interactive 
                  onClick={() => alert('Badge clicked!')}
                >
                  Clickable
                </DynamicBadge>
                <DynamicBadge 
                  variant="success" 
                  loading
                  loadingComponent={<span className="animate-spin">⏳</span>}
                >
                  Loading
                </DynamicBadge>
                <DynamicBadge 
                  variant="warning" 
                  pulse
                  animation="bounce"
                >
                  Animated
                </DynamicBadge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Notification Badges</CardTitle>
              <CardDescription>
                Preset badges for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Badges */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Status Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status="online">Online</StatusBadge>
                    <StatusBadge status="busy">Busy</StatusBadge>
                    <StatusBadge status="away">Away</StatusBadge>
                    <StatusBadge status="offline">Offline</StatusBadge>
                  </div>
                </div>

                {/* Notification Examples */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Notification Badges</h4>
                  <div className="flex flex-wrap gap-6 items-center">
                    <DynamicBadge variant="destructive" size="sm" shape="pill" count={5}>5</DynamicBadge>
                    <DynamicBadge variant="destructive" size="sm" shape="pill" count={12}>12</DynamicBadge>
                    <DynamicBadge variant="info" size="sm" shape="pill" count={99}>99+</DynamicBadge>
                    <TrendingBadge>Trending</TrendingBadge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge Sizes & Shapes</CardTitle>
              <CardDescription>
                Different sizes and shapes available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-16 text-sm text-muted-foreground">Small:</span>
                  <DynamicBadge size="sm" variant="default">Small</DynamicBadge>
                  <DynamicBadge size="sm" variant="success" shape="square">Square</DynamicBadge>
                  <DynamicBadge size="sm" variant="info" shape="pill">Pill Shape</DynamicBadge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-sm text-muted-foreground">Medium:</span>
                  <DynamicBadge size="md" variant="default">Medium</DynamicBadge>
                  <DynamicBadge size="md" variant="warning" shape="square">Square</DynamicBadge>
                  <DynamicBadge size="md" variant="secondary" shape="pill">Pill Shape</DynamicBadge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-sm text-muted-foreground">Large:</span>
                  <DynamicBadge size="lg" variant="default">Large</DynamicBadge>
                  <DynamicBadge size="lg" variant="destructive" shape="square">Square</DynamicBadge>
                  <DynamicBadge size="lg" variant="gradient" shape="pill">Pill Shape</DynamicBadge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
