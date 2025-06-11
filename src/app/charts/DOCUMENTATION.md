# DynamicChart Component Documentation

The `DynamicChart` component is a highly customizable and reusable chart component for Next.js applications. It leverages the Recharts library to create beautiful, responsive data visualizations with minimal code.

## Features

- **Multiple Chart Types**: Support for area, line, bar, and pie charts
- **Dynamic Data Handling**: Accepts any data structure with dynamic key mapping
- **Theme Integration**: Light and dark mode compatibility with customizable colors
- **Responsive Design**: Adapts to different screen sizes and containers
- **Rich Customization**: Control over titles, descriptions, tooltips, legends, axes, and more
- **Interactive Elements**: Built-in tooltips, legends, and hover states
- **Data Loading States**: Support for loading and error handling with API data

## Basic Usage

```tsx
import { DynamicChart } from '@/components/DynamicChart';

// Sample data
const data = [
  { month: 'Jan', sales: 100, profit: 50 },
  { month: 'Feb', sales: 200, profit: 90 },
  { month: 'Mar', sales: 150, profit: 70 },
  // ...more data
];

// Basic usage
export default function ChartExample() {
  return (
    <DynamicChart
      title="Monthly Performance"
      description="Sales and profit trends by month"
      chartType="area"
      data={data}
      xAxisKey="month"
      yAxisKeys={['sales', 'profit']}
    />
  );
}
```

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | ReactNode | - | Chart title displayed in the card header |
| `description` | ReactNode | - | Chart description displayed under the title |
| `footer` | ReactNode | - | Content to display in the card footer |
| `chartType` | 'area' \| 'line' \| 'bar' \| 'pie' | 'area' | Type of chart to render |
| `data` | ChartDataPoint[] | [] | Array of data points to visualize |
| `config` | ChartConfig | defaultConfig | Configuration for styling and labels |
| `xAxisKey` | string | 'name' | Key to use for x-axis values |
| `yAxisKeys` | string[] | ['value'] | Keys to use for y-axis values |
| `height` | number \| string | 300 | Height of the chart container |
| `width` | number \| string | '100%' | Width of the chart container |

### Customization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showGrid` | boolean | true | Whether to display grid lines |
| `showTooltip` | boolean | true | Whether to show tooltips on hover |
| `showLegend` | boolean | true | Whether to display the legend |
| `tooltipFormatter` | Function | - | Custom formatter for tooltip values |
| `tooltipLabelFormatter` | Function | - | Custom formatter for tooltip labels |
| `legendPosition` | 'top' \| 'bottom' | 'bottom' | Position of the legend |
| `className` | string | - | Additional class name for the card |
| `chartProps` | object | {} | Additional props for the specific chart type |
| `classNames` | object | {} | Custom class names for different chart elements |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `xAxis` | object | - | Configuration for x-axis (hide, label, tickCount, etc.) |
| `yAxis` | object | - | Configuration for y-axis (hide, label, domain, etc.) |
| `grid` | object | - | Configuration for grid (horizontal, vertical, strokeDasharray) |
| `backgroundColor` | string | - | Background color for the chart area |
| `stacked` | boolean | false | Whether to stack values (for area and bar charts) |
| `referenceLines` | array | [] | Reference lines to add to the chart |
| `fallback` | ReactNode | - | Component to display when data is empty |

## Configuration

The `config` prop accepts a `ChartConfig` object that allows you to customize the appearance of each data series:

```tsx
const customConfig = {
  sales: {
    label: 'Total Sales', // Label to display in tooltips and legend
    theme: {
      light: '#0ea5e9', // Color in light mode
      dark: '#38bdf8'    // Color in dark mode
    }
  },
  profit: {
    label: 'Net Profit',
    theme: {
      light: '#10b981',
      dark: '#34d399'
    }
  }
};
```

## Examples

### Area Chart with Custom Footer

```tsx
<DynamicChart
  title="Sales Performance"
  description="Monthly sales figures for the current year"
  chartType="area"
  data={salesData}
  xAxisKey="month"
  yAxisKeys={['revenue']}
  footer={
    <div className="flex justify-between w-full">
      <span>Last updated: {new Date().toLocaleDateString()}</span>
      <span>Source: Sales API</span>
    </div>
  }
/>
```

### Bar Chart with Custom Colors

```tsx
<DynamicChart
  title="Quarterly Results"
  description="Revenue by product category"
  chartType="bar"
  data={quarterlyData}
  xAxisKey="quarter"
  yAxisKeys={['product1', 'product2', 'product3']}
  config={{
    product1: {
      label: 'Hardware',
      theme: { light: '#f97316', dark: '#fb923c' }
    },
    product2: {
      label: 'Software',
      theme: { light: '#8b5cf6', dark: '#a78bfa' }
    },
    product3: {
      label: 'Services',
      theme: { light: '#ec4899', dark: '#f472b6' }
    }
  }}
/>
```

### Pie Chart for Distribution

```tsx
<DynamicChart
  title="Market Share"
  description="Distribution by region"
  chartType="pie"
  data={marketShareData}
  xAxisKey="region"
  yAxisKeys={['share']}
  height={400}
  chartProps={{
    innerRadius: 60,
    paddingAngle: 5,
    label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
  }}
/>
```

### Dynamic Data from API with Loading State

```tsx
function ApiChartExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/chart-data');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error) {
    return <div className="text-red-500">Error loading chart data: {error}</div>;
  }

  return (
    <DynamicChart
      title="API Data Visualization"
      chartType="line"
      data={data}
      xAxisKey="date"
      yAxisKeys={['value1', 'value2']}
    />
  );
}
```

## Best Practices

1. **Data Preparation**: Ensure your data is well-formatted before passing it to the chart
2. **Responsive Design**: Use percentage or viewport units for width when possible
3. **Color Accessibility**: Choose colors with sufficient contrast
4. **Mobile Optimization**: Consider hiding certain elements on small screens
5. **Error Handling**: Always provide fallbacks for empty or loading states
6. **Performance**: For large datasets, consider using memoization or pagination

## Advanced Customization

For even more customization options, you can use the `chartProps` prop to pass specific properties to the underlying Recharts components:

```tsx
<DynamicChart
  chartType="area"
  data={data}
  chartProps={{
    margin: { top: 20, right: 30, left: 0, bottom: 0 },
    data1: { strokeWidth: 3, activeDot: { r: 8 } },
    data2: { strokeDasharray: '3 3' }
  }}
/>
```

This comprehensive component allows you to create beautiful, interactive charts with minimal code while maintaining full flexibility for advanced use cases.
