// src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'

// GET /api/products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

// POST /api/products
export async function POST(req: Request) {
  const body = await req.json()

  const { name, description, price, image } = body

  // Validate required fields
  if (!name || !description || price === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name,
        description,
        price,
        image,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}
