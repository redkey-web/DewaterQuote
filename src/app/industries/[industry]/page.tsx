import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllProducts } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle,
  ArrowRight,
  Droplets,
  Flame,
  Mountain,
  Anchor,
  Wind,
  Apple,
  Wheat,
  AlertTriangle,
  Wrench,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react"
import type { Metadata } from "next"

interface IndustryPageProps {
  params: Promise<{ industry: string }>
}

interface CouplingRecommendation {
  application: string
  orbitModel: string
  straubModel: string
  notes: string
}

interface IndustryData {
  name: string
  tagline: string
  description: string
  metaDescription: string
  keywords: string[]
  icon: typeof Droplets
  heroColor: string
  heroImage: string
  challenges: { title: string; description: string }[]
  solutions: { category: string; description: string; products: string[] }[]
  applications: string[]
  couplingGuide?: CouplingRecommendation[]
  recommendedProducts: string[] // Product IDs
  faqs: { question: string; answer: string }[]
}

const industryData: Record<string, IndustryData> = {
  "water-wastewater": {
    name: "Water & Wastewater",
    tagline: "Reliable Solutions for Critical Water Infrastructure",
    description:
      "Complete piping solutions for water treatment plants, sewage systems, and water distribution networks. Our products meet strict Australian standards for potable water and wastewater applications, with certifications including AS/NZS 4020 compliance.",
    metaDescription:
      "Industrial pipe fittings for water treatment plants, sewage systems, and water distribution. AS/NZS 4020 compliant valves, couplings, and expansion joints. Fast delivery Australia-wide.",
    keywords: [
      "water treatment pipe fittings",
      "wastewater valves",
      "sewage pump couplings",
      "potable water pipe",
      "water authority supplies",
      "stormwater products",
    ],
    icon: Droplets,
    heroColor: "from-blue-500/10 to-cyan-500/10",
    heroImage: "/images/industries/water-wastewater.webp",
    challenges: [
      {
        title: "Corrosion Resistance",
        description:
          "Water and wastewater environments accelerate corrosion. Our 316 stainless steel and EPDM rubber products resist degradation.",
      },
      {
        title: "Potable Water Compliance",
        description:
          "Products must meet AS/NZS 4020 for drinking water contact. We stock WRAS-approved and WaterMark certified options.",
      },
      {
        title: "24/7 Operations",
        description:
          "Treatment plants run continuously. Our quick-install couplings minimise downtime during maintenance and repairs.",
      },
      {
        title: "Variable Flow Conditions",
        description:
          "Pump start/stop cycles create water hammer. Expansion joints and check valves protect your infrastructure.",
      },
    ],
    solutions: [
      {
        category: "Pump Connections",
        description: "Isolate vibration and allow for thermal movement with rubber expansion joints.",
        products: ["expansion-joints"],
      },
      {
        category: "Backflow Prevention",
        description: "Check valves prevent reverse flow in pump stations and rising mains.",
        products: ["industrial-valves"],
      },
      {
        category: "Pipe Repair",
        description: "Repair damaged mains without shutdown using Straub and Orbit clamps.",
        products: ["pipe-couplings"],
      },
      {
        category: "Strainer Protection",
        description: "Protect pumps and equipment with Y-strainers and basket strainers.",
        products: ["strainers"],
      },
    ],
    applications: [
      "Water treatment plants",
      "Sewage pumping stations",
      "Desalination facilities",
      "Stormwater management systems",
      "Municipal water networks",
      "Reservoir and dam infrastructure",
      "Recycled water systems",
      "Sludge handling pipelines",
    ],
    couplingGuide: [
      {
        application: "Joining same-sized pipes",
        orbitModel: "Flex Grip / Metal Lock",
        straubModel: "Metal Grip / Grip L",
        notes: "Restrained couplings prevent axial movement"
      },
      {
        application: "Repair clamp for leaking section",
        orbitModel: "Open Flex 200L/300L",
        straubModel: "Open Flex / Clamp SCE",
        notes: "Split-body design for live repairs"
      },
      {
        application: "Joining different OD pipes",
        orbitModel: "Stepped Coupling",
        straubModel: "Step Flex 2/3",
        notes: "For connecting mismatched pipe diameters"
      },
      {
        application: "Plastic-to-metal connection",
        orbitModel: "Combo Lock",
        straubModel: "Combi Grip / Plast Grip",
        notes: "Mixed material joining solution"
      },
    ],
    recommendedProducts: ["BFLYW316", "DB-1", "FSF-REJ", "SBS316"],
    faqs: [
      {
        question: "Are your products approved for potable water applications?",
        answer:
          "Yes, we stock products with WRAS approval, WaterMark certification, and AS/NZS 4020 compliance for contact with drinking water. EPDM rubber seals are the standard for potable water.",
      },
      {
        question: "Can you supply products certified to water authority specifications?",
        answer:
          "Absolutely. We regularly supply products to Water Corporation, Sydney Water, SA Water, and other authorities. Contact us with your project specifications.",
      },
      {
        question: "What materials are best for sewage and wastewater?",
        answer:
          "For sewage, we recommend 316 stainless steel bodies with NBR or EPDM seals. Duckbill check valves in neoprene are ideal for outfalls. Avoid brass in sewage due to dezincification.",
      },
      {
        question: "Do you offer emergency supply for burst mains?",
        answer:
          "Yes, we understand water infrastructure emergencies. Call us directly on 1300 271 290 for urgent orders. We stock common repair clamp sizes for fast dispatch.",
      },
    ],
  },
  irrigation: {
    name: "Irrigation",
    tagline: "Durable Products for Agricultural Water Management",
    description:
      "Reliable irrigation solutions for agricultural and landscaping applications. Products designed for efficient water distribution and long-term durability in outdoor conditions, from broadacre farming to precision drip systems.",
    metaDescription:
      "Irrigation pipe fittings, valves, and couplings for farms, vineyards, and landscaping. UV-resistant materials, foot valves for pumps, and strainers. Delivered Australia-wide.",
    keywords: [
      "irrigation valves",
      "farm pipe fittings",
      "foot valves for pumps",
      "agricultural water",
      "vineyard irrigation",
      "pivot irrigation supplies",
    ],
    icon: Wheat,
    heroColor: "from-green-500/10 to-lime-500/10",
    heroImage: "/images/industries/irrigation.webp",
    challenges: [
      {
        title: "UV Exposure",
        description:
          "Above-ground pipework faces harsh sun. Our products use UV-stabilised materials for long outdoor service life.",
      },
      {
        title: "Debris and Sediment",
        description:
          "Dam and bore water contains debris that damages pumps. Strainers and foot valves protect your investment.",
      },
      {
        title: "Remote Locations",
        description:
          "Farm infrastructure is often far from suppliers. We deliver Australia-wide with regional freight options.",
      },
      {
        title: "Seasonal Demand",
        description:
          "Peak irrigation season means urgent repairs. We stock common sizes for quick turnaround.",
      },
    ],
    solutions: [
      {
        category: "Pump Suction",
        description: "Foot valves maintain prime and prevent backflow in suction lines.",
        products: ["industrial-valves"],
      },
      {
        category: "Flow Control",
        description: "Butterfly and gate valves control water distribution across zones.",
        products: ["industrial-valves"],
      },
      {
        category: "Filtration",
        description: "Y-strainers remove debris before it reaches sprinklers and drippers.",
        products: ["strainers"],
      },
      {
        category: "Pipe Joining",
        description: "Couplings connect different pipe materials and repair damaged sections.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "Agricultural irrigation systems",
      "Drip irrigation networks",
      "Sprinkler systems",
      "Centre pivot irrigation",
      "Golf course irrigation",
      "Vineyard and orchard systems",
      "Sports field irrigation",
      "Nursery and greenhouse supply",
    ],
    recommendedProducts: ["FV-GALV-TD", "CIYSE", "BFLYWCI"],
    faqs: [
      {
        question: "What foot valve should I use for my irrigation pump?",
        answer:
          "For most farm pumps, a galvanised foot valve with EPDM seal is ideal. Match the size to your suction pipe diameter. For corrosive bore water, consider a stainless steel option.",
      },
      {
        question: "How do I protect my pump from debris?",
        answer:
          "Install a Y-strainer on the discharge side and ensure your foot valve has an integrated strainer basket. For very dirty water, add a basket strainer with cleanable element.",
      },
      {
        question: "Can your products handle fertiliser injection systems?",
        answer:
          "Yes, but material selection is important. EPDM seals handle most fertilisers well. For aggressive chemicals, specify NBR or contact us for recommendations.",
      },
      {
        question: "Do you supply fittings for poly pipe?",
        answer:
          "Our couplings work with various pipe materials including PE/poly pipe. Specify the outside diameter when ordering for correct sizing.",
      },
    ],
  },
  "fire-services": {
    name: "Fire Services",
    tagline: "Certified Components for Life Safety Systems",
    description:
      "Fire protection piping components meeting Australian standards for fire safety systems. Trusted by fire protection contractors across Australia for sprinkler systems, hydrant networks, and pump stations.",
    metaDescription:
      "Fire protection pipe fittings, valves, and couplings. AS 2118 compliant products for sprinkler systems, hydrants, and fire pumps.",
    keywords: [
      "fire sprinkler fittings",
      "fire protection valves",
      "fire pump couplings",
      "hydrant supplies",
      "AS 2118 compliant",
    ],
    icon: Flame,
    heroColor: "from-red-500/10 to-orange-500/10",
    heroImage: "/images/industries/fire-services.webp",
    challenges: [
      {
        title: "Regulatory Compliance",
        description:
          "Fire systems require certified components. We stock products compliant with AS 2118 and international standards.",
      },
      {
        title: "Reliability Critical",
        description:
          "Fire systems must work when needed. Our valves are tested and certified for fire service applications.",
      },
      {
        title: "Project Documentation",
        description:
          "Compliance requires traceability. We provide test certificates and material documentation.",
      },
      {
        title: "Specialist Knowledge",
        description:
          "Fire systems have specific requirements. Our team understands fire protection standards.",
      },
    ],
    solutions: [
      {
        category: "Flow Control",
        description: "Butterfly valves for isolation and flow control in sprinkler mains.",
        products: ["industrial-valves"],
      },
      {
        category: "Check Valves",
        description: "Prevent backflow in fire pump discharge and sprinkler feed mains.",
        products: ["industrial-valves"],
      },
      {
        category: "Pump Connections",
        description: "Flexible connections for fire pumps with vibration isolation.",
        products: ["expansion-joints"],
      },
      {
        category: "Pipe Joining",
        description: "Couplings for grooved and plain-end fire sprinkler pipe.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "Fire sprinkler systems",
      "Fire hydrant networks",
      "Fire pump stations",
      "Deluge systems",
      "Fire hose reels",
      "Wet/dry riser systems",
      "Foam systems",
      "Water storage connections",
    ],
    couplingGuide: [
      {
        application: "Sprinkler mains (restrained)",
        orbitModel: "Metal Lock / Fire Protection Coupling",
        straubModel: "Metal Grip Fire Fence",
        notes: "Fire-rated restrained coupling for mains"
      },
      {
        application: "Grooved pipe connections",
        orbitModel: "Flex Grip",
        straubModel: "Metal Grip / Grip L",
        notes: "Axially restrained for grooved systems"
      },
      {
        application: "Retrofit to existing pipe",
        orbitModel: "Open Flex",
        straubModel: "Open Flex",
        notes: "Split-body for connecting to existing services"
      },
      {
        application: "Pump house flexible connections",
        orbitModel: "Flex Grip L",
        straubModel: "Flex 1L/2",
        notes: "Allows for movement and vibration"
      },
    ],
    recommendedProducts: ["BFLYW316", "DPCHK316", "FSF-REJ"],
    faqs: [
      {
        question: "Are your butterfly valves approved for fire protection?",
        answer:
          "Our 316 stainless steel butterfly valves are suitable for fire protection applications. For UL/FM listed requirements, contact us to confirm specific product approvals.",
      },
      {
        question: "Can you provide test certificates for fire system products?",
        answer:
          "Yes, we provide material test certificates, pressure test reports, and compliance documentation for fire system projects as required.",
      },
      {
        question: "What couplings are suitable for grooved fire pipe?",
        answer:
          "For grooved pipe systems, we recommend Straub GRIP couplings which provide axial restraint. For plain-end connections, both GRIP and FLEX options are available.",
      },
      {
        question: "Do you supply products for heritage building fire upgrades?",
        answer:
          "Yes, our pipe repair couplings are ideal for connecting new fire services to existing pipework in heritage buildings without major structural work.",
      },
    ],
  },
  mining: {
    name: "Mining",
    tagline: "Heavy-Duty Solutions for Demanding Environments",
    description:
      "Heavy-duty piping solutions for demanding mining environments. Products engineered to handle abrasive slurries, high pressures, and harsh conditions found in underground and open-cut operations.",
    metaDescription:
      "Mining pipe fittings for dewatering, slurry transport, and process water. Heavy-duty valves, couplings, and expansion joints rated for abrasive and high-pressure service.",
    keywords: [
      "mining pipe fittings",
      "slurry valves",
      "dewatering couplings",
      "mine water management",
      "heavy duty pipe fittings",
      "tailings pipe",
    ],
    icon: Mountain,
    heroColor: "from-amber-500/10 to-yellow-500/10",
    heroImage: "/images/industries/mining.webp",
    challenges: [
      {
        title: "Abrasive Slurries",
        description:
          "Mining fluids contain abrasive particles. We stock heavy-wall products and wear-resistant materials.",
      },
      {
        title: "High Pressures",
        description:
          "Deep mine dewatering operates at high pressure. Our products are rated for demanding service.",
      },
      {
        title: "Remote Sites",
        description:
          "Mine sites are often remote. We coordinate deliveries to site compounds across Australia.",
      },
      {
        title: "Shutdown Windows",
        description:
          "Limited maintenance windows require fast repairs. Our couplings enable quick pipe connection.",
      },
    ],
    solutions: [
      {
        category: "Dewatering",
        description: "Check valves and foot valves for mine dewatering pump systems.",
        products: ["industrial-valves"],
      },
      {
        category: "Slurry Isolation",
        description: "Knife gate valves for positive shut-off of slurry and tailings lines.",
        products: ["industrial-valves"],
      },
      {
        category: "Vibration Control",
        description: "Expansion joints absorb pump vibration and pipe movement.",
        products: ["expansion-joints"],
      },
      {
        category: "Emergency Repair",
        description: "Repair clamps fix damaged pipes fast without shutdown.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "Mine dewatering systems",
      "Slurry transport pipelines",
      "Process water systems",
      "Tailings management",
      "Dust suppression",
      "Wash plant supply",
      "Underground services",
      "Bore water supply",
    ],
    couplingGuide: [
      {
        application: "Emergency pipe repair",
        orbitModel: "Open Flex 200L/300L/400L",
        straubModel: "Open Flex / Clamp SCE/SCZ",
        notes: "Split-body for fast live repairs"
      },
      {
        application: "High-pressure dewatering",
        orbitModel: "Metal Lock S/L",
        straubModel: "Metal Grip GT",
        notes: "High-pressure rated (up to 37 bar)"
      },
      {
        application: "Large diameter pipelines",
        orbitModel: "Flex Grip 3/4",
        straubModel: "Flex 3/4",
        notes: "Sizes up to 4000mm available"
      },
      {
        application: "Joining dissimilar pipes",
        orbitModel: "Stepped Coupling / Combo Lock",
        straubModel: "Step Flex / Combi Grip",
        notes: "For PE to steel, different ODs"
      },
    ],
    recommendedProducts: ["KGV-SS316", "BFLYW316", "FSF-REJ", "DB-1"],
    faqs: [
      {
        question: "What valves work best for slurry service?",
        answer:
          "Knife gate valves are preferred for slurry isolation as the blade cuts through solids. For modulating duty, use a full-bore butterfly valve with hardened disc.",
      },
      {
        question: "Can you supply to remote mine sites?",
        answer:
          "Yes, we regularly deliver to mine sites across WA, QLD, and NT. We can coordinate with site logistics for gate pass requirements and delivery windows.",
      },
      {
        question: "What products suit high-pressure dewatering?",
        answer:
          "Our PN16 rated couplings and valves handle most dewatering applications. For higher pressures, contact us to discuss PN25 or PN40 options.",
      },
      {
        question: "Do you provide wear-resistant options?",
        answer:
          "Yes, for abrasive applications we recommend 316 stainless steel bodies and NBR rubber for better abrasion resistance than EPDM.",
      },
    ],
  },
  construction: {
    name: "Construction",
    tagline: "Reliable Pipe Solutions for Building Projects",
    description:
      "Industrial piping solutions for construction and civil engineering projects. From high-rise buildings to infrastructure developments, we supply durable fittings that meet project deadlines and Australian standards.",
    metaDescription:
      "Construction pipe fittings, valves, and couplings for building projects and civil works. Quick-install couplings, expansion joints, and valves. Fast delivery to Australian construction sites.",
    keywords: [
      "construction pipe fittings",
      "building services plumbing",
      "civil engineering pipe",
      "mechanical services fittings",
      "construction valves",
      "builder pipe supplies",
    ],
    icon: Wrench,
    heroColor: "from-orange-500/10 to-amber-500/10",
    heroImage: "/images/industries/construction.webp",
    challenges: [
      {
        title: "Tight Deadlines",
        description:
          "Construction schedules are demanding. Our stock availability and fast dispatch keep your project on track.",
      },
      {
        title: "Mixed Pipe Materials",
        description:
          "Sites often have different pipe types. Our transition couplings join dissimilar materials reliably.",
      },
      {
        title: "Quality Compliance",
        description:
          "Building certifications require documented products. We provide test certificates and compliance documentation.",
      },
      {
        title: "Site Logistics",
        description:
          "Deliveries need to match construction stages. We coordinate with your schedule for timely supply.",
      },
    ],
    solutions: [
      {
        category: "Building Services",
        description: "Valves and fittings for mechanical plant rooms and riser connections.",
        products: ["industrial-valves"],
      },
      {
        category: "Vibration Isolation",
        description: "Expansion joints isolate pump and equipment vibration from building structure.",
        products: ["expansion-joints"],
      },
      {
        category: "Quick Connections",
        description: "Pipe couplings speed up installation and allow for future modifications.",
        products: ["pipe-couplings"],
      },
      {
        category: "Equipment Protection",
        description: "Strainers protect chillers, boilers, and other equipment from debris.",
        products: ["strainers"],
      },
    ],
    applications: [
      "Commercial building services",
      "High-rise mechanical systems",
      "Hospital and healthcare facilities",
      "Data centre cooling",
      "Industrial facility fit-out",
      "Civil infrastructure projects",
      "Stormwater drainage systems",
      "Plant room installations",
    ],
    couplingGuide: [
      {
        application: "Quick pipe connections",
        orbitModel: "Flex Grip S/L",
        straubModel: "Metal Grip / Flex",
        notes: "No welding, threading, or beveling required"
      },
      {
        application: "Connecting to existing services",
        orbitModel: "Open Flex",
        straubModel: "Open Flex",
        notes: "Split-body for retrofit installations"
      },
      {
        application: "Mixed pipe materials",
        orbitModel: "Combo Lock",
        straubModel: "Combi Grip",
        notes: "Join PVC to HDPE, steel to ductile iron"
      },
      {
        application: "Vibration zones (pump stations)",
        orbitModel: "Flex Grip L",
        straubModel: "Flex 1L/2",
        notes: "Non-restrained for movement absorption"
      },
    ],
    recommendedProducts: ["BFLYW316", "FSF-REJ", "SBS316", "CIYSE"],
    faqs: [
      {
        question: "Can you deliver directly to construction sites?",
        answer:
          "Yes, we deliver to construction sites across Australia. Provide site contact details and any access requirements when ordering.",
      },
      {
        question: "Do you offer trade accounts for builders?",
        answer:
          "Yes, we offer trade accounts for regular purchasers including builders, plumbers, and mechanical contractors. Contact us to set up an account.",
      },
      {
        question: "What documentation do you provide for building certifications?",
        answer:
          "We supply material test certificates, pressure ratings, and compliance documentation as required for building certifications and commissioning.",
      },
      {
        question: "Can you supply products for heritage building renovations?",
        answer:
          "Our pipe couplings are ideal for connecting new services to existing pipework in heritage buildings, allowing upgrades without major structural changes.",
      },
    ],
  },
  marine: {
    name: "Marine",
    tagline: "Corrosion-Resistant Solutions for Maritime Applications",
    description:
      "Corrosion-resistant piping components for marine and offshore applications. Designed to withstand saltwater environments and meet maritime standards for vessels, ports, and offshore installations.",
    metaDescription:
      "Marine pipe fittings in 316 stainless steel. Saltwater-resistant valves, couplings, and expansion joints for ships, ports, and offshore platforms.",
    keywords: [
      "marine pipe fittings",
      "316 stainless steel marine",
      "boat plumbing",
      "offshore pipe fittings",
      "saltwater resistant valves",
      "port infrastructure",
    ],
    icon: Anchor,
    heroColor: "from-cyan-500/10 to-blue-500/10",
    heroImage: "/images/industries/marine.webp",
    challenges: [
      {
        title: "Saltwater Corrosion",
        description:
          "Marine environments accelerate corrosion. 316 stainless steel is essential for long service life.",
      },
      {
        title: "Space Constraints",
        description:
          "Vessel engine rooms have limited space. Compact wafer-style valves maximise available room.",
      },
      {
        title: "Vibration",
        description:
          "Ship engines and wave action create constant vibration. Flexible couplings prevent fatigue failures.",
      },
      {
        title: "Classification Society Requirements",
        description:
          "Maritime standards require certified products. We provide documentation for classification surveys.",
      },
    ],
    solutions: [
      {
        category: "Seawater Systems",
        description: "316SS valves and strainers for cooling water and ballast systems.",
        products: ["industrial-valves", "strainers"],
      },
      {
        category: "Bilge Systems",
        description: "Check valves prevent flooding and duckbills for overboard discharge.",
        products: ["industrial-valves"],
      },
      {
        category: "Engine Room",
        description: "Expansion joints for engine cooling connections with vibration isolation.",
        products: ["expansion-joints"],
      },
      {
        category: "Deck Equipment",
        description: "Couplings for fire main connections and washdown systems.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "Ship ballast systems",
      "Offshore platforms",
      "Port facilities",
      "Dredging operations",
      "Marine cooling systems",
      "Bilge and drainage",
      "Fire fighting systems",
      "Aquaculture facilities",
    ],
    recommendedProducts: ["BFLYW316", "SBS316", "SSYS", "DB-1"],
    faqs: [
      {
        question: "Is 316 stainless steel sufficient for seawater?",
        answer:
          "316SS is suitable for most marine applications with good seawater resistance. For continuous seawater immersion at elevated temperatures, consider 316L or duplex grades.",
      },
      {
        question: "Can you supply products with marine certification?",
        answer:
          "We can provide material certificates and test documentation. For specific classification society approvals (Lloyd's, DNV, etc.), contact us with your requirements.",
      },
      {
        question: "What duckbill material is best for seawater discharge?",
        answer:
          "Neoprene is our standard for marine applications offering good seawater resistance. For fuel or oil contact, specify NBR or Viton materials.",
      },
      {
        question: "Do you supply to shipyards and boat builders?",
        answer:
          "Yes, we supply commercial shipyards, boat builders, and marine maintenance facilities. Trade accounts available for regular purchasers.",
      },
    ],
  },
  hvac: {
    name: "HVAC",
    tagline: "Precision Components for Climate Control Systems",
    description:
      "Heating, ventilation, and air conditioning piping solutions. Products designed for chilled water, hot water, and refrigerant systems in commercial and industrial buildings.",
    metaDescription:
      "HVAC pipe fittings including expansion joints, valves, and strainers for chilled water, heating, and cooling systems. Vibration isolation products for mechanical plant.",
    keywords: [
      "HVAC pipe fittings",
      "chilled water valves",
      "expansion joints HVAC",
      "building services pipe",
      "cooling tower fittings",
      "mechanical services",
    ],
    icon: Wind,
    heroColor: "from-sky-500/10 to-indigo-500/10",
    heroImage: "/images/industries/hvac.webp",
    challenges: [
      {
        title: "Noise & Vibration",
        description:
          "Mechanical plant generates noise transmitted through pipework. Expansion joints isolate vibration.",
      },
      {
        title: "Temperature Cycles",
        description:
          "Heating/cooling cycles cause thermal expansion. Flexible connections accommodate movement.",
      },
      {
        title: "System Cleanliness",
        description:
          "Debris damages chillers and valves. Strainers protect expensive equipment.",
      },
      {
        title: "Tight Programmes",
        description:
          "Construction schedules are demanding. We support fast-track projects with quick supply.",
      },
    ],
    solutions: [
      {
        category: "Pump Isolation",
        description: "Rubber expansion joints absorb vibration at pump connections.",
        products: ["expansion-joints"],
      },
      {
        category: "Flow Control",
        description: "Butterfly valves for isolation at plant connections.",
        products: ["industrial-valves"],
      },
      {
        category: "Equipment Protection",
        description: "Strainers capture debris before chillers and heat exchangers.",
        products: ["strainers"],
      },
      {
        category: "Pipe Connection",
        description: "Couplings for connecting to existing services during upgrades.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "Chilled water systems",
      "Hot water circulation",
      "Cooling tower pipework",
      "Air handling unit connections",
      "Building automation",
      "Data centre cooling",
      "Hospital mechanical services",
      "Shopping centre plant rooms",
    ],
    recommendedProducts: ["FSF-REJ", "BFLYW316", "SBS316", "SSYS"],
    faqs: [
      {
        question: "What expansion joint is best for chiller connections?",
        answer:
          "Single sphere EPDM expansion joints are ideal for chilled water up to 90°C. For higher temperatures, specify Viton or fabric expansion joints.",
      },
      {
        question: "How do I reduce pump noise transmission?",
        answer:
          "Install rubber expansion joints on both suction and discharge sides of pumps. Combined with flexible electrical connections and inertia bases, this isolates most pump vibration.",
      },
      {
        question: "What strainer mesh size for chilled water?",
        answer:
          "Typical chilled water systems use 1.6mm (16 mesh) perforated baskets. Finer mesh may be required for plate heat exchangers - consult the exchanger manufacturer.",
      },
      {
        question: "Can you supply to mechanical contractors?",
        answer:
          "Yes, we supply mechanical contractors, building services consultants, and facility managers. Trade accounts and project pricing available.",
      },
    ],
  },
  "food-beverage": {
    name: "Food & Beverage",
    tagline: "Hygienic Solutions for Process Industries",
    description:
      "Hygienic piping solutions meeting food-grade standards. Products suitable for CIP systems, beverage processing, and food manufacturing facilities requiring clean, contamination-free fluid handling.",
    metaDescription:
      "Food-grade pipe fittings, valves, and strainers for breweries, wineries, and food processing. FDA compliant materials, CIP compatible, stainless steel construction.",
    keywords: [
      "food grade valves",
      "brewery fittings",
      "winery pipe fittings",
      "CIP system components",
      "food processing valves",
      "beverage industry pipe",
    ],
    icon: Apple,
    heroColor: "from-emerald-500/10 to-green-500/10",
    heroImage: "/images/industries/food-beverage.webp",
    challenges: [
      {
        title: "Hygiene Requirements",
        description:
          "Food contact requires certified materials. Our products use FDA-compliant PTFE and food-grade EPDM.",
      },
      {
        title: "CIP Compatibility",
        description:
          "Products must withstand chemical cleaning cycles. 316SS and appropriate seals handle CIP processes.",
      },
      {
        title: "Contamination Prevention",
        description:
          "Dead legs and crevices harbour bacteria. Our products feature hygienic designs.",
      },
      {
        title: "Traceability",
        description:
          "Food safety requires documentation. We provide material certificates and compliance statements.",
      },
    ],
    solutions: [
      {
        category: "Process Control",
        description: "PTFE-seated butterfly valves for clean, leak-free operation.",
        products: ["industrial-valves"],
      },
      {
        category: "Filtration",
        description: "Stainless steel strainers protect pumps and remove particulates.",
        products: ["strainers"],
      },
      {
        category: "Pump Connections",
        description: "Food-grade expansion joints for pump vibration isolation.",
        products: ["expansion-joints"],
      },
      {
        category: "Utility Connections",
        description: "Couplings for water supply and waste connections.",
        products: ["pipe-couplings"],
      },
    ],
    applications: [
      "CIP (Clean-in-Place) systems",
      "Beverage production lines",
      "Food processing plants",
      "Dairy facilities",
      "Brewery operations",
      "Winery tank farms",
      "Pharmaceutical water systems",
      "Bottling plant utilities",
    ],
    recommendedProducts: ["BFLYW316", "SBS316", "SSYS", "FSF-REJ"],
    faqs: [
      {
        question: "Are your products FDA compliant for food contact?",
        answer:
          "Our 316SS bodied products with PTFE seats are suitable for food contact applications. EPDM seals comply with FDA 21 CFR 177.2600 requirements.",
      },
      {
        question: "What materials are suitable for brewery applications?",
        answer:
          "316 stainless steel is standard for breweries. Use EPDM seals for hot water and wort, PTFE seats for chemical dosing lines.",
      },
      {
        question: "Can your valves handle CIP temperatures?",
        answer:
          "Yes, our PTFE-seated butterfly valves handle CIP temperatures up to 120°C. Specify high-temperature seals for sustained hot service.",
      },
      {
        question: "Do you provide certificates of compliance?",
        answer:
          "Yes, we provide material certificates, FDA compliance statements, and food contact suitability documentation as required.",
      },
    ],
  },
}

export const revalidate = 60
export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return Object.keys(industryData).map((industry) => ({
    industry,
  }))
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { industry: industrySlug } = await params
  const industry = industryData[industrySlug]
  if (!industry) return { title: "Industry Not Found" }

  return {
    title: `${industry.name} Pipe Fittings & Valves | Dewater Products`,
    description: industry.metaDescription,
    keywords: industry.keywords,
    openGraph: {
      title: `${industry.name} Solutions | Dewater Products`,
      description: industry.metaDescription,
      type: "website",
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/industries/${industrySlug}`,
    },
  }
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { industry: industrySlug } = await params
  const industry = industryData[industrySlug]

  if (!industry) {
    notFound()
  }

  // Get all products from database and filter for recommended ones
  const allProducts = await getAllProducts()
  const recommendedProducts = allProducts.filter(
    (p) =>
      industry.recommendedProducts.includes(p.id) ||
      industry.solutions.some((s) => s.products.includes(p.category))
  ).slice(0, 8)

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Industries", url: "https://dewaterproducts.com.au/industries" },
    { name: industry.name, url: `https://dewaterproducts.com.au/industries/${industrySlug}` },
  ]

  const IconComponent = industry.icon

  return (
    <div className={`min-h-screen bg-gradient-to-br ${industry.heroColor}`}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative border-b overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${industry.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                <IconComponent className="w-4 h-4" />
                Industry Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">{industry.name}</h1>
              <p className="text-xl text-white/90 mb-2">{industry.tagline}</p>
              <p className="text-white/70 max-w-2xl">{industry.description}</p>
            </div>
            <div className="flex-shrink-0 hidden lg:block">
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Challenges Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold">Industry Challenges We Solve</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <h3 className="font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Our Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industry.solutions.map((solution) => (
              <div
                key={solution.category}
                className="p-6 rounded-lg bg-primary/5 border border-primary/20"
              >
                <h3 className="font-semibold mb-2 text-primary">{solution.category}</h3>
                <p className="text-sm text-muted-foreground mb-3">{solution.description}</p>
                <div className="flex flex-wrap gap-2">
                  {solution.products.map((prod) => (
                    <Link
                      key={prod}
                      href={`/${prod}`}
                      className="text-xs px-2 py-1 rounded bg-background border border-border hover:border-primary/50 transition-colors"
                    >
                      {prod.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="mb-16 p-8 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-bold mb-6">Common Applications in {industry.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {industry.applications.map((app) => (
              <div key={app} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coupling Selection Guide */}
        {industry.couplingGuide && industry.couplingGuide.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Pipe Coupling Selection Guide</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Choose the right coupling for your {industry.name.toLowerCase()} application. We stock both Orbit (Australian) and Straub (Swiss-engineered) couplings.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 border border-border font-semibold">Application</th>
                    <th className="text-left p-4 border border-border font-semibold">
                      <span className="text-primary">Orbit</span> Model
                    </th>
                    <th className="text-left p-4 border border-border font-semibold">
                      <span className="text-primary">Straub</span> Model
                    </th>
                    <th className="text-left p-4 border border-border font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {industry.couplingGuide.map((row, idx) => (
                    <tr key={row.application} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="p-4 border border-border font-medium">{row.application}</td>
                      <td className="p-4 border border-border">{row.orbitModel}</td>
                      <td className="p-4 border border-border">{row.straubModel}</td>
                      <td className="p-4 border border-border text-sm text-muted-foreground">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                href="/pipe-couplings"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Browse all Pipe Couplings <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/orbit-couplings"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Orbit Range <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/straub-couplings"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Straub Range <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended Products for {industry.name}</h2>
            <span className="text-muted-foreground">{recommendedProducts.length} products</span>
          </div>

          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Contact us for product recommendations specific to your {industry.name.toLowerCase()} application.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{industry.name} FAQs</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {industry.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why Choose Dewater Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg">
              <Clock className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Stock items dispatched same day. Delivery Australia-wide including remote sites.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Technical Support</h3>
                <p className="text-sm text-muted-foreground">
                  Expert advice on product selection and specifications for your application.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Competitive Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Trade accounts and project pricing available. Request a quote for bulk pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Need Help with Your {industry.name} Project?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right products for your {industry.name.toLowerCase()} application.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: industry.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
