// 'use client'

// import { useState } from 'react'
// import { ChartBuilder } from './ChartBuilder'
// import { ChartBuilderSheet } from '../card-builder/ChartBuilderSheet'

// // Sample data for demonstration
// const sampleData = [
//   {
//     subnet: '10.6.1.1',
//     StaticIPCount: 5867,
//     DhcpActiveIPCount: 11906,
//     TotalActiveIPCount: 17773,
//     region: 'US',
//   },
//   {
//     subnet: '10.4.2.1',
//     StaticIPCount: 7900,
//     DhcpActiveIPCount: 5354,
//     TotalActiveIPCount: 13254,
//     region: 'EU',
//   },
//   {
//     subnet: '10.60.3.1',
//     StaticIPCount: 380,
//     DhcpActiveIPCount: 65,
//     TotalActiveIPCount: 445,
//     region: 'US',
//   },
//   {
//     subnet: '10.41.4.1',
//     StaticIPCount: 0,
//     DhcpActiveIPCount: 422,
//     TotalActiveIPCount: 422,
//     region: 'ASIA',
//   },
//   {
//     subnet: '10.31.5.1',
//     StaticIPCount: 104,
//     DhcpActiveIPCount: 36,
//     TotalActiveIPCount: 140,
//     region: 'EU',
//   },
//   {
//     subnet: '10.250.6.1',
//     StaticIPCount: 0,
//     DhcpActiveIPCount: 117,
//     TotalActiveIPCount: 117,
//     region: 'US',
//   },
//   {
//     subnet: '10.32.7.1',
//     StaticIPCount: 54,
//     DhcpActiveIPCount: 5,
//     TotalActiveIPCount: 59,
//     region: 'ASIA',
//   },
//   {
//     subnet: '10.34.8.1',
//     StaticIPCount: 0,
//     DhcpActiveIPCount: 50,
//     TotalActiveIPCount: 50,
//     region: 'EU',
//   },
//   {
//     subnet: '10.251.9.1',
//     StaticIPCount: 0,
//     DhcpActiveIPCount: 7,
//     TotalActiveIPCount: 7,
//     region: 'US',
//   },
// ]

// // Column configuration for the data
// const columnConfig = [
//   {
//     field: 'subnet',
//     header: 'Subnet',
//     options: {
//       variant: 'text',
//       index: 0,
//     },
//   },
//   {
//     field: 'StaticIPCount',
//     header: 'Static IP Count',
//     options: {
//       variant: 'number',
//       index: 1,
//     },
//   },
//   {
//     field: 'DhcpActiveIPCount',
//     header: 'DHCP Active IP Count',
//     options: {
//       variant: 'number',
//       index: 2,
//     },
//   },
//   {
//     field: 'TotalActiveIPCount',
//     header: 'Total Active IP Count',
//     options: {
//       variant: 'number',
//       index: 3,
//     },
//   },
//   {
//     field: 'region',
//     header: 'Region',
//     options: {
//       variant: 'multiSelect',
//       index: 4,
//       values: [
//         { label: 'US', value: 'US' },
//         { label: 'EU', value: 'EU' },
//         { label: 'ASIA', value: 'ASIA' },
//       ],
//     },
//   },
// ]

// export default function ChartBuilderPage() {
//   const [savedConfig, setSavedConfig] = useState<any>(null)

//   const handleSave = (config: any) => {
//     console.log('Chart Configuration:', config)
//     setSavedConfig(config)
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Chart Builder</h1>
//           <p className="text-muted-foreground">
//             Create custom charts with global and series-specific filters
//           </p>
//         </div>

//         {/* Add Chart Button - Opens Sheet */}
//         <ChartBuilderSheet
//           data={sampleData}
//           columns={columnConfig}
//           onSave={handleSave}
//         />
//       </div>

//       {/* Optional: Keep the full page version for comparison */}
//       <details className="border rounded-lg">
//         <summary className="p-4 cursor-pointer hover:bg-muted/50">
//           <span className="font-medium">Show Full Page Version</span>
//         </summary>
//         <div className="p-4 border-t">
//           <ChartBuilder
//             data={sampleData}
//             columns={columnConfig}
//             onSave={handleSave}
//           />
//         </div>
//       </details>

//       {savedConfig && (
//         <div className="mt-8 p-4 border rounded-lg bg-muted/20">
//           <h3 className="font-semibold mb-2">Saved Configuration (JSON):</h3>
//           <pre className="text-xs overflow-auto max-h-96 bg-background p-4 rounded border">
//             {JSON.stringify(savedConfig, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   )
// }
