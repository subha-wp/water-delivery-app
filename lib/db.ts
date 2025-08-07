import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export { sql };

export interface User {
  id: number;
  phone: string;
  name: string;
  role: "customer" | "delivery_assistant";
  address?: string;
  village_id?: number;
  village_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  delivery_type: "takeaway" | "home_delivery";
  quantity: number;
  price_per_jar: number;
  total_amount: number;
  status:
    | "pending"
    | "assigned"
    | "in_transit"
    | "delivered"
    | "completed"
    | "cancelled";
  village_id?: number;
  village_name?: string;
  placed_by_assistant_id?: number;
  delivery_assistant_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  delivery_assistant_name?: string;
  delivered_at?: string;
  empty_jar_returned?: boolean;
  instant_jar_received?: boolean;
  delivery_notes?: string;
  cancelled_at?: string;
  cancelled_by?: number;
  cancelled_by_name?: string;
  cancellation_reason?: string;
}

export interface Delivery {
  id: number;
  order_id: number;
  delivery_assistant_id: number;
  delivered_at?: string;
  empty_jar_returned: boolean;
  instant_jar_received: boolean;
  delivery_notes?: string;
  created_at: string;
}
