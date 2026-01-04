import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Warranty Information | Dewater Products",
  description: "12-month warranty on all Dewater Products covering manufacturing defects. Learn about warranty terms, conditions, and how to make a claim.",
}

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Warranty Information</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 not-prose">
            <h2 className="text-xl font-semibold text-primary mb-2">12-Month Warranty</h2>
            <p className="text-muted-foreground">
              All products come with 12 months warranty from the date of purchase covering manufacturing defects only. Extended 24-month warranties are available upon request during quote.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What's Covered</h2>
          <p>
            Our warranty covers products that are free of defects in material and workmanship when used as intended and in accordance with product specifications.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Warranty Resolution</h2>
          <p>
            Our obligation under this warranty is limited to repair or replacement of the defective product, or refund of the purchase price paid, solely at our discretion. To make a claim, the defective item must be returned for examination to confirm the defect.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What Voids the Warranty</h2>
          <p>
            Warranty coverage becomes void if the product experiences:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Misuse or abuse</li>
            <li>Misapplication (using the product outside its intended purpose)</li>
            <li>Improper maintenance</li>
            <li>Modification or tampering</li>
            <li>Installation not in accordance with manufacturer guidelines</li>
            <li>Damage from accident, neglect, or improper handling</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Make a Claim</h2>
          <p>
            To make a warranty claim:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Email us at <a href="mailto:sales@dewaterproducts.com.au" className="text-primary hover:underline">sales@dewaterproducts.com.au</a> with your order details and description of the issue</li>
            <li>Include photos of the defect if applicable</li>
            <li>We will provide a Return Merchandise Authorisation (RMA) number if the claim is approved</li>
            <li>Return the product to us for inspection</li>
            <li>Upon confirmation of the defect, we will repair, replace, or refund as appropriate</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
          <p className="text-sm text-muted-foreground">
            This warranty is expressed in lieu of all other warranties, expressed or implied, from Dewater Products Pty Ltd. We reserve the right to modify product specifications without notice. This warranty does not affect your statutory rights under Australian Consumer Law.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Questions?</h2>
          <p>
            If you have any questions about warranty coverage, please{" "}
            <Link href="/contact" className="text-primary hover:underline">contact us</Link> or call{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
