import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Droplet, Sprout, Flame, Pickaxe, Ship, Wind, UtensilsCrossed } from "lucide-react";

const industryIcons: Record<string, React.ReactNode> = {
  "Water & Wastewater": <Droplet className="w-8 h-8" />,
  "Irrigation": <Sprout className="w-8 h-8" />,
  "Fire Services": <Flame className="w-8 h-8" />,
  "Mining": <Pickaxe className="w-8 h-8" />,
  "Marine": <Ship className="w-8 h-8" />,
  "HVAC": <Wind className="w-8 h-8" />,
  "Food & Beverage": <UtensilsCrossed className="w-8 h-8" />,
};

interface Industry {
  name: string;
  description: string;
  url: string;
}

interface IndustrySectionProps {
  industries: Industry[];
}

export default function IndustrySection({ industries }: IndustrySectionProps) {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialised solutions for diverse industrial sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <Link key={industry.name} href={industry.url} data-testid={`link-industry-${industry.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4 text-primary">{industryIcons[industry.name]}</div>
                  <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
