import { lazy } from "react"
import type { SidebarConfig } from "../components"
import {
    ChartScatter,
    FormInput,
    Settings,
    ShowerHeadIcon,
    Table,
} from "lucide-react"
const Form = lazy(() =>
  import("./form/page").then((module) => ({ default: module.default }))
)
const Chart = lazy(() =>
  import("./charts/page").then((module) => ({ default: module.default }))
)

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
              url: "/form",
              showIf: () => {
                return true
              },
            },
            {
              id: "charts",
              title: "Charts",
              icon: ChartScatter,
              component: Chart,
              url: "/charts",
              isProtected: true,
              showIf() {
                return false
              },
            },
            {
              id: "table",
              title: "Table",
              url: "/table",
              component: lazy(() =>
                import("./table/page").then((module) => ({ default: module.default }))
              ),
              icon: Table,
            },
          ],
        },
        {
          id: "settings",
          title: "Settings",
          icon: Settings,
          url: "/settings",
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
          url: "/terms",
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
