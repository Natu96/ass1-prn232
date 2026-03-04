"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/CartContext"
import { supabase } from "@/lib/supabase-client"

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, loading } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutMessage(null)

    try {
      try {
      // create order using supabase from client
      const { data: cartItems, error: cartError } = await supabase
        .from("cart_items")
        .select("*, products(name, price)")

      if (cartError || !cartItems || cartItems.length === 0) {
        setCheckoutMessage({ type: "error", text: "Cart is empty" })
        return
      }

      const totalPrice = cartItems.reduce((sum, item) => {
        return sum + Number(item.products.price) * item.quantity
      }, 0)

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_price: totalPrice,
          status: "pending",
        })
        .select()
        .single()

      if (orderError || !orderData) {
        setCheckoutMessage({ type: "error", text: orderError?.message || "Checkout failed" })
        return
      }

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.products.name,
        product_price: item.products.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        setCheckoutMessage({ type: "error", text: itemsError.message })
        return
      }

      // clear cart
      await supabase.from("cart_items").delete().neq("id", "")

      setCheckoutMessage({ type: "success", text: "Order placed successfully! ✅" })
      setTimeout(() => {
        window.location.href = "/orders"
      }, 2000)
    } catch (err) {
      setCheckoutMessage({ type: "error", text: "Checkout failed" })
    }
    } catch (error) {
      setCheckoutMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center text-gray-500">Loading cart...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {checkoutMessage && (
        <div
          className={`p-4 rounded-lg font-medium mb-6 ${
            checkoutMessage.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {checkoutMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    {item.products?.image && (
                      <img
                        src={item.products.image}
                        alt={item.products?.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.products?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.products?.description}
                      </p>
                      <p className="text-blue-600 font-semibold">
                        ${Number(item.products?.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, Math.max(1, item.quantity - 1))
                          }
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                          }
                          className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-gray-900 mt-4">
                        ${(Number(item.products?.price || 0) * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${(total * 1.1).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>

            <Link
              href="/"
              className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
