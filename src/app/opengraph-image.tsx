import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "deWater Products - Industrial Pipe Fittings & Valves"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "#3b82f6",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 24,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            deWater Products
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            marginBottom: 48,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Industrial Pipe Fittings, Valves & Couplings
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 48,
          }}
        >
          {["Pipe Couplings", "Valves", "Expansion Joints", "Strainers"].map(
            (item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#e2e8f0",
                  fontSize: 24,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    background: "#3b82f6",
                    borderRadius: "50%",
                  }}
                />
                {item}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "#64748b",
            fontSize: 20,
          }}
        >
          dewaterproducts.com.au • Australian Supplier
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
