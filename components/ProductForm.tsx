'use client'

import { useState } from 'react'
import { Product } from '@/types/product'

interface Props {
  initialData?: Product
  onSuccess?: () => void
}

export default function ProductForm({ initialData, onSuccess }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )
  const [price, setPrice] = useState<number>(
    initialData?.price ?? 0
  )
  const [image, setImage] = useState<string>(
    initialData?.image ?? ''
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      description,
      price,
      image: image || null,
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        'http://localhost:3000'

      const res = await fetch(
        initialData
          ? `${baseUrl}/api/products/${initialData.id}`
          : `${baseUrl}/api/products`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        console.error('API error:', err)
        alert(err.error || 'Có lỗi xảy ra')
        return
      }

      onSuccess?.()

      // reset form khi tạo mới
      if (!initialData) {
        setName('')
        setDescription('')
        setPrice(0)
        setImage('')
      }
    } catch (error) {
      console.error('Request failed:', error)
      alert('Không thể kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-black dark:text-white">
        {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
      </h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}
