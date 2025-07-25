"use client"

import { useState } from "react"
import type { User } from "@/lib/db"
import { AssistantOrderForm } from "./assistant-order-form"
import { DeliveryCompleteForm } from "./delivery-complete-form"
import { AssistantHome } from "./assistant-home"
import { AssistantOrders } from "./assistant-orders"
import { AssistantProfile } from "./assistant-profile"
import { BottomNav } from "./bottom-nav"
import { Logo } from "./logo"

interface AssistantDashboardProps {
  user: User
}

export function AssistantDashboard({ user }: AssistantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile">("home")
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState<number | null>(null)

  const handleOrderCreated = () => {
    setShowOrderForm(false)
    setActiveTab("orders")
  }

  const handleDeliveryComplete = () => {
    setShowDeliveryForm(null)
    setActiveTab("orders")
  }

  if (showOrderForm) {
    return (
      <AssistantOrderForm user={user} onOrderCreated={handleOrderCreated} onCancel={() => setShowOrderForm(false)} />
    )
  }

  if (showDeliveryForm) {
    return (
      <DeliveryCompleteForm
        orderId={showDeliveryForm}
        user={user}
        onComplete={handleDeliveryComplete}
        onCancel={() => setShowDeliveryForm(null)}
      />
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <AssistantHome user={user} onPlaceOrder={() => setShowOrderForm(true)} />
      case "orders":
        return (
          <AssistantOrders
            user={user}
            onPlaceOrder={() => setShowOrderForm(true)}
            onDeliveryComplete={(orderId) => setShowDeliveryForm(orderId)}
          />
        )
      case "profile":
        return <AssistantProfile user={user} />
      default:
        return <AssistantHome user={user} onPlaceOrder={() => setShowOrderForm(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {activeTab === "home" ? (
              <Logo size="md" />
            ) : (
              <h1 className="font-semibold text-gray-900 text-lg">
                {activeTab === "orders" && "Manage Orders"}
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
