import { PublicHeader, SiteFooter } from "@/components/SiteChrome";
import { readSessionFromCookieStore } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await readSessionFromCookieStore();

  return (
    <>
      <div className="staging-banner py-2 text-center">
        Staging site on gravitix.ai. collincad.org will cut over after later
        phases.
      </div>
      <PublicHeader session={session} />
      <main className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card card-section">
              <div className="card-body p-4 p-md-5">
                <h1 className="h2 mb-3">Collin Central Appraisal District</h1>
                <p className="lead">
                  This is the Phase 0 skeleton for the public website rebuild:
                  HTTPS, database, sessions, and staff logins with roles.
                </p>
                <p>
                  Pages, the document library, the cited chatbot, and HelpSpot
                  tickets come in later phases. Property search does not move
                  onto this server.
                </p>
                <a
                  className="btn btn-primary"
                  href="https://onlineportal.collincad.org"
                  rel="noopener noreferrer"
                >
                  Search property records
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-section">
              <div className="card-body p-4">
                <h2 className="h5">Staff</h2>
                <p className="mb-3">
                  Editors, publishers, and admins use in-app accounts on this
                  site. There is no Microsoft login.
                </p>
                <a className="btn btn-outline-secondary" href="/login">
                  Staff login
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
