import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/context/auth-context";
import { CartProvider } from "@/lib/context/cart-context";
import { SearchProvider } from "@/lib/context/search-context";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Store - Order Online",
  description: "Order your favorite food items online with our modern dashboard",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)"
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)"
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml"
      }
    ],
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased bg-background text-foreground'>
        <SessionProvider>
          <SearchProvider>
            <CartProvider>
              <AuthProvider>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                  {children}
                </ThemeProvider>
              </AuthProvider>
            </CartProvider>
          </SearchProvider>
        </SessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
