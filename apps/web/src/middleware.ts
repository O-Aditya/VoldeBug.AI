import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/role-select"];
const PUBLIC_PREFIXES = ["/onboarding", "/api", "/_next", "/favicon"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  // If not logged in, redirect to login
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Ensure role-based routing
  const role = req.auth.user?.role;
  const isTeacherRoute = pathname.startsWith("/dashboard/teacher");
  const isStudentRoute = pathname.startsWith("/dashboard/student") || pathname.startsWith("/dashboard/classroom");

  if (role === "STUDENT" && isTeacherRoute) {
    return NextResponse.redirect(new URL("/dashboard/student", req.nextUrl));
  }

  if (role === "TEACHER" && isStudentRoute) {
    return NextResponse.redirect(new URL("/dashboard/teacher", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};