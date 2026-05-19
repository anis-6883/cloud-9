import { CartProvider } from "@/context/cart-context";
import { SearchProvider } from "@/context/search-context";
import AuthProvider from "@/provider/AuthProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"]
});

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
    <html lang='en' className={geist.className} suppressHydrationWarning>
      <body className='font-sans antialiased bg-background text-foreground' suppressHydrationWarning>
        <NextTopLoader color='#cf3c3e' showSpinner={false} />
        <SearchProvider>
          <CartProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
