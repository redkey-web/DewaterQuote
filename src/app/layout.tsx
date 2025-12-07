import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AppProviders from "@/components/AppProviders"
import { OrganizationJsonLd } from "@/components/JsonLd"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "deWater Products - Industrial Pipe Fittings & Valves",
    template: "%s | deWater Products",
  },
  description:
    "Premium industrial pipe fittings, valves, couplings, and expansion joints. Trusted supplier for water, wastewater, mining, and irrigation industries across Australia.",
  keywords: [
    "pipe fittings",
    "industrial valves",
    "pipe couplings",
    "expansion joints",
    "strainers",
    "dewater products",
    "Australia",
  ],
  authors: [{ name: "deWater Products" }],
  creator: "deWater Products",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://dewaterproducts.com.au",
    siteName: "deWater Products",
    title: "deWater Products - Industrial Pipe Fittings & Valves",
    description:
      "Premium industrial pipe fittings, valves, couplings, and expansion joints. Trusted supplier across Australia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "deWater Products - Industrial Pipe Fittings & Valves",
    description:
      "Premium industrial pipe fittings, valves, couplings, and expansion joints.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
