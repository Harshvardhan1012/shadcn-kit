# Chart Builder

A powerful, interactive chart builder component that allows users to create custom charts with global filters and series-specific filtering capabilities.

## Features

### 1. **Chart Configuration**
- Set a custom chart title
- Choose chart type (bar, line, area, pie, donut, table)
- Preview charts in real-time

### 2. **Global Filters**
- Apply filters that affect all data before aggregation
- Uses the same DataTableFilterList component for consistency
- Support for AND/OR join operators
- Multiple filter types: text, number, date, multiSelect, etc.

### 3. **X-Axis Selection**
- Choose any field from your dataset as the X-axis
- Data is automatically grouped by this field

### 4. **Two Operating Modes**

#### **No Splitting Mode**
- Simple aggregation with a single Y-axis field
- Sum all values for each X-axis group
- Perfect for straightforward charts

#### **Split by Series Mode**
- Create multiple series with independent filters
- Each series can:
  - Target a different field
  - Have a custom label
  - Apply its own filters (in addition to global filters)
  - Use AND/OR join operators
- Perfect for complex comparisons

## Output Format

The Chart Builder generates a configuration object in this exact format:

```typescript
{
  "chartKey": "unique-chart-id",
  "title": "Your Chart Title",
  "data": [
    {
      "xAxisValue": "value1",
      "Series1Label": 100,
      "Series2Label": 200
    }
  ],
  "config": {
    "Series1Label": {
      "label": "Series 1"
    },
    "Series2Label": {
      "label": "Series 2"
    }
  },
  "xAxisKey": "fieldName",
  "yAxisKeys": ["Series1Label", "Series2Label"]
}
```

## Usage Example

```tsx
import { ChartBuilder } from './ChartBuilder'

const data = [
  {
    subnet: '10.6.x.x',
    StaticIPCount: 5867,
    DhcpActiveIPCount: 11906,
    region: 'US'
  },
  // ... more data
]

const columns = [
  {
    field: 'subnet',
    header: 'Subnet',
    options: { variant: 'text', index: 0 }
  },
  {
    field: 'StaticIPCount',
    header: 'Static IP',
    options: { variant: 'number', index: 1 }
  },
  // ... more columns
]

function MyPage() {
  const handleSave = (config) => {
    console.log('Chart config:', config)
    // Save to backend, update state, etc.
  }

  return (
    <ChartBuilder
      data={data}
      columns={columns}
      onSave={handleSave}
    />
  )
}
```

## How It Works

### Data Processing Pipeline

1. **Global Filtering**: Apply global filters to the entire dataset
2. **Series Filtering**: For each series, apply additional filters
3. **Grouping**: Group data by X-axis field
4. **Aggregation**: Sum values for each group
5. **Flattening**: Create flat data structure with all series as columns

### Example Workflow

#### Creating a Multi-Series Chart

1. **Set Chart Title**: "Top 10 Most Utilized Subnets"

2. **Add Global Filters**:
   - Filter: `region` `equals` `US` (to show only US subnets)

3. **Select X-Axis**: Choose `subnet`

4. **Choose Split Mode**: Select "Split by Series"

5. **Add Series**:
   
   **Series 1:**
   - Field: `StaticIPCount`
   - Label: "Static IPv4"
   - Filters: (none - uses all data)
   
   **Series 2:**
   - Field: `DhcpActiveIPCount`
   - Label: "DHCP IPv4"
   - Filters: (none - uses all data)
   
   **Series 3:**
   - Field: `TotalActiveIPCount`
   - Label: "Total Active IPv4"
   - Filters: (none - uses all data)

6. **Preview**: See the chart update in real-time

7. **Save**: Click save to get the configuration object

### Result

The output will have:
- Flattened data with `subnet` as X-axis
- Three Y-axis series: "Static IPv4", "DHCP IPv4", "Total Active IPv4"
- Data filtered to US region only (from global filter)
- Each data point aggregated by subnet

## Components Used

- **DataTableFilterList**: For both global and series-specific filters
- **DynamicChart**: For live preview and visualization
- **UI Components**: Cards, Inputs, Selects, Buttons from shadcn/ui

## Filter Operators Supported

### Text Filters
- `iLike`: Contains (case-insensitive)
- `notILike`: Not contains
- `eq`: Equals
- `ne`: Not equals
- `isEmpty`: Is empty
- `isNotEmpty`: Is not empty

### Number Filters
- `eq`: Equals
- `ne`: Not equals
- `lt`: Less than
- `lte`: Less than or equal
- `gt`: Greater than
- `gte`: Greater than or equal

### Array Filters
- `inArray`: Is any of
- `notInArray`: Is not any of

## Tips

1. **Use Global Filters** for broad data filtering (e.g., date ranges, regions)
2. **Use Series Filters** for comparing subsets (e.g., "Active vs Inactive")
3. **Preview Often** to see how your configuration affects the chart
4. **Label Series Clearly** for better chart readability
5. **Start Simple** with no splitting, then add complexity as needed

## Integration with DynamicChart

The output configuration is designed to work directly with the `DynamicChart` component:

```tsx
<DynamicChart
  chartKey={config.chartKey}
  title={config.title}
  data={config.data}
  config={config.config}
  xAxisKey={config.xAxisKey}
  yAxisKeys={config.yAxisKeys}
  chartType="bar"
/>
```

## Advanced: Filter URL Generation

You can extend the output to include filter URLs for drill-down functionality:

```typescript
const generateFilterUrl = (xValue: string) => {
  const filter = {
    id: xAxisField,
    value: xValue,
    variant: 'text',
    operator: 'iLike',
    filterId: generateId({ length: 8 })
  }
  const encoded = encodeURIComponent(JSON.stringify([filter]))
  return `/your-page?filters=${encoded}`
}

// Add to each data point:
data.forEach(point => {
  point.filterUrl = generateFilterUrl(point[xAxisKey])
})
```
