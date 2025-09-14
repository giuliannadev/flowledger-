"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUsers } from "@/hooks/use-users"

interface UserDetailProps {
  userId: string
  onBack: () => void
}

export function UserDetail({ userId, onBack }: UserDetailProps) {
  const { users, updateUserStatus } = useUsers()
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800"
      case "accountant":
        return "bg-blue-100 text-blue-800"
      case "employee":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <Button variant="ghost" onClick={onBack} className="text-blue-600">
          ← Back to Users
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">Edit</Button>
          {user.status === "active" ? (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              onClick={() => updateUserStatus(user.id, "inactive")}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => updateUserStatus(user.id, "active")}
            >
              Activate
            </Button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-gray-700">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Email:</span>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Role:</span>
                  <div className="font-medium capitalize">{user.role}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status:</span>
                  <div className="font-medium capitalize">{user.status}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Last Active:</span>
                  <div className="font-medium">{user.lastActive}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Joined:</span>
                  <div className="font-medium">{user.createdAt}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Login Count:</span>
                  <div className="font-medium">{user.loginCount || 0} times</div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Permissions</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                {rolePermissions[user.role as keyof typeof rolePermissions]?.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Logged in</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Created invoice INV-003</div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Added expense</div>
                  <div className="text-sm text-gray-500">3 days ago</div>
                </div>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
