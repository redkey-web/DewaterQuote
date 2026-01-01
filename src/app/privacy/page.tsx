import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Dewater Products",
  description: "Privacy policy for Dewater Products. How we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            Dewater Products Pty Ltd is committed to protecting your privacy. This policy outlines
            how we collect, use, and safeguard your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>We may collect the following information when you use our website or place an order:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact details (email, phone, address)</li>
            <li>Company name and ABN (for business customers)</li>
            <li>Order history and product preferences</li>
            <li>Website usage data through cookies</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfil your orders</li>
            <li>Communicate about your orders and enquiries</li>
            <li>Send product updates and promotional offers (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies are small files
            stored on your device that help us remember your preferences and understand how you
            use our site. You can disable cookies in your browser settings, but this may affect
            some website functionality.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from
            unauthorized access, alteration, or disclosure. All payment transactions are processed
            through secure, encrypted connections.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Third Parties</h2>
          <p>
            We do not sell or share your personal information with third parties for marketing
            purposes. We may share information with trusted service providers (e.g., shipping
            companies) as necessary to fulfil your orders.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (subject to legal requirements)</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about our privacy policy, please{" "}
            <a href="/contact" className="text-primary hover:underline">contact us</a> or call{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  )
}
