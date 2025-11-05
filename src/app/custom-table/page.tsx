'use client'

import { useState } from 'react'
import { SortableColumnConfigTable } from './sortable-column-config-table'
import { columnConfig } from './column-config-data'

export default function ColumnConfigPage() {
  const [columns, setColumns] = useState(columnConfig)

  return (
    <div className="space-y-6 p-6 w-full h-full overflow-scroll">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Column Configuration
        </h1>
        <p className="mt-2 text-gray-600">
          Drag and drop to reorder columns. Edit their properties using the
          inputs and selects below.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <SortableColumnConfigTable
          columns={columns}
          onColumnsChange={setColumns}
        />
      </div>

      <div className="rounded-lg border bg-slate-50 p-4">
        <h2 className="mb-4 font-semibold">Current Configuration</h2>
        <pre className="overflow-auto rounded p-4 text-xs">
          {JSON.stringify(columns, null, 2)}
        </pre>
      </div>
    </div>
  )
}
