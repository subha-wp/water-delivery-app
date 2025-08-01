"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Home, Package, Minus, Plus, Search } from "lucide-react"
import { createOrder, getAllCustomers } from "@/lib/orders"
import type { User } from "@/lib/db"

interface AssistantOrderFormProps {
  user: User
  onOrderCreated: () => void
  onCancel: () => void
}

export function AssistantOrderForm({ user, onOrderCreated, onCancel }: AssistantOrderFormProps) {
  const [customers, setCustomers] = useState<User[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [phoneSearch, setPhoneSearch] = useState("")
  const [deliveryType, setDeliveryType] = useState<"takeaway" | "home_delivery">("home_delivery")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    const allCustomers = await getAllCustomers()
    setCustomers(allCustomers)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.phone.includes(phoneSearch) || customer.name.toLowerCase().includes(phoneSearch.toLowerCase()),
  )

  const selectedCustomer = customers.find((c) => c.id.toString() === selectedCustomerId)
  const pricePerJar = deliveryType === "takeaway" ? 10 : 20
  const totalAmount = pricePerJar * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerId) {
      setError("Please select a customer")
      return
    }

    setLoading(true)
    setError("")

    const result = await createOrder(
      Number.parseInt(selectedCustomerId),
      deliveryType,
      quantity,
      user.id, // placed by assistant
    )

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
            <h1 className="font-semibold text-gray-900">Place Order for Customer</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Customer</CardTitle>
              <CardDescription>Choose the customer for this order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by phone or name..."
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        <span className="text-sm text-gray-500">{customer.phone}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCustomer && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                  {selectedCustomer.address && <p className="text-sm text-gray-600 mt-1">{selectedCustomer.address}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Option</CardTitle>
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
                <span>Customer:</span>
                <span>{selectedCustomer?.name || "Not selected"}</span>
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

          <Button type="submit" className="w-full h-12 text-base" disabled={loading || !selectedCustomerId}>
            {loading ? "Placing Order..." : `Place Order - ₹${totalAmount}`}
          </Button>
        </form>
      </div>
    </div>
  )
}
