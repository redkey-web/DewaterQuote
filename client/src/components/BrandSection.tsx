import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface Brand {
  name: string;
  description: string;
  url: string;
}

interface BrandSectionProps {
  brands: Brand[];
}

export default function BrandSection({ brands }: BrandSectionProps) {
  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted Brands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We partner with leading manufacturers to bring you quality products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link key={brand.name} href={brand.url} data-testid={`link-brand-${brand.name.toLowerCase()}`}>
              <Card className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-primary mb-3">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">{brand.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
