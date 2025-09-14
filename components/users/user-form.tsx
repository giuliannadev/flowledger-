"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useUsers } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"

interface UserFormProps {
  onCancel: () => void
  onSave: () => void
}

export function UserForm({ onCancel, onSave }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    sendInvite: true,
  })

  const { addUser } = useUsers()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const user = {
      ...formData,
      status: "pending" as const,
    }

    addUser(user)
    toast({
      title: "User added",
      description: formData.sendInvite
        ? "User has been added and invitation sent."
        : "User has been added successfully.",
    })
    onSave()
  }

  const rolePermissions = {
    owner: [
      "Full system access",
      "Manage users and permissions",
      "View all financial data",
      "Create and edit invoices",
      "Manage expenses",
      "Generate reports",
      "Export data",
    ],
    accountant: [
      "View financial data",
      "Create and edit invoices",
      "Manage expenses",
      "Generate reports",
      "Export data",
    ],
    employee: ["View dashboard", "Add expenses", "View assigned invoices"],
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add User</h1>
          <p className="text-gray-600 mt-1">Invite a new team member to your organization</p>
        </div>
        <Button variant="outline" onClick={onCancel} className="text-gray-700 bg-transparent">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendInvite"
                checked={formData.sendInvite}
                onCheckedChange={(checked) => setFormData({ ...formData, sendInvite: checked as boolean })}
              />
              <Label htmlFor="sendInvite" className="text-sm font-medium">
                Send invitation email to user
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        {formData.role && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Role Permissions</CardTitle>
              <p className="text-sm text-gray-600">
                The following permissions will be granted to this {formData.role}:
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rolePermissions[formData.role as keyof typeof rolePermissions]?.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Add User
          </Button>
        </div>
      </form>
    </div>
  )
}
