import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { hashPassword, validatePassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { canManageUsers, ROLES } from "@/lib/roles";
import { isSameOrigin, getClientIp } from "@/lib/request";
import { readSession, SESSION_COOKIE } from "@/lib/session";

function redirectUsers(request, params) {
  const url = new URL("/dashboard/users", request.url);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url);
}

export async function POST(request) {
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isSameOrigin(request)) {
    return redirectUsers(request, { error: "Request blocked." });
  }

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const role = String(form.get("role") || "");
  const password = String(form.get("password") || "");

  if (!name || !email) {
    return redirectUsers(request, { error: "Name and email are required." });
  }

  if (![ROLES.EDITOR, ROLES.PUBLISHER, ROLES.ADMIN].includes(role)) {
    return redirectUsers(request, { error: "Choose a valid role." });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return redirectUsers(request, { error: passwordError });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return redirectUsers(request, { error: "That email is already in use." });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await hashPassword(password),
    },
  });

  await logAudit({
    ip: getClientIp(request.headers),
    path: "/dashboard/users",
    kind: "user_create",
    detail: `${session.email} created ${email} (${role})`,
  });

  return redirectUsers(request, { created: "1" });
}
