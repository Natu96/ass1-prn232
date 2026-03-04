"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "./supabase-client"

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  products?: {
    id: string
    name: string
    price: number
    image: string
    description: string
  }
}

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch cart on mount and when authentication state changes
  useEffect(() => {
    fetchCart()
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // refetch whenever user signs in or out
      fetchCart()
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // helper that interacts with supabase directly, bypassing our server API
  const fetchCart = async () => {
    try {
      setLoading(true)
      // ensure user is logged in
      const { data: { user }, error: authErr } = await supabase.auth.getUser()
      if (authErr || !user) {
        // not signed in yet, treat empty cart
        setItems([])
        return
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(id, name, price, image, description)")
        .eq("user_id", user.id)
      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      const msg = error.message ?? error
      if (typeof msg === "string" && msg.includes("Could not find the table")) {
        // likely schema not applied yet; ignore and keep empty cart
        console.warn("Cart table missing in database; run DATABASE_SCHEMA.sql or create cart_items table.")
      } else {
        console.error("Failed to fetch cart:", msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId: string, quantity: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // check if exists for this user
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single()
      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id)
      } else {
        await supabase.from("cart_items").insert({
          product_id: productId,
          quantity,
          user_id: user.id,
        })
      }
      await fetchCart()
    } catch (error: any) {
      const msg = error.message ?? error
      if (typeof msg === "string" && msg.includes("Could not find the table")) {
        console.warn("Cannot add to cart because cart_items table is missing.")
      } else {
        console.error("Failed to add item:", msg)
      }
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
        .eq("user_id", user.id)
      await fetchCart()
    } catch (error: any) {
      const msg = error.message ?? error
      if (typeof msg === "string" && msg.includes("Could not find the table")) {
        console.warn("Cannot remove cart item because cart_items table is missing.")
      } else {
        console.error("Failed to remove item:", msg)
      }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single()
      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", existing.id)
        await fetchCart()
      }
    } catch (error: any) {
      const msg = error.message ?? error
      if (typeof msg === "string" && msg.includes("Could not find the table")) {
        console.warn("Cannot update quantity because cart_items table is missing.")
      } else {
        console.error("Failed to update quantity:", msg)
      }
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => {
    const price = item.products?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart, fetchCart, loading }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
