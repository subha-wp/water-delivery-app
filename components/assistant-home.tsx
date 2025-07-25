"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Plus, IndianRupee, Calendar, Package } from "lucide-react"
import type { User } from "@/lib/db"
import { getAssistantAnalytics } from "@/lib/analytics"

interface AssistantHomeProps {
  user: User
  onPlaceOrder: () => void
}

interface AnalyticsData {
  totalDeliveries: number
  totalEarnings: number
  dailyDeliveries: {
    date: string
    count: number
    earnings: number
  }[]
}

export function AssistantHome({ user, onPlaceOrder }: AssistantHomeProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">("today")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    setLoading(true)
    const data = await getAssistantAnalytics(user.id, timeframe)
    setAnalytics(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Welcome, {user.name}!</CardTitle>
              <CardDescription>Delivery Assistant Dashboard</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Action */}
      <Card>
        <CardContent className="p-4">
          <Button onClick={onPlaceOrder} className="w-full h-12 text-base" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Place Order for Customer
          </Button>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Performance Analytics</CardTitle>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today" onClick={() => setTimeframe("today")}>
                Today
              </TabsTrigger>
              <TabsTrigger value="week" onClick={() => setTimeframe("week")}>
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" onClick={() => setTimeframe("month")}>
                This Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading analytics...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-blue-100">
                <CardContent className="p-4 text-center">
                  <div className="bg-blue-50 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700">{analytics?.totalDeliveries || 0}</div>
                  <div className="text-sm text-gray-600">Deliveries</div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100">
                <CardContent className="p-4 text-center">
                  <div className="bg-green-50 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-700">₹{analytics?.totalEarnings || 0}</div>
                  <div className="text-sm text-gray-600">Earnings</div>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && analytics?.dailyDeliveries && analytics.dailyDeliveries.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Breakdown</h3>
              <div className="space-y-2">
                {analytics.dailyDeliveries.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{day.date}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{day.count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{day.earnings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tips for Success</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Always confirm jar returns from customers</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Update delivery status promptly</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Call customers before arriving</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Handle jars with care to avoid damage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
