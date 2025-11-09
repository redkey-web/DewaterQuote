import type { Product, Category, Subcategory } from "../schema";

// Real Products from dewaterproducts.com.au
export const products: Product[] = [
  // Butterfly Valves
  {
    id: "BFLYW316",
    slug: "butterfly-valve-316-stainless-steel-cf8m-body-ptfe",
    sku: "BFLYW316",
    name: "Butterfly Valve - CF8M Full 316 Stainless Steel - PTFE - Wafer Universal",
    shortName: "CF8M Butterfly Valve",
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
    images: [
      { url: "/images/products/valves/butterfly-valve-cf8m-316ss.jpg", alt: "Butterfly Valve - CF8M Full 316 Stainless Steel", type: "image" },
      { url: "/images/products/valves/butterfly-valve-cf8m-316ss-angle2.jpg", alt: "Butterfly Valve - CF8M 316SS - Lever Handle View", type: "image" }
    ],
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
      { url: "/images/products/orbit/pipe-repair-clamp-200mm.jpg", alt: "Orbit Pipe Repair Clamp 55mm", type: "image" }
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
      { url: "/images/products/valves/foot-valve-galv.jpg", alt: "Foot Valve - Galvanised", type: "image" },
      { url: "/images/products/valves/foot-valve-galv-detail.jpg", alt: "Foot Valve - Galvanised - Detail View", type: "image" }
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

  // Flex Grip L
  {
    id: "OCFG-L",
    slug: "flex-grip-l-pipe-coupling",
    sku: "OCFG-L",
    name: "Flex Grip L - Long Model Pipe Coupling",
    shortName: "Flex Grip L",
    brand: "Orbit Couplings",
    category: "pipe-couplings",
    subcategory: "orbit-couplings",
    description: "The Flex Grip L model is the Long model pipe coupling. Allowing for axial movements, vibration, and minor pipe misalignments. This coupling does not prevent pull out, so pipes must be anchored somehow.",
    features: [
      "Flexible design accommodates pipe misalignment and axial movement",
      "Durable and reliable corrosion-resistant materials",
      "Quick installation with no welding, flanging, or special tools required",
      "High-pressure and temperature resistance for industrial and marine use",
      "Vibration absorption prevents stress on piping systems",
      "WRAS-approved EPDM rubber sleeve for potable water",
      "12 months warranty on manufacturing defects only"
    ],
    specifications: [
      { label: "SKU", value: "OCFG-L" },
      { label: "Brand", value: "Orbit Couplings" },
      { label: "Sleeve Material", value: "EPDM" },
      { label: "Body Material", value: "316 Stainless Steel" },
      { label: "Pressure Rating", value: "0 to 32 BAR" }
    ],
    images: [
      { url: "/images/products/orbit/flex-grip-l.jpg", alt: "Flex Grip L Pipe Coupling", type: "image" }
    ],
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "48.3mm",
    leadTime: "12 days if nil stock",
    applications: ["Systems with thermal expansion or dynamic movement", "Marine applications", "Industrial piping", "Building services"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Flex Grip S
  {
    id: "OCFG-S",
    slug: "flex-grip-s-pipe-coupling",
    sku: "OCFG-S",
    name: "Flex Grip S - Short Model Pipe Coupling",
    shortName: "Flex Grip S",
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/flex-grip-s.jpg", alt: "Flex Grip S Pipe Coupling", type: "image" }
    ],
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "21.3mm",
    leadTime: "12 days if nil stock",
    applications: ["Compact installations", "Pipe repair", "Industrial piping", "Pressure systems"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Metal Lock L
  {
    id: "OCML-L",
    slug: "metal-lock-l-pipe-coupling",
    sku: "OCML-L",
    name: "Metal Lock L - Long Model with Axial Restraint",
    shortName: "Metal Lock L",
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/metal-lock-l.jpg", alt: "Metal Lock L Pipe Coupling", type: "image" }
    ],
    materials: {
      body: "304ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "48.3mm",
    leadTime: "12 days if nil stock",
    applications: ["High-pressure systems requiring axial restraint", "Water supply networks", "Industrial process piping", "Infrastructure projects"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 304 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Metal Lock S
  {
    id: "OCML-S",
    slug: "metal-lock-s-pipe-coupling",
    sku: "OCML-S",
    name: "Metal Lock S - Short Model with Axial Restraint",
    shortName: "Metal Lock S",
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/metal-lock-s.jpg", alt: "Metal Lock S Pipe Coupling", type: "image" }
    ],
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 32 BAR",
    sizeFrom: "26.9mm",
    leadTime: "12 days if nil stock",
    applications: ["Compact high-pressure installations", "Pipe repair with restraint", "Water distribution systems", "Industrial applications"],
    certifications: "WRAS-approved EPDM rubber sleeves suitable for potable water applications. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Fire Protection Coupling
  {
    id: "OCFPC",
    slug: "fire-protection-coupling",
    sku: "OCFPC",
    name: "Fire Protection Coupling - IACS Compliant",
    shortName: "Fire Protection Coupling",
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/fire-protection-coupling.jpg", alt: "Fire Protection Coupling", type: "image" }
    ],
    materials: {
      body: "316ss",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO 28 BAR",
    sizeFrom: "114.3mm",
    leadTime: "12 days if nil stock",
    applications: ["Fire protection systems", "Marine fire suppression", "Industrial fire safety", "Building fire services"],
    certifications: "IACS compliant for fire protection applications. WRAS-approved EPDM rubber sleeves suitable for potable water. 316 stainless steel components provide excellent corrosion resistance. Manufactured to ISO 9001 quality standards."
  },

  // Elbow Repair Clamp
  {
    id: "OCERC",
    slug: "elbow-repair-clamp",
    sku: "OCERC",
    name: "Elbow Repair Clamp - Orbit Couplings",
    shortName: "Elbow Repair Clamp",
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/elbow-repair-clamp.jpg", alt: "Elbow Repair Clamp", type: "image" }
    ],
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
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/open-flex-300-l.jpg", alt: "Open Flex 300-L Pipe Coupling", type: "image" }
    ],
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
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/open-flex-400-l.jpg", alt: "Open Flex 400-L Pipe Coupling", type: "image" }
    ],
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
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/pipe-repair-clamp-200mm.jpg", alt: "Orbit Pipe Repair Clamp 200mm Wide", type: "image" }
    ],
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
    brand: "Orbit Couplings",
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
    images: [
      { url: "/images/products/orbit/pipe-repair-clamp-300mm.jpg", alt: "Orbit Pipe Repair Clamp 300mm Wide", type: "image" }
    ],
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
    brand: "Defender",
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
    images: [
      { url: "/images/products/strainers/y-strainer-316ss.jpg", alt: "Stainless Steel Y Strainer CF8M", type: "image" }
    ],
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
    brand: "Defender",
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
    images: [
      { url: "/images/products/expansion-joints/fsf-single-sphere.jpg", alt: "FSF Single Sphere Rubber Expansion Joint", type: "image" }
    ],
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
    brand: "Defender",
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
    brand: "Defender",
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
      { url: "/images/products/flange-adaptors/ss-flange-adapter-316.jpg", alt: "Stainless Steel Flange Adapter 316SS", type: "image" }
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
