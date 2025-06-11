import { NextResponse } from 'next/server'

// Generate random data for the chart
function generateRandomData(numPoints = 12) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  return Array.from({ length: numPoints }, (_, i) => ({
    name: months[i % 12],
    data1: Math.floor(Math.random() * 500) + 100,
    data2: Math.floor(Math.random() * 400) + 50,
    data3: Math.floor(Math.random() * 300) + 150
  }))
}

export async function GET(request: Request) {
  // Get parameters from the URL
  const { searchParams } = new URL(request.url)
  const points = parseInt(searchParams.get('points') || '12')
  
  // Simulate a delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Return the data
  return NextResponse.json({
    data: generateRandomData(points),
    config: {
      data1: {
        label: 'Revenue',
        theme: {
          light: 'oklch(0.65 0.2 140)',
          dark: 'oklch(0.55 0.25 150)',
        },
      },
      data2: {
        label: 'Expenses',
        theme: {
          light: 'oklch(0.65 0.22 240)',
          dark: 'oklch(0.55 0.25 245)',
        },
      },
      data3: {
        label: 'Profit',
        theme: {
          light: 'oklch(0.65 0.25 25)',
          dark: 'oklch(0.6 0.28 30)',
        },
      },
    }
  })
}
