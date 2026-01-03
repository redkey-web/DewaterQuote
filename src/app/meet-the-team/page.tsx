import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Wrench, Users, Award, Handshake } from "lucide-react"

export const metadata: Metadata = {
  title: "Meet the Team | Dewater Products",
  description: "Meet the team at Dewater Products. Our experienced staff provide expert technical support for pipe couplings, valves, and industrial fittings across Australia.",
  openGraph: {
    title: "Meet the Team - Dewater Products",
    description: "Meet the experienced team behind Dewater Products Australia.",
    type: "website",
  },
}

const teamMembers = [
  {
    name: "Kris McKeown",
    role: "Director",
    image: "/images/team/kris-mckeown.jpg",
    description: "With over 12 years as a Mechanical Engineer and 17+ years of sales experience, Kris brings deep technical knowledge of mechanical parts and fluid piping products to every customer interaction.",
    highlights: [
      "12+ years Mechanical Engineering experience",
      "17+ years in technical sales",
      "Expert in pipe couplings and valve selection",
      "Building manufacturer relationships globally",
    ],
    quote: "My goal is to understand and cater to the unique requirements of each customer, ensuring an outstanding experience from enquiry to delivery.",
  },
]

export default function MeetTheTeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Meet the Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            At Dewater Products, we pride ourselves on providing expert technical support
            and personalised service to every customer across Australia.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Photo */}
                  <div className="bg-muted flex items-center justify-center p-8 md:p-12">
                    <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-24 h-24 text-primary/40" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {member.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {member.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "{member.quote}"
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Technical Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Engineering knowledge to help you select the right products for your application.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Manufacturer Relationships</h3>
                <p className="text-sm text-muted-foreground">
                  Direct partnerships with Straub, Orbit, and Teekay for genuine products and support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Customer Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Personalised service tailored to your unique project requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Need help selecting the right products? Our team is here to assist with
            technical advice, product recommendations, and quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:1300271290">
                <Phone className="w-4 h-4 mr-2" />
                1300 271 290
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
