import { prisma } from "./prisma";

export async function logAudit({ ip, path, kind, detail }) {
  try {
    await prisma.auditEvent.create({
      data: {
        ip: ip || "unknown",
        path: path || "/",
        kind,
        detail: detail ? String(detail).slice(0, 500) : null,
      },
    });
  } catch (err) {
    console.error("audit log failed", err);
  }
}
