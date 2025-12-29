import type { Product, Category, Subcategory } from "@/types";

// Helper to generate image array from SKU using local optimized images
// First image is transparent background (nobg), followed by original and alts
function getOptimizedImages(sku: string, productName: string, altCount: number = 0): { url: string; alt: string; type: "image" }[] {
  const images: { url: string; alt: string; type: "image" }[] = [
    // Transparent background version first (hero image)
    { url: `/images/products/nobg/${sku}_nobg.png`, alt: productName, type: "image" },
    // Original with background second
    { url: `/images/products/optimized/${sku}.jpg`, alt: `${productName} - Product Photo`, type: "image" }
  ];
  // Additional alt views
  for (let i = 1; i <= altCount; i++) {
    images.push({ url: `/images/products/optimized/${sku}_alt${i}.jpg`, alt: `${productName} - View ${i + 1}`, type: "image" });
  }
  return images;
}


// Helper for Straub products - converts filename to nobg path format
// e.g., "straub-metal-grip" -> nobg file "STRAUB-METAL_GRIP_nobg.png"
function getStraubImages(filename: string, productName: string): { url: string; alt: string; type: "image" }[] {
  // Convert filename to nobg format: straub-metal-grip -> STRAUB-METAL_GRIP
  const nobgName = filename.replace('straub-', 'STRAUB-').replace(/-/g, '_').toUpperCase().replace('STRAUB_', 'STRAUB-');
  return [
    { url: `/images/products/nobg/${nobgName}_nobg.png`, alt: productName, type: "image" },
    { url: `/images/products/straub/${filename}.png`, alt: `${productName} - Product Photo`, type: "image" }
  ];
}

// Real Products from dewaterproducts.com.au
export const products: Product[] = [
  // Butterfly Valves
  {
    id: "BFLYW316",
    slug: "butterfly-valve-316-stainless-steel-cf8m-body-ptfe",
    sku: "BFLYW316",
    name: "Butterfly Valve - CF8M Full 316 Stainless Steel - PTFE - Wafer Universal",
    shortName: "CF8M Butterfly Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "butterfly-valve",
    description: "Stainless Steel bodied CF8M Butterfly Valve with EPDM/PTFE seat. Universal wafer design to suit a range of flanges and lever operated.",
    features: [
      "Maximum Temperature: 120 Degrees Celsius",
      "Rated to PN16 working pressure in sizes up to DN300 / 12 inches / 300mm",
      "Universal wafer design",
      "Lever operated",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "BFLYW316" },
      { label: "Brand", value: "Butterfly Valve - CF8M 316 Stainless Steel - PTFE" },
      { label: "Body Material", value: "CF8M (Cast 316 stainless steel)" },
      { label: "Lever Material", value: "304 stainless steel" },
      { label: "Seat Material", value: "PTFE" },
      { label: "Pressure Rating", value: "PN16" },
      { label: "Max Temperature", value: "120°C" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. PTFE seat material complies with relevant food-grade and potable water standards.",
    sizeOptions: [
      { value: "50mm", label: "50mm DN50 (2\") Nominal Bore sizing", price: 285, sku: "BFLYW316-50" },
      { value: "65mm", label: "65mm", price: 325, sku: "BFLYW316-65" },
      { value: "80mm", label: "80mm DN80 (3\") Nominal Bore sizing", price: 375, sku: "BFLYW316-80" },
      { value: "100mm", label: "100mm DN100 (4\") Nominal Bore sizing", price: 425, sku: "BFLYW316-100" },
      { value: "125mm", label: "125mm", price: 525, sku: "BFLYW316-125" },
      { value: "150mm", label: "150mm", price: 625, sku: "BFLYW316-150" },
      { value: "200mm", label: "200mm", price: 825, sku: "BFLYW316-200" },
      { value: "250mm", label: "250mm", price: 1125, sku: "BFLYW316-250" },
      { value: "300mm", label: "300mm", price: 1425, sku: "BFLYW316-300" }
    ],
    images: getOptimizedImages("BFLYW316", "CF8M Butterfly Valve 316 Stainless Steel", 2),
    leadTime: "7 days if nil stock",
    materials: {
      body: "CF8M",
      disc: "CF8M",
      seat: "PTFE"
    },
    pressureRange: "0-16 BAR",
    sizeFrom: "50mm",
    priceVaries: true,
    priceNote: "Please check product sizing carefully before ordering. All prices exclude GST."
  },

  // Lugged Butterfly Valve - CF8M 316 Stainless Steel
  {
    id: "BFLYLE316",
    slug: "lugged-butterfly-valve-cf8m-316-stainless-steel",
    sku: "BFLYLE316",
    name: "Lugged Butterfly Valve - CF8M 316 Stainless Steel - EPDM or PTFE - Table E",
    shortName: "Lugged CF8M Butterfly Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "butterfly-valve",
    description: "Stainless steel bodied CF8M Butterfly Valve, lugged Table E, with an EPDM/PTFE seat. Rated to PN16 up to size 300mm. Lever operated. The lugged design suits end-of-pipeline installations, typically at tank or hopper inlets.",
    features: [
      "Lugged Table E design for end-of-line installations",
      "Rated to PN16 working pressure up to DN300",
      "CF8M (316 stainless steel) body and disc",
      "EPDM or PTFE seat options available",
      "Lever operated",
      "Ideal for tank and hopper inlet applications",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "BFLYLE316" },
      { label: "Brand", value: "Lugged CF8M Butterfly Valve - EPDM or PTFE - T/E" },
      { label: "Body Material", value: "CF8M (Cast 316 stainless steel)" },
      { label: "Disc Material", value: "CF8M" },
      { label: "Seat Material", value: "EPDM or PTFE" },
      { label: "Flange Standard", value: "Table E" },
      { label: "Pressure Rating", value: "PN16" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. Table E flange compliance.",
    sizeOptions: [
      { value: "50mm", label: "50mm DN50 (2\") Nominal Bore", price: 776, sku: "BFLYLE316-50" },
      { value: "65mm", label: "65mm", price: 850, sku: "BFLYLE316-65" },
      { value: "80mm", label: "80mm DN80 (3\") Nominal Bore", price: 925, sku: "BFLYLE316-80" },
      { value: "100mm", label: "100mm DN100 (4\") Nominal Bore", price: 1050, sku: "BFLYLE316-100" },
      { value: "125mm", label: "125mm", price: 1250, sku: "BFLYLE316-125" },
      { value: "150mm", label: "150mm", price: 1450, sku: "BFLYLE316-150" },
      { value: "200mm", label: "200mm", price: 1850, sku: "BFLYLE316-200" },
      { value: "250mm", label: "250mm", price: 2450, sku: "BFLYLE316-250" },
      { value: "300mm", label: "300mm", price: 3050, sku: "BFLYLE316-300" }
    ],
    images: getOptimizedImages("BFLYLE316", "Lugged CF8M Butterfly Valve 316 Stainless Steel", 1),
    leadTime: "3 weeks if nil stock",
    materials: {
      body: "CF8M",
      disc: "CF8M",
      seat: "EPDM/PTFE"
    },
    pressureRange: "0-16 BAR",
    sizeFrom: "50mm",
    priceVaries: true,
    priceNote: "Please check product sizing carefully before ordering. EPDM or PTFE seat - contact us to specify. All prices exclude GST."
  },

  // PTFE Lined Butterfly Valve - Universal Wafer
  {
    id: "PTFELBFLYW",
    slug: "ptfe-lined-butterfly-valve-universal-wafer",
    sku: "PTFELBFLYW",
    name: "PTFE Lined Butterfly Valve - Universal Wafer",
    shortName: "PTFE Lined Butterfly Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "butterfly-valve",
    description: "PTFE Lined Butterfly Valve with disc and seat fully encapsulated with PTFE. Universal wafer pattern to suit ANSI 150LB/Table D/E flanges. Lever operated for smaller sizes, gearbox operated for larger sizes.",
    features: [
      "Disc and seat fully encapsulated with PTFE",
      "Maximum operating temperature: 120°C",
      "Rated to PN10 working pressure up to DN200",
      "Universal wafer pattern (ANSI 150LB/Table D/E)",
      "Lever operated (small sizes) / Gearbox operated (large sizes)",
      "Excellent chemical resistance",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "PTFELBFLYW" },
      { label: "Brand", value: "PTFE Lined Butterfly Valve - Universal Wafer" },
      { label: "Body Material", value: "Ductile Iron (DI)" },
      { label: "Lining Material", value: "PTFE" },
      { label: "Seat Material", value: "PTFE" },
      { label: "Pressure Rating", value: "PN10" },
      { label: "Max Temperature", value: "120°C" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. PTFE lining suitable for chemical and food-grade applications.",
    sizeOptions: [
      { value: "50mm", label: "50mm DN50 (2\") Nominal Bore", price: 1214, sku: "PTFELBFLYW-50" },
      { value: "80mm", label: "80mm DN80 (3\") Nominal Bore", price: 1450, sku: "PTFELBFLYW-80" },
      { value: "100mm", label: "100mm DN100 (4\") Nominal Bore", price: 1650, sku: "PTFELBFLYW-100" },
      { value: "150mm", label: "150mm", price: 2150, sku: "PTFELBFLYW-150" },
      { value: "200mm", label: "200mm", price: 2850, sku: "PTFELBFLYW-200" }
    ],
    images: getOptimizedImages("PTFELBFLYW", "PTFE Lined Butterfly Valve Universal Wafer", 1),
    leadTime: "5-7 days if nil stock",
    materials: {
      body: "Ductile Iron (PTFE Lined)",
      seat: "PTFE"
    },
    pressureRange: "0-10 BAR",
    temperature: "-20°C to +120°C",
    sizeFrom: "50mm",
    priceVaries: true,
    priceNote: "Please check product sizing carefully before ordering. All prices exclude GST."
  },

  // CF8M Wafer Butterfly Valve EPDM
  {
    id: "CF8MWEBFVL",
    slug: "cf8m-wafer-butterfly-valve-epdm-lever-operated",
    sku: "CF8MWEBFVL",
    name: "CF8M Wafer Butterfly Valve - EPDM - Lever Operated",
    shortName: "CF8M EPDM Butterfly Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "butterfly-valve",
    description: "CF8M body Universal Wafer Butterfly Valve with EPDM rubber seat, lever operated. Rated PN16. Full 316 stainless steel construction for excellent corrosion resistance.",
    features: [
      "CF8M (316 stainless steel) body and disc",
      "EPDM rubber seat for excellent sealing",
      "Universal wafer design",
      "Lever operated",
      "Rated to PN16 working pressure",
      "Bi-directional and blow out proof",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "CF8MWEBFVL" },
      { label: "Brand", value: "Butterfly Valve - Full 316 Stainless Steel - EPDM" },
      { label: "Body Material", value: "CF8M (Cast 316 stainless steel)" },
      { label: "Disc Material", value: "CF8M" },
      { label: "Seat Material", value: "EPDM" },
      { label: "Pressure Rating", value: "PN16" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. EPDM seat suitable for water and general industrial applications.",
    sizeOptions: [
      { value: "50mm", label: "50mm DN50 (2\") Nominal Bore", price: 450, sku: "CF8MWEBFVL-50" },
      { value: "65mm", label: "65mm", price: 495, sku: "CF8MWEBFVL-65" },
      { value: "80mm", label: "80mm DN80 (3\") Nominal Bore", price: 545, sku: "CF8MWEBFVL-80" },
      { value: "100mm", label: "100mm DN100 (4\") Nominal Bore", price: 585, sku: "CF8MWEBFVL-100" },
      { value: "125mm", label: "125mm", price: 695, sku: "CF8MWEBFVL-125" },
      { value: "150mm", label: "150mm", price: 825, sku: "CF8MWEBFVL-150" },
      { value: "200mm", label: "200mm", price: 1095, sku: "CF8MWEBFVL-200" },
      { value: "250mm", label: "250mm", price: 1495, sku: "CF8MWEBFVL-250" },
      { value: "300mm", label: "300mm", price: 1895, sku: "CF8MWEBFVL-300" }
    ],
    images: getOptimizedImages("CF8MWEBFVL", "CF8M Wafer Butterfly Valve EPDM", 1),
    leadTime: "2-4 weeks if nil stock",
    materials: {
      body: "CF8M",
      disc: "CF8M",
      seat: "EPDM"
    },
    pressureRange: "0-16 BAR",
    sizeFrom: "50mm",
    priceVaries: true,
    priceNote: "Please check product sizing carefully before ordering. All prices exclude GST."
  },

  // Duckbill Check Valve
  {
    id: "DB-1",
    slug: "db-1-slip-on-duckbill-check-valve-neoprene",
    sku: "DB-1",
    name: "DB-1 Slip On Duckbill Check Valve - Neoprene",
    shortName: "DB-1 Duckbill Check Valve",
    brand: "Teekay",
    category: "valves",
    subcategory: "duckbill-check-valve",
    description: "The Slip On Duckbill Check Valve model DB-1 is installed over the end of a plain ended pipe to prevent back flow. The DB-1 model is a Flat bottom model, with a flared top to enhance flow rates and reduce head loss.",
    features: [
      "Curved Bill model provides 50% more sealing area compared to straight bill",
      "Better tighter seal when debris are present",
      "25mm of fluid/water is all it takes to open the valve",
      "Available in a wide range of sizes: 88.9mm to 1700.0mm",
      "Available in different rubber materials: Neoprene, NBR, EPDM, Viton",
      "12 months warranty on manufacturing defects only"
    ],
    certifications: "Rubber materials comply with relevant water and wastewater standards. Available in WRAS-approved EPDM for potable water applications. 316 stainless steel clamps provide corrosion resistance.",
    specifications: [
      { label: "SKU", value: "DB-1" },
      { label: "Brand", value: "DB-1 Slip On Duckbill Check Valve - Neoprene" },
      { label: "Body Material", value: "Neoprene" },
      { label: "Clamp Material", value: "316 stainless steel" },
      { label: "Type", value: "Slip-on duckbill check valve" },
      { label: "Bill Type", value: "Curved bill with flared top" }
    ],
    sizeOptions: [
      { value: "88.9mm", label: "88.9mm" },
      { value: "90.0mm", label: "90.0mm Pipe Outside Diameter Sizing" },
      { value: "101.6mm", label: "101.6mm" },
      { value: "110.0mm", label: "110.0mm" },
      { value: "114.3mm", label: "114.3mm Pipe Outside Diameter sizing" },
      { value: "125.0mm", label: "125.0mm" },
      { value: "140.0mm", label: "140.0mm" },
      { value: "141.3mm", label: "141.3mm" },
      { value: "160.0mm", label: "160.0mm" },
      { value: "168.3mm", label: "168.3mm Pipe Outside Diameter sizing" },
      { value: "180.0mm", label: "180.0mm Pipe Outside Diameter sizing" },
      { value: "200.0mm", label: "200.0mm" },
      { value: "219.1mm", label: "219.1mm" },
      { value: "225.0mm", label: "225.0mm" },
      { value: "250.0mm", label: "250.0mm" },
      { value: "273.0mm", label: "273.0mm" },
      { value: "280.0mm", label: "280.0mm" },
      { value: "315.0mm", label: "315.0mm" },
      { value: "323.9mm", label: "323.9mm" },
      { value: "355.0mm", label: "355.0mm" },
      { value: "355.6mm", label: "355.6mm" },
      { value: "400.0mm", label: "400.0mm" },
      { value: "406.4mm", label: "406.4mm" },
      { value: "450.0mm", label: "450.0mm" },
      { value: "457.0mm", label: "457.0mm" },
      { value: "500.0mm", label: "500.0mm" },
      { value: "508.0mm", label: "508.0mm" },
      { value: "559.0mm", label: "559.0mm" },
      { value: "560.0mm", label: "560.0mm" },
      { value: "609.6mm", label: "609.6mm Pipe Outside Diameter sizing" },
      { value: "630.0mm", label: "630.0mm" }
    ],
    images: getOptimizedImages("DB-1", "DB-1 Duckbill Check Valve Neoprene", 3),
    downloads: [
      { url: "#", label: "Datasheet" }
    ],
    video: "https://www.youtube.com/watch?v=iCanHpZe7EY",
    leadTime: "3 weeks if nil stock",
    materials: {
      body: "Neoprene",
      sleeve: "316ss"
    },
    pressureRange: "0 - 1 BAR",
    sizeFrom: "88.9mm",
    applications: ["Storm water systems", "Outfall pipes", "Backflow prevention"]
  },

  // Orbit Pipe Repair Clamp
  {
    id: "OCRC55",
    slug: "orbit-pipe-repair-clamp-series-1-and-55mm-long",
    sku: "OCRC55",
    name: "Orbit Pipe Repair Clamp Series 1 and 55mm long",
    shortName: "Orbit Repair Clamp 55mm",
    brand: "Orbit",
    category: "pipe-repair-clamps",
    subcategory: "orbit-pipe-repair-clamps",
    description: "The Orbit Pipe Repair Clamp Series 1 and 55mm long with 2 bolts. For small Outside diameter pipes only. Wrap around your small OD pipe to seal any leaking hole or crack. Manufactured from 316 stainless steel and rubber. For Pipe Repair Use Only. This cannot be used as a pipe coupling.",
    features: [
      "Manufactured from 316 stainless steel and WRAS-approved EPDM rubber",
      "2 bolt design for small diameter pipes",
      "Quick and easy installation",
      "Available in different rubber materials: NBR, EPDM, Viton",
      "12 months warranty on manufacturing defects only",
      "For pipe repair use only - not a coupling"
    ],
    certifications: "WRAS-approved EPDM rubber seals suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    specifications: [
      { label: "SKU", value: "OCRC55" },
      { label: "Brand", value: "Orbit Pipe Repair Clamp 55mm wide" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Casing Material", value: "316 Stainless Steel" },
      { label: "Width", value: "55mm" },
      { label: "Bolts", value: "2" }
    ],
    sizeOptions: [
      { value: "48.3mm", label: "48.3mm Pipe Outside Diameter sizing" },
      { value: "50.0mm", label: "50.0mm" },
      { value: "54.0mm", label: "54.0mm" },
      { value: "57.0mm", label: "57.0mm" }
    ],
    images: getOptimizedImages("OCRC55", "Orbit Pipe Repair Clamp 55mm", 3),
    video: "https://www.youtube.com/watch?v=VRei4m3c3Ck",
    leadTime: "12 days if nil stock",
    materials: {
      sleeve: "EPDM",
      body: "316ss"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "48.3mm",
    applications: ["Emergency pipe repairs", "Leak sealing", "Crack repair"],
    straubEquivalent: "STRAUB-REP 1"
  },

  // Foot Valve
  {
    id: "FVGALV",
    slug: "foot-valve-galvanised-flanged-table-d",
    sku: "FVGALV",
    name: "Foot Valve - Galvanised - Flanged Table D",
    shortName: "Galvanised Foot Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "foot-valve",
    description: "Galvanised foot valve with integrated strainer, designed for the suction side of pumps. Prevents backflow and maintains prime in pumping systems.",
    features: [
      "Integrated strainer design",
      "Prevents backflow",
      "Maintains pump prime",
      "Table D flange standard"
    ],
    specifications: [
      { label: "SKU", value: "FVGALV" },
      { label: "Brand", value: "Foot Valve" },
      { label: "Body Material", value: "Galvanised steel" },
      { label: "Seal Material", value: "EPDM" },
      { label: "Flange Standard", value: "Table D" }
    ],
    images: getOptimizedImages("FVGALV", "Galvanised Foot Valve Flanged Table D", 4),
    materials: {
      body: "GALV",
      seat: "EPDM"
    },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "80mm",
    applications: ["Pump suction lines", "Irrigation systems", "Water supply"],
    certifications: "WRAS-approved EPDM seals for potable water applications. Galvanised steel construction to AS/NZS standards. Suitable for water supply and irrigation systems."
  },

  // CF8M Flanged Float Valve
  {
    id: "CF8MDAFV",
    slug: "cf8m-flanged-float-valve-as4087-pn16",
    sku: "CF8MDAFV",
    name: "CF8M Flanged Float Valve AS4087 PN16",
    shortName: "CF8M Flanged Float Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "float-valve",
    description: "CF8M Flanged Float Valve AS4087 PN16. Full 316 stainless steel construction. Sizes available: DN65, DN80, DN100. Body material: CF8M 316SS. Lever and float material: 316 stainless steel.",
    features: [
      "Full 316 stainless steel construction for superior corrosion resistance",
      "CF8M body material (cast 316 stainless steel)",
      "316 stainless steel lever and float",
      "AS4087 PN16 flanged connection",
      "Suitable for tanks and reservoir level control",
      "Available in DN65, DN80, and DN100 sizes",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "CF8MDAFV" },
      { label: "Brand", value: "CF8M Flanged Float Valve" },
      { label: "Body Material", value: "CF8M 316SS" },
      { label: "Lever Material", value: "316 Stainless Steel" },
      { label: "Float Material", value: "316 Stainless Steel" },
      { label: "Flange Standard", value: "AS4087 PN16" },
      { label: "Pressure Rating", value: "PN16" }
    ],
    sizeOptions: [
      { value: "65mm", label: "65mm DN65 (2.5\")", sku: "CF8MDAFV-65" },
      { value: "80mm", label: "80mm DN80 (3\")", sku: "CF8MDAFV-80" },
      { value: "100mm", label: "100mm DN100 (4\")", sku: "CF8MDAFV-100" }
    ],
    images: getOptimizedImages("CF8MDAFV", "CF8M Flanged Float Valve AS4087 PN16", 1),
    downloads: [
      { url: "https://www.dewaterproducts.com.au/assets/brochures/CF8MDAFV.pdf", label: "Datasheet" }
    ],
    video: "https://www.youtube.com/watch?v=k7S7LLR78rs",
    leadTime: "9 to 12 weeks if nil stock",
    materials: {
      body: "CF8M 316SS"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "65mm",
    priceVaries: true,
    priceNote: "Price on application - contact for quote",
    applications: ["Tank level control", "Reservoir management", "Water storage systems", "Industrial water tanks"],
    certifications: "Full 316 stainless steel construction complies with relevant corrosion resistance and food-grade standards. Manufactured to AS4087 PN16 flange specification. Suitable for potable water and industrial applications."
  },

  // Flex Grip L
  {
    id: "OCFG-L",
    slug: "flex-grip-l-pipe-coupling",
    sku: "OCFG-L",
    name: "Flex Grip L - Long Model Pipe Coupling",
    shortName: "Flex Grip L",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Flex Grip L model is the Long model pipe coupling, allowing for axial movements, vibration, and minor pipe misalignments. This coupling does not prevent pull out, so pipes must be anchored. Measure your pipe outside diameter before selecting the size. Ensure the working pressure is suitable.",
    features: [
      "Flexible design accommodates pipe misalignment and axial movement, ideal for systems with thermal expansion or dynamic movement",
      "Durable and reliable corrosion-resistant 316 stainless steel construction ensures longevity in demanding environments",
      "Quick installation requires no welding, flanging, or special tools, reducing labour costs and installation time",
      "High-pressure and temperature resistance suited for industrial and marine use",
      "Vibration absorption prevents stress on piping systems",
      "WRAS-approved EPDM rubber sleeve for potable water applications",
      "Available in NBR, EPDM, and Viton rubber materials - contact for quote",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCFG-L" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 32 BAR" }
    ],
    sizeOptions: [
      { value: "48.3mm", label: "48.3mm Pipe Outside Diameter", price: 370, sku: "OCFG-L48.3" },
      { value: "50.0mm", label: "50.0mm Pipe Outside Diameter", price: 370, sku: "OCFG-L50.0" },
      { value: "54.0mm", label: "54.0mm Pipe Outside Diameter", price: 370, sku: "OCFG-L54.0" },
      { value: "57.0mm", label: "57.0mm Pipe Outside Diameter", price: 371, sku: "OCFG-L57.0" },
      { value: "60.3mm", label: "60.3mm Pipe Outside Diameter", price: 373, sku: "OCFG-L60.3" },
      { value: "63.0mm", label: "63.0mm Pipe Outside Diameter", price: 378, sku: "OCFG-L63.0" },
      { value: "66.6mm", label: "66.6mm Pipe Outside Diameter", price: 381, sku: "OCFG-L66.6" },
      { value: "70.0mm", label: "70.0mm Pipe Outside Diameter", price: 392, sku: "OCFG-L70.0" },
      { value: "73.0mm", label: "73.0mm Pipe Outside Diameter", price: 398, sku: "OCFG-L73.0" },
      { value: "75.0mm", label: "75.0mm Pipe Outside Diameter", price: 405, sku: "OCFG-L75.0" },
      { value: "76.1mm", label: "76.1mm Pipe Outside Diameter", price: 412, sku: "OCFG-L76.1" },
      { value: "79.5mm", label: "79.5mm Pipe Outside Diameter", price: 419, sku: "OCFG-L79.5" },
      { value: "84.0mm", label: "84.0mm Pipe Outside Diameter", price: 448, sku: "OCFG-L84.0" },
      { value: "88.9mm", label: "88.9mm Pipe Outside Diameter", price: 452, sku: "OCFG-L88.9" },
      { value: "90.0mm", label: "90.0mm Pipe Outside Diameter", price: 455, sku: "OCFG-L90.0" },
      { value: "100.6mm", label: "100.6mm Pipe Outside Diameter", price: 458, sku: "OCFG-L100.6" },
      { value: "101.6mm", label: "101.6mm Pipe Outside Diameter", price: 459, sku: "OCFG-L101.6" },
      { value: "104.0mm", label: "104.0mm Pipe Outside Diameter", price: 463, sku: "OCFG-L104.0" },
      { value: "104.8mm", label: "104.8mm Pipe Outside Diameter", price: 463, sku: "OCFG-L104.8" },
      { value: "108.0mm", label: "108.0mm Pipe Outside Diameter", price: 464, sku: "OCFG-L108.0" },
      { value: "110.0mm", label: "110.0mm Pipe Outside Diameter", price: 464, sku: "OCFG-L110.0" },
      { value: "114.3mm", label: "114.3mm Pipe Outside Diameter", price: 466, sku: "OCFG-L114.3" },
      { value: "125.0mm", label: "125.0mm Pipe Outside Diameter", price: 482, sku: "OCFG-L125.0" },
      { value: "126.3mm", label: "126.3mm Pipe Outside Diameter", price: 483, sku: "OCFG-L126.3" },
      { value: "127.0mm", label: "127.0mm Pipe Outside Diameter", price: 483, sku: "OCFG-L127.0" },
      { value: "129.0mm", label: "129.0mm Pipe Outside Diameter", price: 485, sku: "OCFG-L129.0" },
      { value: "130.2mm", label: "130.2mm Pipe Outside Diameter", price: 486, sku: "OCFG-L130.2" },
      { value: "133.0mm", label: "133.0mm Pipe Outside Diameter", price: 487, sku: "OCFG-L133.0" },
      { value: "139.7mm", label: "139.7mm Pipe Outside Diameter", price: 489, sku: "OCFG-L139.7" },
      { value: "140.0mm", label: "140.0mm Pipe Outside Diameter", price: 490, sku: "OCFG-L140.0" },
      { value: "141.3mm", label: "141.3mm Pipe Outside Diameter", price: 490, sku: "OCFG-L141.3" },
      { value: "154.0mm", label: "154.0mm Pipe Outside Diameter", price: 512, sku: "OCFG-L154.0" },
      { value: "159.0mm", label: "159.0mm Pipe Outside Diameter", price: 513, sku: "OCFG-L159.0" },
      { value: "160.0mm", label: "160.0mm Pipe Outside Diameter", price: 514, sku: "OCFG-L160.0" },
      { value: "168.3mm", label: "168.3mm Pipe Outside Diameter", price: 516, sku: "OCFG-L168.3" }
    ],
    images: getOptimizedImages("OCFG-L", "Flex Grip L Pipe Coupling", 3),
    downloads: [
      { url: "https://www.dewaterproducts.com.au/assets/brochures/OCFG-L.pdf", label: "Product Datasheet" }
    ],
    video: "https://www.youtube.com/watch?v=sUyxmHis4gg",
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "48.3mm",
    leadTime: "12 days if nil stock",
    priceVaries: true,
    priceNote: "Please check product sizing carefully before ordering. Prices shown exclude GST. High pressure ratings and alternative rubber materials (NBR, Viton) available - contact us for a quote.",
    applications: ["Systems with thermal expansion or dynamic movement", "Marine applications", "Industrial piping", "Building services"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    straubEquivalent: "STRAUB-FLEX 1L"
  },

  // Flex Grip S
  {
    id: "OCFG-S",
    slug: "flex-grip-s-pipe-coupling",
    sku: "OCFG-S",
    name: "Flex Grip S - Short Model Pipe Coupling",
    shortName: "Flex Grip S",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Flex Grip S model is the Short model pipe coupling for allowing axial movements, vibration and minor pipe misalignments. This coupling does not prevent pull out so pipes must be anchored somehow.",
    features: [
      "Compact short-width design for space-constrained installations",
      "Flexible coupling handles axial and angular deflection",
      "Corrosion-resistant 316 stainless steel construction",
      "No welding required - simplifies installation process",
      "High-pressure resistance suited for industrial use",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCFG-S" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 32 BAR" }
    ],
    images: getOptimizedImages("OCFG-S", "Flex Grip S Pipe Coupling", 2),
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "21.3mm",
    leadTime: "12 days if nil stock",
    applications: ["Compact installations", "Pipe repair", "Industrial piping", "Pressure systems"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    straubEquivalent: "STRAUB-FLEX 1"
  },

  // Metal Lock L
  {
    id: "OCML-L",
    slug: "metal-lock-l-pipe-coupling",
    sku: "OCML-L",
    name: "Metal Lock L - Long Model with Axial Restraint",
    shortName: "Metal Lock L",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Metal Lock L model is the Long model pipe coupling providing axial restraint and pull out resistance. High-strength stainless steel construction ensures reliable performance in demanding applications.",
    features: [
      "Axial restraint provides pull-out resistance",
      "High-strength 304 stainless steel construction",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "No welding or special tools required for installation",
      "Suitable for high-pressure applications up to 32 BAR",
      "Corrosion-resistant design for long service life",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCML-L" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "304 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 32 BAR" }
    ],
    images: getOptimizedImages("OCML-L", "Metal Lock L Pipe Coupling", 4),
    materials: {
      body: "304ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "48.3mm",
    leadTime: "12 days if nil stock",
    applications: ["High-pressure systems requiring axial restraint", "Water supply networks", "Industrial process piping", "Infrastructure projects"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 304 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    straubEquivalent: "STRAUB-METAL-GRIP L"
  },

  // Metal Lock S
  {
    id: "OCML-S",
    slug: "metal-lock-s-pipe-coupling",
    sku: "OCML-S",
    name: "Metal Lock S - Short Model with Axial Restraint",
    shortName: "Metal Lock S",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Orbit Metal Lock S pipe coupling model is the short width version and provides pipe connections with pull out resistance and axial restraint. Ideal for compact installations requiring secure joint integrity.",
    features: [
      "Short-width design with axial restraint and pull-out resistance",
      "High-strength 316 stainless steel construction",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "Suitable for high-pressure applications up to 32 BAR",
      "Quick installation with no welding required",
      "Corrosion-resistant for demanding environments",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCML-S" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 32 BAR" }
    ],
    images: getOptimizedImages("OCML-S", "Metal Lock S Pipe Coupling", 3),
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "26.9mm",
    leadTime: "12 days if nil stock",
    applications: ["Compact high-pressure installations", "Pipe repair with restraint", "Water distribution systems", "Industrial applications"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    straubEquivalent: "STRAUB-METAL-GRIP"
  },

  // Fire Protection Coupling
  {
    id: "OCFPC",
    slug: "fire-protection-coupling",
    sku: "OCFPC",
    name: "Fire Protection Coupling - IACS Compliant",
    shortName: "Fire Protection Coupling",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Fire Protection Coupling is compliant with IACS standards. Installed with an Orbit Couplings Metal Lock S pipe coupling for axial restraint and pull out resistance. Specifically designed for fire protection systems.",
    features: [
      "IACS compliant for fire protection systems",
      "Combined with Metal Lock S for axial restraint",
      "316 stainless steel construction with EPDM sleeve",
      "Pull-out resistance ensures system integrity",
      "High-pressure rating suitable for fire systems up to 28 BAR",
      "Corrosion-resistant materials for long service life",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCFPC" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 28 BAR" },
      { label: "Compliance", value: "IACS" }
    ],
    images: getOptimizedImages("OCFPC", "Fire Protection Coupling IACS Compliant", 3),
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 28 BAR",
    sizeFrom: "114.3mm",
    leadTime: "12 days if nil stock",
    applications: ["Fire protection systems", "Marine fire suppression", "Industrial fire safety", "Building fire services"],
    certifications: "IACS compliant for fire protection applications. WRAS-approved EPDM rubber sleeves suitable for potable water. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards.",
    straubEquivalent: "STRAUB-FIRE COUPLING"
  },

  // Elbow Repair Clamp
  {
    id: "OCERC",
    slug: "elbow-repair-clamp",
    sku: "OCERC",
    name: "Elbow Repair Clamp - Orbit Couplings",
    shortName: "Elbow Repair Clamp",
    brand: "Orbit",
    category: "pipe-repair-clamps",
    subcategory: "orbit-pipe-repair-clamps",
    description: "Specialised elbow repair clamp from Orbit Couplings for sealing leaks on pipe elbows and bends. Features 316 stainless steel construction with WRAS-approved EPDM rubber sleeve for secure, long-lasting repairs on curved pipework.",
    features: [
      "Designed specifically for elbow and bend repairs",
      "316 stainless steel construction for durability",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "Quick installation without pipe removal",
      "Suitable for emergency repairs",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCERC" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Casing Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 25 BAR" }
    ],
    images: getOptimizedImages("OCELBRC", "Elbow Repair Clamp Orbit Couplings", 4),
    materials: {
      sleeve: "EPDM",
      body: "316ss"
    },
    pressureRange: "0 TO 25 BAR",
    leadTime: "12 days if nil stock",
    applications: ["Elbow leak repairs", "Emergency pipe fixes", "Bend reinforcement"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Open Flex 300-L
  {
    id: "OCOF300L",
    slug: "open-flex-300-l",
    sku: "OCOF300L",
    name: "Open Flex 300-L - Large Diameter Pipe Coupling",
    shortName: "Open Flex 300-L",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Open Flex 300-L is a large diameter flexible pipe coupling designed for 220mm pipes. Features heavy-duty 316 stainless steel construction with WRAS-approved EPDM rubber for demanding industrial and municipal applications.",
    features: [
      "Large diameter design for 220mm pipes",
      "Heavy-duty 316 stainless steel construction",
      "WRAS-approved EPDM rubber sleeve",
      "Accommodates pipe movement and misalignment",
      "High-pressure rated to 40 BAR",
      "Suitable for industrial and municipal use",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCOF300L" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pipe Diameter", value: "220.0mm" },
      { label: "Pressure Rating", value: "0 to 40 BAR" }
    ],
    images: getOptimizedImages("OCOF300-L", "Open Flex 300-L Pipe Coupling", 3),
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 40 BAR",
    sizeFrom: "220mm",
    leadTime: "12 days if nil stock",
    applications: ["Large diameter pipelines", "Municipal water systems", "Industrial process piping", "Infrastructure projects"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Open Flex 400-L
  {
    id: "OCOF400L",
    slug: "open-flex-400-l",
    sku: "OCOF400L",
    name: "Open Flex 400-L - Extra Large Diameter Pipe Coupling",
    shortName: "Open Flex 400-L",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Open Flex 400-L is an extra-large diameter flexible pipe coupling for heavy-duty industrial applications. Features robust 316 stainless steel construction with high-pressure EPDM rubber sleeve for the most demanding pipeline projects.",
    features: [
      "Extra-large diameter for heavy-duty applications",
      "Robust 316 stainless steel construction",
      "WRAS-approved EPDM rubber sleeve",
      "High-pressure rated design",
      "Accommodates significant pipe movement",
      "Ideal for large infrastructure projects",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCOF400L" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 40 BAR" }
    ],
    images: getOptimizedImages("OCOF400-L", "Open Flex 400-L Pipe Coupling", 4),
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 40 BAR",
    sizeFrom: "400mm",
    leadTime: "12 days if nil stock",
    applications: ["Large infrastructure projects", "Municipal water mains", "Heavy industrial piping", "Water treatment plants"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Pipe Repair Clamp 200mm Wide
  {
    id: "OCRC200",
    slug: "orbit-pipe-repair-clamp-200mm-wide",
    sku: "OCRC200",
    name: "Orbit Pipe Repair Clamp 200mm Wide",
    shortName: "Orbit Repair Clamp 200mm",
    brand: "Orbit",
    category: "pipe-repair-clamps",
    subcategory: "orbit-pipe-repair-clamps",
    description: "The Orbit Pipe Repair Clamp 200mm wide with reinforced mesh backing for larger leak areas. Manufactured from 316 stainless steel and WRAS-approved EPDM rubber. For pipe repair use only.",
    features: [
      "200mm width covers larger leak areas",
      "Reinforced mesh backing for added strength",
      "316 stainless steel construction",
      "WRAS-approved EPDM rubber seal",
      "Multiple bolt design for secure clamping",
      "Quick installation for emergency repairs",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCRC200" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Casing Material", value: "316 Stainless Steel" },
      { label: "Width", value: "200mm" }
    ],
    images: getOptimizedImages("OCRC200", "Orbit Pipe Repair Clamp 200mm Wide", 3),
    materials: {
      sleeve: "EPDM",
      body: "316ss"
    },
    pressureRange: "0 TO 16 BAR",
    leadTime: "12 days if nil stock",
    applications: ["Large leak repairs", "Emergency pipe fixes", "Crack sealing"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Pipe Repair Clamp 300mm Wide
  {
    id: "OCRC300",
    slug: "orbit-pipe-repair-clamp-300mm-wide",
    sku: "OCRC300",
    name: "Orbit Pipe Repair Clamp 300mm Wide",
    shortName: "Orbit Repair Clamp 300mm",
    brand: "Orbit",
    category: "pipe-repair-clamps",
    subcategory: "orbit-pipe-repair-clamps",
    description: "The Orbit Pipe Repair Clamp 300mm wide with reinforced mesh backing for extensive leak areas. Heavy-duty 316 stainless steel construction with WRAS-approved EPDM rubber for the most demanding repair situations.",
    features: [
      "300mm width for extensive leak coverage",
      "Heavy-duty reinforced mesh backing",
      "316 stainless steel construction",
      "WRAS-approved EPDM rubber seal",
      "Multiple high-strength bolts",
      "Suitable for large pipe repairs",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCRC300" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Casing Material", value: "316 Stainless Steel" },
      { label: "Width", value: "300mm" }
    ],
    images: getOptimizedImages("OCRC300", "Orbit Pipe Repair Clamp 300mm Wide", 3),
    materials: {
      sleeve: "EPDM",
      body: "316ss"
    },
    pressureRange: "0 TO 16 BAR",
    leadTime: "12 days if nil stock",
    applications: ["Extensive leak repairs", "Large crack sealing", "Emergency pipe restoration"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Y-Strainer
  {
    id: "YSTR-CI",
    slug: "y-strainer-cast-iron-flanged",
    sku: "YSTR-CI",
    name: "Y-Strainer - Cast Iron - Flanged PN16",
    shortName: "Cast Iron Y-Strainer",
    brand: "Straub",
    category: "strainers",
    subcategory: "y-strainer",
    description: "Cast iron Y-strainer with stainless steel mesh screen for pipeline filtration. Protects pumps, valves, and equipment from debris. Flanged design rated to PN16.",
    features: [
      "Cast iron body rated to PN16",
      "Stainless steel mesh screen",
      "Easy-clean blow-down plug",
      "Protects downstream equipment",
      "Suitable for water, oil, and gas applications",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "YSTR-CI" },
      { label: "Brand", value: "Y-Strainer" },
      { label: "Body Material", value: "Cast Iron" },
      { label: "Screen Material", value: "Stainless Steel" },
      { label: "Pressure Rating", value: "PN16" },
      { label: "Flange Standard", value: "Table D/E" }
    ],
    images: [
      { url: "/images/products/valves/y-strainer-ci.jpg", alt: "Y-Strainer Cast Iron", type: "image" }
    ],
    materials: {
      body: "Cast Iron",
      disc: "SS304"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "50mm",
    applications: ["Water treatment", "Pump protection", "Pipeline filtration", "Process industries"],
    certifications: "Manufactured to AS/NZS standards. Stainless steel screen to food-grade specifications where applicable."
  },

  // Rubber Expansion Joint
  {
    id: "REJ-EPDM",
    slug: "rubber-expansion-joint-single-sphere-epdm",
    sku: "REJ-EPDM",
    name: "Rubber Expansion Joint - Single Sphere - EPDM",
    shortName: "EPDM Single Sphere Expansion Joint",
    brand: "Teekay",
    category: "rubber-expansion-joints",
    subcategory: "single-sphere",
    description: "Single sphere rubber expansion joint with EPDM rubber body and reinforced nylon fabric. Absorbs thermal expansion, vibration, and pipe misalignment. Flanged connections rated to PN16.",
    features: [
      "WRAS-approved EPDM rubber for potable water",
      "Reinforced with high-strength nylon fabric",
      "Absorbs axial, lateral, and angular movement",
      "Reduces noise and vibration transmission",
      "Floating flanges for easy installation",
      "Temperature range: -30°C to +110°C"
    ],
    specifications: [
      { label: "SKU", value: "REJ-EPDM" },
      { label: "Brand", value: "Rubber Expansion Joint" },
      { label: "Body Material", value: "EPDM Rubber" },
      { label: "Reinforcement", value: "Nylon fabric" },
      { label: "Flange Material", value: "Galvanised steel" },
      { label: "Pressure Rating", value: "PN16" },
      { label: "Temperature Range", value: "-30°C to +110°C" }
    ],
    images: [
      { url: "/images/products/expansion-joints/fsf-single-sphere.jpg", alt: "Rubber Expansion Joint EPDM", type: "image" }
    ],
    materials: {
      body: "EPDM",
      sleeve: "Nylon"
    },
    pressureRange: "0 TO 16 BAR",
    temperature: "-30°C to +110°C",
    sizeFrom: "50mm",
    applications: ["HVAC systems", "Pump connections", "Thermal expansion absorption", "Vibration isolation"],
    certifications: "WRAS-approved EPDM rubber for potable water applications. Manufactured to EN standards for rubber expansion joints."
  },

  // Ball Valve
  {
    id: "BV-316-FF",
    slug: "ball-valve-316-stainless-steel-full-bore",
    sku: "BV-316-FF",
    name: "Ball Valve - 316 Stainless Steel - Full Bore - Flanged",
    shortName: "316ss Full Bore Ball Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "ball-valve",
    description: "Full bore 316 stainless steel ball valve with lever operation. Flanged connections rated to PN40. Suitable for water, gas, and chemical applications.",
    features: [
      "Full bore design for minimal pressure drop",
      "316 stainless steel construction",
      "PTFE seats and seals",
      "Lever operation with lockable device",
      "Fire-safe design",
      "Temperature range: -20°C to +180°C"
    ],
    specifications: [
      { label: "SKU", value: "BV-316-FF" },
      { label: "Brand", value: "Ball Valve" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Ball Material", value: "316 Stainless Steel" },
      { label: "Seat Material", value: "PTFE" },
      { label: "Pressure Rating", value: "PN40" },
      { label: "Temperature Range", value: "-20°C to +180°C" }
    ],
    images: [
      { url: "/images/products/valves/ball-valve-316ss.jpg", alt: "316ss Ball Valve", type: "image" },
      { url: "/images/products/valves/ball-valve-316ss-detail.jpg", alt: "316ss Ball Valve - Lever Detail", type: "image" }
    ],
    materials: {
      body: "316ss",
      seat: "PTFE"
    },
    pressureRange: "0 TO 40 BAR",
    temperature: "-20°C to +180°C",
    sizeFrom: "50mm",
    applications: ["Process industries", "Chemical plants", "Water treatment", "Oil and gas"],
    certifications: "Fire-safe certified to API 607. PTFE seats suitable for food-grade applications. Manufactured to ISO 9001 quality standards."
  },

  // Gate Valve
  {
    id: "GV-DI-RS",
    slug: "gate-valve-ductile-iron-resilient-seated",
    sku: "GV-DI-RS",
    name: "Gate Valve - Ductile Iron - Resilient Seated - PN16",
    shortName: "DI Resilient Seat Gate Valve",
    brand: "Straub",
    category: "valves",
    subcategory: "gate-valve",
    description: "Ductile iron resilient seated gate valve with EPDM encapsulated disc. Non-rising stem design with handwheel operation. Flanged connections to AS2129 Table D/E.",
    features: [
      "EPDM fully encapsulated disc",
      "Non-rising stem design",
      "Ductile iron body to AS/NZS 2638.1",
      "Epoxy powder coated",
      "Suitable for underground installation",
      "WRAS-approved EPDM seals"
    ],
    specifications: [
      { label: "SKU", value: "GV-DI-RS" },
      { label: "Brand", value: "Gate Valve" },
      { label: "Body Material", value: "Ductile Iron" },
      { label: "Disc Material", value: "Ductile Iron with EPDM coating" },
      { label: "Pressure Rating", value: "PN16" },
      { label: "Flange Standard", value: "AS2129 Table D/E" }
    ],
    images: [
      { url: "/images/products/valves/gate-valve-di.jpg", alt: "DI Gate Valve", type: "image" },
      { url: "/images/products/valves/gate-valve-di-detail.jpg", alt: "DI Gate Valve - Handwheel Detail", type: "image" }
    ],
    materials: {
      body: "DI",
      disc: "DI/EPDM"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "80mm",
    applications: ["Water distribution", "Sewerage systems", "Fire protection", "Irrigation"],
    certifications: "WRAS-approved EPDM seals for potable water. Manufactured to AS/NZS 2638 standards. Suitable for underground installation."
  },

  // Y Strainer - CF8M 316 Stainless Steel
  {
    id: "SSYS",
    slug: "stainless-steel-y-strainer-cf8m-flanged-ansi-150lb",
    sku: "SSYS",
    name: "Stainless Steel Y Strainer CF8M Flanged ANSI 150LB",
    shortName: "CF8M Y Strainer",
    brand: "Teekay",
    category: "strainers",
    subcategory: "y-strainer",
    description: "Permanent pipeline strainer for filtering debris with 316 stainless steel body. Y-shaped design allows horizontal or vertical installation. Ideal for pre-pump filtration and applications requiring infrequent cleaning.",
    features: [
      "316 stainless steel CF8M body for corrosion resistance",
      "Removable 316SS internal filter screen",
      "1mm mesh standard (other mesh sizes available)",
      "Rated to ANSI 150LB / PN20",
      "Horizontal or vertical installation",
      "Compact Y-shape design for tight spaces",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "SSYS" },
      { label: "Brand", value: "Defender" },
      { label: "Body Material", value: "CF8M (Cast 316 stainless steel)" },
      { label: "Screen Material", value: "316 stainless steel" },
      { label: "Mesh Size", value: "1mm standard" },
      { label: "Pressure Rating", value: "ANSI 150LB / PN20" },
      { label: "Flange Standard", value: "ANSI 150LB" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. 316 stainless steel construction suitable for potable water, corrosive fluids, and demanding industrial applications.",
    sizeOptions: [
      { value: "50mm", label: "DN50 (2\")", price: 395, sku: "SSYS-50" },
      { value: "80mm", label: "DN80 (3\")", price: 495, sku: "SSYS-80" },
      { value: "100mm", label: "DN100 (4\")", price: 595, sku: "SSYS-100" },
      { value: "150mm", label: "DN150 (6\")", price: 795, sku: "SSYS-150" },
      { value: "200mm", label: "DN200 (8\")", price: 1095, sku: "SSYS-200" },
      { value: "250mm", label: "DN250 (10\")", price: 1495, sku: "SSYS-250" },
      { value: "300mm", label: "DN300 (12\")", price: 1895, sku: "SSYS-300" }
    ],
    images: getOptimizedImages("SSYS", "Stainless Steel Y Strainer CF8M ANSI 150LB", 3),
    leadTime: "7-10 days if nil stock",
    materials: {
      body: "CF8M/316SS"
    },
    pressureRange: "0-20 BAR",
    sizeFrom: "50mm",
    applications: ["Pre-pump protection", "Process water", "Chemical plants", "Food & beverage", "Marine", "Mining"],
    priceVaries: true,
    priceNote: "Prices shown are for standard 1mm mesh. Other mesh sizes available on request. All prices exclude GST."
  },

  // FSF Single Sphere Rubber Expansion Joint
  {
    id: "FSFREJ",
    slug: "fsf-single-sphere-rubber-expansion-joint-zinc-flanges",
    sku: "FSFREJ",
    name: "FSF Single Sphere Rubber Expansion Joint - Table E / ANSI 150LB Zinc Flanges",
    shortName: "FSF Single Sphere",
    brand: "Teekay",
    category: "rubber-expansion-joints",
    subcategory: "single-sphere",
    description: "Economical single sphere rubber expansion joint for vibration elimination, expansion, contraction, and angular movement. Molded spherical design with EPDM rubber element and zinc-plated steel flanges. Suitable for both suction and discharge pipes.",
    features: [
      "Moulded single sphere design for flexibility",
      "Handles one movement at a time (compression OR extension OR angular)",
      "EPDM rubber element with WRAS approval for potable water",
      "Zinc-plated steel flanges - Table E or ANSI 150LB",
      "Pressure rating: 7.5 to 16 Bar",
      "Vacuum rating: Up to 600mm Hg (vacuum ring available for higher negative pressure)",
      "Size range DN32 to DN600",
      "12 months warranty (24 months available on request)"
    ],
    specifications: [
      { label: "SKU", value: "FSFREJ" },
      { label: "Brand", value: "Defender" },
      { label: "Element Material", value: "EPDM rubber" },
      { label: "Flange Material", value: "Zinc-plated steel" },
      { label: "Flange Standard", value: "AS2129 Table E / ANSI 150LB" },
      { label: "Pressure Rating", value: "7.5-16 Bar" },
      { label: "Vacuum Rating", value: "600mm Hg (without vacuum ring)" }
    ],
    certifications: "EPDM rubber WRAS-approved for potable water use. Suitable for pumps, de-watering, mining, power generation, waste water treatment, marine, and HVAC applications.",
    sizeOptions: [
      { value: "32mm", label: "DN32", price: 174, sku: "FSFREJ-32" },
      { value: "50mm", label: "DN50 (2\")", price: 195, sku: "FSFREJ-50" },
      { value: "65mm", label: "DN65", price: 215, sku: "FSFREJ-65" },
      { value: "80mm", label: "DN80 (3\")", price: 235, sku: "FSFREJ-80" },
      { value: "100mm", label: "DN100 (4\")", price: 265, sku: "FSFREJ-100" },
      { value: "125mm", label: "DN125 (5\")", price: 295, sku: "FSFREJ-125" },
      { value: "150mm", label: "DN150 (6\")", price: 325, sku: "FSFREJ-150" },
      { value: "200mm", label: "DN200 (8\")", price: 395, sku: "FSFREJ-200" },
      { value: "250mm", label: "DN250 (10\")", price: 495, sku: "FSFREJ-250" },
      { value: "300mm", label: "DN300 (12\")", price: 595, sku: "FSFREJ-300" }
    ],
    images: getOptimizedImages("FSFREJ", "FSF Single Sphere Rubber Expansion Joint", 3),
    leadTime: "5-7 days if nil stock",
    materials: {
      body: "EPDM/Zinc plated flanges"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "32mm",
    applications: ["Pumps", "De-watering", "Mining", "Power generation", "Waste water treatment", "Marine", "HVAC", "Industrial air compressors"],
    priceVaries: true,
    priceNote: "Optional upgrades: 316SS flanges, vacuum rings, control rods, PTFE lining. Contact us for custom requirements."
  },

  // Simplex Basket Strainer
  {
    id: "SBSANSI",
    slug: "simplex-basket-strainer-316-ss-flanged-ansi-150lb",
    sku: "SBSANSI",
    name: "ANSI 150LB 316SS Simplex Basket Strainer",
    shortName: "Simplex Basket Strainer",
    brand: "Teekay",
    category: "strainers",
    subcategory: "simplex-basket-strainer",
    description: "Single basket strainer with higher flow rates and easier cleaning than Y strainers. 316 stainless steel body with removable perforated basket for frequent maintenance applications. Less pressure drop and head loss compared to Y strainers.",
    features: [
      "316 stainless steel body and basket",
      "Larger filtration area than Y strainers",
      "Easy basket removal for cleaning",
      "Lower pressure drop than Y strainers",
      "Uni-directional flow design",
      "Quick-open cover (optional)",
      "Multiple mesh sizes available",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "SBSANSI" },
      { label: "Brand", value: "Defender" },
      { label: "Body Material", value: "316 stainless steel" },
      { label: "Basket Material", value: "316SS perforated" },
      { label: "Pressure Rating", value: "ANSI 150LB" },
      { label: "Flange Standard", value: "ANSI Class 150" },
      { label: "Flow Direction", value: "Uni-directional" }
    ],
    certifications: "Manufactured to ISO 9001 quality standards. 316 stainless steel construction suitable for corrosive environments and potable water applications.",
    sizeOptions: [
      { value: "50mm", label: "DN50 (2\")", price: 625, sku: "SBSANSI-50" },
      { value: "65mm", label: "DN65", price: 695, sku: "SBSANSI-65" },
      { value: "80mm", label: "DN80 (3\")", price: 795, sku: "SBSANSI-80" },
      { value: "100mm", label: "DN100 (4\")", price: 925, sku: "SBSANSI-100" },
      { value: "125mm", label: "DN125 (5\")", price: 1095, sku: "SBSANSI-125" },
      { value: "150mm", label: "DN150 (6\")", price: 1295, sku: "SBSANSI-150" },
      { value: "200mm", label: "DN200 (8\")", price: 1695, sku: "SBSANSI-200" },
      { value: "250mm", label: "DN250 (10\")", price: 2295, sku: "SBSANSI-250" },
      { value: "300mm", label: "DN300 (12\")", price: 2895, sku: "SBSANSI-300" }
    ],
    images: [
      { url: "/images/products/strainers/simplex-basket-strainer-316ss.jpg", alt: "Simplex Basket Strainer 316SS", type: "image" }
    ],
    leadTime: "10-14 days if nil stock",
    materials: {
      body: "316SS"
    },
    pressureRange: "0-20 BAR",
    sizeFrom: "50mm",
    applications: ["Process water", "Chemical plants", "Food & beverage", "Pharmaceuticals", "Corrosive fluids", "High-flow applications"],
    priceVaries: true,
    priceNote: "Optional: quick-open covers, differential pressure gauges, custom mesh sizes. Duplex 2205 stainless steel available on request."
  },

  // Flange Adaptor
  {
    id: "SSFA",
    slug: "stainless-steel-flange-adapter-316ss-epdm",
    sku: "SSFA",
    name: "Stainless Steel Flange Adapter - 316SS Body with EPDM Seal",
    shortName: "316SS Flange Adaptor",
    brand: "Teekay",
    category: "flange-adaptors",
    subcategory: "flange-adaptor",
    description: "Versatile flange adaptor for connecting plain-ended pipes to flanged equipment. 316 stainless steel construction with EPDM seal. Suitable for pipe OD range 30mm to 4064mm. Wide range of flange specifications available.",
    features: [
      "316 stainless steel body for corrosion resistance",
      "EPDM or NBR sealing gasket options",
      "Connects plain-ended pipe to flanged equipment",
      "Wide size range: 30mm to 4064mm OD",
      "Multiple flange standards available",
      "Pressure rated to PN16 standard sizes",
      "Custom sizes and specifications available",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "SSFA" },
      { label: "Brand", value: "Defender" },
      { label: "Body Material", value: "316 stainless steel" },
      { label: "Seal Material", value: "EPDM (NBR available)" },
      { label: "Pressure Rating", value: "PN16 (standard sizes)" },
      { label: "Flange Standards", value: "AS2129 Table D/E, AS4087 PN16, ANSI 150LB" },
      { label: "Size Range", value: "30mm to 4064mm OD" }
    ],
    certifications: "WRAS-approved EPDM seals for potable water. Manufactured to ISO 9001 quality standards. Suitable for water distribution, sewerage, and industrial applications.",
    sizeOptions: [
      { value: "50mm", label: "DN50 (2\") - 60.3mm OD", price: 195, sku: "SSFA-50" },
      { value: "80mm", label: "DN80 (3\") - 88.9mm OD", price: 245, sku: "SSFA-80" },
      { value: "100mm", label: "DN100 (4\") - 114.3mm OD", price: 295, sku: "SSFA-100" },
      { value: "150mm", label: "DN150 (6\") - 168.3mm OD", price: 395, sku: "SSFA-150" },
      { value: "200mm", label: "DN200 (8\") - 219.1mm OD", price: 495, sku: "SSFA-200" },
      { value: "250mm", label: "DN250 (10\") - 273mm OD", price: 625, sku: "SSFA-250" },
      { value: "300mm", label: "DN300 (12\") - 323.9mm OD", price: 795, sku: "SSFA-300" }
    ],
    images: [
      { url: "/images/products/flange-adaptors/ss-flange-adapter-316.png", alt: "Stainless Steel Flange Adapter 316SS", type: "image" }
    ],
    leadTime: "10-14 days if nil stock",
    materials: {
      body: "316SS",
      seat: "EPDM"
    },
    pressureRange: "0-16 BAR",
    sizeFrom: "50mm",
    applications: ["Water distribution", "Sewerage", "Mining", "Industrial process", "Desalination", "Pipe repair"],
    priceVaries: true,
    priceNote: "Custom sizes over 300mm available on request. Contact us for large diameter and special flange specifications."
  },

  // ========== STRAUB PRODUCTS ==========
  // Swiss-engineered pipe couplings - Premium range

  // Axial Restraint Couplings
  {
    id: "STRAUB-METAL-GRIP",
    slug: "straub-metal-grip",
    sku: "STRAUB-METAL-GRIP",
    name: "STRAUB-METAL-GRIP Pipe Coupling",
    shortName: "STRAUB Metal-Grip",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Pull-out resistant pipe coupling for all metal pipes to meet the highest standards. Swiss precision engineering with 67 bar pressure rating. The STRAUB-METAL-GRIP provides axial restraint, preventing pipe separation under pressure.",
    features: [
      "Axial restraint (pull-out resistant) design",
      "Pressure rating: 67 bar",
      "Size range: 30.0 to 609.6 mm",
      "EPDM and NBR sealing sleeves available",
      "Temperature range: -30°C to +100°C (EPDM)",
      "DIN 86128-1 and 86128-2 compliant",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-METAL-GRIP" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "67 bar" },
      { label: "Size Range", value: "30.0 to 609.6 mm" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" },
      { label: "Body Material", value: "Stainless Steel" }
    ],
    images: getStraubImages("straub-metal-grip", "STRAUB-METAL-GRIP Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 67 BAR",
    sizeFrom: "30.0mm",
    leadTime: "2-3 weeks",
    applications: ["Industrial piping", "Marine", "Chemical plants", "Water treatment", "Oil & gas"],
    certifications: "DIN 86128-1 and 86128-2 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-METAL-GRIP-FF",
    slug: "straub-metal-grip-ff",
    sku: "STRAUB-METAL-GRIP-FF",
    name: "STRAUB-METAL-GRIP FF Pipe Coupling",
    shortName: "STRAUB Metal-Grip FF",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Full-face sealing version of the STRAUB-METAL-GRIP for maximum sealing security. Swiss precision engineering with 67 bar pressure rating and axial restraint.",
    features: [
      "Full-face sealing design for maximum security",
      "Axial restraint (pull-out resistant)",
      "Pressure rating: 67 bar",
      "Size range: 30.0 to 457.2 mm",
      "EPDM and NBR sealing sleeves",
      "DIN 86128 compliant",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-METAL-GRIP-FF" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "67 bar" },
      { label: "Size Range", value: "30.0 to 457.2 mm" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-metal-grip-ff", "STRAUB-METAL-GRIP FF Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 67 BAR",
    sizeFrom: "30.0mm",
    leadTime: "2-3 weeks",
    applications: ["High-pressure systems", "Marine", "Chemical plants", "Critical infrastructure"],
    certifications: "DIN 86128-1 and 86128-2 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-GRIP",
    slug: "straub-grip",
    sku: "STRAUB-GRIP",
    name: "STRAUB-GRIP Pipe Coupling",
    shortName: "STRAUB Grip",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Axially restrained pipe coupling with 40 bar pressure rating. Wide size range from 25mm to 711.2mm for versatile applications.",
    features: [
      "Axial restraint design",
      "Pressure rating: 40 bar",
      "Size range: 25 to 711.2 mm",
      "EPDM and NBR sealing sleeves",
      "Temperature range: -30°C to +100°C",
      "DIN 86128 compliant",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-GRIP" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "40 bar" },
      { label: "Size Range", value: "25 to 711.2 mm" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-grip", "STRAUB-GRIP Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 40 BAR",
    sizeFrom: "25mm",
    leadTime: "2-3 weeks",
    applications: ["Industrial piping", "Water treatment", "Building services", "Process piping"],
    certifications: "DIN 86128-1 and 86128-2 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-GRIP-FF",
    slug: "straub-grip-ff",
    sku: "STRAUB-GRIP-FF",
    name: "STRAUB-GRIP FF Pipe Coupling",
    shortName: "STRAUB Grip FF",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Full-face sealing version of STRAUB-GRIP with 40 bar pressure rating. Enhanced sealing for critical applications.",
    features: [
      "Full-face sealing design",
      "Axial restraint",
      "Pressure rating: 40 bar",
      "Size range: 25.0 to 406.4 mm",
      "EPDM and NBR sealing sleeves",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-GRIP-FF" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "40 bar" },
      { label: "Size Range", value: "25.0 to 406.4 mm" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-grip-ff", "STRAUB-GRIP FF Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 40 BAR",
    sizeFrom: "25.0mm",
    leadTime: "2-3 weeks",
    applications: ["Industrial piping", "Water treatment", "Critical systems"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-PLAST-GRIP",
    slug: "straub-plast-grip",
    sku: "STRAUB-PLAST-GRIP",
    name: "STRAUB-PLAST-GRIP Pipe Coupling",
    shortName: "STRAUB Plast-Grip",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Axially restrained coupling specifically designed for plastic pipes. 16 bar pressure rating with gentle gripping action to prevent pipe damage.",
    features: [
      "Designed for plastic pipes",
      "Gentle gripping action",
      "Pressure rating: 16 bar",
      "Size range: 40.0 to 355.0 mm",
      "EPDM sealing sleeve",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-PLAST-GRIP" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "40.0 to 355.0 mm" },
      { label: "Temperature Range", value: "-30°C to +80°C" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-plast-grip", "STRAUB-PLAST-GRIP Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "40.0mm",
    leadTime: "2-3 weeks",
    applications: ["Plastic pipelines", "PVC/PE pipes", "Water distribution", "Irrigation"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-COMBI-GRIP",
    slug: "straub-combi-grip",
    sku: "STRAUB-COMBI-GRIP",
    name: "STRAUB-COMBI-GRIP Pipe Coupling",
    shortName: "STRAUB Combi-Grip",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Versatile coupling for connecting metal to plastic pipes with axial restraint. Ideal for mixed material pipeline systems.",
    features: [
      "Connects metal to plastic pipes",
      "Axial restraint on both sides",
      "Pressure rating: 16 bar",
      "Size range: 40.0/38.0 to 355.0/355.6 mm",
      "EPDM sealing sleeve",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-COMBI-GRIP" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "40.0/38.0 to 355.0/355.6 mm" },
      { label: "Temperature Range", value: "-30°C to +80°C" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-combi-grip", "STRAUB-COMBI-GRIP Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "40.0mm",
    leadTime: "2-3 weeks",
    applications: ["Mixed material systems", "Retrofitting", "Pipeline upgrades"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-PLAST-PRO",
    slug: "straub-plast-pro",
    sku: "STRAUB-PLAST-PRO",
    name: "STRAUB-PLAST-PRO Pipe Coupling",
    shortName: "STRAUB Plast-Pro",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Professional-grade coupling for plastic pipes with optimised gripping force distribution. Advanced design for demanding plastic pipeline applications.",
    features: [
      "Optimised for plastic pipes",
      "Advanced grip force distribution",
      "Pressure rating: 16 bar",
      "Size range: 63.0-180.0 / 125.0-355.0 mm",
      "EPDM sealing sleeve",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-PLAST-PRO" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "63.0-180.0 / 125.0-355.0 mm" },
      { label: "Temperature Range", value: "-30°C to +80°C" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-plast-pro", "STRAUB-PLAST-PRO Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "63.0mm",
    leadTime: "2-3 weeks",
    applications: ["PE/PP pipelines", "Large diameter plastic pipes", "Industrial applications"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },

  // Non-Axial Restraint (Flex) Couplings
  {
    id: "STRAUB-FLEX-1",
    slug: "straub-flex-1",
    sku: "STRAUB-FLEX-1",
    name: "STRAUB-FLEX 1 Pipe Coupling",
    shortName: "STRAUB Flex 1",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Axially flexible pipe coupling for pipes of all materials. Accommodates axial movement, vibration, and minor misalignment. Equivalent to Orbit Flex Grip L.",
    features: [
      "Flexible design for movement absorption",
      "Pressure rating: 25 bar",
      "Size range: 48.3 to 168.3 mm",
      "EPDM, NBR, and FPM sealing options",
      "Temperature range: -20°C to +180°C",
      "DIN 86128 compliant",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLEX-1" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "25 bar" },
      { label: "Size Range", value: "48.3 to 168.3 mm" },
      { label: "Temperature Range", value: "-20°C to +180°C" },
      { label: "Sealing Material", value: "EPDM/NBR/FPM" }
    ],
    images: getStraubImages("straub-flex-1", "STRAUB-FLEX 1 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 25 BAR",
    sizeFrom: "48.3mm",
    leadTime: "2-3 weeks",
    applications: ["Pump connections", "Vibration isolation", "Thermal expansion", "Building services"],
    certifications: "DIN 86128-1 and 86128-2 compliant. Swiss quality manufacturing with 5-year system warranty. Equivalent to Orbit OCFG-L."
  },
  {
    id: "STRAUB-FLEX-2",
    slug: "straub-flex-2",
    sku: "STRAUB-FLEX-2",
    name: "STRAUB-FLEX 2 Pipe Coupling",
    shortName: "STRAUB Flex 2",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Large diameter flexible coupling for pipes up to 2032mm. Ideal for infrastructure and industrial applications.",
    features: [
      "Large diameter range",
      "Flexible design",
      "Pressure rating: 16 bar",
      "Size range: 172.0 to 2032.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLEX-2" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "172.0 to 2032.0 mm" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-flex-2", "STRAUB-FLEX 2 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "172.0mm",
    leadTime: "2-3 weeks",
    applications: ["Large diameter pipes", "Infrastructure", "Water mains", "Industrial piping"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-FLEX-3",
    slug: "straub-flex-3",
    sku: "STRAUB-FLEX-3",
    name: "STRAUB-FLEX 3 Pipe Coupling",
    shortName: "STRAUB Flex 3",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Heavy-duty flexible coupling for very large diameter pipelines up to 2032mm with 10 bar pressure rating.",
    features: [
      "Heavy-duty construction",
      "Pressure rating: 10 bar",
      "Size range: 219.1 to 2032.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLEX-3" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "219.1 to 2032.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-flex-3", "STRAUB-FLEX 3 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "219.1mm",
    leadTime: "2-3 weeks",
    applications: ["Large infrastructure", "Water mains", "Sewerage", "Industrial"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-FLEX-35",
    slug: "straub-flex-35",
    sku: "STRAUB-FLEX-35",
    name: "STRAUB-FLEX 3.5 Pipe Coupling",
    shortName: "STRAUB Flex 3.5",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Intermediate size flexible coupling for large diameter applications from 323.9 to 1219.2mm.",
    features: [
      "Intermediate size range",
      "Pressure rating: 10 bar",
      "Size range: 323.9 to 1219.2 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLEX-35" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "323.9 to 1219.2 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-flex-35", "STRAUB-FLEX 3.5 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "323.9mm",
    leadTime: "2-3 weeks",
    applications: ["Large diameter pipes", "Infrastructure", "Water treatment"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-FLEX-4",
    slug: "straub-flex-4",
    sku: "STRAUB-FLEX-4",
    name: "STRAUB-FLEX 4 Pipe Coupling",
    shortName: "STRAUB Flex 4",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Extra-wide flexible coupling for large diameter pipes from 323.9 to 812.8mm.",
    features: [
      "Extra-wide design",
      "Pressure rating: 10 bar",
      "Size range: 323.9 to 812.8 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLEX-4" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "323.9 to 812.8 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-flex-4", "STRAUB-FLEX 4 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "323.9mm",
    leadTime: "2-3 weeks",
    applications: ["Large diameter pipes", "Municipal water", "Industrial"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-OPEN-FLEX-1",
    slug: "straub-open-flex-1",
    sku: "STRAUB-OPEN-FLEX-1",
    name: "STRAUB-OPEN-FLEX 1 Pipe Coupling",
    shortName: "STRAUB Open-Flex 1",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Open design flexible coupling for easy installation around existing pipes. 25 bar pressure rating.",
    features: [
      "Open design for retrofit installation",
      "Pressure rating: 25 bar",
      "Size range: 48.3 to 168.3 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-OPEN-FLEX-1" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "25 bar" },
      { label: "Size Range", value: "48.3 to 168.3 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-open-flex-1", "STRAUB-OPEN-FLEX 1 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 25 BAR",
    sizeFrom: "48.3mm",
    leadTime: "2-3 weeks",
    applications: ["Retrofit installations", "Pipe repair", "Building services"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-OPEN-FLEX-2",
    slug: "straub-open-flex-2",
    sku: "STRAUB-OPEN-FLEX-2",
    name: "STRAUB-OPEN-FLEX 2 Pipe Coupling",
    shortName: "STRAUB Open-Flex 2",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Large diameter open design coupling for retrofit installation on pipes up to 2032mm.",
    features: [
      "Open design for large pipes",
      "Pressure rating: 16 bar",
      "Size range: 172.0 to 2032.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-OPEN-FLEX-2" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "172.0 to 2032.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-open-flex-2", "STRAUB-OPEN-FLEX 2 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "172.0mm",
    leadTime: "2-3 weeks",
    applications: ["Large diameter retrofit", "Infrastructure repair", "Water mains"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-OPEN-FLEX-3",
    slug: "straub-open-flex-3",
    sku: "STRAUB-OPEN-FLEX-3",
    name: "STRAUB-OPEN-FLEX 3 Pipe Coupling",
    shortName: "STRAUB Open-Flex 3",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Extra-large diameter open design coupling for pipes up to 4064mm. Ideal for major infrastructure projects.",
    features: [
      "Extra-large diameter range up to 4064mm",
      "Open design",
      "Pressure rating: 10 bar",
      "Size range: 219.1 to 4064.0 mm",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-OPEN-FLEX-3" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "219.1 to 4064.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-open-flex-3", "STRAUB-OPEN-FLEX 3 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "219.1mm",
    leadTime: "2-3 weeks",
    applications: ["Major infrastructure", "Large water mains", "Tunnels"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-OPEN-FLEX-35",
    slug: "straub-open-flex-35",
    sku: "STRAUB-OPEN-FLEX-35",
    name: "STRAUB-OPEN-FLEX 3.5 Pipe Coupling",
    shortName: "STRAUB Open-Flex 3.5",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Large diameter open coupling for pipes from 323.9 to 4064mm with 10 bar pressure rating.",
    features: [
      "Large diameter open design",
      "Pressure rating: 10 bar",
      "Size range: 323.9 to 4064.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-OPEN-FLEX-35" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "323.9 to 4064.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-open-flex-35", "STRAUB-OPEN-FLEX 3.5 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "323.9mm",
    leadTime: "2-3 weeks",
    applications: ["Infrastructure", "Large diameter retrofit", "Water treatment"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-OPEN-FLEX-4",
    slug: "straub-open-flex-4",
    sku: "STRAUB-OPEN-FLEX-4",
    name: "STRAUB-OPEN-FLEX 4 Pipe Coupling",
    shortName: "STRAUB Open-Flex 4",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Heavy-duty open design coupling for very large diameter pipes up to 4064mm.",
    features: [
      "Heavy-duty open design",
      "Pressure rating: 10 bar",
      "Size range: 323.9 to 4064.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-OPEN-FLEX-4" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "323.9 to 4064.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-open-flex-4", "STRAUB-OPEN-FLEX 4 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "323.9mm",
    leadTime: "2-3 weeks",
    applications: ["Major infrastructure", "Large water mains", "Industrial"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-STEP-FLEX-2",
    slug: "straub-step-flex-2",
    sku: "STRAUB-STEP-FLEX-2",
    name: "STRAUB-STEP-FLEX 2 Pipe Coupling",
    shortName: "STRAUB Step-Flex 2",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Stepped coupling for connecting pipes of different diameters. Flexible design with 10 bar pressure rating.",
    features: [
      "Connects different diameter pipes",
      "Stepped design",
      "Pressure rating: 10 bar",
      "Size range: 219.1 to 812.8 mm",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-STEP-FLEX-2" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "219.1 to 812.8 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-step-flex-2", "STRAUB-STEP-FLEX 2 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "219.1mm",
    leadTime: "2-3 weeks",
    applications: ["Pipe transitions", "Mixed systems", "Retrofitting"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-STEP-FLEX-3",
    slug: "straub-step-flex-3",
    sku: "STRAUB-STEP-FLEX-3",
    name: "STRAUB-STEP-FLEX 3 Pipe Coupling",
    shortName: "STRAUB Step-Flex 3",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Large diameter stepped coupling for connecting different sized pipes from 914.4 to 2032mm.",
    features: [
      "Large diameter stepped design",
      "Pressure rating: 10 bar",
      "Size range: 914.4 to 2032.0 mm",
      "EPDM and NBR sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-STEP-FLEX-3" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "914.4 to 2032.0 mm" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: getStraubImages("straub-step-flex-3", "STRAUB-STEP-FLEX 3 Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "914.4mm",
    leadTime: "2-3 weeks",
    applications: ["Large pipe transitions", "Infrastructure"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-SQUARE-FLEX",
    slug: "straub-square-flex",
    sku: "STRAUB-SQUARE-FLEX",
    name: "STRAUB-SQUARE-FLEX Pipe Coupling",
    shortName: "STRAUB Square-Flex",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Specialised coupling for square/rectangular profile pipes. Available in 60, 80, and 100mm sizes.",
    features: [
      "For square profile pipes",
      "Pressure rating: 6 bar",
      "Size range: 60, 80, 100 mm",
      "EPDM sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-SQUARE-FLEX" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "6 bar" },
      { label: "Size Range", value: "60, 80, 100 mm" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-square-flex", "STRAUB-SQUARE-FLEX Pipe Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 6 BAR",
    sizeFrom: "60mm",
    leadTime: "2-3 weeks",
    applications: ["Square profile pipes", "HVAC ducting", "Industrial"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-REP-FLEX",
    slug: "straub-rep-flex",
    sku: "STRAUB-REP-FLEX",
    name: "STRAUB-REP-FLEX Pipe Repair Coupling",
    shortName: "STRAUB Rep-Flex",
    brand: "Straub",
    category: "pipe-repair-clamps",
    subcategory: "straub-pipe-repair-clamps",
    description: "Flexible pipe repair coupling for sealing leaks and cracks. Quick installation without welding or cutting.",
    features: [
      "Quick repair without welding",
      "Flexible sealing",
      "Pressure rating: 16 bar",
      "Size range: 46.0 to 429.0 mm",
      "EPDM sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-REP-FLEX" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "16 bar" },
      { label: "Size Range", value: "46.0 to 429.0 mm" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-rep-flex", "STRAUB-REP-FLEX Pipe Repair Coupling"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "46.0mm",
    leadTime: "2-3 weeks",
    applications: ["Pipe repair", "Emergency fixes", "Leak sealing"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-CLAMP-1PC",
    slug: "straub-clamp-one-piece",
    sku: "STRAUB-CLAMP-1PC",
    name: "STRAUB-CLAMP One-Piece",
    shortName: "STRAUB Clamp 1PC",
    brand: "Straub",
    category: "pipe-repair-clamps",
    subcategory: "straub-pipe-repair-clamps",
    description: "One-piece pipe repair clamp for quick emergency repairs. Wraps around pipe to seal leaks and cracks.",
    features: [
      "One-piece design",
      "Quick installation",
      "Pressure rating: 10 bar",
      "Size range: 44.0 to 330.0 mm",
      "EPDM sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-CLAMP-1PC" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "44.0 to 330.0 mm" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-clamp-1pc", "STRAUB-CLAMP One-Piece"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "44.0mm",
    leadTime: "2-3 weeks",
    applications: ["Emergency repair", "Leak sealing", "Pipe maintenance"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-CLAMP-2PC",
    slug: "straub-clamp-two-piece",
    sku: "STRAUB-CLAMP-2PC",
    name: "STRAUB-CLAMP Two-Piece",
    shortName: "STRAUB Clamp 2PC",
    brand: "Straub",
    category: "pipe-repair-clamps",
    subcategory: "straub-pipe-repair-clamps",
    description: "Two-piece pipe repair clamp for larger diameter pipes. Easy installation with two-part design.",
    features: [
      "Two-piece design for larger pipes",
      "Easy installation",
      "Pressure rating: 10 bar",
      "Size range: 88.0 to 440.0 mm",
      "EPDM sealing",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-CLAMP-2PC" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "10 bar" },
      { label: "Size Range", value: "88.0 to 440.0 mm" },
      { label: "Sealing Material", value: "EPDM" }
    ],
    images: getStraubImages("straub-clamp-2pc", "STRAUB-CLAMP Two-Piece"),
    materials: { body: "Stainless Steel", sleeve: "EPDM" },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "88.0mm",
    leadTime: "2-3 weeks",
    applications: ["Large pipe repair", "Emergency fixes", "Leak sealing"],
    certifications: "DIN 86128 compliant. Swiss quality manufacturing with 5-year system warranty."
  },

  // Shaped Parts
  {
    id: "STRAUB-ELBOW-90",
    slug: "straub-elbow-90",
    sku: "STRAUB-ELBOW-90",
    name: "STRAUB Elbow 90°",
    shortName: "STRAUB Elbow 90°",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "90-degree pipe elbow with extended ends. Manufactured from 1.4571 stainless steel (V4A). Premium Swiss engineering.",
    features: [
      "90-degree angle",
      "Extended ends (Type 3)",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-ELBOW-90" },
      { label: "Brand", value: "Straub" },
      { label: "Angle", value: "90°" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-elbow-90", "STRAUB Elbow 90°"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Pipeline direction changes", "Building services", "Industrial piping"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-ELBOW-45",
    slug: "straub-elbow-45",
    sku: "STRAUB-ELBOW-45",
    name: "STRAUB Elbow 45°",
    shortName: "STRAUB Elbow 45°",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "45-degree pipe elbow with extended ends. Manufactured from 1.4571 stainless steel.",
    features: [
      "45-degree angle",
      "Extended ends",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-ELBOW-45" },
      { label: "Brand", value: "Straub" },
      { label: "Angle", value: "45°" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-elbow-45", "STRAUB Elbow 45°"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Gradual direction changes", "Building services", "Industrial"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-EQUAL-TEE",
    slug: "straub-equal-tee",
    sku: "STRAUB-EQUAL-TEE",
    name: "STRAUB Equal Tee",
    shortName: "STRAUB Equal Tee",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "Equal tee fitting for pipeline branching. All three connections are the same diameter.",
    features: [
      "Equal diameter branches",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-EQUAL-TEE" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "Equal Tee" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-equal-tee", "STRAUB Equal Tee"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Pipeline branching", "Distribution systems", "Industrial"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-REDUCING-TEE",
    slug: "straub-reducing-tee",
    sku: "STRAUB-REDUCING-TEE",
    name: "STRAUB Reducing Tee",
    shortName: "STRAUB Reducing Tee",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "Reducing tee for branching to a smaller diameter pipe. Main run maintains diameter, branch is reduced.",
    features: [
      "Reducing branch connection",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-REDUCING-TEE" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "Reducing Tee" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-reducing-tee", "STRAUB Reducing Tee"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Branch connections", "Size transitions", "Distribution systems"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-REDUCER",
    slug: "straub-reducer-concentric",
    sku: "STRAUB-REDUCER",
    name: "STRAUB Concentric Reducer",
    shortName: "STRAUB Reducer",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "Concentric reducer for transitioning between different pipe diameters. Maintains centre line alignment.",
    features: [
      "Concentric design",
      "Smooth diameter transition",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-REDUCER" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "Concentric Reducer" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-reducer", "STRAUB Concentric Reducer"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Pipe size transitions", "Pump connections", "Equipment connections"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-FLANGE-ADAPTER",
    slug: "straub-flange-adapter",
    sku: "STRAUB-FLANGE-ADAPTER",
    name: "STRAUB Flange Adapter",
    shortName: "STRAUB Flange Adapter",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "Flange adapter for connecting plain-ended pipes to flanged equipment or valves.",
    features: [
      "Plain end to flange connection",
      "1.4571 stainless steel",
      "Various flange standards",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-FLANGE-ADAPTER" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "Flange Adapter" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-flange-adapter", "STRAUB Flange Adapter"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Valve connections", "Equipment connections", "Pipeline terminations"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-END-CAP",
    slug: "straub-pipe-end-cap",
    sku: "STRAUB-END-CAP",
    name: "STRAUB Pipe End Cap",
    shortName: "STRAUB End Cap",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "End cap for sealing off pipe ends. Pressure-tight closure for pipeline terminations.",
    features: [
      "Pressure-tight seal",
      "1.4571 stainless steel",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-END-CAP" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "End Cap" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-end-cap", "STRAUB Pipe End Cap"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Pipeline termination", "Pressure testing", "Future expansion points"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  },
  {
    id: "STRAUB-THREADED",
    slug: "straub-threaded-connection",
    sku: "STRAUB-THREADED",
    name: "STRAUB Threaded Connection",
    shortName: "STRAUB Threaded",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-shaped-parts",
    description: "Threaded connection fitting for integrating threaded components into plain-end piping systems.",
    features: [
      "Plain end to threaded connection",
      "1.4571 stainless steel",
      "Various thread standards",
      "Pressure rating: 25 bar",
      "5-year system warranty"
    ],
    specifications: [
      { label: "SKU", value: "STRAUB-THREADED" },
      { label: "Brand", value: "Straub" },
      { label: "Type", value: "Threaded Connection" },
      { label: "Material", value: "1.4571 Stainless Steel" },
      { label: "Pressure Rating", value: "25 bar" }
    ],
    images: getStraubImages("straub-threaded", "STRAUB Threaded Connection"),
    materials: { body: "1.4571 Stainless Steel" },
    pressureRange: "0 TO 25 BAR",
    leadTime: "2-3 weeks",
    applications: ["Threaded equipment", "Instrumentation", "Small bore connections"],
    certifications: "Swiss quality manufacturing with 5-year system warranty."
  }
];

// Categories
export const categories: Category[] = [
  {
    id: "valves",
    slug: "valves",
    name: "Industrial Valves",
    description: "Dewater Products supplies a full range of industrial-grade valves for fluid control, isolation, and backflow prevention. Whether you're working on water treatment, process pipelines, or general infrastructure, our valve selection covers check valves, gate valves, ball valves, butterfly valves and more.",
    longDescription: "We ship across Australia and offer expert support for engineers, specifiers, and contractors.",
    image: "/placeholder-valves.jpg"
  },
  {
    id: "pipe-couplings",
    slug: "pipe-couplings",
    name: "Pipe Couplings",
    description: "Dewater Products supplies a wide range of industrial-grade pipe couplings for joining plain-ended pipes across pressure, drainage, and suction pipelines. Whether you're specifying for infrastructure, process water, fire protection, or general pipeline repairs, our range includes flexible, axially restrained, and stepped pipe couplings from trusted global manufacturers.",
    longDescription: "We offer fast delivery across Australia and expert technical support. Call us on 1300 271 290 for advice.",
    image: "/placeholder-couplings.jpg"
  },
  {
    id: "pipe-repair-clamps",
    slug: "pipe-repair-clamps",
    name: "Pipe Repair Clamps",
    description: "Emergency and permanent pipe repair solutions. Orbit repair clamps provide quick, reliable repairs for leaking or damaged pipes.",
    image: "/placeholder-repair-clamps.jpg"
  },
  {
    id: "strainers",
    slug: "strainers",
    name: "Strainers",
    description: "Pipeline filtration solutions including Y-strainers, basket strainers, and suction strainers for protecting pumps and equipment.",
    image: "/placeholder-strainers.jpg"
  },
  {
    id: "rubber-expansion-joints",
    slug: "rubber-expansion-joints",
    name: "Rubber Expansion Joints",
    description: "Flexible rubber expansion joints for absorbing thermal expansion, vibration, and misalignment in piping systems.",
    image: "/placeholder-expansion.jpg"
  },
  {
    id: "flange-adaptors",
    slug: "flange-adaptors",
    name: "Flange Adaptors",
    description: "Stainless steel flange adaptors for connecting plain-ended pipes to flanged equipment.",
    image: "/placeholder-flanges.jpg"
  }
];

// Subcategories
export const subcategories: Subcategory[] = [
  // Valves subcategories
  {
    id: "butterfly-valve",
    slug: "butterfly-valve",
    name: "Butterfly Valves",
    description: "Compact flow control valves with a rotating disc, ideal for large diameter pipes.",
    category: "valves",
    image: "/placeholder-butterfly.jpg"
  },
  {
    id: "duckbill-check-valve",
    slug: "duckbill-check-valve",
    name: "Duckbill Check Valves",
    description: "Rubber valve that flexes open under flow, ideal for outfalls and stormwater systems.",
    category: "valves"
  },
  {
    id: "swing-check-valve",
    slug: "swing-check-valve",
    name: "Swing Check Valves",
    description: "Traditional swing disc check valves for preventing backflow in pipelines.",
    category: "valves"
  },
  {
    id: "dual-plate-check-valve",
    slug: "dual-plate-check-valve",
    name: "Dual Plate Check Valves",
    description: "Compact wafer-style check valves with spring-loaded dual plates.",
    category: "valves"
  },
  {
    id: "ball-check-valve",
    slug: "ball-check-valve",
    name: "Ball Check Valves",
    description: "Check valves using a ball mechanism for reliable backflow prevention.",
    category: "valves"
  },
  {
    id: "gate-valve",
    slug: "gate-valve",
    name: "Gate Valves",
    description: "Full-bore shutoff valves ideal for isolation in water and slurry systems.",
    category: "valves"
  },
  {
    id: "knife-gate-valve",
    slug: "knife-gate-valve",
    name: "Knife Gate Valves",
    description: "Heavy-duty shut-off valves for thick slurries and viscous fluids.",
    category: "valves"
  },
  {
    id: "foot-valve",
    slug: "foot-valve",
    name: "Foot Valves",
    description: "Non-return valves with strainers designed for the suction side of pumps.",
    category: "valves"
  },
  {
    id: "float-valve",
    slug: "float-valve",
    name: "Float Valves",
    description: "Level control valves that maintain liquid levels in tanks and reservoirs.",
    category: "valves"
  },
  {
    id: "ball-valve",
    slug: "ball-valve",
    name: "Ball Valves",
    description: "Quick shut-off valves using rotating ball for water, gas, and chemical applications.",
    category: "valves"
  },

  // Pipe Couplings subcategories
  {
    id: "orbit-couplings",
    slug: "orbit-couplings",
    name: "Orbit Couplings",
    description: "Australian industrial range of flexible and restrained pipe couplings.",
    category: "pipe-couplings"
  },
  {
    id: "straub-couplings",
    slug: "straub-couplings",
    name: "Straub Couplings",
    description: "Swiss-engineered GRIP and FLEX pipe couplings for axial restraint and flexible connections.",
    category: "pipe-couplings"
  },
  {
    id: "straub-shaped-parts",
    slug: "straub-shaped-parts",
    name: "Straub Shaped Parts",
    description: "Swiss-engineered elbows, tees, reducers, and end caps for pipe systems.",
    category: "pipe-couplings"
  },

  // Repair Clamps subcategories
  {
    id: "orbit-pipe-repair-clamps",
    slug: "orbit-pipe-repair-clamps",
    name: "Orbit Pipe Repair Clamps",
    description: "Stainless steel repair clamps for emergency and permanent pipe repairs.",
    category: "pipe-repair-clamps"
  },
  {
    id: "straub-pipe-repair-clamps",
    slug: "straub-pipe-repair-clamps",
    name: "Straub Pipe Repair Clamps",
    description: "Swiss-engineered pipe repair clamps for demanding applications.",
    category: "pipe-repair-clamps"
  },

  // Strainers subcategories
  {
    id: "y-strainer",
    slug: "y-strainer",
    name: "Y Strainers",
    description: "Compact Y-pattern strainers for pipeline filtration.",
    category: "strainers"
  },
  {
    id: "simplex-basket-strainer",
    slug: "simplex-basket-strainer",
    name: "Simplex Basket Strainers",
    description: "Single basket strainers for pipeline protection.",
    category: "strainers"
  },
  {
    id: "duplex-basket-strainer",
    slug: "duplex-basket-strainer",
    name: "Duplex Basket Strainers",
    description: "Twin basket strainers for continuous filtration.",
    category: "strainers"
  },

  // Rubber Expansion Joints subcategories
  {
    id: "single-sphere",
    slug: "single-sphere",
    name: "Single Sphere Expansion Joints",
    description: "Single sphere rubber expansion joints for pump connections and vibration isolation.",
    category: "rubber-expansion-joints"
  },

  // Flange Adaptors subcategories
  {
    id: "flange-adaptor",
    slug: "flange-adaptor",
    name: "Flange Adaptors",
    description: "Stainless steel flange adaptors for connecting plain-ended pipes to flanged equipment.",
    category: "flange-adaptors"
  }
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsBySubcategory(category: string, subcategory: string): Product[] {
  return products.filter((p) => p.category === category && p.subcategory === subcategory);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(slug: string): Subcategory | undefined {
  return subcategories.find((s) => s.slug === slug);
}

export function getSubcategoriesByCategory(category: string): Subcategory[] {
  return subcategories.filter((s) => s.category === category);
}
