import { ROLE_LABELS } from "@/lib/roles";
import { readSessionFromCookieStore } from "@/lib/session";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await readSessionFromCookieStore();

  return (
    <>
      <h1 className="h3 mb-4">Welcome, {session?.name}</h1>
      <p className="text-secondary mb-4">
        Signed in as {ROLE_LABELS[session?.role]}. Phase 0 is accounts and
        roles only.
      </p>
      <div className="row g-3">
        <div className="col-md-6 col-lg-3">
          <div className="card card-section h-100">
            <div className="card-body">
              <h2 className="h6">Phase 0</h2>
              <p className="small mb-0">Logins and roles — live.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card card-section h-100">
            <div className="card-body">
              <h2 className="h6 text-secondary">Phase 1</h2>
              <p className="small mb-0">CMS pages and navigation.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card card-section h-100">
            <div className="card-body">
              <h2 className="h6 text-secondary">Phase 2</h2>
              <p className="small mb-0">Document library and publish flag.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card card-section h-100">
            <div className="card-body">
              <h2 className="h6 text-secondary">Phase 3–4</h2>
              <p className="small mb-0">Chatbot, HelpSpot API, n8n jobs.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
