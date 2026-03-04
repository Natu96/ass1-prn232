"use client"

import Link from "next/link"
import { useState } from "react"
import { Product } from "@/types/product"
import { useCart } from "@/lib/CartContext"

export default function ProductItem({ product }: { product: Product }) {
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    // stop the surrounding Link from navigating when we click this button
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    await addItem(product.id, 1)
    setAddingToCart(false)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden h-56 bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-4xl">👕</div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Product Name */}
            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-2xl text-blue-600">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-5 pb-5 space-y-2">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {addingToCart ? "Adding..." : "🛒 Add to Cart"}
            </button>
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
