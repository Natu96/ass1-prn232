"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import ProductItem from "./ProductItem"
import SearchBar from "./SearchBar"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else if (data?.error) {
          console.error("API Error:", data.error)
          setProducts([])
        } else {
          setProducts([])
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.description.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div>
      <SearchBar keyword={keyword} setKeyword={setKeyword} />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">Loading products...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {keyword ? "No products found" : "No products available"}
          </h3>
          <p className="text-gray-600">{keyword ? "Try a different search" : "Check back soon!"}</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 text-sm mb-4">Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
