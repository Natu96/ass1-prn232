// src/components/ProductCard.tsx
import Link from 'next/link'
import { Product } from '@/types/product'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-3"
          />
        )}

        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <p className="text-red-600 font-bold mt-2">
          {Number(product.price).toLocaleString()} đ
        </p>
      </div>
    </Link>
  )
}
