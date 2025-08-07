"use server";

import { sql } from "./db";
import type { User } from "./db";
import bcrypt from "bcryptjs";

export async function createCustomerByAssistant(
  assistantId: number,
  phone: string,
  name: string,
  villageId: number,
  address?: string
): Promise<{
  success: boolean;
  customer?: User;
  password?: string;
  error?: string;
}> {
  try {
    // Check if customer already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE phone = ${phone}
    `;

    if (existingUsers.length > 0) {
      return {
        success: false,
        error: "Customer with this phone number already exists",
      };
    }

    // Generate password: first 4 digits of name + last 4 digits of phone
    const nameDigits = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 4);
    const phoneDigits = phone.slice(-4);
    const autoPassword = nameDigits + phoneDigits;

    // Hash the password
    const passwordHash = await bcrypt.hash(autoPassword, 10);

    // Create new customer
    const result = await sql`
      INSERT INTO users (phone, name, role, address, village_id, password_hash, created_by_assistant_id)
      VALUES (${phone}, ${name}, 'customer', ${
      address || null
    }, ${villageId}, ${passwordHash}, ${assistantId})
      RETURNING *
    `;

    const customer = result[0] as User;

    // Log the customer creation
    await sql`
      INSERT INTO customer_creation_logs (customer_id, assistant_id, customer_phone, customer_name, auto_generated_password)
      VALUES (${customer.id}, ${assistantId}, ${phone}, ${name}, ${autoPassword})
    `;

    // Get village name for the response
    let village_name = null;
    try {
      const villageResult = await sql`
        SELECT name FROM villages WHERE id = ${villageId}
      `;
      if (villageResult.length > 0) {
        village_name = villageResult[0].name;
      }
    } catch (error) {
      console.log("Error fetching village name:", error);
    }

    const customerWithVillage = { ...customer, village_name };

    return {
      success: true,
      customer: customerWithVillage,
      password: autoPassword,
    };
  } catch (error) {
    console.error("Create customer by assistant error:", error);
    return {
      success: false,
      error: "Failed to create customer. Please try again.",
    };
  }
}

export async function searchCustomersByPhone(phone: string): Promise<User[]> {
  try {
    const customers = await sql`
      SELECT u.*, v.name as village_name 
      FROM users u
      LEFT JOIN villages v ON u.village_id = v.id
      WHERE u.role = 'customer' 
      AND u.phone LIKE ${`%${phone}%`}
      ORDER BY u.name
      LIMIT 10
    `;

    return customers as User[];
  } catch (error) {
    console.error("Search customers error:", error);
    return [];
  }
}

export async function getCustomerCreationHistory(
  assistantId: number
): Promise<any[]> {
  try {
    const history = await sql`
      SELECT 
        ccl.*,
        u.name as customer_name,
        u.phone as customer_phone,
        v.name as village_name
      FROM customer_creation_logs ccl
      JOIN users u ON ccl.customer_id = u.id
      LEFT JOIN villages v ON u.village_id = v.id
      WHERE ccl.assistant_id = ${assistantId}
      ORDER BY ccl.created_at DESC
      LIMIT 50
    `;

    return history;
  } catch (error) {
    console.error("Get customer creation history error:", error);
    return [];
  }
}
