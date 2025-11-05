import type { ColumnConfig } from "@/components/master-table/get-columns"
import { CheckCheck, LampCeilingIcon, Newspaper } from "lucide-react"

// JSON-based column configuration for the table
// Supports features like: isHide, is_switch, CircleCheckBig icon, sorting, etc.

export const columnConfig: ColumnConfig[] = [
  {
    field: "id",
    header: "ID",
    options: {
      variant: "number",
      index: 0,
      sortable: true,
      isHide: false, // Set to true to hide this column
      text_size: "small",
    },
  },
  {
    field: "todo",
    header: "Todo",
    options: {
      index: 1,
      variant: "text",
      text_size: "large",
      icon: Newspaper ,
      isHide: false,
      is_longtext: true,
      // on_click_id: "view_todo",
    },
  },
  {
    field: "completed",
    header: "Status",
    options: {
      index: 2,
      sortable: true,
      variant: "multiSelect",
      values: [
        { label: "Completed", value: true },
        { label: "Pending", value: false },
      ],
      icons:[
        {
            value: true,
            icon: CheckCheck,
        },
        {
            value: false,
            icon: LampCeilingIcon,

        }
      ],
      // isHide: true,
      // is_switch: true, // Renders as switch with CircleCheckBig icon when checked
      // switch_value: true, // Value that represents "checked" state
      on_change_id: "toggle_completed", // Triggers when switch changes
    },
  },
  {
    field: "userId",
    header: "User ID",
    options: {
      index: 3,
      variant: "number",
      isHide: false,
      hideable: false,
      text_size: "large",
    },
  },
  // Example of a hidden column
  // Uncomment to see how isHide works
  // {
  //   field: 'secretField',
  //   header: 'Secret',
  //   options: {
  //     index: 4,
  //     variant: 'text',
  //     sortable: false,
  //     isHide: true, // This column will not be displayed
  //   },
  // },
]

export default columnConfig
