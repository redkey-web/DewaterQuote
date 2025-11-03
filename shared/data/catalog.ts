import type { Product, Category, Subcategory } from "../schema";

// Real Products from dewaterproducts.com.au
export const products: Product[] = [
  // Butterfly Valves
  {
    id: "BFLYW316",
    slug: "butterfly-valve-316-stainless-steel-cf8m-body-ptfe",
    sku: "BFLYW316",
    name: "Butterfly Valve - CF8M Full 316 Stainless Steel - PTFE - Wafer Universal",
    shortName: "CF8M Butterfly Valve - PTFE",
    brand: "Butterfly Valve - CF8M 316 Stainless Steel - PTFE",
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
      { value: "50mm", label: "50mm DN50 (2\") Nominal Bore sizing" },
      { value: "65mm", label: "65mm" },
      { value: "80mm", label: "80mm DN80 (3\") Nominal Bore sizing" },
      { value: "100mm", label: "100mm DN100 (4\") Nominal Bore sizing" },
      { value: "125mm", label: "125mm" },
      { value: "150mm", label: "150mm" },
      { value: "200mm", label: "200mm" },
      { value: "250mm", label: "250mm" },
      { value: "300mm", label: "300mm" }
    ],
    images: [
      { url: "/placeholder-valve.jpg", alt: "Butterfly Valve - CF8M Full 316 Stainless Steel", type: "image" }
    ],
    leadTime: "7 days if nil stock",
    materials: {
      body: "CF8M",
      disc: "CF8M",
      seat: "PTFE"
    },
    pressureRange: "0-16 BAR",
    sizeFrom: "50mm"
  },

  // Duckbill Check Valve
  {
    id: "DB-1",
    slug: "db-1-slip-on-duckbill-check-valve-neoprene",
    sku: "DB-1",
    name: "DB-1 Slip On Duckbill Check Valve - Neoprene",
    shortName: "DB-1 Duckbill Check Valve",
    brand: "DB-1 Slip On Duckbill Check Valve - Neoprene",
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
    images: [
      { url: "/placeholder-duckbill.jpg", alt: "DB-1 Slip On Duckbill Check Valve", type: "image" }
    ],
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
    brand: "Orbit Pipe Repair Clamp 55mm wide",
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
    images: [
      { url: "/placeholder-clamp.jpg", alt: "Orbit Pipe Repair Clamp 55mm", type: "image" }
    ],
    video: "https://www.youtube.com/watch?v=VRei4m3c3Ck",
    leadTime: "12 days if nil stock",
    materials: {
      sleeve: "EPDM",
      body: "316ss"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "48.3mm",
    applications: ["Emergency pipe repairs", "Leak sealing", "Crack repair"]
  },

  // Foot Valve
  {
    id: "FVGALV",
    slug: "foot-valve-galvanised-flanged-table-d",
    sku: "FVGALV",
    name: "Foot Valve - Galvanised - Flanged Table D",
    shortName: "Galvanised Foot Valve",
    brand: "Foot Valve",
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
    images: [
      { url: "/placeholder-foot-valve.jpg", alt: "Foot Valve - Galvanised", type: "image" }
    ],
    materials: {
      body: "GALV",
      seat: "EPDM"
    },
    pressureRange: "0 TO 10 BAR",
    sizeFrom: "80mm",
    applications: ["Pump suction lines", "Irrigation systems", "Water supply"],
    certifications: "WRAS-approved EPDM seals for potable water applications. Galvanised steel construction to AS/NZS standards. Suitable for water supply and irrigation systems."
  },

  // Orbit Standard Coupling
  {
    id: "ORBIT-STD",
    slug: "orbit-standard-coupling-series-1",
    sku: "ORBIT-STD",
    name: "Orbit Standard Coupling Series 1",
    shortName: "Orbit Standard Coupling",
    brand: "Orbit",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Orbit Standard Coupling Series 1 is a flexible pipe coupling for joining plain-ended pipes. Features 316 stainless steel construction with WRAS-approved EPDM rubber sleeve for potable water applications.",
    features: [
      "Flexible coupling allows angular deflection",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "316 stainless steel bands and bolts",
      "Accommodates slight misalignment",
      "Quick and easy installation",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "ORBIT-STD" },
      { label: "Brand", value: "Orbit" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Band Material", value: "316 Stainless Steel" },
      { label: "Bolts", value: "4" },
      { label: "Series", value: "1" }
    ],
    images: [
      { url: "/placeholder-coupling.jpg", alt: "Orbit Standard Coupling", type: "image" }
    ],
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "48.3mm",
    applications: ["Water supply pipelines", "Pressure pipelines", "Pipe joining"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Y-Strainer
  {
    id: "YSTR-CI",
    slug: "y-strainer-cast-iron-flanged",
    sku: "YSTR-CI",
    name: "Y-Strainer - Cast Iron - Flanged PN16",
    shortName: "Cast Iron Y-Strainer",
    brand: "Y-Strainer",
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
      { url: "/placeholder-strainer.jpg", alt: "Y-Strainer Cast Iron", type: "image" }
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
    brand: "Rubber Expansion Joint",
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
      { url: "/placeholder-expansion.jpg", alt: "Rubber Expansion Joint EPDM", type: "image" }
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
    brand: "Ball Valve",
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
      { url: "/placeholder-ball-valve.jpg", alt: "316ss Ball Valve", type: "image" }
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
    brand: "Gate Valve",
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
      { url: "/placeholder-gate-valve.jpg", alt: "DI Gate Valve", type: "image" }
    ],
    materials: {
      body: "DI",
      disc: "DI/EPDM"
    },
    pressureRange: "0 TO 16 BAR",
    sizeFrom: "80mm",
    applications: ["Water distribution", "Sewerage systems", "Fire protection", "Irrigation"],
    certifications: "WRAS-approved EPDM seals for potable water. Manufactured to AS/NZS 2638 standards. Suitable for underground installation."
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
