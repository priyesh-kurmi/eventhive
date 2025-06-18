import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Get the current path and referrer
  const path = request.nextUrl.pathname;
  const referer = request.headers.get('referer') || '';
  
  // Create a storage key for bypassing onboarding check temporarily
  const skipOnboardingCheckCookie = request.cookies.get('skipOnboardingCheck');
  const shouldSkipOnboardingCheck = skipOnboardingCheckCookie?.value === 'true';
  
  // Check if we're coming from the onboarding page to dashboard
  const isComingFromOnboarding = referer.includes('/onboarding') && path.startsWith('/dashboard');
  
  // Skip onboarding check if either condition is true
  if (isComingFromOnboarding || shouldSkipOnboardingCheck) {
    // Allow access to dashboard without checking onboarding status
    return NextResponse.next();
  }
  
  // Protected routes require authentication
  const protectedRoutes = ['/dashboard', '/events/create'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  // Auth routes redirect to dashboard if already authenticated
  const authRoutes = ['/sign-in', '/sign-up'];
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  
  // Handle protected routes - redirect to sign-in if not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Redirect to dashboard if already authenticated and visiting auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  // Check if user needs onboarding
  const isOnboarded = token?.isOnboarded as boolean | undefined;
  if (isAuthenticated && !isOnboarded && path !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/create/:path*',
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/onboarding/:path*'
  ],
};