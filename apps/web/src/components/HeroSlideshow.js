"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  { id: "01", label: "Foundations", tone: "violet" },
  { id: "02", label: "Systems", tone: "slate" },
  { id: "03", label: "Applied", tone: "dusk" },
];

const DELAY_MS = 5000;
const EXIT_MS = 750;

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(null);
  const currentRef = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const from = currentRef.current;
      const next = (from + 1) % SLIDES.length;
      currentRef.current = next;
      setExiting(from);
      setCurrent(next);
    }, DELAY_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (exiting === null) {
      return undefined;
    }
    const timer = window.setTimeout(() => setExiting(null), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  return (
    <div
      className="home-hero-media"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >
      {SLIDES.map((slide, index) => {
        const className = [
          "home-hero-slide",
          `home-hero-slide-${slide.tone}`,
          index === current ? "is-active" : "",
          index === exiting ? "is-exiting" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={slide.id}
            className={className}
            aria-hidden={index !== current}
          >
            <span className="home-hero-slide-index">{slide.id}</span>
            <span className="home-hero-slide-label">{slide.label}</span>
          </div>
        );
      })}
    </div>
  );
}
