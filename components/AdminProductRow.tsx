"use client"

import Link from "next/link"
import { useState } from "react"
import { Product } from "@/types/product"

export default function AdminProductRow({
  product,
  onDelete,
}: {
  product: Product
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(product.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-900">
        <div className="flex items-center gap-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <span className="truncate">{product.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{product.description}</td>
      <td className="px-6 py-4 font-semibold text-blue-600">${Number(product.price).toFixed(2)}</td>
      <td className="px-6 py-4 space-x-3 flex">
        <Link
          href={`/admin/edit/${product.id}`}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
            confirmDelete
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          {confirmDelete ? "Confirm Delete?" : "Delete"}
        </button>
      </td>
    </tr>
  )
}
