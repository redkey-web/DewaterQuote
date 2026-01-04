import Link from "next/link"

// Map application text to industry page URLs
const applicationToIndustry: Record<string, string> = {
  // Mining
  "mining": "/industries/mining",
  "mining industry": "/industries/mining",
  "mining applications": "/industries/mining",
  "mining slurry": "/industries/mining",
  "mining slurry applications": "/industries/mining",
  "slurry pipelines": "/industries/mining",
  "dewatering": "/industries/mining",
  "mine dewatering": "/industries/mining",

  // Construction
  "construction": "/industries/construction",
  "construction sites": "/industries/construction",
  "building services": "/industries/construction",
  "concrete pumping": "/industries/construction",

  // Marine
  "marine": "/industries/marine",
  "marine applications": "/industries/marine",
  "marine and coastal": "/industries/marine",
  "shipbuilding": "/industries/marine",
  "offshore": "/industries/marine",
  "coastal applications": "/industries/marine",

  // Food & Beverage
  "food & beverage": "/industries/food-beverage",
  "food and beverage": "/industries/food-beverage",
  "food & beverage processing": "/industries/food-beverage",
  "food processing": "/industries/food-beverage",
  "beverage processing": "/industries/food-beverage",
  "dairy": "/industries/food-beverage",
  "breweries": "/industries/food-beverage",
  "wineries": "/industries/food-beverage",
  "pharmaceuticals": "/industries/food-beverage",

  // Water & Wastewater
  "water & wastewater": "/industries/water-wastewater",
  "water and wastewater": "/industries/water-wastewater",
  "water treatment": "/industries/water-wastewater",
  "wastewater treatment": "/industries/water-wastewater",
  "wastewater": "/industries/water-wastewater",
  "sewage": "/industries/water-wastewater",
  "sewage treatment": "/industries/water-wastewater",
  "water supply": "/industries/water-wastewater",
  "water supply systems": "/industries/water-wastewater",
  "potable water": "/industries/water-wastewater",
  "stormwater": "/industries/water-wastewater",
  "stormwater systems": "/industries/water-wastewater",
  "stormwater outfalls": "/industries/water-wastewater",
  "wastewater discharge": "/industries/water-wastewater",
  "pump station outlets": "/industries/water-wastewater",
  "dam and levee outlets": "/industries/water-wastewater",
  "drainage systems": "/industries/water-wastewater",
  "industrial effluent": "/industries/water-wastewater",
  "process water": "/industries/water-wastewater",
  "process water filtration": "/industries/water-wastewater",
  "process water line strainer": "/industries/water-wastewater",

  // Irrigation
  "irrigation": "/industries/irrigation",
  "irrigation systems": "/industries/irrigation",
  "agricultural": "/industries/irrigation",
  "agriculture": "/industries/irrigation",
  "farming": "/industries/irrigation",

  // Fire Services
  "fire services": "/industries/fire-services",
  "fire protection": "/industries/fire-services",
  "fire protection systems": "/industries/fire-services",
  "fire suppression": "/industries/fire-services",
  "sprinkler systems": "/industries/fire-services",

  // HVAC
  "hvac": "/industries/hvac",
  "hvac systems": "/industries/hvac",
  "hvac inline strainer systems": "/industries/hvac",
  "heating": "/industries/hvac",
  "cooling": "/industries/hvac",
  "cooling systems": "/industries/hvac",
  "air conditioning": "/industries/hvac",
  "chilled water": "/industries/hvac",

  // General industrial (map to most relevant)
  "chemical plants": "/industries/water-wastewater",
  "chemical processing": "/industries/water-wastewater",
  "chemical manufacturing": "/industries/water-wastewater",
  "industrial processing": "/industries/water-wastewater",
  "industrial applications": "/industries/water-wastewater",
  "oil and gas": "/industries/mining",
  "oil & gas": "/industries/mining",
  "petrochemical": "/industries/mining",
  "power generation": "/industries/water-wastewater",
  "power plants": "/industries/water-wastewater",

  // Pump-related
  "pump protection": "/industries/water-wastewater",
  "pre-pump protection": "/industries/water-wastewater",
  "pump suction lines": "/industries/water-wastewater",
  "hydraulic pump suction strainer": "/industries/water-wastewater",

  // High-flow
  "high-flow applications": "/industries/water-wastewater",

  // Tide/backflow
  "tide gates replacement": "/industries/water-wastewater",
  "backflow prevention": "/industries/water-wastewater",
}

function getIndustryUrl(application: string): string | null {
  const normalized = application.toLowerCase().trim()
  return applicationToIndustry[normalized] || null
}

interface ApplicationLinksProps {
  applications: string[]
  className?: string
  variant?: "chips" | "list"
}

export default function ApplicationLinks({ applications, className = "", variant = "chips" }: ApplicationLinksProps) {
  if (variant === "list") {
    return (
      <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
        {applications.map((app, i) => {
          const industryUrl = getIndustryUrl(app)

          return (
            <li key={i} className="flex items-center gap-2">
              <span className="text-primary">•</span>
              {industryUrl ? (
                <Link
                  href={industryUrl}
                  className="text-muted-foreground hover:text-primary hover:underline transition-colors"
                >
                  {app}
                </Link>
              ) : (
                <span className="text-muted-foreground">{app}</span>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {applications.map((app, i) => {
        const industryUrl = getIndustryUrl(app)

        if (industryUrl) {
          return (
            <Link
              key={i}
              href={industryUrl}
              className="text-sm bg-muted px-3 py-1.5 rounded-md border hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {app}
            </Link>
          )
        }

        return (
          <span
            key={i}
            className="text-sm bg-muted px-3 py-1.5 rounded-md border"
          >
            {app}
          </span>
        )
      })}
    </div>
  )
}
