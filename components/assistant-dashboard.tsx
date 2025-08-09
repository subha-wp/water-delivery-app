//@ts-nocheck
"use client";

import { useState } from "react";
import type { User } from "@/lib/db";
import { AssistantOrderForm } from "./assistant-order-form";
import { CreateCustomerForm } from "./create-customer-form";
import { DeliveryCompleteForm } from "./delivery-complete-form";
import { AssistantHome } from "./assistant-home";
import { AssistantOrders } from "./assistant-orders";
import { AssistantProfile } from "./assistant-profile";
import { AssistantFreeJarDeliveries } from "./assistant-free-jar-deliveries";
import { BottomNav } from "./bottom-nav";
import { Logo } from "./logo";

interface AssistantDashboardProps {
  user: User;
}

export function AssistantDashboard({ user }: AssistantDashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile">(
    "home"
  );
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState<number | null>(null);
  const [showFreeJarDeliveries, setShowFreeJarDeliveries] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const handleOrderCreated = () => {
    setShowOrderForm(false);
    setShowCreateCustomer(false);
    setSelectedCustomer(null);
    setActiveTab("orders");
  };

  const handleDeliveryComplete = () => {
    setShowDeliveryForm(null);
    setActiveTab("orders");
  };

  const handleCustomerCreated = (customer: User) => {
    setShowCreateCustomer(false);
    setSelectedCustomer(customer);
    setShowOrderForm(true);
  };

  const handlePlaceOrder = () => {
    setSelectedCustomer(null);
    setShowOrderForm(true);
  };

  const handleCreateCustomer = () => {
    setShowOrderForm(false);
    setShowCreateCustomer(true);
  };

  const handleCancelOrderForm = () => {
    setShowOrderForm(false);
    setSelectedCustomer(null);
  };

  const handleCancelCreateCustomer = () => {
    setShowCreateCustomer(false);
    setSelectedCustomer(null);
  };

  const handleShowFreeJarDeliveries = () => {
    setShowFreeJarDeliveries(true);
  };

  const handleBackFromFreeJar = () => {
    setShowFreeJarDeliveries(false);
  };

  if (showCreateCustomer) {
    return (
      <CreateCustomerForm
        user={user}
        onCustomerCreated={handleCustomerCreated}
        onCancel={handleCancelCreateCustomer}
      />
    );
  }

  if (showOrderForm) {
    return (
      <AssistantOrderForm
        user={user}
        onOrderCreated={handleOrderCreated}
        onCancel={handleCancelOrderForm}
        preSelectedCustomer={selectedCustomer || undefined}
      />
    );
  }

  if (showDeliveryForm) {
    return (
      <DeliveryCompleteForm
        orderId={showDeliveryForm}
        user={user}
        onComplete={handleDeliveryComplete}
        onCancel={() => setShowDeliveryForm(null)}
      />
    );
  }

  if (showFreeJarDeliveries) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackFromFreeJar}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back
              </button>
              <h1 className="font-semibold text-gray-900 text-lg">
                Free Jar Deliveries
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto p-4">
          <AssistantFreeJarDeliveries user={user} />
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <AssistantHome
            user={user}
            onPlaceOrder={handlePlaceOrder}
            onShowFreeJarDeliveries={handleShowFreeJarDeliveries}
          />
        );
      case "orders":
        return (
          <AssistantOrders
            user={user}
            onPlaceOrder={handlePlaceOrder}
            onCreateCustomer={handleCreateCustomer}
            onDeliveryComplete={(orderId) => setShowDeliveryForm(orderId)}
          />
        );
      case "profile":
        return <AssistantProfile user={user} />;
      default:
        return (
          <AssistantHome
            user={user}
            onPlaceOrder={handlePlaceOrder}
            onShowFreeJarDeliveries={handleShowFreeJarDeliveries}
          />
        );
    }
  };

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
  );
}
