import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { i18n } from './config';

function getLocale(request: NextRequest) {
  console.log("🌍 [getLocale] Starting locale detection")

  // 1. Check cookie first for user preference
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  console.log("🌍 [getLocale] Cookie locale:", cookieLocale)
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    console.log("🌍 [getLocale] Using cookie locale:", cookieLocale)
    return cookieLocale;
  }

  // 2. Get Accept-Language header
  const acceptLanguageHeader = request.headers.get('accept-language') ?? '';
  console.log("🌍 [getLocale] Accept-Language header:", acceptLanguageHeader)
  const headers = {
    'accept-language': acceptLanguageHeader,
  };

  // Use negotiator to parse preferred languages
  const languages = new Negotiator({ headers }).languages();
  console.log("🌍 [getLocale] Parsed languages:", languages)

  // Match against supported locales
  const matchedLocale = match(languages, i18n.locales, i18n.defaultLocale);
  console.log("🌍 [getLocale] Matched locale:", matchedLocale)
  return matchedLocale;
}

export function localizationMiddleware(request: NextRequest) {
  console.log("🌍 [LocalizationMiddleware] === DEBUG START ===")
  const { pathname } = request.nextUrl;
  console.log("🌍 [LocalizationMiddleware] Original pathname:", pathname)
  console.log("🌍 [LocalizationMiddleware] Request URL:", request.url)
  console.log("🌍 [LocalizationMiddleware] nextUrl.href:", request.nextUrl.href)

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  console.log("🌍 [LocalizationMiddleware] pathnameHasLocale:", pathnameHasLocale)

  // If locale exists in URL, continue
  if (pathnameHasLocale) {
    console.log("🌍 [LocalizationMiddleware] Locale exists, continuing")
    return NextResponse.next();
  }

  // Get best matching locale
  const locale = getLocale(request);
  console.log("🌍 [LocalizationMiddleware] Detected locale:", locale)

  // Redirect to localized URL
  console.log("🌍 [LocalizationMiddleware] Original nextUrl.pathname:", request.nextUrl.pathname)
  request.nextUrl.pathname = `/${locale}${pathname}`;
  console.log("🌍 [LocalizationMiddleware] Modified nextUrl.pathname:", request.nextUrl.pathname)
  console.log("🌍 [LocalizationMiddleware] Full nextUrl after modification:", request.nextUrl.href)

  try {
    const response = NextResponse.redirect(request.nextUrl);
    console.log("🌍 [LocalizationMiddleware] Redirect response created successfully")

    // Set cookie for future visits
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log("🌍 [LocalizationMiddleware] === DEBUG END ===")
    return response;
  } catch (error) {
    console.error("🚨 [LocalizationMiddleware] ERROR creating redirect:", error)
    console.error("🚨 [LocalizationMiddleware] request.nextUrl:", request.nextUrl)
    console.error("🚨 [LocalizationMiddleware] request.nextUrl.href:", request.nextUrl.href)
    throw error
  }
}