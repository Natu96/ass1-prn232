import EditProductForm from "@/components/EditProductForm"
import { Product } from "@/types/product"

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/products/${id}`,
    { cache: "no-store" }
  )
  return res.json()
}

export default async function EditPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>
      <EditProductForm product={product} />
    </main>
  )
}
