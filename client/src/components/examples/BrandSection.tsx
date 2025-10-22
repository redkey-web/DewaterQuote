import BrandSection from "../BrandSection";

export default function BrandSectionExample() {
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

  return <BrandSection brands={brands} />;
}
