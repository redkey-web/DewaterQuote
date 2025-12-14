import CategorySection from "../CategorySection";
import { Wrench, Gauge, ArrowLeftRight, Filter } from "lucide-react";

export default function CategorySectionExample() {
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

  return <CategorySection categories={categories} />;
}
