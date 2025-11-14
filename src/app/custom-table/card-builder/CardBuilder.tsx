'use client'

import SheetDemo from '@/components/sheet/page'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CardForm } from './CardForm'
import { CardGrid } from './CardGrid'
import type { Card } from './types'
import { useCardStorage } from './useCardStorage'
import type { FilterVariant } from '@/types/data-table'

interface CardBuilderProps {
  data: Record<string, any>[]
  availableFields: string[]
  columnConfig?: any[] // Optional: for detecting field variants
  showActions?: boolean // Optional: show edit/delete actions (default: true)
}

export function CardBuilder({
  data,
  availableFields,
  columnConfig,
  showActions = true,
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

    return variants
  }, [data, columnConfig])

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
        showActions={showActions}
      />

      <SheetDemo
        open={showForm}
        onOpenChange={setShowForm}>
        <CardForm
          availableFields={availableFields}
          fieldVariants={fieldVariants}
          columnConfig={columnConfig}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          initialCard={editingCard}
        />
      </SheetDemo>
    </div>
  )
}
