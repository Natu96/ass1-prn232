import { NextResponse } from "next/server"
import { supabaseServer } from "../../../../lib/supabase-server"

export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret")
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { email, password } = body
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    // create admin user using service role
    const { data, error } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: "admin" },
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ user: data.user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
