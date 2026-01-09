"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  X,
  Package,
  TrendingDown,
  AlertCircle,
  Loader2,
  Building2,
  MapPin,
  Truck,
  FileText,
  Plus,
  Minus,
  Trash2,
  FileCheck,
  Square,
  CheckSquare,
} from "lucide-react"
import {
  getQuoteItemSKU,
  getQuoteItemPrice,
  getQuoteItemSubtotal,
  getQuoteItemDiscountedSubtotal,
  getQuoteItemSavings,
  getDiscountPercentage,
  getQuoteItemSizeLabel,
  calculateMaterialCertFee,
  getMaterialCertCount,
} from "@/lib/quote"
import { useQuote } from "@/context/QuoteContext"
import { useToast } from "@/hooks/use-toast"
import { useGeo } from "@/hooks/useGeo"
import { Turnstile } from "@/components/Turnstile"
import { trackQuoteSubmission } from "@/components/GoogleAnalytics"

const addressSchema = z.object({
  street: z.string().min(5, "Please enter a valid street address"),
  suburb: z.string().min(2, "Please enter a suburb"),
  state: z.string().min(2, "Please select a state"),
  postcode: z.string().regex(/^\d{4}$/, "Please enter a valid 4-digit postcode"),
})

const quoteFormSchema = z.object({
  // Company Details
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  // Delivery Address
  deliveryAddress: addressSchema,
  // Billing Address
  billingSameAsDelivery: z.boolean().default(true),
  billingAddress: z.object({
    street: z.string(),
    suburb: z.string(),
    state: z.string(),
    postcode: z.string(),
  }).optional(),
  // Notes
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  // Only validate billing address if NOT same as delivery
  if (!data.billingSameAsDelivery) {
    if (!data.billingAddress?.street || data.billingAddress.street.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid street address", path: ["billingAddress", "street"] })
    }
    if (!data.billingAddress?.suburb || data.billingAddress.suburb.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a suburb", path: ["billingAddress", "suburb"] })
    }
    if (!data.billingAddress?.state || data.billingAddress.state.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a state", path: ["billingAddress", "state"] })
    }
    if (!data.billingAddress?.postcode || !/^\d{4}$/.test(data.billingAddress.postcode)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid 4-digit postcode", path: ["billingAddress", "postcode"] })
    }
  }
})

type QuoteFormValues = z.infer<typeof quoteFormSchema>

export default function RequestQuotePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items: quoteItems, removeItem, clearQuote, updateItemQuantity, toggleMaterialCert } = useQuote()
  const { isAustralia } = useGeo()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  // Calculate pricing totals
  const pricedItems = quoteItems.filter((item) => getQuoteItemPrice(item) !== undefined)
  const unpricedItems = quoteItems.filter((item) => getQuoteItemPrice(item) === undefined)
  const hasUnpricedItems = unpricedItems.length > 0
  const totalQuantity = quoteItems.reduce((sum, item) => sum + item.quantity, 0)
  const uniqueItems = quoteItems.length
  // Discount applies based on TOTAL cart quantity, not per-item
  const discountedTotal = pricedItems.reduce(
    (sum, item) => sum + (getQuoteItemDiscountedSubtotal(item, totalQuantity) || 0),
    0
  )
  const totalSavings = pricedItems.reduce((sum, item) => sum + getQuoteItemSavings(item, totalQuantity), 0)
  const certFeeTotal = calculateMaterialCertFee(quoteItems)
  const certCount = getMaterialCertCount(quoteItems)

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      deliveryAddress: {
        street: "",
        suburb: "",
        state: "",
        postcode: "",
      },
      billingSameAsDelivery: true,
      billingAddress: {
        street: "",
        suburb: "",
        state: "",
        postcode: "",
      },
      notes: "",
    },
  })

  const billingSameAsDelivery = form.watch("billingSameAsDelivery")

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  // Check if Turnstile is required (env var set)
  // TEMPORARILY DISABLED for testing - set to false to allow submissions
  const turnstileRequired = false // !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const canSubmit = !turnstileRequired || turnstileToken

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: data.companyName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          deliveryAddress: data.deliveryAddress,
          billingAddress: data.billingSameAsDelivery ? data.deliveryAddress : data.billingAddress,
          notes: data.notes,
          items: quoteItems.map((item) => ({
            id: item.id,
            name: item.name,
            sku: getQuoteItemSKU(item),
            brand: item.brand,
            category: item.category,
            quantity: item.quantity,
            materialTestCert: item.materialTestCert,
            variation: item.variation ? {
              sku: item.variation.sku,
              sizeLabel: item.variation.sizeLabel,
              price: item.variation.unitPrice,
            } : undefined,
            customSpecs: item.customSpecs,
          })),
          totals: {
            itemCount: quoteItems.length,
            pricedTotal: discountedTotal,
            savings: totalSavings,
            hasUnpricedItems,
            certFee: certFeeTotal,
            certCount: certCount,
          },
          turnstileToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quote request")
      }

      // Track conversion in GA4
      const productNames = quoteItems.map(item => item.name).join(', ')
      trackQuoteSubmission(productNames, quoteItems.length)

      setIsSubmitted(true)
      clearQuote()
      toast({
        title: "Quote Sent",
        description: "Our team will contact you within 1-2 business days.",
      })
    } catch (error) {
      console.error("Quote form error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen underwater-bg flex items-center justify-center px-6">
        {/* Animated underwater elements */}
        <div className="wave-top" />
        <div className="caustics" />

        {/* Floating bubbles */}
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />
        <div className="bubble bubble-6" />
        <div className="bubble bubble-7" />
        <div className="bubble bubble-8" />

        {/* Floating sediment particles */}
        <div className="sediment sediment-1" />
        <div className="sediment sediment-2" />
        <div className="sediment sediment-3" />
        <div className="sediment sediment-4" />
        <div className="sediment sediment-5" />
        <div className="sediment sediment-6" />
        <div className="sediment sediment-7" />

        <Card className="max-w-2xl w-full relative z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 p-4 shadow-lg shadow-cyan-500/30 animate-pulse">
                <CheckCircle2
                  className="w-16 h-16 text-white"
                  data-testid="icon-success"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent" data-testid="text-success-title">
              Quote Sent!
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-success-message">
              Your quote has been sent to your email. Please check your inbox for the full
              quote with pricing and terms.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => router.push("/")}
                data-testid="button-home"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/25"
              >
                Return to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
                data-testid="button-browse"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-950"
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quoteItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-24">
            <Package
              className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6"
              data-testid="icon-empty-cart"
            />
            <h1 className="text-3xl font-bold mb-4" data-testid="text-empty-title">
              Your Quote is Empty
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-empty-message">
              Add products to your quote to request pricing from our team.
            </p>
            <Button onClick={() => router.push("/")} data-testid="button-browse-products">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
          Request a Quote
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Fill out the form below and our team will provide you with a detailed quote.
        </p>
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This quote is not a binding purchase order. To proceed, reply to the quote email or call 1300 271 290.
            We will review your requirements and respond within 1-2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice-Style Quote Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Your Items
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {totalQuantity} item{totalQuantity !== 1 ? 's' : ''} ({uniqueItems} unique)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Invoice Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">SKU</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Qty</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Unit Price</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Line Total</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteItems.map((item) => {
                        const price = getQuoteItemPrice(item)
                        const sku = getQuoteItemSKU(item)
                        const sizeLabel = getQuoteItemSizeLabel(item)
                        const subtotal = getQuoteItemSubtotal(item)
                        const discountedSubtotal = getQuoteItemDiscountedSubtotal(item, totalQuantity)
                        const discountPercent = getDiscountPercentage(totalQuantity)
                        const hasDiscount = discountPercent > 0

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-border last:border-0"
                            data-testid={`quote-item-${item.id}`}
                          >
                            {/* Product */}
                            <td className="py-3 px-2">
                              <div className="font-medium" data-testid={`text-product-name-${item.id}`}>
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.brand}{sizeLabel ? ` • ${sizeLabel}` : ""}
                              </div>
                              <div className="text-xs text-muted-foreground sm:hidden">
                                {sku}
                              </div>
                              {/* Custom Specs Display (Straub/Teekay products) */}
                              {item.customSpecs && (
                                <div className="mt-1 p-2 bg-muted/50 rounded text-xs space-y-1">
                                  <p className="text-foreground">
                                    <span className="text-muted-foreground">Pipe OD:</span> {item.customSpecs.pipeOd} |
                                    <span className="text-muted-foreground"> Material:</span> {item.customSpecs.rubberMaterial} |
                                    <span className="text-muted-foreground"> Pressure:</span> {item.customSpecs.pressure}
                                  </p>
                                  {item.customSpecs.notes && (
                                    <p className="text-muted-foreground italic">{item.customSpecs.notes}</p>
                                  )}
                                </div>
                              )}
                              {isAustralia && hasDiscount && (
                                <Badge
                                  variant="secondary"
                                  className="bg-destructive/10 text-destructive text-xs mt-1"
                                >
                                  {discountPercent}% OFF
                                </Badge>
                              )}
                              {/* Material Certificate Toggle - Prominent red box */}
                              <button
                                type="button"
                                onClick={() => toggleMaterialCert(item.id)}
                                className={`flex items-center gap-2 text-xs mt-2 px-3 py-2 rounded-md border-2 transition-all ${
                                  item.materialTestCert
                                    ? "bg-red-50 dark:bg-red-950 border-red-500 text-red-700 dark:text-red-300 shadow-sm"
                                    : "bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:border-red-500 hover:bg-red-50"
                                }`}
                                title={item.materialTestCert ? "Remove material certificate" : "Add material certificate (+$350)"}
                              >
                                {item.materialTestCert ? (
                                  <CheckSquare className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 flex-shrink-0" />
                                )}
                                <FileCheck className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">{item.materialTestCert ? "Material Cert Added" : "Add Material Cert (+$350)"}</span>
                              </button>
                            </td>

                            {/* SKU */}
                            <td
                              className="py-3 px-2 font-mono text-xs text-muted-foreground hidden sm:table-cell"
                              data-testid={`text-sku-${item.id}`}
                            >
                              {sku}
                            </td>

                            {/* Quantity - Editable */}
                            <td className="py-3 px-2">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center border border-border rounded-md">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                    data-testid={`button-decrease-${item.id}`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span
                                    className="px-2 text-sm font-medium min-w-[2rem] text-center"
                                    data-testid={`text-quantity-${item.id}`}
                                  >
                                    {item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                    data-testid={`button-increase-${item.id}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </td>

                            {/* Unit Price */}
                            <td className="py-3 px-2 text-right hidden md:table-cell">
                              {isAustralia ? (
                                price !== undefined ? (
                                  <span>${price.toFixed(2)}</span>
                                ) : (
                                  <span className="text-amber-600">POA</span>
                                )
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>

                            {/* Line Total */}
                            <td className="py-3 px-2 text-right font-medium">
                              {isAustralia ? (
                                price !== undefined ? (
                                  hasDiscount ? (
                                    <div>
                                      <span className="line-through text-xs text-muted-foreground block">
                                        ${subtotal?.toFixed(2)}
                                      </span>
                                      <span className="text-primary">${discountedSubtotal?.toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <span>${subtotal?.toFixed(2)}</span>
                                  )
                                ) : (
                                  <span className="text-amber-600">POA</span>
                                )
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>

                            {/* Remove */}
                            <td className="py-3 px-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                                data-testid={`button-remove-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quote Summary */}
                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  {/* Subtotal - AU only */}
                  {isAustralia && pricedItems.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({pricedItems.length} items)</span>
                        <span>
                          ${pricedItems.reduce((sum, item) => sum + (getQuoteItemSubtotal(item) || 0), 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Bulk Discount */}
                      {totalSavings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-destructive flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            Bulk Discount
                          </span>
                          <span className="text-destructive font-medium" data-testid="text-total-savings">
                            -${totalSavings.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Material Certificates */}
                      {certFeeTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <FileCheck className="w-4 h-4" />
                            Material Certificates ({certCount})
                          </span>
                          <span>${certFeeTotal.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Delivery */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Delivery (Metro)
                        </span>
                        <span className="text-green-600 font-medium">FREE</span>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold">Total (ex GST)</span>
                        <span className="text-2xl font-bold text-primary" data-testid="text-discounted-total">
                          ${(discountedTotal + certFeeTotal).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>GST (10%)</span>
                        <span>${((discountedTotal + certFeeTotal) * 0.1).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total (inc GST)</span>
                        <span className="font-semibold">${((discountedTotal + certFeeTotal) * 1.1).toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {/* Non-AU message */}
                  {!isAustralia && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Pricing is available for Australian customers.
                        <br />
                        Submit your quote and we&apos;ll provide a custom price.
                      </p>
                    </div>
                  )}

                  {/* Unpriced Items Notice */}
                  {hasUnpricedItems && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          {unpricedItems.length} item{unpricedItems.length !== 1 ? "s require" : " requires"} pricing confirmation
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          Final quote will include pricing for all items.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log('Form validation errors:', errors))} className="space-y-8">
                    {/* Company Details Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ABC Industries Pty Ltd"
                                autoComplete="organization"
                                {...field}
                                data-testid="input-company-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                autoComplete="name"
                                {...field}
                                data-testid="input-contact-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.smith@company.com"
                                autoComplete="email"
                                {...field}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+61 400 000 000"
                                autoComplete="tel"
                                {...field}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Delivery Address Section */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5" />
                        Delivery Address
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="deliveryAddress.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Industrial Drive"
                                  autoComplete="shipping street-address"
                                  {...field}
                                  data-testid="input-delivery-street"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="deliveryAddress.suburb"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Suburb *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Welshpool"
                                    autoComplete="shipping address-level2"
                                    {...field}
                                    data-testid="input-delivery-suburb"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deliveryAddress.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-delivery-state">
                                      <SelectValue placeholder="State" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="WA">WA</SelectItem>
                                    <SelectItem value="NSW">NSW</SelectItem>
                                    <SelectItem value="VIC">VIC</SelectItem>
                                    <SelectItem value="QLD">QLD</SelectItem>
                                    <SelectItem value="SA">SA</SelectItem>
                                    <SelectItem value="TAS">TAS</SelectItem>
                                    <SelectItem value="NT">NT</SelectItem>
                                    <SelectItem value="ACT">ACT</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deliveryAddress.postcode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postcode *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="6106"
                                    autoComplete="shipping postal-code"
                                    maxLength={4}
                                    {...field}
                                    data-testid="input-delivery-postcode"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Billing Address Section */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5" />
                        Billing Address
                      </h3>

                      <FormField
                        control={form.control}
                        name="billingSameAsDelivery"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-billing-same"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Same as delivery address</FormLabel>
                              <FormDescription>
                                Uncheck if billing address is different
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {!billingSameAsDelivery && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <FormField
                            control={form.control}
                            name="billingAddress.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123 Billing Street"
                                    autoComplete="billing street-address"
                                    {...field}
                                    data-testid="input-billing-street"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField
                              control={form.control}
                              name="billingAddress.suburb"
                              render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                  <FormLabel>Suburb *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Perth"
                                      autoComplete="billing address-level2"
                                      {...field}
                                      data-testid="input-billing-suburb"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billingAddress.state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-billing-state">
                                        <SelectValue placeholder="State" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="WA">WA</SelectItem>
                                      <SelectItem value="NSW">NSW</SelectItem>
                                      <SelectItem value="VIC">VIC</SelectItem>
                                      <SelectItem value="QLD">QLD</SelectItem>
                                      <SelectItem value="SA">SA</SelectItem>
                                      <SelectItem value="TAS">TAS</SelectItem>
                                      <SelectItem value="NT">NT</SelectItem>
                                      <SelectItem value="ACT">ACT</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billingAddress.postcode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postcode *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="6000"
                                      autoComplete="billing postal-code"
                                      maxLength={4}
                                      {...field}
                                      data-testid="input-billing-postcode"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Additional Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requirements, delivery instructions, or questions..."
                              className="min-h-24"
                              {...field}
                              data-testid="textarea-notes"
                            />
                          </FormControl>
                          <FormDescription>
                            Include any specific delivery requirements or project details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Turnstile Widget */}
                    <Turnstile
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileExpire}
                      className="flex justify-center"
                    />

                    {/* Quote Conditions */}
                    <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground space-y-3">
                      <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Free delivery for metro areas. If there are any shipping costs for regional locations, we will confirm on final quote.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">Warranty:</span> Up to 5 years on Orbit/Straub pipe couplings* | 12 months on all other products (including repair clamps)
                        </div>
                      </div>
                      <div className="border-t border-border pt-2 mt-2 space-y-1">
                        <p>• Quote valid for 30 days from submission</p>
                        <p>• All prices exclude GST</p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || !canSubmit}
                      data-testid="button-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Get Quote"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick totals */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Items</span>
                  <span className="text-2xl font-bold" data-testid="text-total-items">
                    {quoteItems.length}
                  </span>
                </div>
                {isAustralia && pricedItems.length > 0 && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Est. Total</span>
                    <span className="text-xl font-bold text-primary" data-testid="text-estimated-total">
                      ${(discountedTotal + certFeeTotal).toFixed(2)}
                    </span>
                  </div>
                )}
                {isAustralia && totalSavings > 0 && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-destructive">You Save</span>
                    <span className="font-bold text-destructive">
                      ${totalSavings.toFixed(2)}
                    </span>
                  </div>
                )}
                {isAustralia && certCount > 0 && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Certificates</span>
                    <span className="font-medium">
                      {certCount} (+${certFeeTotal})
                    </span>
                  </div>
                )}
                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Our team reviews your request</li>
                    <li>• We prepare a detailed quote</li>
                    <li>• Response within 1-2 business days</li>
                    <li>• Questions? We&apos;re here to help</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Contact Us</h4>
                  <p className="text-sm text-muted-foreground">
                    Phone: 1300 271 290
                    <br />
                    Email: sales@dewaterproducts.com.au
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
