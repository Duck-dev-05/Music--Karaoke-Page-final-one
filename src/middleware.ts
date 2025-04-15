import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip auth check for public routes
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const sessionCookie = request.cookies.get('auth_session')

  if (!sessionCookie) {
    // Redirect to login if no session cookie
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Validate session cookie
    const session = JSON.parse(sessionCookie.value)
    if (!session.user) {
      throw new Error('Invalid session')
    }
    return NextResponse.next()
  } catch (error) {
    // Clear invalid cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_session')
    return response
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/profile/:path*'
  ]
}
