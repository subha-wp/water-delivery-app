"use server"

import { sql } from "./db"

export interface Village {
  id: number
  name: string
  is_active: boolean
  created_at: string
}

export async function getActiveVillages(): Promise<Village[]> {
  try {
    const villages = await sql`
      SELECT * FROM villages 
      WHERE is_active = true 
      ORDER BY name
    `

    return villages as Village[]
  } catch (error) {
    console.error("Get active villages error:", error)
    return []
  }
}

export async function getVillageById(villageId: number): Promise<Village | null> {
  try {
    const villages = await sql`
      SELECT * FROM villages WHERE id = ${villageId}
    `

    if (villages.length === 0) {
      return null
    }

    return villages[0] as Village
  } catch (error) {
    console.error("Get village by id error:", error)
    return null
  }
}
