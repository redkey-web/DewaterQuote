"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, TrendingDown, ArrowRight, Eye } from "lucide-react"

// Sample product for demo
const sampleProduct = {
  name: "Flex-Grip Coupling 316SS",
  brand: "Orbit",
  image: "https://mj2ui8tgpl.ufs.sh/f/yiNKPHk7I5buQ0NmAHqTiS6o4cJKvr0LlMFjHZ85RhGwdsAu",
}

const brandColors: Record<string, { bg: string; text: string; accent: string }> = {
  Orbit: { bg: "bg-orange-500", text: "text-black", accent: "orange" },
  Straub: { bg: "bg-red-600", text: "text-white", accent: "red" },
  Teekay: { bg: "bg-red-600", text: "text-white", accent: "red" },
  "Defender Valves": { bg: "bg-gray-700", text: "text-white", accent: "gray" },
}

// ===========================================
// STYLE 1: Clean Minimal
// ===========================================
function CleanMinimalCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="aspect-square p-6 bg-gray-50/50 relative">
          <Image
            src={sampleProduct.image}
            alt={sampleProduct.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {/* Brand badge */}
          <span className="absolute top-3 left-3 bg-orange-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
            {sampleProduct.brand}
          </span>
        </div>
        {/* Info */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {sampleProduct.name}
          </h3>
          <div className="mt-2 flex items-center text-xs text-gray-500 group-hover:text-orange-600 transition-colors">
            <span>View product</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// STYLE 2: Glassmorphism
// ===========================================
function GlassmorphismCard() {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-2xl overflow-hidden">
        {/* Background blur layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl" />
        {/* Glass border */}
        <div className="relative border border-white/50 rounded-2xl overflow-hidden shadow-lg shadow-black/5">
          {/* Image */}
          <div className="aspect-square p-6 relative">
            <Image
              src={sampleProduct.image}
              alt={sampleProduct.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
            {/* Floating brand badge */}
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200/50 shadow-sm">
              {sampleProduct.brand}
            </span>
          </div>
          {/* Info */}
          <div className="p-4 bg-gradient-to-t from-white/90 to-transparent">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
              {sampleProduct.name}
            </h3>
            <div className="mt-2 flex items-center text-xs text-gray-600 group-hover:text-orange-600 transition-colors">
              <Eye className="w-3 h-3 mr-1" />
              <span>View details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// STYLE 3: Industrial Professional
// ===========================================
function IndustrialProCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-orange-500/50 transition-all duration-300">
        {/* Brand color bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
        {/* Image */}
        <div className="aspect-square p-6 bg-zinc-800 relative">
          <Image
            src={sampleProduct.image}
            alt={sampleProduct.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {/* Corner brand */}
          <div className="absolute top-3 right-3 text-xs font-bold text-orange-500 tracking-wider uppercase">
            {sampleProduct.brand}
          </div>
        </div>
        {/* Info */}
        <div className="p-4 border-t border-zinc-700">
          <h3 className="font-semibold text-white text-sm line-clamp-2">
            {sampleProduct.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Industrial Grade</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// STYLE 4: Floating Card (Premium)
// ===========================================
function FloatingCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        {/* Image with brand overlay */}
        <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={sampleProduct.image}
            alt={sampleProduct.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Brand pill - top left */}
          <div className="absolute top-4 left-4">
            <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {sampleProduct.brand}
            </span>
          </div>
          {/* View button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg">
              View Product
            </span>
          </div>
        </div>
        {/* Info */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {sampleProduct.name}
          </h3>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// BRAND INDICATOR VARIANTS
// ===========================================

// Variant A: Subtle Pill Badge (shown above in cards)

// Variant B: Colored Left Border
function BorderBrandCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex">
        {/* Brand color stripe */}
        <div className="w-1.5 bg-orange-500 shrink-0" />
        <div className="flex-1">
          {/* Image */}
          <div className="aspect-square p-4 relative">
            <Image
              src={sampleProduct.image}
              alt={sampleProduct.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* Info */}
          <div className="p-4 pt-0">
            <span className="text-xs text-orange-600 font-semibold">{sampleProduct.brand}</span>
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1">
              {sampleProduct.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

// Variant C: Background Tint
function TintBrandCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-orange-100/50">
        {/* Image */}
        <div className="aspect-square p-6 relative">
          <Image
            src={sampleProduct.image}
            alt={sampleProduct.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Info */}
        <div className="p-4 bg-white/80">
          <span className="text-xs text-orange-600 font-semibold uppercase tracking-wide">{sampleProduct.brand}</span>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1">
            {sampleProduct.name}
          </h3>
        </div>
      </div>
    </div>
  )
}

// Variant D: No Brand (reveal on hover)
function NoBrandCard() {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="aspect-square p-6 relative bg-gray-50">
          <Image
            src={sampleProduct.image}
            alt={sampleProduct.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {/* Brand reveals on hover */}
          <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">{sampleProduct.brand}</span>
          </div>
        </div>
        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {sampleProduct.name}
          </h3>
        </div>
      </div>
    </div>
  )
}

// ===========================================
// DEMO PAGE
// ===========================================
export default function CardDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Card Styles</h1>
        <p className="text-gray-600 mb-12">Compare different card designs. Hover over each to see interactions.</p>

        {/* CARD STYLES */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Card Styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <CleanMinimalCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">1. Clean Minimal</p>
            </div>
            <div>
              <GlassmorphismCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">2. Glassmorphism</p>
            </div>
            <div>
              <IndustrialProCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">3. Industrial Pro</p>
            </div>
            <div>
              <FloatingCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">4. Floating Card</p>
            </div>
          </div>
        </section>

        {/* BRAND INDICATORS */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Brand Indicator Styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <CleanMinimalCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">A. Pill Badge</p>
            </div>
            <div>
              <BorderBrandCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">B. Left Border</p>
            </div>
            <div>
              <TintBrandCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">C. Background Tint</p>
            </div>
            <div>
              <NoBrandCard />
              <p className="text-center text-sm text-gray-500 mt-3 font-medium">D. Reveal on Hover</p>
            </div>
          </div>
        </section>

        {/* GRID PREVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Grid Preview (Floating Card)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
            <FloatingCard />
          </div>
        </section>
      </div>
    </div>
  )
}
