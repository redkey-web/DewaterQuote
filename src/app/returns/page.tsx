import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns Policy | Dewater Products",
  description: "Returns and refund policy for Dewater Products orders. 7-day return window with conditions.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Returns Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            If you wish to return goods because you have changed your mind, ordered the wrong item,
            or find our goods have been damaged in transit, please email us within 7 days of receiving
            your goods at{" "}
            <a href="mailto:sales@dewaterproducts.com.au" className="text-primary hover:underline">
              sales@dewaterproducts.com.au
            </a>
          </p>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200 m-0">
              <strong>Please note:</strong> If the return is due to an error on your part (wrong item ordered,
              change of mind, etc.), a 30% restocking fee will apply.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Conditions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items must be returned within 7 days of receipt</li>
            <li>Items must be in original, unopened packaging</li>
            <li>Items must be in resaleable condition</li>
            <li>Custom or special order items cannot be returned</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Address</h2>
          <p>
            Please return goods to:
          </p>
          <address className="not-italic bg-muted p-4 rounded-lg">
            Dewater Products Pty Ltd<br />
            67 Howe Street<br />
            Osborne Park WA 6017
          </address>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Damaged Goods</h2>
          <p>
            If your goods arrive damaged, please take photos of the damage and email them to us
            within 48 hours of delivery. We will arrange a replacement or refund at no additional cost.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Questions?</h2>
          <p>
            If you have any questions about returns, please{" "}
            <a href="/contact" className="text-primary hover:underline">contact us</a> or call{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
