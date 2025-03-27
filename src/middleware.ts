import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const isAuthenticated = request.cookies.get('auth-token')

  // Define protected routes
  const protectedRoutes = ['/playlist']

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    // Add the original URL as a parameter to redirect back after login
    redirectUrl.searchParams.set('from', path)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/playlist/:path*',
  ]
}
