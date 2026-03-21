import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root path - redirect to English home
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en/home', request.url));
  }
  
  // Check if pathname starts with a valid locale
  const locales = ['en', 'hi', 'mr'];
  const pathLocale = pathname.split('/')[1];
  
  // If no locale prefix, redirect to English version
  if (!locales.includes(pathLocale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }
  
  // Set locale cookie
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', pathLocale, { path: '/', sameSite: 'lax' });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
