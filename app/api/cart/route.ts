import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/cart - fetch user's cart items
export async function GET(req: NextRequest) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(id, name, price, image, description)")
    .eq("user_id", user.id)

  if (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/cart - add item to cart or update quantity
export async function POST(req: NextRequest) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { product_id, quantity } = body

  if (!product_id || !quantity) {
    return NextResponse.json(
      { error: "Missing product_id or quantity" },
      { status: 400 }
    )
  }

  // Check if item already in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .single()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("id", existing.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Cart updated" })
  }

  // Add new item
  const { error } = await supabase.from("cart_items").insert({
    user_id: user.id,
    product_id,
    quantity,
  })

  if (error) {
    console.error("Cart insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Item added to cart" })
}

// DELETE /api/cart - remove item from cart
export async function DELETE(req: NextRequest) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const cartItemId = searchParams.get("id")

  if (!cartItemId) {
    return NextResponse.json({ error: "Missing cart item id" }, { status: 400 })
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Item removed from cart" })
}
