"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Home,
  Package,
  MapPin,
  AlertCircle,
  CheckCircle,
  Gift,
} from "lucide-react";
import type { User } from "@/lib/db";
import { getActiveVillages } from "@/lib/villages";
import type { Village } from "@/lib/villages";
import { updateUserProfile } from "@/lib/auth";
import { FreeJarBookingComponent } from "./free-jar-booking";
import { getBookingTimeDisplay } from "@/lib/booking-config";

interface CustomerHomeProps {
  user: User;
  onPlaceOrder: () => void;
}

export function CustomerHome({ user, onPlaceOrder }: CustomerHomeProps) {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState<string>(
    user.village_id?.toString() || ""
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    const activeVillages = await getActiveVillages();
    setVillages(activeVillages);
    setLoading(false);
  };

  const handleVillageChange = async (villageId: string) => {
    setSelectedVillageId(villageId);
    setUpdating(true);

    // Update user's village in the database
    const selectedVillage = villages.find((v) => v.id.toString() === villageId);
    if (selectedVillage) {
      await updateUserProfile(
        user.id,
        user.name,
        user.address,
        selectedVillage.id
      );
    }

    setUpdating(false);
  };

  const selectedVillage = villages.find(
    (v) => v.id.toString() === selectedVillageId
  );

  return (
    <div className="space-y-2">
      {/* Welcome Section */}
      <Card>
        <CardHeader className="">
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className="text-md">
                Welcome back, {user.name}!
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Village Selection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Select Your Delivery Village</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading villages...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Select
                  value={selectedVillageId}
                  onValueChange={handleVillageChange}
                  disabled={updating}
                >
                  <SelectTrigger id="village-select">
                    <SelectValue placeholder="Choose your village for delivery" />
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
              </div>

              {/* Village Status */}
              {selectedVillage ? (
                <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-xs">
                      Delivery available in {selectedVillage.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-orange-800 font-medium">
                      Please select your village
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Choose your delivery area from the dropdown above to start
                    ordering
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {/* Free Jar Booking Section - Highlighted */}
      <FreeJarBookingComponent user={user} />
      {/* Regular Order Button */}
      <Card>
        <CardContent className="p-4">
          {selectedVillage ? (
            <Button
              onClick={onPlaceOrder}
              className="w-full h-12 text-base"
              size="lg"
              disabled={updating}
            >
              <Plus className="h-5 w-5 mr-2" />
              {updating ? "Updating..." : "Place Regular Order"}
            </Button>
          ) : (
            <div className="text-center py-4">
              <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">
                Select Your Village First
              </p>
              <p className="text-sm text-gray-500">
                Choose your delivery area above to unlock ordering
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Our Services</CardTitle>
          <CardDescription>
            Choose the option that works best for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Free Jar Highlight */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Gift className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">FREE Daily Jar</p>
                <p className="text-sm text-blue-700">
                  Every day at {getBookingTimeDisplay()}
                </p>
              </div>
            </div>
            <span className="font-bold text-blue-900">FREE</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Takeaway</p>
                <p className="text-sm text-green-700">Pick up from our store</p>
              </div>
            </div>
            <span className="font-bold text-green-900">₹10/jar</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Home className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Home Delivery</p>
                <p className="text-sm text-blue-700">
                  Delivered to your doorstep
                </p>
              </div>
            </div>
            <span className="font-bold text-blue-900">₹20/jar</span>
          </div>
        </CardContent>
      </Card>

      {/* Available Villages List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Available Delivery Areas</CardTitle>
          <CardDescription>We deliver to these villages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {villages.map((village, index) => (
              <div
                key={village.id}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  selectedVillage?.id === village.id
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <span className="text-gray-700 font-medium">{index + 1}.</span>
                <span
                  className={`${
                    selectedVillage?.id === village.id
                      ? "text-blue-800 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {village.name}
                </span>
                {selectedVillage?.id === village.id && (
                  <CheckCircle className="h-4 w-4 text-blue-600 ml-auto" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Why Choose জলধারা?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">
              100% Pure & Safe Water
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Fast & Reliable Delivery
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Village-wise Delivery Service
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Daily FREE Jar at {getBookingTimeDisplay()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Easy Online Ordering</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
