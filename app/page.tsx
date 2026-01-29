// src/app/page.tsx
import ProductCard from "@/components/ProductCard"
import { Product } from "@/types/product"

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  return res.json()
}

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Clothing Store
        </h1>

        {products.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Chưa có sản phẩm nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
