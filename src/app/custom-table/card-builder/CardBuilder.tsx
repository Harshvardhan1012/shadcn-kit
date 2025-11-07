'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CardForm } from './CardForm'
import { CardGrid } from './CardGrid'
import type { Card, FilterVariant } from './types'
import { useCardStorage } from './useCardStorage'

interface CardBuilderProps {
  data: Record<string, any>[]
  availableFields: string[]
  columnConfig?: any[] // Optional: for detecting field variants
}

export function CardBuilder({
  data,
  availableFields,
  columnConfig,
}: CardBuilderProps) {
  const { cards, isHydrated, addCard, updateCard, deleteCard, reorderCards } =
    useCardStorage()
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | undefined>()

  // Detect field variants from data types or column config
  const fieldVariants = useMemo(() => {
    const variants: Record<string, FilterVariant> = {}

    if (columnConfig) {
      // Use column config variant if available
      columnConfig.forEach((col: any) => {
        if (col.field && col.options?.variant) {
          variants[col.field] = col.options.variant as FilterVariant
        }
      })
    }

    // Fallback: detect from data types
    availableFields.forEach((field) => {
      if (variants[field]) return // Already set from columnConfig

      const sample = data?.[0]?.[field]
      if (sample === null || sample === undefined) {
        variants[field] = 'text'
      } else if (typeof sample === 'boolean') {
        variants[field] = 'boolean'
      } else if (typeof sample === 'number') {
        variants[field] = 'number'
      } else if (Array.isArray(sample)) {
        variants[field] = 'array'
      } else if (sample instanceof Date || !isNaN(Date.parse(sample))) {
        variants[field] = 'dateRange'
      } else {
        variants[field] = 'text'
      }
    })

    return variants
  }, [availableFields, data, columnConfig])

  const handleSave = (card: Card) => {
    if (editingCard) {
      updateCard(editingCard.id, card)
      setEditingCard(undefined)
    } else {
      addCard(card)
    }
    setShowForm(false)
  }

  const handleEdit = (card: Card) => {
    setEditingCard(card)
    setShowForm(true)
  }

  if (!isHydrated) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cards</h2>
        <Button
          size="sm"
          onClick={() => {
            setEditingCard(undefined)
            setShowForm(true)
          }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      <CardGrid
        cards={cards}
        data={data}
        onEdit={handleEdit}
        onDelete={deleteCard}
        onReorder={reorderCards}
      />

      <Sheet
        open={showForm}
        onOpenChange={setShowForm}>
        <VisuallyHidden>
          <SheetTitle>
            {editingCard ? 'Edit Card' : 'Create New Card'}
          </SheetTitle>
        </VisuallyHidden>
        <SheetContent className="overflow-y-auto">
          <CardForm
            availableFields={availableFields}
            fieldVariants={fieldVariants}
            columnConfig={columnConfig}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            initialCard={editingCard}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
