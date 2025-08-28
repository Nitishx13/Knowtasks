import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/home',
    '/login',
    '/register',
    '/api/(.*)'
  ],
  afterAuth(auth, req, evt) {
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


