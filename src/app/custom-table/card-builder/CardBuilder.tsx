'use client'

import SheetDemo from '@/components/sheet/page'
import { Button } from '@/components/ui/button'
import type { FilterVariant } from '@/types/data-table'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CardForm } from './CardForm'
import { CardGrid } from './CardGrid'
import type { Card } from './types'
import { useCardStorage } from './useCardStorage'

interface CardBuilderProps {
  data: Record<string, any>[]
  sp: boolean
  availableFields?: string[]
  columnConfig?: any[] // Optional: for detecting field variants
  showActions?: boolean // Optional: show edit/delete actions (default: true)
  // Props for SP mode (when sp=true, cards are managed externally)
  cards?: Card[]
  onAddCard?: (card: Card) => void
  onUpdateCard?: (id: number, card: Card) => void
  onDeleteCard?: (id: number) => void
  onReorderCards?: (cards: Card[]) => void
}

export function CardBuilder({
  data,
  availableFields,
  sp,
  columnConfig,
  showActions = false,
  cards: externalCards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onReorderCards,
}: CardBuilderProps) {
  // Use external cards and callbacks when sp=true, otherwise use localStorage
  const storageResult = useCardStorage()

  const cards = sp ? externalCards || [] : storageResult.cards
  const isHydrated = sp ? true : storageResult.isHydrated
  const addCard = sp ? onAddCard || (() => {}) : storageResult.addCard
  const updateCard = sp ? onUpdateCard || (() => {}) : storageResult.updateCard
  const deleteCard = sp ? onDeleteCard || (() => {}) : storageResult.deleteCard
  const reorderCards = sp
    ? onReorderCards || (() => {})
    : storageResult.reorderCards

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
      updateCard(editingCard.cardId, card)
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
      <div className="flex items-center justify-end">
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
        sp={sp}
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
          sp={sp}
        />
      </SheetDemo>
    </div>
  )
}
