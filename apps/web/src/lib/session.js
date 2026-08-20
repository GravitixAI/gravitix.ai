import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getRedis } from "./redis";

export const SESSION_COOKIE = "ccad_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function sessionKey(id) {
  return `session:${id}`;
}

export async function createSession(user) {
  const id = randomBytes(32).toString("hex");
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await getRedis().set(sessionKey(id), payload, "EX", SESSION_TTL_SECONDS);
  return id;
}

export async function readSessionFromCookieStore() {
  try {
    const jar = await cookies();
    const id = jar.get(SESSION_COOKIE)?.value;
    if (!id) return null;
    return readSession(id);
  } catch {
    return null;
  }
}

export async function readSession(id) {
  if (!id || id.length < 32) return null;
  const redis = getRedis();
  const raw = await redis.get(sessionKey(id));
  if (!raw) return null;
  await redis.expire(sessionKey(id), SESSION_TTL_SECONDS);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function destroySession(id) {
  if (id) {
    await getRedis().del(sessionKey(id));
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
