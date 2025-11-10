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
      main: true,
      variant: "text",
      // text_size: "large",
      sortable: true,
      value_type: undefined,
      icon: Newspaper,
      isHide: false,
      // is_longtext: true,
      // on_click_id: "view_todo",
    },
  },
  {
    field: "completed",
    header: "Completed",
    options: {
      index: 2,
      variant: "multiSelect",
      isHide: false,
      sortable: true,
      values: [
        {
          label: "completed",
          value: true,
        },
        {
          label: "Pending",
          value: false,
        },
      ],
      icons: [
        {
          value: true,
          icon: "a-arrow-down",
        },
        {
          value: false,
          icon: "airplay",
        },
      ],
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
  {
    field: "email",
    header: "Email",
    options:{
      index:4,
      variant:"text",
      isHide:false,
      text_size:"medium",
    }
  },
  {
    field: "name",
    header: "Name",
    options:{
      index:5,
      variant:"text",
      isHide:false,
      text_size:"medium",
    }
  }
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
