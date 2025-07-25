"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Home, Package, Minus, Plus, MapPin } from "lucide-react"
import { createOrder } from "@/lib/orders"
import type { User } from "@/lib/db"

interface OrderFormProps {
  user: User
  onOrderCreated: () => void
  onCancel: () => void
}

export function OrderForm({ user, onOrderCreated, onCancel }: OrderFormProps) {
  const [deliveryType, setDeliveryType] = useState<"takeaway" | "home_delivery">("home_delivery")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const pricePerJar = deliveryType === "takeaway" ? 10 : 20
  const totalAmount = pricePerJar * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user.village_id) {
      setError("Please select your village first from the home screen")
      return
    }

    setLoading(true)
    setError("")

    const result = await createOrder(user.id, deliveryType, quantity, user.village_id)

    if (result.success) {
      onOrderCreated()
    } else {
      setError(result.error || "Failed to place order")
    }

    setLoading(false)
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
            <h1 className="font-semibold text-gray-900">Place Order</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Area Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Delivery Area</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">{user.village_name || "Village not selected"}</p>
                <p className="text-sm text-green-700">Your order will be delivered to this area</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Option</CardTitle>
              <CardDescription>Choose how you'd like to receive your water</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryType}
                onValueChange={(value) => setDeliveryType(value as "takeaway" | "home_delivery")}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="home_delivery" id="home_delivery" />
                    <Label htmlFor="home_delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Home className="h-4 w-4 text-blue-600" />
                          <span>Home Delivery</span>
                        </div>
                        <span className="font-semibold">₹20/jar</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Delivered to your doorstep</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <span>Takeaway</span>
                        </div>
                        <span className="font-semibold">₹10/jar</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pick up from our location</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Quantity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quantity</CardTitle>
              <CardDescription>How many 20L jars do you need?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="text-center">
                  <div className="text-3xl font-bold">{quantity}</div>
                  <div className="text-sm text-gray-500">jar{quantity > 1 ? "s" : ""}</div>
                </div>

                <Button type="button" variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Delivery Area:</span>
                <span className="font-medium">{user.village_name || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Type:</span>
                <span className="capitalize">{deliveryType.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>
                  {quantity} jar{quantity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Price per jar:</span>
                <span>₹{pricePerJar}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full h-12 text-base" disabled={loading || !user.village_id}>
            {loading ? "Placing Order..." : `Place Order - ₹${totalAmount}`}
          </Button>
        </form>
      </div>
    </div>
  )
}
