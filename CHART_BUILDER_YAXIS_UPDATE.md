# ChartBuilder Y-Axis Multiple Fields Update

## Overview
Updated the ChartBuilder component to support **multiple Y-axis fields** with individual operation selection for each field, similar to the CardForm configuration.

## Key Changes

### 1. Multiple Y-Axis Fields (No Splitting Mode)
- Changed from single Y-axis field to **multi-select** for selecting multiple fields
- Each selected field gets its own **operation selector** (Sum, Average, Count, Min, Max, Unique Count)
- Operations are filtered based on field type/variant (similar to CardForm)

### 2. Enhanced Series Configuration (Split Mode)
- Added **operation selector** for each series
- Operations dynamically filtered based on selected field type
- Auto-resets operation when field changes to first available operation

### 3. Smart Operation Selection
- Operations are contextual based on field variant:
  - **Number/Range fields**: count, sum, avg, min, max, uniqueCount
  - **Text fields**: count, uniqueCount
  - **Date fields**: count, min, max, uniqueCount
  - **Boolean/Select**: count, uniqueCount

### 4. Enhanced Aggregation Logic
Both modes now support all operations with proper calculations:
- **Sum**: Adds all values
- **Average**: Calculates mean value
- **Min/Max**: Finds minimum/maximum values
- **Count**: Counts all rows
- **Unique Count**: Counts distinct values

## UI Changes

### No Splitting Mode
```tsx
// Before: Single Y-axis field dropdown
<Select value={yAxisField} onValueChange={setYAxisField}>
  <SelectValue placeholder="Select Y-axis field" />
</Select>

// After: Multi-select with operation selectors
<MultiSelect values={yAxisFields} onValuesChange={setYAxisFields}>
  <MultiSelectValue placeholder="Select Y-axis fields" />
</MultiSelect>

// For each selected field:
<div className="flex items-center gap-2">
  <Label>{field}</Label>
  <Select value={operation} onValueChange={...}>
    {/* Available operations based on field type */}
  </Select>
</div>
```

### Split Mode
```tsx
// Added operation selector between Field and Series Label
<div>
  <Label>Field</Label>
  <Select value={series.field} />
</div>

<div>
  <Label>Operation</Label>  // NEW
  <Select value={series.operation}>
    {/* Operations filtered by field type */}
  </Select>
</div>

<div>
  <Label>Series Label</Label>
  <Input value={series.label} />
</div>
```

## Data Structure Updates

### YAxisFieldConfig (New Interface)
```typescript
interface YAxisFieldConfig {
  field: string
  operation: CardOperation  // 'sum' | 'avg' | 'count' | 'min' | 'max' | 'uniqueCount'
}
```

### SeriesConfig (Updated)
```typescript
interface SeriesConfig {
  id: string
  field: string
  operation: CardOperation  // NEW: Added operation support
  label: string
  filters: ExtendedColumnFilter<any>[]
  joinOperator: JoinOperator
}
```

## Aggregation Example

### Input Data
```typescript
[
  { region: 'US', revenue: 1000, orders: 10 },
  { region: 'US', revenue: 1500, orders: 15 },
  { region: 'EU', revenue: 2000, orders: 20 }
]
```

### Configuration
- X-Axis: `region`
- Y-Axis Fields:
  - `revenue` with operation `sum`
  - `orders` with operation `avg`

### Output Data
```typescript
[
  {
    region: 'US',
    'revenue (Sum)': 2500,      // 1000 + 1500
    'orders (Average)': 12.5     // (10 + 15) / 2
  },
  {
    region: 'EU',
    'revenue (Sum)': 2000,
    'orders (Average)': 20
  }
]
```

### Chart Config
```typescript
{
  'revenue (Sum)': { label: 'revenue (Sum)' },
  'orders (Average)': { label: 'orders (Average)' }
}
```

## Benefits

1. **Flexibility**: Users can compare multiple metrics with different operations in a single chart
2. **Type Safety**: Operations are filtered based on field type to prevent invalid selections
3. **Consistency**: Uses the same operation system as CardForm for familiar UX
4. **Rich Analysis**: Supports complex aggregations like "Sum of Revenue vs Average Orders vs Unique Customers"

## Usage Example

```tsx
<ChartBuilder 
  data={salesData} 
  columns={columnConfig}
  onSave={(config) => {
    console.log(config.yAxisKeys)
    // ['revenue (Sum)', 'orders (Average)', 'customers (Unique Count)']
  }}
/>
```

### User Workflow
1. Enter chart title
2. Add global filters (optional)
3. Select X-axis field (e.g., 'date')
4. Choose **No Splitting** mode
5. Select multiple Y-axis fields (e.g., 'revenue', 'orders')
6. For each field, choose an operation:
   - revenue → Sum
   - orders → Average
7. Preview chart shows both series with correct aggregations
8. Save configuration

## Migration Notes

### Breaking Changes
- `yAxisField` (string) replaced with `yAxisFields` (string[]) and `yAxisFieldConfigs` (YAxisFieldConfig[])
- `SeriesConfig` now requires `operation` property

### Backward Compatibility
- Existing charts using split mode will need to add operation to series configs
- Default operation is 'sum' for new series

## Technical Implementation

### Key Functions

**getAvailableOperations(fieldName: string)**
- Retrieves field variant from column config
- Returns appropriate operations for that variant type

**Aggregation Pipeline**
1. Group data by X-axis value
2. For each group, maintain statistics (sum, count, min, max, unique values)
3. After grouping, calculate final value based on operation type
4. Return flattened array with computed values

### State Management
```typescript
const [yAxisFields, setYAxisFields] = useState<string[]>([])
const [yAxisFieldConfigs, setYAxisFieldConfigs] = useState<YAxisFieldConfig[]>([])

// Auto-sync configs when fields change
useMemo(() => {
  const newConfigs = yAxisFields.map(field => ({
    field,
    operation: getAvailableOperations(field)[0] || 'count'
  }))
  setYAxisFieldConfigs(newConfigs)
}, [yAxisFields])
```

## Future Enhancements

- [ ] Custom labels for each Y-axis field (override auto-generated label)
- [ ] Support for calculated fields (e.g., revenue / orders = average order value)
- [ ] Color customization for each Y-axis series
- [ ] Save/load preset configurations
- [ ] Export aggregated data to CSV/Excel
