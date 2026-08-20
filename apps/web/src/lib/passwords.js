import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const MAX_FAILURES_BEFORE_LOCK = 5;
const LOCK_MINUTES = 15;
const MIN_PASSWORD_LENGTH = 12;

export function validatePassword(password) {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function isLocked(user, now = new Date()) {
  return Boolean(user.lockedUntil && user.lockedUntil > now);
}

export async function recordLoginFailure(user) {
  const failedLoginCount = user.failedLoginCount + 1;
  const lockedUntil =
    failedLoginCount >= MAX_FAILURES_BEFORE_LOCK
      ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
      : user.lockedUntil;

  return prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount, lockedUntil },
  });
}

export async function recordLoginSuccess(user) {
  if (user.failedLoginCount === 0 && !user.lockedUntil) return user;
  return prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
}
