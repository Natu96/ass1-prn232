'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ProductForm from '@/components/ProductForm'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  async function deleteProduct(id: string) {
    if (!confirm('Xóa sản phẩm này?')) return

    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductForm
          initialData={editing ?? undefined}
          onSuccess={() => {
            setEditing(null)
            fetchProducts()
          }}
        />

        <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h2>

          <ul className="space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <span>{p.name}</span>

                <div className="flex gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => setEditing(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
