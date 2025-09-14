"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth.tsx"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  userRole: string
}

export function Sidebar({ activeView, onViewChange, userRole }: SidebarProps) {
  const { user, logout } = useAuth()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", roles: ["owner", "accountant", "employee"] },
    { id: "invoices", label: "Invoices", icon: "📄", roles: ["owner", "accountant"] },
    { id: "expenses", label: "Expenses", icon: "💰", roles: ["owner", "accountant", "employee"] },
    { id: "reports", label: "Reports", icon: "📈", roles: ["owner", "accountant"] },
    { id: "users", label: "Users", icon: "👥", roles: ["owner"] },
  ]

  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">FlowLedger</h2>
            <p className="text-sm text-gray-500">{user?.company}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left h-11",
              activeView === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100",
            )}
            onClick={() => onViewChange(item.id)}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
