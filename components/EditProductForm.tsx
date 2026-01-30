"use client"

import { useState } from "react"
import { Product } from "@/types/product"

export default function EditProductForm({ product }: { product: Product }) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [image, setImage] = useState(product.image || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        image: image || null,
      }),
    })

    if (!res.ok) {
      alert("Cập nhật thất bại")
      return
    }

    alert("Cập nhật thành công")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        className="border p-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        type="url"
        className="border p-2 w-full"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-32 h-32 object-cover border"
        />
      )}

      <button className="bg-black text-white px-4 py-2">
        Update
      </button>
    </form>
  )
}
