'use client'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import type { Column, ColumnDef } from '@tanstack/react-table'
import { TouchpadOff } from 'lucide-react'
import { todos } from './data'
import DynamicMaster from '@/components/master-table/master-table'
import datatableConfig from './table_config'
import { exampleFormConfig, formSchema } from './form_config'
import { useEffect, useState } from 'react'
import {
  setActionClickHandler,
  setButtonClickHandler,
  setCheckedClickHandler,
  setFormFieldOnChangeHandler,
  setTableActionHandler,
  setupMasterPageHandlersAuto,
  updateFormFieldConfig,
} from '@/lib/utils'

interface Todos {
  id: number
  todo: string
  completed: boolean
  userId: number
}

const TableExample = () => {
  const columns: ColumnDef<Todos>[] = [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      enableColumnFilter: true,
      meta: {
        label: 'ID',
        placeholder: 'Enter ID...',
        variant: 'number',
      },
    },
    {
      accessorKey: 'todo',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="Todo"
        />
      ),
      enableColumnFilter: true,
      filterFn: 'includesString',
      meta: {
        label: 'Todo',
        placeholder: 'Search todos...',
        variant: 'text',
        icon: TouchpadOff,
      },
    },
    {
      accessorKey: 'completed',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="Completed"
        />
      ),
      size: 100,
      enableColumnFilter: true,
      filterFn: 'equals',
      cell: ({ getValue }) => (
        <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
          {getValue<boolean>() ? 'Yes' : 'No'}
        </Badge>
      ),
      meta: {
        label: 'Status',
        variant: 'select',
        options: [
          { value: 'true', label: 'Completed' },
          { value: 'false', label: 'Pending' },
        ],
      },
    },
    {
      accessorKey: 'userId',
      accessorFn: (row) => row.userId,
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="User ID"
        />
      ),
      size: 100,
      enableColumnFilter: true,
      filterFn: 'equals',
      meta: {
        label: 'User ID',
        placeholder: 'Enter user ID...',
        variant: 'number',
      },
    },
  ]
  console.log(columns)

  const [config, setConfig] = useState(exampleFormConfig)

  useEffect(() => {
    setButtonClickHandler((id, isValid, values, form) => {
      console.log('🔁 GLOBAL handler')
      console.log({ id, isValid, values, form })
      if (id === 'submit') {
        // Do submission
      }
    })
  }, [])

  useEffect(() => {
    setTableActionHandler((actionId, value, row) => {
      debugger
    })
  }, [])

  useEffect(() => {
    setupMasterPageHandlersAuto(config, setConfig, (values) => {
      console.log('Custom submit logic:', values)
      // Add any custom submission logic here (API calls, etc.)
    })
  }, [])

  useEffect(() => {
    setActionClickHandler((action, row) => {
      debugger
      if (action == 'edit') {
        setDefaultFormValues({
          ...row,
          edit: true,
        })
        console.log(defaultFormValues)
        setSheetOpen(true)
      }
    })
  }, [])

  useEffect(() => {
    setCheckedClickHandler((action, value, rows) => {
      debugger
      if (action === 'change_is_active') {
        setData((data) =>
          data.map((item) => {
            if (rows.some((r: any) => r.id === item.id)) {
              return { ...item, completed: value }
            }
            return item
          })
        )
        console.log(data)
        return
      }
      if (action === 'delete') {
        setData((data) =>
          data.filter((item) => rows.every((r: any) => r.id !== item.id))
        )
        console.log(data)
      }
      debugger
    })
  }, [])
  const [data, setData] = useState<Todos[]>(todos)

  useEffect(() => {
    setFormFieldOnChangeHandler((field, value, form_value) => {
      debugger
      updateFormFieldConfig

      if (field === 'is_active' && value === false) {
        const updated = updateFormFieldConfig(
          config,
          'main',
          'milestone_sequence',
          {
            disabled: true,
            description:
              '** Please active the header for Add/Edit the sequences',
          }
        )
        setConfig(updated)
      } else if (field === 'is_active' && value === true) {
        const updated = updateFormFieldConfig(
          config,
          'main',
          'milestone_sequence',
          {
            disabled: false,
            description: null,
          }
        )
        setConfig(updated)
      }

      if (field === 'is_sequence_active' && value === false) {
        const updated = updateFormFieldConfig(
          config,
          'milestone_sequence',
          'mandatory',
          {
            disabled: true,
            config: { hint: 'Please active the field to modify this' },
          }
        )
        setConfig(updated)
      } else if (field === 'is_sequence_active' && value === true) {
        const updated = updateFormFieldConfig(
          config,
          'milestone_sequence',
          'mandatory',
          { disabled: false, config: { hint: null } }
        )
        setConfig(updated)
      }
    })
  }, [config])

  const [sheetOpen, setSheetOpen] = useState(false)
  const [defaultFormValues, setDefaultFormValues] = useState<any>()
  return (
    <>
      <DynamicMaster<Todos>
        data={data}
        datatableConfig={{
          ...datatableConfig,
          columnsConfig: columns,
        }}
        formConfig={exampleFormConfig}
        formSchema={formSchema}
        sheetOpen={sheetOpen}
        onSheetOpenChange={setSheetOpen}
        defaultFormValues={defaultFormValues}
        // onFormConfigChange={(config) =>
        // addItem={add}
        // ref={}
      />
    </>
  )
}

export default TableExample
