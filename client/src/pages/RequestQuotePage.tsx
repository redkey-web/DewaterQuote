import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, X, Package } from "lucide-react";
import { SEO } from "@/components/SEO";
import type { Product } from "@shared/schema";

const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  company: z.string().optional(),
  message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface RequestQuotePageProps {
  quoteItems: Product[];
  onRemoveFromQuote: (productId: string) => void;
  onClearQuote: () => void;
}

export default function RequestQuotePage({
  quoteItems,
  onRemoveFromQuote,
  onClearQuote,
}: RequestQuotePageProps) {
  const [, navigate] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = (data: QuoteFormValues) => {
    console.log("Quote request submitted:", {
      ...data,
      items: quoteItems.map(item => ({
        sku: item.sku,
        name: item.name,
        brand: item.brand,
      })),
    });
    setIsSubmitted(true);
    onClearQuote();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <SEO
          title="Quote Request Submitted - deWater Products"
          description="Your quote request has been successfully submitted. Our team will contact you shortly."
          canonical="https://dewaterproducts.com.au/request-quote"
        />
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" data-testid="icon-success" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4" data-testid="text-success-title">
              Quote Request Submitted
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-success-message">
              Thank you for your quote request. Our team will review your requirements and contact you within 1-2 business days.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} data-testid="button-home">
                Return to Home
              </Button>
              <Button variant="outline" onClick={() => navigate("/products")} data-testid="button-browse">
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quoteItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Request a Quote - deWater Products"
          description="Request a quote for industrial pipe fittings, valves, couplings, and expansion joints. Fast quotes from deWater Products Australia."
          canonical="https://dewaterproducts.com.au/request-quote"
        />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-24">
            <Package className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" data-testid="icon-empty-cart" />
            <h1 className="text-3xl font-bold mb-4" data-testid="text-empty-title">Your Quote is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-empty-message">
              Add products to your quote to request pricing from our team.
            </p>
            <Button onClick={() => navigate("/")} data-testid="button-browse-products">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Request a Quote - deWater Products"
        description="Request a quote for industrial pipe fittings, valves, couplings, and expansion joints. Fast quotes from deWater Products Australia."
        canonical="https://dewaterproducts.com.au/request-quote"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Request a Quote</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Fill out the form below and our team will provide you with a detailed quote.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Quote Items ({quoteItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quoteItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-4" data-testid={`quote-item-${item.id}`}>
                      <div className="flex-1">
                        <h3 className="font-semibold" data-testid={`text-product-name-${item.id}`}>
                          {item.shortName || item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono" data-testid={`text-sku-${item.id}`}>
                          SKU: {item.sku}
                        </p>
                        <Badge variant="secondary" className="mt-2" data-testid={`badge-brand-${item.id}`}>
                          {item.brand}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFromQuote(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} data-testid="input-name" />
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
                              placeholder="john.smith@example.com"
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
                            <Input placeholder="+61 400 000 000" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Industries Pty Ltd" {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Requirements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide any additional information about your requirements, quantities needed, delivery location, or specific technical questions..."
                              className="min-h-32"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg" data-testid="button-submit">
                      Submit Quote Request
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
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold" data-testid="text-total-items">{quoteItems.length}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Our team reviews your request</li>
                    <li>• We prepare a detailed quote</li>
                    <li>• You receive pricing within 1-2 business days</li>
                    <li>• Questions? We're here to help</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Contact Us</h4>
                  <p className="text-sm text-muted-foreground">
                    Phone: 1300 123 456<br />
                    Email: sales@dewaterproducts.com.au
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
