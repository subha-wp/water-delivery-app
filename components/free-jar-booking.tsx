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
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Timer,
} from "lucide-react";
import {
  bookFreeJar,
  hasCustomerBookedToday,
  getCurrentISTTime,
  getCustomerFreeJarBookings,
} from "@/lib/free-jar-booking";
import type { User } from "@/lib/db";
import type { FreeJarBooking as FreeJarBookingType } from "@/lib/free-jar-booking";

interface FreeJarBookingProps {
  user: User;
}

export function FreeJarBookingComponent({ user }: FreeJarBookingProps) {
  const [hasBooked, setHasBooked] = useState(false);
  const [bookings, setBookings] = useState<FreeJarBookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [timeInfo, setTimeInfo] = useState<{
    current_time: string;
    current_date: string;
    is_booking_time: boolean;
    seconds_until_8am: number;
  } | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [networkError, setNetworkError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeInfo && !timeInfo.is_booking_time) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [timeInfo]);

  const loadData = async () => {
    try {
      const [bookedData, timeData, bookingsData] = await Promise.all([
        hasCustomerBookedToday(user.id),
        getCurrentISTTime(),
        getCustomerFreeJarBookings(user.id),
      ]);

      setHasBooked(bookedData);
      setTimeInfo(timeData);
      setBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error("Load data error:", error);
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    if (!timeInfo) return;

    const now = new Date();
    const tomorrow8AM = new Date();
    tomorrow8AM.setDate(tomorrow8AM.getDate() + 1);
    tomorrow8AM.setHours(8, 0, 0, 0);

    const diff = tomorrow8AM.getTime() - now.getTime();

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    } else {
      setCountdown("00:00:00");
    }
  };

  const handleBooking = async () => {
    if (!user.village_id) {
      setError("Please select your village first");
      return;
    }

    setBooking(true);
    setNetworkError(false);
    setError("");

    try {
      const result = await bookFreeJar(user.id, user.village_id);

      if (result.success) {
        setShowSuccess(true);
        setHasBooked(true);
        loadData();

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        if (result.shouldShowNetworkError) {
          setNetworkError(true);
          setError(result.error || "Network error occurred");
        } else {
          setError(result.error || "Booking failed");
        }
      }
    } catch (error) {
      setNetworkError(true);
      setError("Connection failed. Please try again.");
    }

    setBooking(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">
            Loading free jar booking...
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Free Jar Booking Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-blue-900">
                🎉 FREE 20L Water Jar!
              </CardTitle>
              <CardDescription className="text-blue-700">
                Daily at exactly 8:00 AM
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Booking Status */}
          {timeInfo?.is_booking_time ? (
            <div className="space-y-4">
              {hasBooked ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      🎉 You've successfully booked your free jar for today!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Network Error Display */}
                  {networkError && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2">
                        <WifiOff className="h-5 w-5 text-red-600" />
                        <div className="flex-1">
                          <span className="font-medium text-red-800">
                            Connection Issue
                          </span>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 animate-pulse">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          🎉 Booking Confirmed! Your free jar will be delivered
                          today.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Regular Error */}
                  {error && !networkError && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="text-orange-800">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Booking Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={booking || hasBooked || !user.village_id}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    size="lg"
                  >
                    {booking ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>
                          {networkError
                            ? "Retrying Connection..."
                            : "Booking Your Free Jar..."}
                        </span>
                      </div>
                    ) : hasBooked ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Already Booked Today</span>
                      </div>
                    ) : !user.village_id ? (
                      "Select Village First"
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5" />
                        <span>🚀 BOOK FREE JAR NOW!</span>
                      </div>
                    )}
                  </Button>

                  {/* Network Status Indicator */}
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    {networkError ? (
                      <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Poor Connection</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Connected</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Countdown Timer */}
              <div className="text-center p-2 bg-white rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Next Free Booking Opens In:
                </h3>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                  {countdown}
                </div>
              </div>

              <div className="p-1 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-800">
                  💡 <strong>Pro Tip:</strong> Be ready at exactly 8:00 AM to
                  get your free jar!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking History */}
      {bookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Free Jar History</CardTitle>
            <CardDescription>
              Track your free jar bookings and deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(booking.slot_date).toLocaleDateString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.village_name}
                    </p>
                  </div>
                  <Badge
                    className={
                      booking.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "booked"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
