"use server";

import { sql } from "./db";

export interface FreeJarSlot {
  id: number;
  slot_date: string;
  total_slots: number;
  booked_slots: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FreeJarBooking {
  id: number;
  customer_id: number;
  slot_date: string;
  village_id: number;
  booking_time: string;
  status: "booked" | "delivered" | "cancelled" | "expired";
  delivery_assistant_id?: number;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  village_name?: string;
  delivery_assistant_name?: string;
}

export type FreeJarBookingType = FreeJarBooking;

// Check if current time is exactly 8:00 AM IST
export async function isValidBookingTime(): Promise<boolean> {
  try {
    const result = await sql`SELECT is_valid_booking_time() as is_valid`;
    return result[0]?.is_valid || false;
  } catch (error) {
    console.error("Check booking time error:", error);
    return false;
  }
}

// Get current IST time info
export async function getCurrentISTTime(): Promise<{
  current_time: string;
  current_date: string;
  is_booking_time: boolean;
  seconds_until_8am: number;
}> {
  try {
    const result = await sql`
      SELECT 
        (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::TIME as current_time,
        (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE as current_date,
        is_valid_booking_time() as is_booking_time,
        CASE 
          WHEN (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::TIME < '08:00:00' THEN
            EXTRACT(EPOCH FROM ('08:00:00'::TIME - (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::TIME))
          ELSE
            EXTRACT(EPOCH FROM ('08:00:00'::TIME + INTERVAL '1 day' - (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::TIME))
        END as seconds_until_8am
    `;

    return {
      current_time: result[0]?.current_time || "",
      current_date: result[0]?.current_date || "",
      is_booking_time: result[0]?.is_booking_time || false,
      seconds_until_8am: Number(result[0]?.seconds_until_8am || 0),
    };
  } catch (error) {
    console.error("Get IST time error:", error);
    return {
      current_time: "",
      current_date: "",
      is_booking_time: false,
      seconds_until_8am: 0,
    };
  }
}

// Get today's free jar slot (internal function - not exposed to frontend)
async function getTodaysFreeJarSlot(): Promise<FreeJarSlot | null> {
  try {
    const result = await sql`
      SELECT * FROM free_jar_slots 
      WHERE slot_date = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE
      AND is_active = true
    `;

    if (result.length === 0) {
      // Create today's slot if it doesn't exist
      await sql`SELECT create_daily_free_jar_slot()`;

      const newResult = await sql`
        SELECT * FROM free_jar_slots 
        WHERE slot_date = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE
        AND is_active = true
      `;

      return (newResult[0] as FreeJarSlot) || null;
    }

    return result[0] as FreeJarSlot;
  } catch (error) {
    console.error("Get today's slot error:", error);
    return null;
  }
}

// Check if customer has already booked today
export async function hasCustomerBookedToday(
  customerId: number
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM free_jar_bookings 
      WHERE customer_id = ${customerId} 
      AND slot_date = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE
      AND status IN ('booked', 'delivered')
    `;

    return Number(result[0]?.count || 0) > 0;
  } catch (error) {
    console.error("Check customer booking error:", error);
    return false;
  }
}

// Simulate network delay for failed bookings
async function simulateNetworkDelay(): Promise<void> {
  const delay = Math.random() * 3000 + 2000; // 2-5 seconds
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Book free jar with strategic UX
export async function bookFreeJar(
  customerId: number,
  villageId: number
): Promise<{
  success: boolean;
  error?: string;
  booking?: FreeJarBooking;
  shouldShowNetworkError?: boolean;
}> {
  try {
    // Log the attempt
    await sql`
      INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
      VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'attempt_started')
    `;

    // Check if it's exactly 8:00 AM IST
    const isValidTime = await isValidBookingTime();
    if (!isValidTime) {
      await sql`
        INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
        VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'invalid_time')
      `;
      return {
        success: false,
        error: "Free jar booking is only available at exactly 8:00 AM IST",
        shouldShowNetworkError: false,
      };
    }

    // Check if customer already booked today
    const alreadyBooked = await hasCustomerBookedToday(customerId);
    if (alreadyBooked) {
      await sql`
        INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
        VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'already_booked')
      `;
      return {
        success: false,
        error: "You have already booked your free jar for today",
        shouldShowNetworkError: false,
      };
    }

    // Get current slot (internal check)
    const slot = await getTodaysFreeJarSlot();
    if (!slot) {
      await simulateNetworkDelay();
      return {
        success: false,
        error: "Network error. Please try again.",
        shouldShowNetworkError: true,
      };
    }

    // Check if slots are available (but don't show this to customer)
    if (slot.booked_slots >= slot.total_slots) {
      // Simulate network error to make customer think it's a connectivity issue
      await simulateNetworkDelay();
      await sql`
        INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
        VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'slots_full_network_simulation')
      `;
      return {
        success: false,
        error: "Network timeout. Please check your connection and try again.",
        shouldShowNetworkError: true,
      };
    }

    // Attempt to book (with race condition handling)
    const bookingResult = await sql`
      WITH slot_check AS (
        SELECT id, booked_slots, total_slots 
        FROM free_jar_slots 
        WHERE slot_date = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE
        AND is_active = true
        FOR UPDATE
      ),
      booking_insert AS (
        INSERT INTO free_jar_bookings (customer_id, slot_date, village_id)
        SELECT ${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, ${villageId}
        WHERE EXISTS (
          SELECT 1 FROM slot_check WHERE booked_slots < total_slots
        )
        RETURNING *
      ),
      slot_update AS (
        UPDATE free_jar_slots 
        SET booked_slots = booked_slots + 1, updated_at = CURRENT_TIMESTAMP
        WHERE slot_date = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE
        AND EXISTS (SELECT 1 FROM booking_insert)
        RETURNING *
      )
      SELECT b.*, v.name as village_name
      FROM booking_insert b
      LEFT JOIN villages v ON b.village_id = v.id
    `;

    if (bookingResult.length === 0) {
      // Slots were full, simulate network error
      await simulateNetworkDelay();
      await sql`
        INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
        VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'race_condition_network_simulation')
      `;
      return {
        success: false,
        error: "Connection lost. Please try again later.",
        shouldShowNetworkError: true,
      };
    }

    // Success - log it
    await sql`
      INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
      VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, true, 'success')
    `;

    return {
      success: true,
      booking: bookingResult[0] as FreeJarBooking,
    };
  } catch (error) {
    console.error("Book free jar error:", error);

    // Log failed attempt
    await sql`
      INSERT INTO free_jar_booking_attempts (customer_id, slot_date, success, failure_reason)
      VALUES (${customerId}, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::DATE, false, 'system_error')
    `;

    // Always show as network error to maintain the illusion
    await simulateNetworkDelay();
    return {
      success: false,
      error: "Network error occurred. Please try again.",
      shouldShowNetworkError: true,
    };
  }
}

// Get customer's free jar bookings
export async function getCustomerFreeJarBookings(
  customerId: number
): Promise<FreeJarBooking[]> {
  try {
    const result = await sql`
      SELECT 
        fjb.*,
        v.name as village_name,
        da.name as delivery_assistant_name
      FROM free_jar_bookings fjb
      LEFT JOIN villages v ON fjb.village_id = v.id
      LEFT JOIN users da ON fjb.delivery_assistant_id = da.id
      WHERE fjb.customer_id = ${customerId}
      ORDER BY fjb.slot_date DESC, fjb.created_at DESC
    `;

    return result as FreeJarBooking[];
  } catch (error) {
    console.error("Get customer free jar bookings error:", error);
    return [];
  }
}

// Get assistant's free jar deliveries
export async function getAssistantFreeJarDeliveries(
  assistantId: number
): Promise<FreeJarBooking[]> {
  try {
    const result = await sql`
      SELECT 
        fjb.*,
        c.name as customer_name,
        c.phone as customer_phone,
        c.address as customer_address,
        v.name as village_name
      FROM free_jar_bookings fjb
      JOIN users c ON fjb.customer_id = c.id
      LEFT JOIN villages v ON fjb.village_id = v.id
      WHERE fjb.delivery_assistant_id = ${assistantId} 
      OR (fjb.status = 'booked' AND fjb.delivery_assistant_id IS NULL)
      ORDER BY fjb.slot_date DESC, fjb.created_at DESC
    `;

    return result as (FreeJarBooking & {
      customer_name?: string;
      customer_phone?: string;
      customer_address?: string;
    })[];
  } catch (error) {
    console.error("Get assistant free jar deliveries error:", error);
    return [];
  }
}

// Assign free jar delivery to assistant
export async function assignFreeJarDelivery(
  bookingId: number,
  assistantId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE free_jar_bookings 
      SET delivery_assistant_id = ${assistantId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId} AND status = 'booked'
    `;

    return { success: true };
  } catch (error) {
    console.error("Assign free jar delivery error:", error);
    return { success: false, error: "Failed to assign delivery" };
  }
}

// Mark free jar as delivered
export async function markFreeJarDelivered(
  bookingId: number,
  assistantId: number,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE free_jar_bookings 
      SET 
        status = 'delivered',
        delivered_at = CURRENT_TIMESTAMP,
        notes = ${notes || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${bookingId} AND delivery_assistant_id = ${assistantId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Mark free jar delivered error:", error);
    return { success: false, error: "Failed to mark as delivered" };
  }
}
