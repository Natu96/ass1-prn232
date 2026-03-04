"use client"

import EditProductForm from "@/components/EditProductForm"
import { Product } from "@/types/product"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase-client"

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/products/${id}`,
    { cache: "no-store" }
  )
  return res.json()
}

export default function EditPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user || (user.user_metadata as any)?.role !== "admin") {
        router.replace("/")
        return
      }
      const { id } = await params
      const p = await fetchProduct(id)
      setProduct(p)
      setChecking(false)
    }
    init()
  }, [params, router])

  if (checking) return <div className="p-6">Checking permissions...</div>
  if (!product) return <div className="p-6">Product not found</div>

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>
      <EditProductForm product={product} />
    </main>
  )
}
