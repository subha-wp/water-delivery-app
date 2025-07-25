"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, MapPin, LogOut, Edit, Save, X } from "lucide-react"
import { updateUserProfile } from "@/lib/auth"
import type { User as UserType } from "@/lib/db"
import { useRouter } from "next/navigation"

interface CustomerProfileProps {
  user: UserType
}

export function CustomerProfile({ user }: CustomerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: user.name,
    address: user.address || "",
  })
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setError("")

    const result = await updateUserProfile(user.id, formData.name, formData.address)

    if (result.success) {
      setIsEditing(false)
      // Refresh the page to get updated user data
      window.location.reload()
    } else {
      setError(result.error || "Failed to update profile")
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      address: user.address || "",
    })
    setIsEditing(false)
    setError("")
  }

  const handleLogout = async () => {
    try {
      // Call the logout API route
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      })

      // Always redirect to home page regardless of response
      // This ensures logout works even if there are minor API issues
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback: redirect anyway to ensure user gets logged out
      window.location.href = "/"
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">My Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <User className="h-4 w-4 text-gray-500" />
                <span>{user.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{user.phone}</span>
            </div>
            <p className="text-xs text-gray-500">Phone number cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your delivery address"
                rows={3}
              />
            ) : (
              <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md min-h-[60px]">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <span className="flex-1">{user.address || "No address provided"}</span>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSave} disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-1" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={loading} className="flex-1">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Account Type:</span>
            <span className="font-medium capitalize">Customer</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Member Since:</span>
            <span className="font-medium">{new Date(user.created_at).toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium">{new Date(user.updated_at).toLocaleDateString("en-IN")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card>
        <CardContent className="p-4">
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
