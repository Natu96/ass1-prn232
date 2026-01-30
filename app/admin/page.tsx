"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import ProductForm from "@/components/ProductForm"
import AdminProductRow from "@/components/AdminProductRow"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])

  const loadProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    loadProducts()
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        <ProductForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h2>
        <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <AdminProductRow
              key={p.id}
              product={p}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
      </div>
    </main>
  )
}
