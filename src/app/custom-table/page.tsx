'use client'

import type { ColumnConfig } from '@/components/master-table/get-columns'
import DynamicMaster from '@/components/master-table/master-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TabWrapper, type TabItem } from '@/components/ui/tab-wrapper'
import { useEffect, useMemo, useState } from 'react'
import { ChartBuilderSheet } from '../custom-chart/ChartBuilderSheet'
import datatableConfig from '../table/table_config'
import { callApi } from './api'
import { CardBuilder } from './card-builder/CardBuilder'
import { generateColumnConfig } from './generateColumnConfig'
import { SortableColumnConfigTable } from './sortable-column-config-table'

export default function ColumnConfigPage() {
  const [url, setUrl] = useState('')
  const [api, setapi] = useState(false)
  const { data: apiResponse } = callApi(url, api)
  const columnConfig: ColumnConfig[] = useMemo(() => {
    return generateColumnConfig(apiResponse?.data)
  }, [apiResponse])
  const [columns, setColumns] = useState(columnConfig)

  useEffect(() => {
    setColumns(columnConfig)
  }, [columnConfig])

  const availableFields = useMemo(() => {
    if (!apiResponse?.data || apiResponse.data.length === 0) return []
    return Object.keys(apiResponse?.data[0])
  }, [apiResponse])

  const tabs: TabItem[] = useMemo(
    () => [
      {
        name: 'Configuration',
        value: 'configuration',
        content: (
          <div className="space-y-6">
            <SortableColumnConfigTable
              key={columns.map((e) => e.field).join('')}
              columns={columns}
              onColumnsChange={setColumns}
            />
          </div>
        ),
      },
      {
        name: 'Preview',
        value: 'preview',
        content: (
          <>
            <CardBuilder
              data={apiResponse?.data}
              availableFields={availableFields}
              columnConfig={columns}
              sp={false}
            />
            <ChartBuilderSheet
              data={apiResponse?.data}
              columns={columns}
              onSave={(config) => {
                console.log('Chart Configuration:', config)
              }}
            />
            <DynamicMaster<any>
              data={apiResponse?.data}
              datatableConfig={{
                ...datatableConfig,
                columnsConfig: columns,
              }}
            />
          </>
        ),
      },
    ],
    [columns, apiResponse?.data, availableFields]
  )

  return (
    <div className="space-y-6 p-6 h-screen overflow-y-scroll">
      <div className="space-y-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL to fetch data"
        />
        <Button
          onClick={() => {
            // Trigger data fetch
            setapi(true)
            setUrl(url)
          }}>
          Fetch data
        </Button>
      </div>

      <TabWrapper
        tabs={tabs}
        defaultValue="configuration"
      />
    </div>
  )
}
