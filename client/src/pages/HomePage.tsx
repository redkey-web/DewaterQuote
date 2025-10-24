import Hero from "@/components/Hero";
import TrustMetrics from "@/components/TrustMetrics";
import CategorySection from "@/components/CategorySection";
import BrandSection from "@/components/BrandSection";
import IndustrySection from "@/components/IndustrySection";
import { Wrench, Gauge, ArrowLeftRight, Filter, Droplet, Sprout, Flame, Pickaxe } from "lucide-react";

export default function HomePage() {
  const categories = [
    {
      name: "Clamps & Couplings",
      description: "Pipe couplings, repair clamps, and flange adaptors",
      url: "/clamps-couplings",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      name: "Valves",
      description: "Check valves, gate valves, and ball valves",
      url: "/valves",
      icon: <Gauge className="w-8 h-8" />,
    },
    {
      name: "Expansion Joints",
      description: "Rubber, PTFE, and stainless/fabric joints",
      url: "/expansion-joints",
      icon: <ArrowLeftRight className="w-8 h-8" />,
    },
    {
      name: "Strainers & Filters",
      description: "Y strainers, basket, T, and duplex strainers",
      url: "/strainers",
      icon: <Filter className="w-8 h-8" />,
    },
  ];

  const brands = [
    {
      name: "Straub",
      description: "German engineering excellence in pipe couplings and repair solutions",
      url: "/brands/straub",
    },
    {
      name: "Orbit",
      description: "Premium valves and fittings for demanding industrial applications",
      url: "/brands/orbit",
    },
    {
      name: "Teekay",
      description: "Innovative expansion joints and flexible connectors",
      url: "/brands/teekay",
    },
  ];

  const industries = [
    {
      name: "Water & Wastewater",
      description: "Reliable solutions for water treatment and distribution",
      url: "/industries/water-wastewater",
    },
    {
      name: "Irrigation",
      description: "Efficient systems for agricultural applications",
      url: "/industries/irrigation",
    },
    {
      name: "Fire Services",
      description: "Critical components for fire protection systems",
      url: "/industries/fire-services",
    },
    {
      name: "Mining",
      description: "Robust fittings for harsh mining environments",
      url: "/industries/mining",
    },
  ];

  return (
    <div>
      <Hero />
      <TrustMetrics />
      <CategorySection categories={categories} />
      <BrandSection brands={brands} />
      <IndustrySection industries={industries} />
    </div>
  );
}
