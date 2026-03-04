import { NextResponse, NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This route uses the ANON KEY to sign up test accounts
// No service role key needed — works with public auth

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TEST_USER = { email: "user@test.com", password: "password123" }
const TEST_ADMIN = { email: "admin@test.com", password: "adminpass" }

export async function GET(req: NextRequest) {
  const results: any = {}

  // helper to sign up via client API
  const ensure = async (account: { email: string; password: string }, role: string) => {
    // first try to sign in to check if exists
    const signIn = await supabase.auth.signInWithPassword(account)
    if (!signIn.error) {
      results[role] = "exists"
      return
    }
    // doesn't exist, create via sign up
    const signUp = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: { role },
      },
    })
    if (signUp.error) {
      results[role] = signUp.error.message
    } else {
      results[role] = "created"
    }
  }

  await ensure(TEST_USER, "user")
  await ensure(TEST_ADMIN, "admin")

  return NextResponse.json({ results, credentials: { user: TEST_USER, admin: TEST_ADMIN } })
}
