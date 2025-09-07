import { authMiddleware, createRouteMatcher } from "@clerk/nextjs";

const isLoginPage = createRouteMatcher(['/login(.*)']);
const isRegisterPage = createRouteMatcher(['/register(.*)']);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const useTestAuth = process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/home',
    '/login(.*)',
    '/register(.*)',
    // In development mode with test auth, make dashboard and data API routes public
    ...(isDevelopment && useTestAuth ? [
      '/dashboard(.*)',
      '/api/data/(.*)'
    ] : []),
    // Only make non-data API routes public in production
    '/api/(?!data)(.*)'
  ],
  afterAuth(auth, req, evt) {
    // For development with test auth, bypass authentication checks
    if (isDevelopment && useTestAuth) {
      // Allow access to all routes in development with test auth
      return;
    }
    
    // Redirect signed-in users away from login/register
    const url = new URL(req.nextUrl.origin + req.nextUrl.pathname);
    if (auth.userId && (url.pathname.startsWith('/login') || url.pathname.startsWith('/register'))) {
      url.pathname = '/dashboard';
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.\w+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};


