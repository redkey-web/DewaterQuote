import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials } from "@shared/data/testimonials";

export function TestimonialsSmallSection() {
  const featuredTestimonials = testimonials.slice(0, 2);

  return (
    <section className="py-12 px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-bold mb-6">What Our Customers Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredTestimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 flex flex-col hover-elevate">
              {/* Star Rating */}
              <div className="flex gap-1 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground text-sm mb-3 flex-grow line-clamp-3">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="border-t pt-3">
                <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                {testimonial.company && (
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
