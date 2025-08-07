"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  UserPlus,
  Phone,
  UserIcon,
  MapPin,
  Key,
  CheckCircle,
  Copy,
} from "lucide-react";
import { createCustomerByAssistant } from "@/lib/customer-management";
import { getActiveVillages } from "@/lib/villages";
import type { Village } from "@/lib/villages";

interface CreateCustomerFormProps {
  user: any;
  onCustomerCreated: (customer: any) => void;
  onCancel: () => void;
}

export function CreateCustomerForm({
  user,
  onCustomerCreated,
  onCancel,
}: CreateCustomerFormProps) {
  const [villages, setVillages] = useState<Village[]>([]);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    villageId: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    customer: any;
    password: string;
  } | null>(null);
  const [villagesLoading, setVillagesLoading] = useState(true);

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    const activeVillages = await getActiveVillages();
    setVillages(activeVillages);
    setVillagesLoading(false);
  };

  const generatePreviewPassword = () => {
    if (formData.name && formData.phone) {
      const nameDigits = formData.name
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 4);
      const phoneDigits = formData.phone.slice(-4);
      return nameDigits + phoneDigits;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.phone || !formData.name || !formData.villageId) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    const result = await createCustomerByAssistant(
      user.id,
      formData.phone,
      formData.name,
      Number.parseInt(formData.villageId),
      formData.address
    );

    if (result.success && result.customer && result.password) {
      setSuccess({ customer: result.customer, password: result.password });
    } else {
      setError(result.error || "Failed to create customer");
    }

    setLoading(false);
  };

  const handleCopyPassword = async () => {
    if (success?.password) {
      try {
        await navigator.clipboard.writeText(success.password);
        // You could add a toast notification here
      } catch (error) {
        console.error("Failed to copy password:", error);
      }
    }
  };

  const handleContinue = () => {
    if (success?.customer) {
      onCustomerCreated(success.customer);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <h1 className="font-semibold text-gray-900 text-lg">
                Customer Created Successfully
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4">
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-green-900">
                      Customer Account Created!
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      New customer has been successfully registered
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{success.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{success.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Village:</span>
                  <span className="font-medium">
                    {success.customer.village_name}
                  </span>
                </div>
                {success.customer.address && (
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right flex-1 ml-2">
                      {success.customer.address}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Login Credentials */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Login Credentials</span>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Share these credentials with the customer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">
                      Phone Number:
                    </span>
                    <span className="font-mono text-blue-900">
                      {success.customer.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">Password:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-blue-900 bg-white px-2 py-1 rounded border">
                        {success.password}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPassword}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
                  <p className="font-medium mb-1">Password Generation Rule:</p>
                  <p>
                    First 4 characters of name + Last 4 digits of phone number
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Note */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-1 rounded-full mt-0.5">
                    <Key className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-1">
                      Important:
                    </p>
                    <p className="text-sm text-orange-700">
                      Please share these login credentials with the customer.
                      They can change their password after logging in for the
                      first time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent"
              >
                Back to Orders
              </Button>
              <Button onClick={handleContinue} className="flex-1">
                Create Order for Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
            <h1 className="font-semibold text-gray-900 text-lg">
              Create New Customer
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Customer Registration
                  </CardTitle>
                  <CardDescription>
                    Create a new customer account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter customer's phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter customer's full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village *</Label>
                {villagesLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading villages...
                  </div>
                ) : (
                  <Select
                    value={formData.villageId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, villageId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer's village" />
                    </SelectTrigger>
                    <SelectContent>
                      {villages.map((village) => (
                        <SelectItem
                          key={village.id}
                          value={village.id.toString()}
                        >
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    placeholder="Enter customer's delivery address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="pl-10 min-h-[60px]"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Preview */}
          {formData.name && formData.phone && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Auto-Generated Password</span>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Password will be automatically created for the customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800">Password Preview:</span>
                    <span className="font-mono text-blue-900 bg-white px-2 py-1 rounded border">
                      {generatePreviewPassword()}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Generation Rule:</p>
                    <p>First 4 characters of name + Last 4 digits of phone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading || villagesLoading}
          >
            {loading ? "Creating Customer..." : "Create Customer Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
