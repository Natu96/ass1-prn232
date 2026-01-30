// src/app/page.tsx
import ProductList from "@/components/ProductList"

export default async function Home() {
 return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
        <ProductList />
      </main>
  )
}
