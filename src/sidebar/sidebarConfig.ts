import type { SidebarConfig } from "@/components/NavSideBar/DynamicSidebar"
import {
  ChartScatter,
  FormInput,
  LayoutDashboard,
  Settings,
  ShowerHeadIcon,
  Table2,
} from "lucide-react"
import { lazy } from "react"
import { AppRoutes } from "../routes/routeUtils"
const Form = lazy(() =>
  import("../app/sectionedForm/page").then((module) => ({
    default: module.default,
  })),
)
const Chart = lazy(() =>
  import("../app/charts/page").then((module) => ({ default: module.default })),
)
const Table = lazy(() =>
  import("../app/table/page").then((module) => ({
    default: module.default,
  })),
)

const CustomChart = lazy(() => import("../app/custom-chart/landing"))
const CustomTable = lazy(() => import("../app/custom-table/page"))
const CustomChartAppKey = lazy(() => import("../app/custom-chart/page"))
const DashboardPage = lazy(() => import("../app/dashboard/page"))

export const sidebarConfig: SidebarConfig = {
  groups: [
    {
      id: "Navigation",
      label: "Navigation",
      items: [
        {
          id: "Components",
          title: "Components",
          defaultOpen: true,
          badge: 6,
          subItems: [
            {
              id: "form",
              title: "Form",
              icon: FormInput,
              component: Form,
              url: AppRoutes.FORM,
              showIf: () => {
                //custom logic to show or hide item use Auth Context
                return true
              },
            },
            {
              id: "charts",
              title: "Charts",
              icon: ChartScatter,
              component: Chart,
              url: AppRoutes.CHARTS,
            },
            {
              id: "dashboard",
              title: "Dashboard",
              icon: LayoutDashboard,
              component: DashboardPage,
              url: "/dashboard",
            },
            {
              id: "dashboard_key",
              title: "Dashboard by Key",
              icon: LayoutDashboard,
              component: DashboardPage,
              url: "/dashboard/:dashboardKey",
            },
            {
              id: "table",
              title: "Table",
              url: AppRoutes.TABLE,
              component: Table,
              icon: Table2,
            },
            {
              id: "custom_table",
              title: "Custom Table",
              url: AppRoutes.CUSTOM_TABLE,
              component: CustomChart,
              icon: Table2,
            },
            {
              id: "custom_chart",
              title: "Custom Chart",
              url: "/custom-chart",
              component: CustomTable,
              icon: ChartScatter,
            },
            {
              id: "custom_chart_appkey",
              title: "Custom Chart by AppKey",
              url: "/custom-chart/:appKey",
              component: CustomChartAppKey,
              icon: ChartScatter,
            },
          ],
        },
        {
          id: "settings",
          title: "Settings",
          icon: Settings,
          url: AppRoutes.SETTINGS,
        },
      ],
    },
  ],
  header: [
    {
      id: "header",
      items: [
        {
          id: "JSON",
          icon: ShowerHeadIcon,
          title: "Application",
          onClick: () => console.log("Application clicked"),
        },
      ],
    },
  ],
  footer: [
    {
      id: "footer",
      items: [
        {
          id: "terms",
          title: "Terms of Service",
          icon: Settings,
          url: "/terms", // Not in enum, keep as is or add to enum if needed
          onClick: () => console.log("Terms of Service clicked"),
          showIf: () => {
            //function that will be return true or false might be async from context
            return true
          },
        },
      ],
    },
  ],
}
