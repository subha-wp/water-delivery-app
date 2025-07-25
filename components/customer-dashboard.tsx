"use client"

import { useState } from "react"
import type { User } from "@/lib/db"
import { OrderForm } from "./order-form"
import { CustomerHome } from "./customer-home"
import { CustomerOrders } from "./customer-orders"
import { CustomerProfile } from "./customer-profile"
import { BottomNav } from "./bottom-nav"
import { Logo } from "./logo"

interface CustomerDashboardProps {
  user: User
}

export function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile">("home")
  const [showOrderForm, setShowOrderForm] = useState(false)

  const handleOrderCreated = () => {
    setShowOrderForm(false)
    setActiveTab("orders")
  }

  const handlePlaceOrder = () => {
    // Check if user has selected a village
    if (!user.village_id) {
      // This shouldn't happen since the button is disabled, but just in case
      return
    }
    setShowOrderForm(true)
  }

  if (showOrderForm) {
    return <OrderForm user={user} onOrderCreated={handleOrderCreated} onCancel={() => setShowOrderForm(false)} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <CustomerHome user={user} onPlaceOrder={handlePlaceOrder} />
      case "orders":
        return <CustomerOrders user={user} />
      case "profile":
        return <CustomerProfile user={user} />
      default:
        return <CustomerHome user={user} onPlaceOrder={handlePlaceOrder} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            {activeTab === "home" ? (
              <Logo size="lg" />
            ) : (
              <h1 className="font-semibold text-gray-900 text-lg">
                {activeTab === "orders" && "My Orders"}
                {activeTab === "profile" && "Profile"}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">{renderContent()}</div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
