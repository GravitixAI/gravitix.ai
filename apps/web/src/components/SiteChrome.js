import Link from "next/link";

const NAV_LINKS = [
  { href: "/#audiences", label: "Students" },
  { href: "/#paths", label: "Learning Paths" },
  { href: "/#courses", label: "Courses" },
  { href: "/#resources", label: "Resources" },
  { href: "/#about", label: "About" },
];

function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="logo-mark">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.25"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="5.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.25"
        transform="rotate(-24 16 16)"
      />
      <circle cx="16" cy="16" r="3.25" fill="currentColor" />
      <circle cx="26.5" cy="12" r="1.4" fill="#c4b5fd" />
    </svg>
  );
}

export function PublicHeader() {
  return (
    <header className="site-header">
      <nav aria-label="Primary" className="navbar navbar-dark navbar-expand-md">
        <div className="container-xl d-flex flex-wrap align-items-center justify-content-between gap-3 py-2">
          <Link
            className="navbar-brand d-flex align-items-center gap-2"
            href="/"
          >
            <LogoMark />
            Gravitix AI
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primaryNav"
            aria-controls="primaryNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="primaryNav">
            <ul className="navbar-nav ms-md-auto align-items-md-center gap-md-2">
              {NAV_LINKS.map((link) => (
                <li className="nav-item" key={link.href}>
                  <Link className="nav-link px-md-3" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item ms-md-2 mt-3 mt-md-0">
                <Link
                  className="btn btn-get-started w-100 w-md-auto"
                  href="/#get-started"
                >
                  Get Started
                </Link>
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
      <nav className="navbar navbar-dark navbar-expand-md">
        <div className="container-xl">
          <Link className="navbar-brand" href="/dashboard">
            Gravitix AI · Admin
          </Link>
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
                <Link className="nav-link" href="/dashboard">
                  Overview
                </Link>
              </li>
              {session?.role === "ADMIN" ? (
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard/users">
                    Users
                  </Link>
                </li>
              ) : null}
            </ul>
            <div className="d-flex align-items-center gap-3 pb-3 pb-md-0">
              <span className="navbar-text text-muted-gx small">
                {session?.email}
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
      <div className="container-xl small text-center">
        <div className="font-display fw-semibold text-light">Gravitix AI</div>
        <div className="mt-1">
          AI education for builders who want to understand how models work.
        </div>
      </div>
    </footer>
  );
}
