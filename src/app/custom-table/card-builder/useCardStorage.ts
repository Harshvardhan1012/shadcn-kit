import { useCallback, useEffect, useState } from "react"
import type { Card } from "./types"

const STORAGE_KEY = "custom_table_cards"

export const useCardStorage = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setCards(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load cards from storage:", error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to storage whenever cards change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    }
  }, [cards, isHydrated])

  const addCard = useCallback((card: Card) => {
    setCards((prev) => [...prev, card])
  }, [])

  const updateCard = useCallback((id: number, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((card) => (card.cardId === id ? { ...card, ...updates } : card))
    )
  }, [])

  const deleteCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((card) => card.cardId !== id))
  }, [])

  const reorderCards = useCallback((newOrder: Card[]) => {
    setCards(newOrder.map((card, index) => ({ ...card, order: index })))
  }, [])

  return {
    cards,
    isHydrated,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
  }
}
