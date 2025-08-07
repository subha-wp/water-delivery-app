"use server";

import { sql } from "./db";
import type { Order, User } from "./db";

export async function createOrder(
  customerId: number,
  deliveryType: "takeaway" | "home_delivery",
  quantity: number,
  villageId: number,
  placedByAssistantId?: number
): Promise<{ success: boolean; orderId?: number; error?: string }> {
  try {
    const pricePerJar = deliveryType === "takeaway" ? 10 : 20;
    const totalAmount = pricePerJar * quantity;

    const result = await sql`
      INSERT INTO orders (customer_id, delivery_type, quantity, price_per_jar, total_amount, village_id, placed_by_assistant_id)
      VALUES (${customerId}, ${deliveryType}, ${quantity}, ${pricePerJar}, ${totalAmount}, ${villageId}, ${
      placedByAssistantId || null
    })
      RETURNING id
    `;

    const orderId = result[0].id;

    // Log the order creation
    await sql`
      INSERT INTO order_logs (order_id, action, performed_by, details)
      VALUES (${orderId}, 'order_placed', ${
      placedByAssistantId || customerId
    }, ${
      placedByAssistantId
        ? "Order placed by delivery assistant"
        : "Order placed by customer"
    })
    `;

    return { success: true, orderId };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Failed to create order. Please try again.",
    };
  }
}

export async function cancelOrder(
  orderId: number,
  cancelledBy: number,
  reason: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, get the current order status
    const orderResult = await sql`
      SELECT status, customer_id, delivery_type, total_amount 
      FROM orders 
      WHERE id = ${orderId}
    `;

    if (orderResult.length === 0) {
      return { success: false, error: "Order not found" };
    }

    const order = orderResult[0];
    const originalStatus = order.status;

    // Check if order can be cancelled
    if (
      order.status === "delivered" ||
      order.status === "completed" ||
      order.status === "cancelled"
    ) {
      return {
        success: false,
        error: `Cannot cancel order with status: ${order.status}`,
      };
    }

    // Update order status to cancelled
    await sql`
      UPDATE orders 
      SET 
        status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        cancelled_by = ${cancelledBy},
        cancellation_reason = ${reason},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;

    // Log the cancellation in order_cancellations table
    await sql`
      INSERT INTO order_cancellations (
        order_id, 
        cancelled_by, 
        cancellation_reason, 
        original_status,
        refund_required,
        notes
      )
      VALUES (
        ${orderId}, 
        ${cancelledBy}, 
        ${reason}, 
        ${originalStatus},
        ${originalStatus !== "pending"},
        ${notes || ""}
      )
    `;

    // Log the cancellation in order_logs
    await sql`
      INSERT INTO order_logs (order_id, action, performed_by, details)
      VALUES (${orderId}, 'order_cancelled', ${cancelledBy}, ${`Order cancelled: ${reason}`})
    `;

    return { success: true };
  } catch (error) {
    console.error("Cancel order error:", error);
    return {
      success: false,
      error: "Failed to cancel order. Please try again.",
    };
  }
}

export async function getCustomerOrders(customerId: number): Promise<Order[]> {
  try {
    const orders = await sql`
      SELECT 
        o.*,
        da.name as delivery_assistant_name,
        v.name as village_name,
        d.delivered_at,
        d.empty_jar_returned,
        d.instant_jar_received,
        d.delivery_notes,
        cb.name as cancelled_by_name
      FROM orders o
      LEFT JOIN users da ON o.delivery_assistant_id = da.id
      LEFT JOIN users cb ON o.cancelled_by = cb.id
      LEFT JOIN villages v ON o.village_id = v.id
      LEFT JOIN deliveries d ON o.id = d.order_id
      WHERE o.customer_id = ${customerId}
      ORDER BY o.created_at DESC
    `;

    return orders as Order[];
  } catch (error) {
    console.error("Get customer orders error:", error);
    return [];
  }
}

export async function getAssistantOrders(
  assistantId: number
): Promise<Order[]> {
  try {
    const orders = await sql`
      SELECT 
        o.*,
        c.name as customer_name,
        c.address as customer_address,
        c.phone as customer_phone,
        v.name as village_name,
        d.delivered_at,
        d.empty_jar_returned,
        d.instant_jar_received,
        d.delivery_notes,
        cb.name as cancelled_by_name
      FROM orders o
      JOIN users c ON o.customer_id = c.id
      LEFT JOIN users cb ON o.cancelled_by = cb.id
      LEFT JOIN villages v ON o.village_id = v.id
      LEFT JOIN deliveries d ON o.id = d.order_id
      WHERE o.delivery_assistant_id = ${assistantId} OR (o.status = 'pending' AND o.delivery_assistant_id IS NULL)
      ORDER BY 
        CASE WHEN o.delivery_assistant_id = ${assistantId} THEN 0 ELSE 1 END,
        o.created_at DESC
    `;

    return orders as (Order & {
      customer_address?: string;
      customer_phone?: string;
      village_name?: string;
    })[];
  } catch (error) {
    console.error("Get assistant orders error:", error);
    return [];
  }
}

export async function getOrderById(
  orderId: number
): Promise<
  | (Order & {
      customer_name?: string;
      customer_address?: string;
      customer_phone?: string;
      village_name?: string;
    })
  | null
> {
  try {
    const orders = await sql`
      SELECT 
        o.*,
        c.name as customer_name,
        c.address as customer_address,
        c.phone as customer_phone,
        v.name as village_name,
        d.delivered_at,
        d.empty_jar_returned,
        d.instant_jar_received,
        d.delivery_notes,
        cb.name as cancelled_by_name
      FROM orders o
      JOIN users c ON o.customer_id = c.id
      LEFT JOIN users cb ON o.cancelled_by = cb.id
      LEFT JOIN villages v ON o.village_id = v.id
      LEFT JOIN deliveries d ON o.id = d.order_id
      WHERE o.id = ${orderId}
    `;

    if (orders.length === 0) {
      return null;
    }

    return orders[0] as Order & {
      customer_name?: string;
      customer_address?: string;
      customer_phone?: string;
      village_name?: string;
    };
  } catch (error) {
    console.error("Get order by id error:", error);
    return null;
  }
}

export async function assignOrderToAssistant(
  orderId: number,
  assistantId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE orders 
      SET delivery_assistant_id = ${assistantId}, status = 'assigned', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;

    await sql`
      INSERT INTO order_logs (order_id, action, performed_by, details)
      VALUES (${orderId}, 'order_assigned', ${assistantId}, 'Order assigned to delivery assistant')
    `;

    return { success: true };
  } catch (error) {
    console.error("Assign order error:", error);
    return { success: false, error: "Failed to assign order." };
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: Order["status"],
  assistantId: number,
  emptyJarReturned?: boolean,
  deliveryNotes?: string,
  instantJarReceived?: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;

    if (status === "delivered") {
      await sql`
        INSERT INTO deliveries (
          order_id, 
          delivery_assistant_id, 
          delivered_at, 
          empty_jar_returned, 
          delivery_notes,
          instant_jar_received
        )
        VALUES (
          ${orderId}, 
          ${assistantId}, 
          CURRENT_TIMESTAMP, 
          ${emptyJarReturned || false}, 
          ${deliveryNotes || ""},
          ${instantJarReceived || false}
        )
      `;
    }

    await sql`
      INSERT INTO order_logs (order_id, action, performed_by, details)
      VALUES (${orderId}, ${`order_${status}`}, ${assistantId}, ${
      deliveryNotes || `Order status updated to ${status}`
    })
    `;

    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function getAllCustomers(): Promise<User[]> {
  try {
    const customers = await sql`
      SELECT u.*, v.name as village_name 
      FROM users u
      LEFT JOIN villages v ON u.village_id = v.id
      WHERE u.role = 'customer' 
      ORDER BY u.name
    `;

    return customers as User[];
  } catch (error) {
    console.error("Get customers error:", error);
    return [];
  }
}
