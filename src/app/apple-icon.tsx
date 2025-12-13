import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: "white",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          dW
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
