"use client"

import { useEffect, useMemo, useState } from "react"
import type { Product } from "@/lib/catalog"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

const CART_STORAGE_KEY = "inteligent-service-cart"

function safeParse(value: string | null): CartItem[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item?.id && item?.quantity > 0)
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(safeParse(localStorage.getItem(CART_STORAGE_KEY)))
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  return {
    items,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
