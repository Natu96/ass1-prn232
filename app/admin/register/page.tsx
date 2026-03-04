"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      setLoading(false)
      if (!res.ok) {
        setError(json?.error || "Failed to create admin")
        return
      }
      router.push("/admin/login")
    } catch (err: any) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Create Admin Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Admin Secret" value={secret} onChange={e => setSecret(e.target.value)} />
          <button className="w-full bg-red-600 text-white py-2 rounded disabled:opacity-60" disabled={loading}>{loading ? "Creating..." : "Create Admin"}</button>
        </form>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <p className="text-sm text-gray-600 mt-4">Already have admin account? <a href="/admin/login" className="text-blue-600">Sign in</a></p>
      </div>
    </div>
  )
}
