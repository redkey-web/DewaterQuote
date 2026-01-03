import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Wrench, Users, Handshake } from "lucide-react"

export const metadata: Metadata = {
  title: "Meet the Team | Dewater Products",
  description: "Meet the team at Dewater Products. Our experienced staff provide expert technical support for pipe couplings, valves, and industrial fittings across Australia.",
  openGraph: {
    title: "Meet the Team - Dewater Products",
    description: "Meet the experienced team behind Dewater Products Australia.",
    type: "website",
  },
}

export default function MeetTheTeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Meet the Team</h1>
        </div>
      </section>

      {/* Director Message */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Photo */}
                <div className="bg-muted flex items-center justify-center p-8 md:p-12">
                  <div className="w-48 h-48 flex-shrink-0 rounded-full overflow-hidden bg-primary/10">
                    <Image
                      src="/images/team/kris-mckeown.png"
                      alt="Kris McKeown"
                      width={192}
                      height={192}
                      className="w-48 h-48 object-cover object-top"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-8">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg mb-4">
                      Welcome to our website! I want to personally extend a warm welcome and express my gratitude for your visit. My name is Kris McKeown, and I am the Director of Dewater Products.
                    </p>

                    <p className="mb-4">
                      Having spent over 12 years as a Mechanical Engineer, I bring a wealth of technical expertise to our offerings. My passion for mechanical parts has been ingrained in me since I can remember, and it drives me to continuously stay updated on the latest advancements in the industry. This allows me to provide you with cutting-edge solutions tailored to your specific needs in every application of our fluid piping products.
                    </p>

                    <p className="mb-4">
                      In addition to my engineering background, I have accumulated over 17 years of experience in sales. This experience has shaped my ability to understand and cater to the unique requirements of each customer. Whether you're seeking guidance in product selection or have specific needs in mind, I am here to assist you throughout the entire process.
                    </p>

                    <p className="mb-4">
                      Over the years, I have nurtured strong relationships with manufacturers and built a reliable network for sourcing and importing quality, affordable products for the Australian market. It is my utmost priority to ensure that you have access to a comprehensive range of products that meet the highest standards of quality and performance, all at competitive prices.
                    </p>

                    <p className="mb-4">
                      More than anything, my aim is to provide you with an outstanding customer experience. Your satisfaction matters deeply to me, and I am committed to going above and beyond to exceed your expectations. From your first visit to our website to long after your purchase, I am here to assist you and address any questions or concerns you may have.
                    </p>

                    <p className="mb-6">
                      Thank you for taking the time to explore our website. I invite you to browse through our selection of industrial fluid piping products, and I genuinely hope you find the solutions you are seeking. Should you need any assistance or guidance, please do not hesitate to reach out to me directly. I look forward to serving you and building a lasting relationship based on trust, reliability, and exceptional service.
                    </p>

                    <p className="text-muted-foreground italic mb-2">With sincere appreciation,</p>
                    <p className="font-semibold">Kris McKeown</p>
                    <p className="text-primary">Director, Dewater Products</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
