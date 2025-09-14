"use client"

export type Permission =
  | "view_dashboard"
  | "manage_invoices"
  | "manage_expenses"
  | "view_reports"
  | "export_data"
  | "manage_users"
  | "full_access"

export type UserRole = "owner" | "accountant" | "employee"

export const rolePermissions: Record<UserRole, Permission[]> = {
  owner: [
    "full_access",
    "manage_users",
    "manage_invoices",
    "manage_expenses",
    "view_reports",
    "export_data",
    "view_dashboard",
  ],
  accountant: ["manage_invoices", "manage_expenses", "view_reports", "export_data", "view_dashboard"],
  employee: [
    "view_dashboard",
    "manage_expenses", // Limited to own expenses
  ],
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission) || rolePermissions[userRole].includes("full_access")
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  switch (route) {
    case "/dashboard":
      return hasPermission(userRole, "view_dashboard")
    case "/invoices":
      return hasPermission(userRole, "manage_invoices")
    case "/expenses":
      return hasPermission(userRole, "manage_expenses")
    case "/reports":
      return hasPermission(userRole, "view_reports")
    case "/users":
      return hasPermission(userRole, "manage_users")
    default:
      return false
  }
}
