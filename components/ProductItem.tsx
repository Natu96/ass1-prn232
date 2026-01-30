import Link from "next/link"
import { Product } from "@/types/product"

export default function ProductItem({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col bg-white">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover"
          />
        )}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <p className="font-semibold text-lg text-blue-600 mt-auto">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
