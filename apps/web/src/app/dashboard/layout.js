import { redirect } from "next/navigation";
import { DashboardHeader, SiteFooter } from "@/components/SiteChrome";
import { readSessionFromCookieStore } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const session = await readSessionFromCookieStore();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader session={session} />
      <main className="container py-4">{children}</main>
      <SiteFooter />
    </>
  );
}
