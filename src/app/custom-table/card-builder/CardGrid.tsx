'use client'

import { CardDashboard } from '@/components/ui/CardDashboard'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { GripVertical } from 'lucide-react'
import { calculateCardValue } from './cardUtils'
import type { Card } from './types'

interface CardGridProps {
  cards: Card[]
  data: Record<string, any>[]
  onEdit: (card: Card) => void
  onDelete: (id: string) => void
  onReorder: (cards: Card[]) => void
}

export function CardGrid({
  cards,
  data,
  onEdit,
  onDelete,
  onReorder,
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div>
          <p className="text-muted-foreground text-sm">No cards created yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first card to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <Sortable
      value={cards}
      onValueChange={onReorder}
      orientation="mixed"
      getItemValue={(card) => card.id}>
      <SortableContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const value = calculateCardValue(data, card)

          return (
            <SortableItem
              key={card.id}
              value={card.id}
              asChild>
              <div className="group">
                <CardDashboard
                  title={card.title}
                  value={value}
                  editDelete={{
                    onEdit: () => onEdit(card),
                    onDelete: () => onDelete(card.id),
                  }}
                  dragHandle={
                    <SortableItemHandle
                      className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
                      style={{ opacity: 0.5 }}>
                      <GripVertical className="w-5 h-5" />
                    </SortableItemHandle>
                  }
                />
              </div>
            </SortableItem>
          )
        })}
      </SortableContent>

      <SortableOverlay>
        {({ value }) => {
          const card = cards.find((c) => c.id === value)
          if (!card) return null
          const cardValue = calculateCardValue(data, card)
          return (
            <CardDashboard
              title={card.title}
              value={cardValue}
              className="shadow-lg"
            />
          )
        }}
      </SortableOverlay>
    </Sortable>
  )
}
