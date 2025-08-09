// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Phone, CheckCircle } from "lucide-react";
import {
  getAssistantFreeJarDeliveries,
  assignFreeJarDelivery,
  markFreeJarDelivered,
} from "@/lib/free-jar-booking";
import { formatDateTimeIST } from "@/lib/time-utils";
import type { User } from "@/lib/db";
import type { FreeJarBooking } from "@/lib/free-jar-booking";

interface AssistantFreeJarDeliveriesProps {
  user: User;
}

export function AssistantFreeJarDeliveries({
  user,
}: AssistantFreeJarDeliveriesProps) {
  const [deliveries, setDeliveries] = useState<
    (FreeJarBooking & {
      customer_name?: string;
      customer_phone?: string;
      customer_address?: string;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    const data = await getAssistantFreeJarDeliveries(user.id);
    setDeliveries(data);
    setLoading(false);
  };

  const handleAssign = async (bookingId: number) => {
    const result = await assignFreeJarDelivery(bookingId, user.id);
    if (result.success) {
      loadDeliveries();
    }
  };

  const handleMarkDelivered = async (bookingId: number) => {
    const result = await markFreeJarDelivered(
      bookingId,
      user.id,
      "Free jar delivered successfully"
    );
    if (result.success) {
      loadDeliveries();
    }
  };

  const handleCall = (phone: string) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "phoneCall",
          phone: phone,
        })
      );
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  const myDeliveries = deliveries.filter(
    (d) => d.delivery_assistant_id === user.id
  );
  const availableDeliveries = deliveries.filter(
    (d) => !d.delivery_assistant_id && d.status === "booked"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            Loading free jar deliveries...
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Gift className="h-5 w-5 text-blue-600" />
            <span>Free Jar Deliveries</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Available Deliveries */}
      {availableDeliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Available Free Jar Deliveries ({availableDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableDeliveries.map((delivery) => {
              const bookingDateTime = formatDateTimeIST(delivery.booking_time);

              return (
                <Card key={delivery.id} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          Free Jar #{delivery.id}
                        </span>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                          {delivery.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {delivery.customer_phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="font-medium">
                          {delivery.village_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booked:</span>
                        <span className="font-medium">
                          {bookingDateTime.date} at {bookingDateTime.time}
                        </span>
                      </div>
                      {delivery.customer_address && (
                        <div className="flex items-start justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-right flex-1 ml-2">
                            {delivery.customer_address}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => handleAssign(delivery.id)}
                        className="flex-1"
                        size="sm"
                      >
                        Accept Delivery
                      </Button>
                      {delivery.customer_phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCall(delivery.customer_phone!)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* My Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            My Free Jar Deliveries ({myDeliveries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myDeliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No free jar deliveries assigned</p>
            </div>
          ) : (
            myDeliveries.map((delivery) => {
              const bookingDateTime = formatDateTimeIST(delivery.booking_time);
              const deliveredDateTime = delivery.delivered_at
                ? formatDateTimeIST(delivery.delivered_at)
                : null;

              return (
                <Card key={delivery.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          Free Jar #{delivery.id}
                        </span>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">
                          {delivery.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {delivery.customer_phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="font-medium">
                          {delivery.village_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booked:</span>
                        <span className="font-medium">
                          {bookingDateTime.date} at {bookingDateTime.time}
                        </span>
                      </div>
                      {deliveredDateTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered:</span>
                          <span className="font-medium text-green-600">
                            {deliveredDateTime.date} at {deliveredDateTime.time}
                          </span>
                        </div>
                      )}
                      {delivery.customer_address && (
                        <div className="flex items-start justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-right flex-1 ml-2">
                            {delivery.customer_address}
                          </span>
                        </div>
                      )}
                    </div>

                    {delivery.status === "booked" && (
                      <div className="flex space-x-2 mt-4">
                        <Button
                          onClick={() => handleMarkDelivered(delivery.id)}
                          className="flex-1"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Delivered
                        </Button>
                        {delivery.customer_phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(delivery.customer_phone!)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}

                    {delivery.status === "delivered" && (
                      <div className="mt-4 p-2 bg-green-50 rounded-md text-center">
                        <span className="text-sm text-green-800 font-medium">
                          ✅ Free jar delivered successfully!
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
