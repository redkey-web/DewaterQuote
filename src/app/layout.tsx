import type { Metadata } from "next"
import { Inter, Comfortaa, DotGothic16 } from "next/font/google"
import "./globals.css"
import AppProviders from "@/components/AppProviders"
import { OrganizationJsonLd } from "@/components/JsonLd"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" })
const dotGothic = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--font-dot" })

export const metadata: Metadata = {
  title: {
    default: "Dewater Products - Industrial Pipe Fittings & Valves",
    template: "%s | Dewater Products",
  },
  description:
    "Premium industrial pipe fittings, valves, couplings, and expansion joints. Trusted supplier for water, wastewater, mining, and irrigation industries across Australia.",
  keywords: [
    "pipe fittings",
    "industrial valves",
    "pipe couplings",
    "expansion joints",
    "strainers",
    "Dewater Products",
    "Australia",
  ],
  authors: [{ name: "Dewater Products" }],
  creator: "Dewater Products",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://dewaterproducts.com.au",
    siteName: "Dewater Products",
    title: "Dewater Products - Industrial Pipe Fittings & Valves",
    description:
      "Premium industrial pipe fittings, valves, couplings, and expansion joints. Trusted supplier across Australia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dewater Products - Industrial Pipe Fittings & Valves",
    description:
      "Premium industrial pipe fittings, valves, couplings, and expansion joints.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
      <body className={[inter.variable, comfortaa.variable, dotGothic.variable, "font-sans antialiased"].join(" ")}>
        <GoogleAnalytics />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
