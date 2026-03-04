"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "../lib/supabase-client"

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/admin/login",
  "/admin/register",
]

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const verify = async () => {
      // if the current path is public, skip
      if (PUBLIC_PATHS.includes(pathname)) {
        setChecked(true)
        return
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login")
      } else {
        setChecked(true)
      }
    }
    verify()
  }, [pathname, router])

  // don't render children until we've checked so we avoid flash
  if (!checked) return <div className="p-6">Checking authentication…</div>

  return <>{children}</>
}
