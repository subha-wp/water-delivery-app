"use server"

import { cookies } from "next/headers"
import { sql } from "./db"
import type { User } from "./db"
import bcrypt from "bcryptjs"

export async function registerCustomer(
  phone: string,
  name: string,
  password: string,
  address?: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `

    if (existingUsers.length > 0) {
      return { success: false, error: "Phone number already registered" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create new customer without village_id
    const result = await sql`
      INSERT INTO users (phone, name, role, address, password_hash)
      VALUES (${phone}, ${name}, 'customer', ${address || null}, ${passwordHash})
      RETURNING *
    `

    const user = result[0] as User

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, user }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function loginUser(
  phone: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // First, try to get user without village join to avoid table dependency issues
    const users = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `

    if (users.length === 0) {
      return { success: false, error: "Invalid phone number or password" }
    }

    const user = users[0] as User & { password_hash: string }

    // Check if password_hash exists
    if (!user.password_hash) {
      return { success: false, error: "Account not properly set up. Please contact support." }
    }

    // For demo accounts, allow simple password check
    const isDemoAccount = ["9876543210", "9123456789"].includes(phone)
    let isValidPassword = false

    if (isDemoAccount && password === "demo123") {
      // Allow demo login with simple password
      isValidPassword = true
    } else {
      // Verify password using bcrypt
      try {
        isValidPassword = await bcrypt.compare(password, user.password_hash)
      } catch (bcryptError) {
        console.error("Bcrypt error:", bcryptError)
        // Fallback for demo accounts
        if (isDemoAccount && password === "demo123") {
          isValidPassword = true
        }
      }
    }

    if (!isValidPassword) {
      return { success: false, error: "Invalid phone number or password" }
    }

    // Try to get village name if village_id exists and villages table exists
    let village_name = null
    if (user.village_id) {
      try {
        const villageResult = await sql`
          SELECT name FROM villages WHERE id = ${user.village_id}
        `
        if (villageResult.length > 0) {
          village_name = villageResult[0].name
        }
      } catch (villageError) {
        // Villages table might not exist yet, continue without village name
        console.log("Villages table not found, continuing without village name")
      }
    }

    // Remove password hash from user object and add village name if found
    const { password_hash, ...userWithoutPassword } = user
    const userWithVillage = { ...userWithoutPassword, village_name }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("user_session", JSON.stringify(userWithVillage), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, user: userWithVillage }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("user_session")

    if (!sessionCookie) {
      return null
    }

    return JSON.parse(sessionCookie.value) as User
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const cookieStore = await cookies()
    // Delete the session cookie
    cookieStore.delete("user_session")

    // Also try to set an expired cookie as a fallback
    cookieStore.set("user_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      expires: new Date(0), // Set to past date
    })
  } catch (error) {
    console.error("Logout user error:", error)
    // Even if there's an error, we should continue with logout
  }
}

export async function updateUserProfile(
  userId: number,
  name: string,
  address?: string,
  villageId?: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE users 
      SET name = ${name}, address = ${address || null}, village_id = ${villageId || null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    // Try to update session cookie with village information
    let village_name = null
    if (villageId) {
      try {
        const villageResult = await sql`
          SELECT name FROM villages WHERE id = ${villageId}
        `
        if (villageResult.length > 0) {
          village_name = villageResult[0].name
        }
      } catch (villageError) {
        // Villages table might not exist yet, continue without village name
        console.log("Villages table not found during profile update")
      }
    }

    // Get updated user data
    const updatedUsers = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `

    if (updatedUsers.length > 0) {
      const { password_hash, ...userWithoutPassword } = updatedUsers[0]
      const userWithVillage = { ...userWithoutPassword, village_name }

      const cookieStore = await cookies()
      cookieStore.set("user_session", JSON.stringify(userWithVillage), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}
