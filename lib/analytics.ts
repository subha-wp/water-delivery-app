"use server"

import { sql } from "./db"

export async function getAssistantAnalytics(assistantId: number, timeframe: "today" | "week" | "month") {
  try {
    let timeCondition = ""

    switch (timeframe) {
      case "today":
        timeCondition = "AND d.delivered_at >= CURRENT_DATE"
        break
      case "week":
        timeCondition = "AND d.delivered_at >= CURRENT_DATE - INTERVAL '7 days'"
        break
      case "month":
        timeCondition = "AND d.delivered_at >= CURRENT_DATE - INTERVAL '30 days'"
        break
    }

    // Get total deliveries and earnings (only count home_delivery for earnings)
    const totalResult = await sql`
      SELECT 
        COUNT(*) as total_deliveries,
        SUM(CASE WHEN o.delivery_type = 'home_delivery' THEN 5 ELSE 0 END) as total_earnings
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      WHERE d.delivery_assistant_id = ${assistantId}
      AND d.delivered_at IS NOT NULL
      ${sql.unsafe(timeCondition)}
    `

    // Get daily breakdown (only count home_delivery for earnings)
    const dailyResult = await sql`
      SELECT 
        TO_CHAR(d.delivered_at, 'DD-MM-YYYY') as date,
        COUNT(*) as count,
        SUM(CASE WHEN o.delivery_type = 'home_delivery' THEN 5 ELSE 0 END) as earnings
      FROM deliveries d
      JOIN orders o ON d.order_id = o.id
      WHERE d.delivery_assistant_id = ${assistantId}
      AND d.delivered_at IS NOT NULL
      ${sql.unsafe(timeCondition)}
      GROUP BY TO_CHAR(d.delivered_at, 'DD-MM-YYYY')
      ORDER BY TO_CHAR(d.delivered_at, 'DD-MM-YYYY') DESC
    `

    return {
      totalDeliveries: Number.parseInt(totalResult[0]?.total_deliveries || "0"),
      totalEarnings: Number.parseInt(totalResult[0]?.total_earnings || "0"),
      dailyDeliveries: dailyResult.map((day) => ({
        date: day.date,
        count: Number.parseInt(day.count),
        earnings: Number.parseInt(day.earnings),
      })),
    }
  } catch (error) {
    console.error("Get assistant analytics error:", error)
    return {
      totalDeliveries: 0,
      totalEarnings: 0,
      dailyDeliveries: [],
    }
  }
}
