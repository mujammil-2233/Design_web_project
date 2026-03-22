import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Redirect / to /en/home
  if (url.pathname === '/') {
    url.pathname = '/en/home';
    return Response.redirect(url);
  }
  
  // Redirect /en, /hi, /mr to respective home pages
  if (url.pathname === '/en' || url.pathname === '/hi' || url.pathname === '/mr') {
    const locale = url.pathname.slice(1);
    url.pathname = `/${locale}/home`;
    return Response.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(hi|mr|en)/:path*'],
};
