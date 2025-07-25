"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { updateOrderStatus } from "@/lib/orders"
import type { Order, User } from "@/lib/db"
import { getOrderById } from "@/lib/orders"

interface DeliveryCompleteFormProps {
  orderId: number
  user: User
  onComplete: () => void
  onCancel: () => void
}

export function DeliveryCompleteForm({ orderId, user, onComplete, onCancel }: DeliveryCompleteFormProps) {
  const [order, setOrder] = useState<
    (Order & { customer_name?: string; customer_address?: string; customer_phone?: string }) | null
  >(null)
  const [emptyJarReturned, setEmptyJarReturned] = useState<string>("false")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    setLoading(true)
    const orderData = await getOrderById(orderId)
    setOrder(orderData)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const result = await updateOrderStatus(
      orderId,
      "delivered",
      user.id,
      emptyJarReturned === "returned" || emptyJarReturned === "instant",
      deliveryNotes,
      emptyJarReturned === "instant",
    )

    if (result.success) {
      onComplete()
    } else {
      setError(result.error || "Failed to complete delivery")
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Order not found</p>
          <Button onClick={onCancel} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-gray-900">Complete Delivery</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Order #{order.id}</span>
              </CardTitle>
              <CardDescription>Confirm delivery details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
              {order.customer_address && (
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right flex-1 ml-2">{order.customer_address}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span>
                  {order.quantity} jar{order.quantity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{order.delivery_type.replace("_", " ")}</span>
              </div>
              {order.delivery_type === "home_delivery" && (
                <div className="p-2 bg-green-50 rounded-md text-sm text-green-800">
                  You will earn ₹5 for this home delivery
                </div>
              )}
              {order.delivery_type === "takeaway" && (
                <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">No earnings for takeaway orders</div>
              )}
            </CardContent>
          </Card>

          {/* Empty Jar Return */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Empty Jar Return</CardTitle>
              <CardDescription>Did the customer return empty jars?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={emptyJarReturned} onValueChange={setEmptyJarReturned}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="returned" id="jar_returned_yes" />
                    <Label htmlFor="jar_returned_yes" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>Yes, empty jar(s) returned</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="instant" id="jar_returned_instant" />
                    <Label htmlFor="jar_returned_instant" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>Yes, Same Jar instantly</span>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="false" id="jar_returned_no" />
                    <Label htmlFor="jar_returned_no" className="flex-1 cursor-pointer">
                      <span>No, empty jar(s) not returned</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Delivery Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Notes</CardTitle>
              <CardDescription>Any additional notes about the delivery (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Customer was not home, left with neighbor..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full h-12 text-base" disabled={submitting}>
            {submitting ? "Completing Delivery..." : "Complete Delivery"}
          </Button>
        </form>
      </div>
    </div>
  )
}
