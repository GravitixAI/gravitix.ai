import { NextResponse } from "next/server";

const DECOY_PATHS = [
  /^\/wp-login\.php$/i,
  /^\/xmlrpc\.php$/i,
  /^\/wp-admin(\/|$)/i,
  /^\/wordpress(\/|$)/i,
  /^\/wp-includes(\/|$)/i,
  /^\/wp-content(\/|$)/i,
];

export function isDecoyPath(pathname) {
  return DECOY_PATHS.some((re) => re.test(pathname));
}

function applySecurityHeaders(request, response) {
  const path = request.nextUrl.pathname;
  const onDashboard = path === "/dashboard" || path.startsWith("/dashboard/");

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("X-Frame-Options", onDashboard ? "DENY" : "SAMEORIGIN");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com",
      "img-src 'self' data:",
      "font-src 'self' https://cdn.jsdelivr.net",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return response;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isDecoyPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/decoy";
    url.searchParams.set("from", pathname);
    return applySecurityHeaders(request, NextResponse.rewrite(url));
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const session = request.cookies.get("ccad_session")?.value;
    if (!session) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", pathname);
      return applySecurityHeaders(request, NextResponse.redirect(login));
    }
  }

  if (pathname === "/login" && request.cookies.get("ccad_session")?.value) {
    const dashboard = request.nextUrl.clone();
    dashboard.pathname = "/dashboard";
    return applySecurityHeaders(request, NextResponse.redirect(dashboard));
  }

  return applySecurityHeaders(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
