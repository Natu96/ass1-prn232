// src/app/products/[id]/page.tsx
import { Product } from "@/types/product"

interface Props {
  params: {
    id: string
  }
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `http://localhost:3000/api/products/${id}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Product not found")
  }

  return res.json()
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id)

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg p-6 shadow">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded mb-6"
          />
        )}

        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          {product.name}
        </h1>

        <p className="text-zinc-600 dark:text-zinc-300 mb-4">
          {product.description}
        </p>

        <p className="text-xl font-semibold text-red-600">
          {Number(product.price).toLocaleString()} đ
        </p>
      </div>
    </main>
  )
}
