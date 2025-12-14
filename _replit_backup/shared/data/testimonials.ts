export interface Testimonial {
  name: string;
  company?: string;
  role?: string;
  text: string;
  rating: number; // 1-5
  date?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "David Smith",
    company: "ABC Water Services",
    role: "Operations Manager",
    text: "Excellent quality products and fast delivery. DeWater's technical support helped us solve a complex installation issue within 24 hours. Highly recommended!",
    rating: 5,
    date: "2 months ago"
  },
  {
    name: "Sarah Johnson",
    company: "Industrial Solutions Pty Ltd",
    role: "Site Manager",
    text: "We've been sourcing our pipe fittings from DeWater for 3 years. Consistently reliable products, competitive pricing, and professional service. Great team!",
    rating: 5,
    date: "1 month ago"
  },
  {
    name: "Michael Chen",
    company: "Perth Construction Group",
    role: "Procurement Officer",
    text: "Outstanding customer service and product quality. The Orbit couplings perform brilliantly in harsh conditions. Will definitely order again.",
    rating: 5,
    date: "3 weeks ago"
  },
  {
    name: "Emma Williams",
    company: "Eastern Water Authority",
    role: "Engineering Coordinator",
    text: "DeWater Products is a trusted partner for our water treatment systems. Their technical expertise and support are unmatched in the industry.",
    rating: 5,
    date: "2 weeks ago"
  }
];
