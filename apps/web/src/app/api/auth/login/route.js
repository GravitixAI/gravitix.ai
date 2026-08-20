import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import {
  isLocked,
  recordLoginFailure,
  recordLoginSuccess,
  verifyPassword,
} from "@/lib/passwords";
import { isSameOrigin, getClientIp } from "@/lib/request";
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";

function safeNextPath(next) {
  if (typeof next !== "string" || !next.startsWith("/dashboard")) {
    return "/dashboard";
  }
  if (next.startsWith("//") || next.includes("://")) {
    return "/dashboard";
  }
  return next;
}

function redirectWithError(request, code) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", code);
  return NextResponse.redirect(url);
}

export async function POST(request) {
  const ip = getClientIp(request.headers);
  const form = await request.formData();
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") || "");
  const honeypot = String(form.get("company_url") || "").trim();
  const next = safeNextPath(form.get("next"));

  if (!isSameOrigin(request)) {
    await logAudit({ ip, path: "/login", kind: "login_origin_block" });
    return redirectWithError(request, "origin");
  }

  if (honeypot) {
    await logAudit({
      ip,
      path: "/login",
      kind: "honeypot",
      detail: honeypot.slice(0, 100),
    });
    return redirectWithError(request, "invalid");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await logAudit({ ip, path: "/login", kind: "login_fail", detail: email });
    return redirectWithError(request, "invalid");
  }

  if (isLocked(user)) {
    await logAudit({ ip, path: "/login", kind: "login_locked", detail: email });
    return redirectWithError(request, "locked");
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await recordLoginFailure(user);
    await logAudit({ ip, path: "/login", kind: "login_fail", detail: email });
    return redirectWithError(request, "invalid");
  }

  await recordLoginSuccess(user);
  const sessionId = await createSession(user);
  await logAudit({ ip, path: "/login", kind: "login_ok", detail: email });

  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions());
  return response;
}
