// src/components/Navbar.tsx
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-black dark:text-white"
        >
          ClothingStore
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-700 dark:text-zinc-300 hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/admin"
            className="text-zinc-700 dark:text-zinc-300 hover:text-black"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
