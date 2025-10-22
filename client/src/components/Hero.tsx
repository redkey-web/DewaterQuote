import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import heroImage from "@assets/58_1761097233222.jpg";

export default function Hero() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Industrial Pipe Fittings & Valves
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Quality couplings, valves, expansion joints and strainers from leading brands Straub, Orbit and Teekay
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" data-testid="button-request-quote">
                Request a Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-download-price-list">
                <FileText className="mr-2 w-5 h-5" />
                Download Price List
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Industrial pipe fittings and valves"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
