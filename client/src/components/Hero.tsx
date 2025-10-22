import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import heroImage from "@assets/generated_images/Industrial_pipe_fittings_hero_image_29db0b69.png";

export default function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Industrial Pipe Fittings & Valves
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Quality couplings, valves, expansion joints and strainers from leading brands Straub, Orbit and Teekay
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground border border-primary-border" data-testid="button-request-quote">
            Request a Quote <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm text-white border-white/30 hover:bg-background/20" data-testid="button-download-price-list">
            <FileText className="mr-2 w-5 h-5" />
            Download Price List
          </Button>
        </div>
      </div>
    </section>
  );
}
