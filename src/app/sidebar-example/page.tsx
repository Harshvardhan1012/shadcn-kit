// 'use client'

// import { DynamicSidebar, SidebarConfig } from '@/components/DynamicSidebar'
// import {
//   BellRing,
//   Calendar,
//   CheckCircle,
//   ClockFading,
//   GitPullRequest,
//   Inbox,
//   LogOut,
//   Settings,
//   User,
//   X,
// } from 'lucide-react'
// import Home from '../page'
// import { AlertDialogDemo } from '@/components/AlertDialog'
// import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
// import { use, useState } from 'react'

// export function sidebarExample() {
//   const [open, setOpen] = useState<boolean>(false)
//   const headerConfig = {
//     logo: {
//       text: 'MyApp',
//     },
//     user: {
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       avatarComponent: User,
//     },
//   }

//   const footerConfig = {
//     buttons: [
//       {
//         id: 'logout',
//         label: 'Logout',
//         icon: LogOut,
//         variant: 'outline' as const,
//         onClick: handleLogout,
//       },
//     ],
//   }

//   const sidebarConfig: SidebarConfig = {
//     headerConfig: headerConfig,
//     footerConfig: footerConfig,
//     groups: [
//       {
//         id: 'main',
//         label: 'Navigation',
//         items: [
//           {
//             id: 'home',
//             title: 'Home',
//             icon: Home,
//             url: '/',
//           },
//           {
//             id: 'inbox',
//             title: 'Inbox',
//             icon: Inbox,
//             url: '/inbox',
//             badge: 3,
//           },
//           {
//             id: 'calendar',
//             title: 'Calendar',
//             icon: Calendar,
//             url: '/calendar',
//           },
//         ],
//       },
//       {
//         id: 'features',
//         label: 'Features',
//         items: [
//           {
//             id: 'requests',
//             title: 'Requests',
//             icon: GitPullRequest,
//             defaultOpen: true,
//             badge: 6,
//             subItems: [
//               {
//                 id: 'pending',
//                 title: 'Pending',
//                 icon: ClockFading,
//                 url: '/requests/pending',
//                 badge: 4,
//               },
//               {
//                 id: 'approved',
//                 title: 'Approved',
//                 icon: CheckCircle,
//                 url: '/requests/approved',
//               },
//               {
//                 id: 'rejected',
//                 title: 'Rejected',
//                 icon: X,
//                 url: '/requests/rejected',
//               },
//               {
//                 id: 'incoming',
//                 title: 'Incoming',
//                 icon: BellRing,
//                 url: '/requests/incoming',
//                 badge: 2,
//               },
//             ],
//           },
//           {
//             id: 'settings',
//             title: 'Settings',
//             icon: Settings,
//             url: '/settings',
//           },
//         ],
//       },
//     ],
//   }
//   return (
//     <div className="flex h-full">
//       <DynamicSidebar config={sidebarConfig} />
//       <SidebarInset className="p-6">
//         <SidebarTrigger />
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Dashboard</h1>
//         </div>
//         <div className="prose">
//           <h2>Collapsible Sidebar Demo</h2>
//           <p>
//             This example demonstrates a dynamic sidebar with collapsible mode.
//             When collapsed, it shows only icons with tooltips on hover.
//           </p>
//         </div>
//       </SidebarInset>
//       {open && (
//         <AlertDialogDemo
//           onCancel={() => setOpen(false)}
//           openState={open}
//           title="Logout"
//           description="Are you sure you want to logout?"
//           cancelText="Cancel"
//           confirmText="Logout"
//           onConfirm={handleConfirmLogout}
//         />
//       )}{' '}
//     </div>
//   )
// }
