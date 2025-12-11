/**
 * Server-side Turnstile token verification
 *
 * Usage in API routes:
 * ```ts
 * import { verifyTurnstileToken } from "@/lib/turnstile"
 *
 * const verification = await verifyTurnstileToken(token)
 * if (!verification.success) {
 *   return NextResponse.json({ error: "Verification failed" }, { status: 400 })
 * }
 * ```
 */

interface TurnstileVerifyResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  "error-codes"?: string[]
  action?: string
  cdata?: string
}

interface VerificationResult {
  success: boolean
  error?: string
  timestamp?: string
  hostname?: string
}

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

/**
 * Verify a Turnstile token server-side
 *
 * @param token - The token from the Turnstile widget
 * @param ip - Optional IP address of the user (improves security)
 * @returns Verification result
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<VerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // Allow bypass in development if no secret key
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping verification")
    return { success: true }
  }

  // Reject empty tokens
  if (!token) {
    return { success: false, error: "No verification token provided" }
  }

  try {
    const formData = new URLSearchParams()
    formData.append("secret", secretKey)
    formData.append("response", token)
    if (ip) {
      formData.append("remoteip", ip)
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      console.error("Turnstile API error:", response.status, response.statusText)
      return { success: false, error: "Verification service unavailable" }
    }

    const data: TurnstileVerifyResponse = await response.json()

    if (!data.success) {
      const errorCodes = data["error-codes"] || []
      console.warn("Turnstile verification failed:", errorCodes)

      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        "missing-input-secret": "Server configuration error",
        "invalid-input-secret": "Server configuration error",
        "missing-input-response": "Verification required",
        "invalid-input-response": "Invalid verification",
        "bad-request": "Invalid request",
        "timeout-or-duplicate": "Verification expired, please try again",
        "internal-error": "Verification service error",
      }

      const errorMessage = errorCodes
        .map((code) => errorMessages[code] || code)
        .join(", ")

      return { success: false, error: errorMessage || "Verification failed" }
    }

    return {
      success: true,
      timestamp: data.challenge_ts,
      hostname: data.hostname,
    }
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return { success: false, error: "Verification service unavailable" }
  }
}
