import { authMiddleware, createRouteMatcher } from "@clerk/nextjs";

const isLoginPage = createRouteMatcher(['/login(.*)']);
const isRegisterPage = createRouteMatcher(['/register(.*)']);

// Check if test auth is enabled (works in both development and production)
const useTestAuth = process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/home',
    '/login(.*)',
    '/register(.*)',
    // When test auth is enabled, make dashboard and data API routes public
    ...(useTestAuth ? [
      '/dashboard(.*)',
      '/api/data/(.*)'
    ] : []),
    // Only make non-data API routes public when test auth is disabled
    '/api/(?!data)(.*)'
  ],
  afterAuth(auth, req, evt) {
    // When test auth is enabled, bypass authentication checks
    if (useTestAuth) {
      // Allow access to all routes when test auth is enabled
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


