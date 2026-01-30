import { Product } from "@/types/product"

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/products/${id}`,
    { cache: "no-store" }
  )
  return res.json()
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      )}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-lg font-semibold">${product.price}</p>
    </main>
  )
}
