"use client"

import { Product } from "@/types/product"

export default function AdminProductRow({
  product,
  onDelete,
}: {
  product: Product
  onDelete: (id: string) => void
}) {
  return (
    <tr>
      <td className="border p-2">{product.name}</td>
      <td className="border p-2">${product.price}</td>
      <td className="border p-2">
        <button
          className="text-red-600"
          onClick={() => onDelete(product.id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  )
}
