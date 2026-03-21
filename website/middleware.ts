import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function middleware(request: Request) {
  // Handle root path - redirect to default locale
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return Response.redirect(new URL('/en', request.url));
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
