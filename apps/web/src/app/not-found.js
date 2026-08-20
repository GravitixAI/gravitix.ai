import Link from "next/link";
import { PublicHeader, SiteFooter } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <PublicHeader />
      <main className="container-xl flex-grow-1 py-5 px-4">
        <h1 className="home-section-title">Page not found</h1>
        <p className="home-section-copy mt-3">
          The page you requested does not exist.
        </p>
        <Link className="btn btn-get-started mt-4" href="/">
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
