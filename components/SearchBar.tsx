"use client"

export default function SearchBar({
  keyword,
  setKeyword,
}: {
  keyword: string
  setKeyword: (v: string) => void
}) {
  return (
    <input
      className="border p-2 w-full mb-4"
      placeholder="Search products..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  )
}
