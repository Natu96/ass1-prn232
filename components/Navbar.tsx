"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Clothing Store
      </Link>

      <div className="space-x-4">
        <Link href="/">Products</Link>
        <Link href="/admin" className="font-semibold">
          Admin
        </Link>
      </div>
    </nav>
  )
}
