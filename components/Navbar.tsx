"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase-client"
import { useCart } from "@/lib/CartContext"

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { count } = useCart()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserEmail(data.user.email ?? null)
        const r = (data.user.user_metadata as any)?.role
        setRole(typeof r === "string" ? r : null)
      }
      setLoading(false)
    }
    load()
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null)
        const r2 = (session.user.user_metadata as any)?.role
        setRole(typeof r2 === "string" ? r2 : null)
      } else {
        setUserEmail(null)
        setRole(null)
      }
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    setRole(null)
  }

  const avatarInitial = userEmail?.substring(0, 1).toUpperCase() || "?"

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white hover:opacity-90 transition">
          🛍️ Clothing Store
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-white text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition">
            Products
          </Link>

          {userEmail && (
            <>
              <Link href="/cart" className="relative text-white text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-2 9h0" />
                </svg>
                Cart
                {count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
              <Link href="/orders" className="text-white text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition">
                Orders
              </Link>
            </>
          )}

          {!loading && (
            <>
              {!userEmail ? (
                <>
                  <Link href="/register" className="text-white text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition">
                    Register
                  </Link>
                  <Link href="/login" className="text-white text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition">
                    Login
                  </Link>
                  <Link href="/admin/login" className="text-white text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition">
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  {/* User Avatar & Email */}
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {avatarInitial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-xs font-medium truncate max-w-xs">{userEmail}</span>
                      {role && (
                        <span className={`text-xs font-semibold ${
                          role === "admin" ? "text-yellow-300" : "text-green-300"
                        }`}>
                          {role.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin Panel Link */}
                  {role === "admin" && (
                    <Link href="/admin" className="text-white text-sm font-semibold bg-yellow-500/30 hover:bg-yellow-500/40 px-3 py-2 rounded-lg transition">
                      Admin Panel
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-white text-sm hover:bg-red-500/30 px-3 py-2 rounded-lg transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
