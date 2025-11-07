# Card Builder Component

A flexible, drag-and-drop card building system for creating custom summary cards with real-time calculations, filtering, and persistent storage.

## Features

### ✨ Core Capabilities

- **Drag & Drop Interface**: Reorder cards using the Sortable UI with visual feedback
- **Multiple Operations**: count, sum, avg, min, max, uniqueCount
- **Custom Filtering**: Apply per-card filters with multiple operators
- **Color Coding**: 8 predefined colors for visual organization
- **Persistent Storage**: Cards are saved to localStorage and survive page refreshes
- **Real-time Calculations**: Card values update based on table data and filters
- **Edit & Delete**: Hover to access edit/delete actions

### 🎨 Supported Operations

- **Count**: Total number of non-null values
- **Sum**: Total of numeric values
- **Average**: Mean of numeric values (rounded to 2 decimals)
- **Minimum**: Smallest numeric value
- **Maximum**: Largest numeric value
- **Unique Count**: Number of distinct values

### 🔧 Filtering Operators

- **eq**: Exact match
- **iLike**: Case-insensitive contains
- **gt**: Greater than
- **lt**: Less than
- **gte**: Greater than or equal
- **lte**: Less than or equal

## Component Structure

```
card-builder/
├── CardBuilder.tsx              # Main component with form management
├── CardForm.tsx                 # Form for creating/editing cards
├── CardGrid.tsx                 # Draggable grid display with Sortable
├── CardFilterComponents.tsx      # Filter creation and list components
├── cardUtils.ts                 # Calculation and utility functions
├── useCardStorage.ts            # Hook for localStorage management
├── types.ts                     # TypeScript interfaces
└── index.ts                     # Barrel export
```

## Usage

### Basic Integration

```tsx
import { CardBuilder } from '@/app/custom-table/card-builder'

export function MyComponent() {
  const [data, setData] = useState([])
  const availableFields = Object.keys(data[0] || {})

  return (
    <CardBuilder 
      data={data} 
      availableFields={availableFields}
    />
  )
}
```

### With API Data

```tsx
const { data: apiResponse } = callApi(url, api)

const availableFields = useMemo(() => {
  if (!apiResponse?.data || apiResponse.data.length === 0) return []
  return Object.keys(apiResponse.data[0])
}, [apiResponse])

return (
  <CardBuilder
    data={apiResponse?.data || []}
    availableFields={availableFields}
  />
)
```

## Type Definitions

```typescript
// Card interface
interface Card {
  id: string
  title: string
  field: string
  operation: CardOperation
  color: string
  filters?: CardFilter[]
  order?: number
}

// Filter interface
interface CardFilter {
  field: string
  operator: 'eq' | 'iLike' | 'gt' | 'lt' | 'gte' | 'lte'
  value: string | number
}

// Available operations
type CardOperation = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'uniqueCount'
```

## Storage

Cards are automatically persisted to localStorage under the key `custom_table_cards`. Each card includes:
- Unique ID (timestamp-based)
- Title and configuration
- Associated filters
- Display order

### Retrieving Stored Cards

```typescript
const stored = localStorage.getItem('custom_table_cards')
const cards = stored ? JSON.parse(stored) : []
```

## Customization

### Available Colors

8 predefined colors are available:
- Red (#ef4444)
- Orange (#f97316)
- Yellow (#eab308)
- Green (#22c55e)
- Blue (#3b82f6)
- Purple (#a855f7)
- Pink (#ec4899)
- Slate (#64748b)

### Custom Operations

To add custom operations, extend `cardUtils.ts`:

```typescript
export function calculateCardValue(
  data: Record<string, any>[],
  card: Card
): string | number {
  // Add your custom operation here
  switch (card.operation) {
    case 'customOp':
      return data.length * 2 // Example
    // ...
  }
}
```

## Sheet Integration

The card form opens in a sheet (side panel) for a clean UI:

```tsx
<Sheet open={showForm} onOpenChange={setShowForm}>
  <SheetContent className="overflow-y-auto">
    <CardForm
      availableFields={availableFields}
      onSave={handleSave}
      onCancel={() => setShowForm(false)}
      initialCard={editingCard}
    />
  </SheetContent>
</Sheet>
```

## Drag and Drop

Cards are reorderable using the dnd-kit library. The drag handle appears automatically, and the overlay preview shows during dragging.

```tsx
<Sortable
  value={cards}
  onValueChange={onReorder}
  orientation="vertical"
  getItemValue={(card) => card.id}
>
  {/* SortableContent and SortableItem components */}
</Sortable>
```

## API Integration

Cards automatically recalculate when:
1. Table data changes
2. Applied filters change
3. Card-specific filters are modified

No additional configuration needed - calculations happen reactively.

## Examples

### Create a Card for Total Orders
1. Click "Add Card"
2. Title: "Total Orders"
3. Field: "orderId"
4. Operation: "Count"
5. Color: Green
6. No filters needed

### Create a Card for High-Value Orders
1. Click "Add Card"
2. Title: "Orders Over $1000"
3. Field: "orderId"
4. Operation: "Count"
5. Add filter: `amount` `gte` `1000`

### Create a Card for Average Order Value
1. Click "Add Card"
2. Title: "Avg Order Value"
3. Field: "amount"
4. Operation: "Avg"
5. Color: Blue

## Performance Notes

- Calculations run on every data change (optimized with useMemo)
- Storage operations are debounced through useEffect
- Card count limit: No hard limit (recommend < 20 for performance)
- Data point limit: Tested up to 10,000 rows

## Browser Support

Requires browser support for:
- localStorage API
- ES6+ JavaScript
- Drag and Drop API (dnd-kit)

## Troubleshooting

### Cards not persisting
- Check if localStorage is enabled
- Verify browser console for errors
- Check Application tab in DevTools

### Calculations incorrect
- Verify field names match exactly (case-sensitive)
- Check filter conditions are correct
- Ensure data types match operation requirements

### Drag and drop not working
- Check dnd-kit is properly installed
- Verify SortableItemHandle is accessible
- Check for z-index conflicts in CSS
