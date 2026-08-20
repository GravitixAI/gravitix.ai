import { PublicHeader, SiteFooter } from "@/components/SiteChrome";

const SECTIONS = [
  {
    id: "courses",
    title: "Courses",
    copy: "Course catalog coming next.",
  },
  {
    id: "paths",
    title: "Learning Paths",
    copy: "Guided paths from fundamentals to applied AI.",
  },
  {
    id: "resources",
    title: "Resources",
    copy: "Reference material, glossaries, and practice sets.",
  },
  {
    id: "about",
    title: "About",
    copy: "Gravitix AI exists to make serious AI education clear, structured, and usable.",
  },
  {
    id: "get-started",
    title: "Get Started",
    copy: "Enrollment and onboarding will live here.",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-grow-1 d-flex flex-column">
        <section className="container-xl home-hero d-flex flex-column justify-content-center px-4 px-sm-3 py-5">
          <p className="home-hero-label mb-0">AI education</p>
          <h1 className="home-hero-title mt-3 mb-0">
            Learn AI from first principles.
          </h1>
          <p className="home-hero-lead mt-4 mb-0">
            Gravitix AI is a learning home for courses, paths, and resources
            that help you understand how modern AI actually works.
          </p>
        </section>

        {SECTIONS.map((section) => (
          <section className="home-section" id={section.id} key={section.id}>
            <div className="container-xl px-4 px-sm-3">
              <h2 className="home-section-title mb-0">{section.title}</h2>
              <p className="home-section-copy mt-3 mb-0">{section.copy}</p>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
