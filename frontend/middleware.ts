import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  // 1. Authentication Check: Redirect to login if accessing dashboard without a token
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Authorization Check: Role-based access control (RBAC)
  // Prevent non-admin users from accessing admin-specific routes
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // 3. Optional: Prevent logged-in users from accessing login/register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    const redirectUrl =
      role === "admin" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

// 4. Matcher configuration to optimize performance
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
