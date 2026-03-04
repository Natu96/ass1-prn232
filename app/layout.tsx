import Navbar from "@/components/Navbar"
import "./globals.css"
import AuthGuard from "../components/AuthGuard"
import { CartProvider } from "@/lib/CartContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <AuthGuard>
            {children}
          </AuthGuard>
        </CartProvider>
      </body>
    </html>
  )
}
