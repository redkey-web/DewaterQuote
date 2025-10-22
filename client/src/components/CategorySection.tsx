import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Category {
  name: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Product Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of industrial pipe fittings, valves, and accessories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.url} data-testid={`link-category-${index}`}>
              <Card className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4 text-primary">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    View Products <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
