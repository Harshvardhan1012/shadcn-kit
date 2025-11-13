'use client'

import type { ColumnConfig } from '@/components/master-table/get-columns'
import DynamicMaster from '@/components/master-table/master-table'
import { Input } from '@/components/ui/input'
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

  return (
    <div className="space-y-6 p-6 h-screen overflow-y-scroll">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL to fetch data"
      />
      <button
        onClick={() => {
          // Trigger data fetch
          setapi(true)
          setUrl(url)
        }}>
        Fetch data
      </button>

      <SortableColumnConfigTable
        key={columns.map((e) => e.field).join('')}
        columns={columns}
        onColumnsChange={setColumns}
      />
      <CardBuilder
        data={apiResponse?.data}
        availableFields={availableFields}
        columnConfig={columns}
      />
      <ChartBuilderSheet
        data={apiResponse?.data}
        columns={columns}
        onSave={(config) => {
          console.log('Chart Configuration:', config)
        }}
      />

      {apiResponse?.data && (
        <DynamicMaster<any>
          data={apiResponse.data}
          datatableConfig={{
            ...datatableConfig,
            columnsConfig: columns,
          }}></DynamicMaster>
      )}

      <div className="rounded-lg border bg-slate-50 p-4">
        <h2 className="mb-4 font-semibold">Current Configuration</h2>
        <pre className="overflow-auto rounded p-4 text-xs">
          {JSON.stringify(columns, null, 2)}
        </pre>
      </div>
    </div>
  )
}
