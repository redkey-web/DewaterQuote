import IndustrySection from "../IndustrySection";

export default function IndustrySectionExample() {
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
    {
      name: "Marine",
      description: "Corrosion-resistant marine-grade products",
      url: "/industries/marine",
    },
    {
      name: "HVAC",
      description: "Precision components for climate control",
      url: "/industries/hvac",
    },
    {
      name: "Food & Beverage",
      description: "Hygienic fittings for food processing",
      url: "/industries/food-beverage",
    },
  ];

  return <IndustrySection industries={industries.slice(0, 4)} />;
}
