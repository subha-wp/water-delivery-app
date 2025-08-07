"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { X, AlertTriangle } from "lucide-react";
import { cancelOrder } from "@/lib/orders";
import type { Order, User } from "@/lib/db";

interface OrderCancellationDialogProps {
  order: Order;
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
}

export function OrderCancellationDialog({
  order,
  user,
  onCancel,
  onSuccess,
}: OrderCancellationDialogProps) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedReasons = [
    "Customer requested cancellation",
    "Unable to contact customer",
    "Address not accessible",
    "Customer not available",
    "Vehicle breakdown",
    "Weather conditions",
    "Stock unavailable",
    "Other",
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const finalReason = reason === "Other" ? customReason : reason;

    if (!finalReason.trim()) {
      setError("Please select or enter a cancellation reason");
      setLoading(false);
      return;
    }

    const result = await cancelOrder(order.id, user.id, finalReason);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Failed to cancel order");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-red-900">
                  Cancel Order
                </CardTitle>
                <CardDescription>Order #{order.id}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Order Details */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="capitalize">
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Warning</p>
                <p className="text-sm text-red-700">
                  This action cannot be undone. The order will be permanently
                  cancelled.
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="space-y-3">
            <Label>Reason for Cancellation *</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="space-y-2">
                {predefinedReasons.map((predefinedReason) => (
                  <div
                    key={predefinedReason}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={predefinedReason}
                      id={predefinedReason}
                    />
                    <Label
                      htmlFor={predefinedReason}
                      className="text-sm cursor-pointer"
                    >
                      {predefinedReason}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {reason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Please specify:</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Enter the reason for cancellation..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading || !reason}
            >
              {loading ? "Cancelling..." : "Cancel Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
