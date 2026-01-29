// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

// PUT /api/products/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const body = await req.json()

  const { name, description, price, image } = body

  if (!name || !description || price === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      description,
      price,
      image,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

// DELETE /api/products/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Product deleted successfully' }
  )
}
