"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase-client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    const user = data.user
    if (!user || (user.user_metadata as any)?.role !== "admin") {
      await supabase.auth.signOut()
      setError("Not an admin account")
      return
    }
    router.push("/admin")
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-blue-800 text-white py-2 rounded disabled:opacity-60" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <p className="text-sm text-gray-600 mt-4">Need an admin account? <a href="/admin/register" className="text-blue-600">Create one</a></p>
      </div>
    </div>
  )
}
