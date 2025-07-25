import { logoutUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await logoutUser()
    // Create a response that redirects to home
    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"))

    // Ensure the cookie is cleared in the response
    response.cookies.delete("user_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"))
    response.cookies.delete("user_session")
    return response
  }
}

export async function POST() {
  try {
    await logoutUser()
    // For POST requests, return JSON response
    const response = NextResponse.json({ success: true })

    // Clear the cookie in the response
    response.cookies.delete("user_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    const response = NextResponse.json({ success: true }) // Still return success to ensure redirect
    response.cookies.delete("user_session")
    return response
  }
}
