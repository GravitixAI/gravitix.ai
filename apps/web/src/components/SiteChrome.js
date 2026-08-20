import { ROLE_LABELS } from "@/lib/roles";

export function PublicHeader({ session }) {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-md navbar-dark">
        <div className="container">
          <a className="navbar-brand fw-semibold" href="/">
            Collin CAD
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://onlineportal.collincad.org"
                  rel="noopener noreferrer"
                >
                  Property search
                </a>
              </li>
              <li className="nav-item">
                {session ? (
                  <a className="nav-link" href="/dashboard">
                    Dashboard ({ROLE_LABELS[session.role] || session.role})
                  </a>
                ) : (
                  <a className="nav-link" href="/login">
                    Staff login
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function DashboardHeader({ session }) {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-md navbar-dark">
        <div className="container">
          <a className="navbar-brand fw-semibold" href="/dashboard">
            Staff dashboard
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#dashNav"
            aria-controls="dashNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="dashNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">
                  Overview
                </a>
              </li>
              {session?.role === "ADMIN" ? (
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard/users">
                    Users
                  </a>
                </li>
              ) : null}
            </ul>
            <div className="d-flex align-items-center gap-3">
              <span className="navbar-text text-white-50 small">
                {session?.email} · {ROLE_LABELS[session?.role] || session?.role}
              </span>
              <form method="post" action="/api/auth/logout">
                <button className="btn btn-sm btn-outline-light" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer mt-auto py-4">
      <div className="container small text-center">
        <div>Collin Central Appraisal District</div>
        <div className="text-secondary">
          Staging on gravitix.ai. Property search, protests, and owner accounts
          stay on the taxpayer portal.
        </div>
      </div>
    </footer>
  );
}
