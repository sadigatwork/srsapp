import { UserRole } from "@/lib/auth";

export function requireRole(userRole: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(userRole)) {
    throw new Error("FORBIDDEN");
  }
}
