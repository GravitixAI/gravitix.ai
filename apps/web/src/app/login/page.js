import { PublicHeader, SiteFooter } from "@/components/SiteChrome";
import { readSessionFromCookieStore } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff login" };

export default async function LoginPage({ searchParams }) {
  const session = await readSessionFromCookieStore();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const next = typeof params.next === "string" ? params.next : "/dashboard";

  const messages = {
    invalid: "Invalid email or password.",
    locked: "Too many attempts. Try again later.",
    origin: "This login request was blocked.",
  };

  return (
    <>
      <PublicHeader session={session} />
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card card-section">
              <div className="card-body p-4">
                <h1 className="h4 mb-3">Staff login</h1>
                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {messages[error] || messages.invalid}
                  </div>
                ) : null}
                <form method="post" action="/api/auth/login" autoComplete="on">
                  <input type="hidden" name="next" value={next} />
                  <div className="honeypot" aria-hidden="true">
                    <label htmlFor="company_url">Company website</label>
                    <input
                      id="company_url"
                      name="company_url"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="form-control"
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <button className="btn btn-primary w-100" type="submit">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
