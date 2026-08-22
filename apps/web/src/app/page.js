import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MeshField } from "@/components/MeshField";
import { PublicHeader, SiteFooter } from "@/components/SiteChrome";
import { StarField } from "@/components/StarField";

const PREP_STEPS = [
  "Early building blocks",
  "Math that unlocks models",
  "Science of systems",
  "Tech and computing",
  "Ready for formal AI",
];

const COURSE_FAMILIES = [
  {
    index: "01",
    title: "Preparatory mathematics",
    copy: "The quantitative habits young learners need before statistics, linear algebra, or model math show up in school.",
    unlocks: "Unlocks: measuring, patterns, and later model math",
  },
  {
    index: "02",
    title: "Preparatory sciences",
    copy: "How the physical world is observed, tested, and explained — the stance AI study will ask for later.",
    unlocks: "Unlocks: systems thinking and evidence",
  },
  {
    index: "03",
    title: "Preparatory tech / computing",
    copy: "Clear thinking with instructions, data, and tools — without assuming a programming class already happened.",
    unlocks: "Unlocks: computation as a craft",
  },
];

const RESOURCES = [
  {
    type: "Guide",
    title: "Step-up guides",
    copy: "For parents and educators: when to raise the difficulty, and what to introduce next.",
  },
  {
    type: "Practice",
    title: "Practice sets",
    copy: "Short student work tied to the foundations path — not a full course.",
  },
  {
    type: "Explainer",
    title: "Explainers and glossary",
    copy: "One idea at a time: what a model is, why algebra matters, how to talk about AI without the hype.",
  },
];

const ABOUT_CLAIMS = [
  "We teach how models work, not only how to prompt.",
  "We start before school offers the AI class.",
  "We steer. We are not the school district.",
];

const START_DOORS = [
  {
    id: "family",
    who: "Student / family",
    copy: "Join the foundations path. A parent can follow along.",
  },
  {
    id: "educator",
    who: "Educator",
    copy: "Request the curriculum map and pacing view.",
  },
  {
    id: "builder",
    who: "Builder",
    copy: "Get notified when the adult path opens.",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-grow-1 d-flex flex-column">
        <section className="home-hero d-flex flex-column justify-content-center">
          <StarField />
          <div className="container-xl home-hero-copy px-4 px-sm-3 py-5">
            <div className="row align-items-center g-4 g-lg-5">
              <div className="col-lg-7">
                <p className="home-hero-label mb-0">AI education</p>
                <h1 className="home-hero-title mt-3 mb-0">
                  Learn AI from first principles.
                </h1>
                <p className="home-hero-lead mt-4 mb-0">
                  Gravitix AI is a learning home for courses, paths, and
                  resources that help you understand how modern AI actually
                  works.
                </p>
              </div>
              <div className="col-lg-5 d-flex justify-content-center">
                <HeroSlideshow />
              </div>
            </div>
          </div>
        </section>

        <section className="audience-hero" id="audiences">
          <MeshField />
          <div className="container-xl audience-hero-copy px-4 px-sm-3 py-5">
            <p className="audience-hero-label mb-0">Students · Parents · Educators</p>
            <h2 className="audience-hero-title mt-3 mb-0">
              Start before the AI class exists.
            </h2>
            <p className="audience-hero-lead mt-3 mb-0">
              A path through the math, science, and tech that prepare young
              learners — and a map for the adults who guide them.
            </p>
            <div className="row g-3 g-md-4 mt-4">
              <div className="col-md-4">
                <div className="audience-door">
                  <span className="audience-door-who">Students</span>
                  <p className="audience-door-copy mb-0">
                    Learn the building blocks before school offers the AI
                    course.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="audience-door">
                  <span className="audience-door-who">Parents</span>
                  <p className="audience-door-copy mb-0">
                    Know when to step up, and where to steer next.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="audience-door">
                  <span className="audience-door-who">Educators</span>
                  <p className="audience-door-copy mb-0">
                    A curriculum map for pacing and placing students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section" id="paths">
          <div className="container-xl px-4 px-sm-3">
            <h2 className="home-section-title mb-0">Learning Paths</h2>
            <p className="home-section-copy mt-3 mb-0">
              A path, not a pile of videos. What to learn, in what order, and
              when to step up.
            </p>
            <div className="row g-4 mt-4">
              <div className="col-lg-7">
                <article className="catalog-card path-card-featured h-100">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span className="catalog-badge catalog-badge-live">
                      First path
                    </span>
                    <span className="catalog-kicker">Prep</span>
                  </div>
                  <h3 className="catalog-card-title mb-0">
                    AI-ready foundations
                  </h3>
                  <p className="catalog-card-copy mt-3 mb-0">
                    For students who do not yet have an AI course at school, and
                    for the parents and educators who pace them. Starts with
                    early math, science, and tech. Ends when a learner is ready
                    for formal AI study.
                  </p>
                  <ol className="path-steps mt-4 mb-0">
                    {PREP_STEPS.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              </div>
              <div className="col-lg-5">
                <article className="catalog-card h-100">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span className="catalog-badge">Coming next</span>
                    <span className="catalog-kicker">Builder</span>
                  </div>
                  <h3 className="catalog-card-title mb-0">Builder path</h3>
                  <p className="catalog-card-copy mt-3 mb-0">
                    For learners who already have enough schooling. Starts at
                    how models work. Ends at applied AI.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section" id="courses">
          <div className="container-xl px-4 px-sm-3">
            <h2 className="home-section-title mb-0">Courses</h2>
            <p className="home-section-copy mt-3 mb-0">
              Subject families for the foundations path. Individual titles will
              land here as they are written. Builder courses will live here too.
            </p>
            <div className="row g-4 mt-4">
              {COURSE_FAMILIES.map((course) => (
                <div className="col-md-4" key={course.index}>
                  <article className="catalog-card h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="catalog-index">{course.index}</span>
                      <span className="catalog-badge">Planned</span>
                    </div>
                    <h3 className="catalog-card-title mb-0">{course.title}</h3>
                    <p className="catalog-card-copy mt-3 mb-0">{course.copy}</p>
                    <p className="catalog-card-meta mt-3 mb-0">{course.unlocks}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" id="resources">
          <div className="container-xl px-4 px-sm-3">
            <h2 className="home-section-title mb-0">Resources</h2>
            <p className="home-section-copy mt-3 mb-0">
              The toolkit beside the path: guides for adults, practice for
              students, explainers for everyone.
            </p>
            <div className="row g-3 mt-4">
              {RESOURCES.map((resource) => (
                <div className="col-md-4" key={resource.type}>
                  <article className="catalog-card catalog-card-plain h-100">
                    <span className="catalog-kicker">{resource.type}</span>
                    <h3 className="catalog-card-title mt-2 mb-0">
                      {resource.title}
                    </h3>
                    <p className="catalog-card-copy mt-3 mb-0">
                      {resource.copy}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" id="about">
          <div className="container-xl px-4 px-sm-3">
            <h2 className="home-section-title mb-0">About</h2>
            <p className="home-section-copy mt-3 mb-4">
              For students, parents, educators, and builders who want the real
              foundations — not a prompt cheat sheet.
            </p>
            <ul className="about-claims mb-0">
              {ABOUT_CLAIMS.map((claim) => (
                <li key={claim}>{claim}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="start-section" id="get-started">
          <div className="container-xl px-4 px-sm-3 py-5">
            <h2 className="home-section-title mb-0">Get Started</h2>
            <p className="home-section-copy mt-3 mb-0">
              Enrollment is not open yet. Tell us who you are and we will notify
              you. Staff accounts use the separate login.
            </p>
            <div className="row g-3 g-md-4 mt-4">
              {START_DOORS.map((door) => (
                <div className="col-md-4" key={door.id}>
                  <div className="catalog-card h-100">
                    <h3 className="catalog-card-title mb-0">{door.who}</h3>
                    <p className="catalog-card-copy mt-3 mb-0">{door.copy}</p>
                    <label className="form-label mt-3" htmlFor={`notify-${door.id}`}>
                      Email
                    </label>
                    <input
                      className="form-control"
                      id={`notify-${door.id}`}
                      type="email"
                      autoComplete="email"
                      disabled
                      placeholder="you@example.com"
                    />
                    <button
                      className="btn btn-get-started w-100 mt-3"
                      type="button"
                      disabled
                    >
                      Get notified
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
