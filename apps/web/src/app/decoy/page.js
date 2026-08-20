import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { logAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/request";

export const dynamic = "force-dynamic";

export default async function DecoyPage({ searchParams }) {
  const params = await searchParams;
  const path = typeof params.from === "string" ? params.from : "/wp-login.php";
  const headerList = await headers();
  await logAudit({
    ip: getClientIp(headerList),
    path,
    kind: "wp_probe",
    detail: headerList.get("user-agent"),
  });
  notFound();
}
