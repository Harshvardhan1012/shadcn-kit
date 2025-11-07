'use client'

import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { resolveLucideIcon } from '@/lib/icon-resolver'
import { Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  calculateCardValue,
  getOperationIcon,
  getOperationLabel,
} from './cardUtils'
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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
      orientation="vertical"
      getItemValue={(card) => card.id}>
      <SortableContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const value = calculateCardValue(data, card)
          const IconComponent = resolveLucideIcon(
            getOperationIcon(card.operation)
          )

          return (
            <SortableItem
              key={card.id}
              value={card.id}
              asChild>
              <div
                className="relative rounded-lg border p-4 transition-all hover:shadow-md"
                style={{ borderLeftColor: card.color, borderLeftWidth: '4px' }}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {getOperationLabel(card.operation)}
                    </p>
                    <h3 className="text-sm font-medium mt-1">{card.title}</h3>
                    <div className="flex items-center gap-2 mt-3">
                      {IconComponent && (
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: card.color }}
                        />
                      )}
                      <p className="text-2xl font-bold">{value}</p>
                    </div>
                    {card.filters && card.filters.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {card.filters.length} filter
                        {card.filters.length !== 1 ? 's' : ''} applied
                      </p>
                    )}
                  </div>

                  <SortableItemHandle
                    className="p-1 hover:bg-muted rounded"
                    style={{ cursor: 'grab', opacity: 0.5 }}>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-xs font-bold opacity-50">::</span>
                    </div>
                  </SortableItemHandle>
                </div>

                {/* Edit and Delete buttons on hover */}
                {hoveredId === card.id && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => onEdit(card)}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => onDelete(card.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </SortableItem>
          )
        })}
      </SortableContent>

      <SortableOverlay>
        {({ value }) => {
          const card = cards.find((c) => c.id === value)
          if (!card) return null
          return (
            <div
              className="rounded-lg border p-4 shadow-lg"
              style={{ borderLeftColor: card.color, borderLeftWidth: '4px' }}>
              <p className="text-xs text-muted-foreground">{card.title}</p>
              <p className="text-lg font-bold mt-1">
                {calculateCardValue(data, card)}
              </p>
            </div>
          )
        }}
      </SortableOverlay>
    </Sortable>
  )
}
