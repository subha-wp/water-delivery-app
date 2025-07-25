"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MapPin, AlertCircle, ArrowLeft } from "lucide-react"
import { getActiveVillages } from "@/lib/villages"
import type { Village } from "@/lib/villages"
import type { User } from "@/lib/db"

interface VillageSelectorProps {
  user: User
  onVillageSelected: (villageId: number, villageName: string) => void
  onCancel: () => void
}

export function VillageSelector({ user, onVillageSelected, onCancel }: VillageSelectorProps) {
  const [villages, setVillages] = useState<Village[]>([])
  const [selectedVillageId, setSelectedVillageId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVillages()
  }, [])

  const loadVillages = async () => {
    const activeVillages = await getActiveVillages()
    setVillages(activeVillages)

    // Pre-select user's village if they have one
    if (user.village_id) {
      setSelectedVillageId(user.village_id.toString())
    }

    setLoading(false)
  }

  const handleContinue = () => {
    if (selectedVillageId) {
      const selectedVillage = villages.find((v) => v.id.toString() === selectedVillageId)
      if (selectedVillage) {
        onVillageSelected(selectedVillage.id, selectedVillage.name)
      }
    }
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
            <h1 className="font-semibold text-gray-900 text-lg">Select Delivery Area</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Village Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Choose Your Village</span>
            </CardTitle>
            <CardDescription>
              We deliver to the following areas. Please select your village to continue with your order.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading villages...</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="village">Select Village</Label>
                  <Select value={selectedVillageId} onValueChange={setSelectedVillageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your village" />
                    </SelectTrigger>
                    <SelectContent>
                      {villages.map((village) => (
                        <SelectItem key={village.id} value={village.id.toString()}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVillageId && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Selected: {villages.find((v) => v.id.toString() === selectedVillageId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Service Areas Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Delivery Areas</CardTitle>
            <CardDescription>We currently serve these villages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {villages.map((village, index) => (
                <div key={village.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{village.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Not Available Warning */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">Village Not Listed?</p>
                <p className="text-sm text-orange-700 mt-1">
                  If your village is not in the list above, we don't currently deliver to your area. Please contact us
                  to request delivery service in your village.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedVillageId} className="flex-1">
            Continue to Order
          </Button>
        </div>
      </div>
    </div>
  )
}
