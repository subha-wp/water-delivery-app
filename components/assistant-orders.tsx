// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Plus,
  Phone,
  Package,
  Clock,
  Calendar,
  UserPlus,
  Timer,
  MessageSquare,
  X,
} from "lucide-react";
import {
  getAssistantOrders,
  assignOrderToAssistant,
  updateOrderStatus,
} from "@/lib/orders";
import { formatDateTimeIST, calculateDeliveryTimeIST } from "@/lib/time-utils";
import { OrderCancellationDialog } from "./order-cancellation-dialog";
import type { Order, User } from "@/lib/db";

interface AssistantOrdersProps {
  user: User;
  onPlaceOrder: () => void;
  onCreateCustomer: () => void;
  onDeliveryComplete: (orderId: number) => void;
}

export function AssistantOrders({
  user,
  onPlaceOrder,
  onCreateCustomer,
  onDeliveryComplete,
}: AssistantOrdersProps) {
  const [orders, setOrders] = useState<
    (Order & { customer_address?: string; customer_phone?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "assigned" | "in_transit" | "pending"
  >("all");
  const [showCancelDialog, setShowCancelDialog] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const assistantOrders = await getAssistantOrders(user.id);
    setOrders(assistantOrders);
    setLoading(false);
  };

  const handleAssignOrder = async (orderId: number) => {
    const result = await assignOrderToAssistant(orderId, user.id);
    if (result.success) {
      loadOrders();
    }
  };

  const handleCall = (phone) => {
    if (window.ReactNativeWebView) {
      // We're in the WebView, send a message to the native app
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "phoneCall",
          phone: phone,
        })
      );
    } else {
      // We're in a regular browser, use the default behavior
      window.location.href = `tel:${phone}`;
    }
  };

  const handleUpdateStatus = async (
    orderId: number,
    status: Order["status"]
  ) => {
    if (status === "delivered") {
      onDeliveryComplete(orderId);
    } else {
      const result = await updateOrderStatus(orderId, status, user.id);
      if (result.success) {
        loadOrders();
      }
    }
  };

  const handleCancelOrder = (order: Order) => {
    setShowCancelDialog(order);
  };

  const handleCancelSuccess = () => {
    setShowCancelDialog(null);
    loadOrders();
  };

  const canCancelOrder = (order: Order) => {
    return (
      order.status === "pending" ||
      order.status === "assigned" ||
      order.status === "in_transit"
    );
  };

  const myOrders = orders.filter(
    (order) => order.delivery_assistant_id === user.id
  );
  const availableOrders = orders.filter(
    (order) => order.status === "pending" && !order.delivery_assistant_id
  );

  const filteredMyOrders =
    statusFilter === "all"
      ? myOrders
      : myOrders.filter((order) => order.status === statusFilter);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Manage Orders</h2>
        <div className="flex space-x-2">
          <Button onClick={onCreateCustomer} size="sm" variant="outline">
            <UserPlus className="h-4 w-4 mr-1" />
            New Customer
          </Button>
          <Button onClick={onPlaceOrder} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Order
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="my-orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-orders">
            My Orders ({myOrders.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-orders" className="space-y-4">
          {/* Status Filter Tabs */}
          <Card>
            <CardContent className="p-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="all"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="assigned"
                    onClick={() => setStatusFilter("assigned")}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    New
                  </TabsTrigger>
                  <TabsTrigger
                    value="in_transit"
                    onClick={() => setStatusFilter("in_transit")}
                  >
                    <Truck className="h-3 w-3 mr-1" />
                    Transit
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    onClick={() => setStatusFilter("pending")}
                  >
                    <Package className="h-3 w-3 mr-1" />
                    Pending
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading orders...
            </div>
          ) : filteredMyOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  No {statusFilter !== "all" ? statusFilter : ""} orders found
                </p>
                <p className="text-sm text-gray-400">
                  {statusFilter !== "all"
                    ? "Try a different filter"
                    : "Check available orders to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMyOrders.map((order) => {
              const orderDateTime = formatDateTimeIST(order.created_at);
              const deliveredDateTime = order.delivered_at
                ? formatDateTimeIST(order.delivered_at)
                : null;
              const deliveryDuration = calculateDeliveryTimeIST(
                order.created_at,
                order.delivered_at
              );
              const cancelledDateTime = order.cancelled_at
                ? formatDateTimeIST(order.cancelled_at)
                : null;

              return (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                        {canCancelOrder(order) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                          {order.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {order.customer_phone}
                        </span>
                      </div>
                      {order.customer_address && (
                        <div className="flex items-start justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-right flex-1 ml-2">
                            {order.customer_address}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="capitalize">
                          {order.village_name || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium capitalize">
                          {order.delivery_type.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium">
                          {order.quantity} jar{order.quantity > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <p className="font-semibold">₹{order.total_amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Per Jar:</span>
                        <p className="font-medium">₹{order.price_per_jar}</p>
                      </div>
                    </div>

                    {/* Order Time - IST */}
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-md">
                      <Timer className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">
                            Order Placed:
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-800">
                              {orderDateTime.date}
                            </div>
                            <div className="text-xs text-blue-600">
                              {orderDateTime.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Time - IST */}
                    {deliveredDateTime && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-md">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              Delivered:
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-800">
                                {deliveredDateTime.date}
                              </div>
                              <div className="text-xs text-green-600">
                                {deliveredDateTime.time}
                              </div>
                            </div>
                          </div>
                          {deliveryDuration && (
                            <div className="mt-1 text-xs text-green-700">
                              Delivery time: {deliveryDuration}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Time - IST */}
                    {cancelledDateTime && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-md">
                        <X className="h-4 w-4 text-red-600" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-800">
                              Cancelled:
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-red-800">
                                {cancelledDateTime.date}
                              </div>
                              <div className="text-xs text-red-600">
                                {cancelledDateTime.time}
                              </div>
                            </div>
                          </div>
                          {order.cancelled_by_name && (
                            <div className="mt-1 text-xs text-red-700">
                              By: {order.cancelled_by_name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Earnings Info */}
                    {order.status !== "cancelled" && (
                      <>
                        {order.delivery_type === "home_delivery" && (
                          <div className="p-2 bg-green-50 rounded-md text-sm text-green-800">
                            Earnings: ₹5 (Home Delivery)
                          </div>
                        )}
                        {order.delivery_type === "takeaway" && (
                          <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                            No earnings (Takeaway)
                          </div>
                        )}
                      </>
                    )}

                    {/* Order Notes/Remarks */}
                    {order.notes && (
                      <div className="pt-2 border-t">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600 text-sm font-medium">
                              Order Notes:
                            </span>
                            <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                              {order.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Reason */}
                    {order.status === "cancelled" &&
                      order.cancellation_reason && (
                        <div className="pt-2 border-t">
                          <div className="flex items-start space-x-2">
                            <X className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-gray-600 text-sm font-medium">
                                Cancellation Reason:
                              </span>
                              <p className="text-sm text-gray-700 mt-1 bg-red-50 p-2 rounded border border-red-200">
                                {order.cancellation_reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Delivery Notes/Remarks */}
                    {order.delivery_notes && (
                      <div className="pt-2 border-t">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600 text-sm font-medium">
                              Delivery Notes:
                            </span>
                            <p className="text-sm text-gray-700 mt-1 bg-green-50 p-2 rounded border border-green-200">
                              {order.delivery_notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Jar Status */}
                    {(order.status === "delivered" ||
                      order.status === "completed") && (
                      <div className="p-2 bg-blue-50 rounded-md">
                        <span className="text-sm text-blue-800">
                          Jar Status:{" "}
                        </span>
                        <span className="text-sm font-medium text-blue-800">
                          {order.empty_jar_returned
                            ? order.instant_jar_received
                              ? "Same jar returned instantly"
                              : "Empty jar returned"
                            : "Empty jar not returned yet"}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {order.status !== "cancelled" && (
                      <div className="flex space-x-2 pt-2">
                        {order.status === "assigned" && (
                          <Button
                            onClick={() =>
                              handleUpdateStatus(order.id, "in_transit")
                            }
                            className="flex-1"
                            size="sm"
                          >
                            Start Delivery
                          </Button>
                        )}
                        {order.status === "in_transit" && (
                          <Button
                            onClick={() =>
                              handleUpdateStatus(order.id, "delivered")
                            }
                            className="flex-1"
                            size="sm"
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {order.delivery_type === "home_delivery" &&
                          order.customer_phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCall(order.customer_phone)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading orders...
            </div>
          ) : availableOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No available orders</p>
                <p className="text-sm text-gray-400">
                  New orders will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            availableOrders.map((order) => {
              const orderDateTime = formatDateTimeIST(order.created_at);

              return (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Customer Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                          {order.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="capitalize">
                          {order.village_name || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <p className="font-medium capitalize">
                          {order.delivery_type.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <p className="font-medium">
                          {order.quantity} jar{order.quantity > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <p className="font-semibold">₹{order.total_amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Per Jar:</span>
                        <p className="font-medium">₹{order.price_per_jar}</p>
                      </div>
                    </div>

                    {/* Order Time - IST */}
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-md">
                      <Timer className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">
                            Order Placed:
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-800">
                              {orderDateTime.date}
                            </div>
                            <div className="text-xs text-blue-600">
                              {orderDateTime.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="pt-2 border-t">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600 text-sm font-medium">
                              Order Notes:
                            </span>
                            <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                              {order.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Earnings Info */}
                    {order.delivery_type === "home_delivery" && (
                      <div className="p-2 bg-green-50 rounded-md text-sm text-green-800">
                        Earnings: ₹5 (Home Delivery)
                      </div>
                    )}
                    {order.delivery_type === "takeaway" && (
                      <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                        No earnings (Takeaway)
                      </div>
                    )}

                    <Button
                      onClick={() => handleAssignOrder(order.id)}
                      className="w-full"
                      size="sm"
                    >
                      Accept Order
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Cancellation Dialog */}
      {showCancelDialog && (
        <OrderCancellationDialog
          order={showCancelDialog}
          user={user}
          onCancel={() => setShowCancelDialog(null)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
}
