import { Award, Delete, Download } from "lucide-react"

export const actionConfig = [
  {
    action: "download",
    is_direct_action: true,
    icon: Download,
    tooltip: "Export Data",
    is_export: true,
    onClick: (data: any) => {
      console.log("Exporting data...", data)
    },
  },
  {
    action: "delete",
    is_direct_action: true,
    icon: Delete,
    tooltip: "Delete selected data",
    onClick: (action: string, value: any, row: any) => {
      console.log("Exporting data...", action, value, row)
    },
  },
  {
    action: "change_is_active",
    is_direct_action: false,
    icon: Award,
    tooltip: "Change Active Status",
    is_field_change: true,
    field: "is_active",
    api: "some/api",
    values: [
      {
        key: true,
        value: "Yes",
        onClick: (data: any) => {
          console.log(data)
        },
      },
      {
        key: false,
        value: "No",
      },
    ],
  },
]

// export const columnActions = [
//   {
//     title: "Edit",
//     type: "edit",
//   },
//   {
//     title: "View",
//     type: "view",
//   },
// ]

const addItemData = {
  title: "Add Activity",
}

export const tableConfig = {
  selectAll: true,
  actionColumn: false,
}

const datatableConfig = {
  actionConfig,
  columnActions: [],
  addItemData,
  tableConfig,
}

export default datatableConfig
