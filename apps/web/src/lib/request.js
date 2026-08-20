export function getClientIp(headersList) {
  const cf = headersList.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const real = headersList.get("x-real-ip");
  if (real) return real.trim();

  return "unknown";
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
