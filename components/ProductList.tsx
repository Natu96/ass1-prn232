"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import ProductItem from "./ProductItem"
import SearchBar from "./SearchBar"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [keyword, setKeyword] = useState("")

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
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <>
      <SearchBar keyword={keyword} setKeyword={setKeyword} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductItem key={p.id} product={p} />
        ))}
      </div>
    </>
  )
}
