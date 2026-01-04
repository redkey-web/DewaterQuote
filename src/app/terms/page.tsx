import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Use | Dewater Products",
  description: "Website terms of use for Dewater Products. Conditions for using our website, intellectual property, and liability information.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            By continuing to browse and use this website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Content Disclaimer</h2>
          <p>
            The content of the pages of this website is for your general information and use only. It is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.
          </p>
          <p>
            You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibility</h2>
          <p>
            Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p>
            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
          </p>
          <p>
            All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Unauthorised Use</h2>
          <p>
            Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">External Links</h2>
          <p>
            From time to time, this website may include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p>
            Your use of this website and any dispute arising out of such use of the website is subject to the laws of Australia.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Related Policies</h2>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Link
              href="/privacy"
              className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <h3 className="font-semibold">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">How we handle your data</p>
            </Link>
            <Link
              href="/delivery"
              className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <h3 className="font-semibold">Delivery Policy</h3>
              <p className="text-sm text-muted-foreground">Shipping and transit times</p>
            </Link>
            <Link
              href="/returns"
              className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <h3 className="font-semibold">Returns Policy</h3>
              <p className="text-sm text-muted-foreground">Returns and refunds</p>
            </Link>
            <Link
              href="/warranty"
              className="block p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
            >
              <h3 className="font-semibold">Warranty</h3>
              <p className="text-sm text-muted-foreground">Product warranty terms</p>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </div>
  )
}
