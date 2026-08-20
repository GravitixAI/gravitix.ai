import { NextResponse } from "next/server";
import {
  destroySession,
  SESSION_COOKIE,
} from "@/lib/session";

export async function POST(request) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  await destroySession(sessionId);
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
