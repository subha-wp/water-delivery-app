"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Truck, Droplets, Calendar } from "lucide-react"
import { getCustomerOrders } from "@/lib/orders"
import type { Order, User } from "@/lib/db"

interface CustomerOrdersProps {
  user: User
}

export function CustomerOrders({ user }: CustomerOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const customerOrders = await getCustomerOrders(user.id)
    setOrders(customerOrders)
    setLoading(false)
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "assigned":
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDescription = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Order placed, waiting for assignment"
      case "assigned":
        return "Order assigned to delivery assistant"
      case "in_transit":
        return "Order is on the way"
      case "delivered":
        return "Order delivered successfully"
      case "completed":
        return "Order completed"
      default:
        return "Unknown status"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order History</CardTitle>
          <CardDescription>Track your water jar orders</CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Place your first order to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                </div>
                <CardDescription className="text-sm">{getStatusDescription(order.status)}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium capitalize">{order.delivery_type.replace("_", " ")}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <p className="font-medium">
                      {order.quantity} jar{order.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-semibold text-lg">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order Date:</span>
                    <p className="font-medium">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {/* Delivery Date (if delivered) */}
                {order.delivered_at && (
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-sm text-green-800">Delivered on:</span>
                      <span className="text-sm font-medium text-green-800 ml-1">{formatDate(order.delivered_at)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Village:</span>
                  <span className="font-medium">{order.village_name || "Not specified"}</span>
                </div>

                {order.delivery_assistant_name && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600 text-sm">Delivery Assistant:</span>
                    <p className="font-medium">{order.delivery_assistant_name}</p>
                  </div>
                )}

                {order.notes && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600 text-sm">Notes:</span>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}

                {/* Jar Status */}
                {(order.status === "delivered" || order.status === "completed") && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600 text-sm">Jar Status:</span>
                    <p className="text-sm font-medium">
                      {order.empty_jar_returned
                        ? order.instant_jar_received
                          ? "Same jar returned instantly"
                          : "Empty jar returned"
                        : "Empty jar not returned yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
