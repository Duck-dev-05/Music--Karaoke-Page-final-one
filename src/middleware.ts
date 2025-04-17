import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Routes configuration
const routes = {
  protected: ['/profile', '/settings', '/premium'],
  auth: ['/(auth)/login', '/(auth)/register', '/login', '/register'],
  public: ['/', '/songs', '/karaoke', '/search', '/favorites'],
  special: {
    favorites: '/favorites',
    playlists: '/playlists'
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const path = request.nextUrl.pathname
  
  // Get the callback URL from the search parameters
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')

  // Handle auth pages (login/register)
  if (routes.auth.some(route => path.startsWith(route))) {
    if (isAuthenticated) {
      // If user is authenticated and tries to access auth pages, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Handle playlists route
  if (path === routes.special.playlists || path.startsWith('/playlists/')) {
    if (!isAuthenticated) {
      // Redirect to login without auto-redirect
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Handle other protected routes
  if (routes.protected.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Special handling for favorites page
  if (path === routes.special.favorites) {
    // Allow access to favorites page for both authenticated and non-authenticated users
    // The page component will handle different views based on auth status
    return NextResponse.next()
  }

  // Allow access to public routes
  if (routes.public.some(route => path === route)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
}
