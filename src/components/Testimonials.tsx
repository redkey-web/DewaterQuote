"use client"

import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { testimonials } from "@/data/testimonials"

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">CUSTOMER TESTIMONIALS</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Trusted by industrial buyers and contractors across Australia
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 flex flex-col h-full hover-elevate">
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground mb-6 flex-grow text-sm leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="border-t pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                {testimonial.company && (
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                )}
                {testimonial.role && (
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                )}
                {testimonial.date && (
                  <p className="text-xs text-muted-foreground mt-2">{testimonial.date}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
