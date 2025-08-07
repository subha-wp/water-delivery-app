"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Truck,
  Droplets,
  Calendar,
  MessageSquare,
  Timer,
  X,
} from "lucide-react";
import { getCustomerOrders } from "@/lib/orders";
import { formatDateTimeIST, calculateDeliveryTimeIST } from "@/lib/time-utils";
import type { Order, User } from "@/lib/db";

interface CustomerOrdersProps {
  user: User;
}

export function CustomerOrders({ user }: CustomerOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const customerOrders = await getCustomerOrders(user.id);
    setOrders(customerOrders);
    setLoading(false);
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "assigned":
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Order placed, waiting for assignment";
      case "assigned":
        return "Order assigned to delivery assistant";
      case "in_transit":
        return "Order is on the way";
      case "delivered":
        return "Order delivered successfully";
      case "completed":
        return "Order completed";
      case "cancelled":
        return "Order has been cancelled";
      default:
        return "Unknown status";
    }
  };

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-4">
              Place your first order to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
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
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <CardTitle className="text-base">
                        Order #{order.id}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {getStatusDescription(order.status)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
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
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-semibold text-lg">
                        ₹{order.total_amount}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Village:</span>
                      <p className="font-medium">
                        {order.village_name || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Order Time - IST
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
                  {/* {cancelledDateTime && (
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
                  )} */}

                  {/* Delivery Assistant */}
                  {order.delivery_assistant_name &&
                    order.status !== "cancelled" && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-600 text-sm">
                          Delivery Assistant:
                        </span>
                        <p className="font-medium">
                          {order.delivery_assistant_name}
                        </p>
                      </div>
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
                  {order.delivery_notes && order.status !== "cancelled" && (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
