import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Array of public routes that don't require authentication
const publicRoutes = ["/", "/sign-in", "/sign-up", "/events(.*)"];

// Function to check if a given route is public
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith("(.*)")) {
      const routeWithoutWildcard = route.replace("(.*)", "");
      return path.startsWith(routeWithoutWildcard);
    }
    return path === route;
  });
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // If it's a public route, don't check for auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Otherwise, use the Clerk middleware
  return clerkMiddleware(request, {} as any);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};