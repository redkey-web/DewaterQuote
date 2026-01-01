import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery Policy | Dewater Products",
  description: "Free delivery to Australian metro areas. Road freight transit times and delivery information for Dewater Products orders.",
}

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Delivery Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            Dewater Products Pty Ltd offer free delivery in Australia to Metro Areas and some rural areas using road freight.
          </p>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200 m-0">
              <strong>Please note:</strong> We reserve the right to decline deliveries to certain Metro addresses where there are excessively long wait times, challenging delivery conditions, or where delivery costs exceed our standard rates. This policy is in place to ensure the efficiency and sustainability of our service.
            </p>
          </div>

          <p>
            We do not provide free delivery to remote locations or hard to reach locations resulting in a higher than normal freight charge.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Transit Times</h2>
          <p>Road freight transit times will vary depending on your state as follows:</p>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">State/Territory</th>
                  <th className="px-4 py-3 text-left font-semibold">Transit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">Western Australia (WA)</td>
                  <td className="px-4 py-3">1 to 2 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">South Australia (SA)</td>
                  <td className="px-4 py-3">3 to 4 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Victoria (VIC) / New South Wales (NSW)</td>
                  <td className="px-4 py-3">5 to 7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Australian Capital Territory (ACT)</td>
                  <td className="px-4 py-3">5 to 7 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Queensland (QLD)</td>
                  <td className="px-4 py-3">7 to 10 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Northern Territory (NT)</td>
                  <td className="px-4 py-3">7 to 10 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Tasmania (TAS)</td>
                  <td className="px-4 py-3">8 to 10 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted-foreground">
            Please also consider if the product(s) you have ordered has a lead time as well.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Questions?</h2>
          <p>
            If you have any questions about delivery, please <a href="/contact" className="text-primary hover:underline">contact us</a> or call <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
