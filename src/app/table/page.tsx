'use client'
import DynamicMaster from '@/components/master-table/master-table'
import datatableConfig from './table_config'
import { exampleFormConfig } from './form_config'
import { useEffect, useRef, useState } from 'react'
import {
  setActionClickHandler,
  setButtonClickHandler,
  setCheckedClickHandler,
  setFormFieldOnChangeHandler,
  setTableActionHandler,
  setupMasterPageHandlersAuto,
  updateFormFieldConfig,
} from '@/lib/utils'
import type { FormContextType } from '@/components/form/FormContext'
import columnConfig from './column_config'
import { todos } from '../custom-table/data'

interface Todos {
  id: number
  todo: string
  completed: boolean
  userId: number
}

const TableExample = () => {
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
          data.filter((item) =>
            rows.selectedIds.every((r: any) => r !== item.id)
          )
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
  const ref = useRef<FormContextType>(null)
  return (
    <>
      <DynamicMaster<Todos>
        data={todos}
        datatableConfig={{
          ...datatableConfig,
          columnsConfig: columnConfig ,
        }}
        sheetOpen={sheetOpen}
        onSheetOpenChange={setSheetOpen}
        onClickAddItem={() => {
          setDefaultFormValues(undefined)
        }}>
        {/* <DynamicForm
          ref={ref}
          formConfig={config}
          schema={formSchema}
          onSubmit={(formData) => {
            console.log('Form submitted:', formData)
          }}
          defaultValues={defaultFormValues}
          showResetButton
          className="w-full"
        /> */}
        sdf
      </DynamicMaster>
    </>
  )
}

export default TableExample
