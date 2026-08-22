"use client";

import { useEffect, useRef } from "react";

const INFLUENCE = 280;
const ATTRACT = 5200;
const SWIRL = 3800;
const HOME_SPRING = 20;
const HOME_SPRING_NEAR = 3.5;
const DAMPING = 1.6;
const MAX_SPEED = 640;

export function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return undefined;
    }

    const mouse = { x: 0, y: 0, inside: false, influence: 0 };
    let stars = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let lastTime = performance.now();

    function starCount(w, h) {
      return Math.round(Math.min(130, Math.max(42, (w * h) / 9500)));
    }

    function spawn(w, h) {
      const next = [];
      const count = starCount(w, h);
      for (let i = 0; i < count; i += 1) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const bright = Math.random() < 0.14;
        next.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          r: bright ? 1.5 + Math.random() * 0.9 : 0.55 + Math.random() * 0.85,
          alpha: bright ? 0.55 + Math.random() * 0.3 : 0.22 + Math.random() * 0.38,
          hue: Math.random() < 0.28 ? "violet" : "white",
          phase: Math.random() * Math.PI * 2,
        });
      }
      stars = next;
    }

    function resize() {
      const bounds = host.getBoundingClientRect();
      const nextW = Math.max(1, Math.round(bounds.width));
      const nextH = Math.max(1, Math.round(bounds.height));
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const sizeChanged = nextW !== width || nextH !== height || nextDpr !== dpr;
      width = nextW;
      height = nextH;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (sizeChanged || stars.length === 0) {
        spawn(width, height);
      }
    }

    function readPointer(event) {
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      mouse.x = x;
      mouse.y = y;
      mouse.inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
    }

    function step(now) {
      const rawDt = (now - lastTime) / 1000;
      const dt = Math.min(0.033, Math.max(0.001, rawDt));
      lastTime = now;

      const target = mouse.inside ? 1 : 0;
      mouse.influence += (target - mouse.influence) * Math.min(1, dt * 10);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const near = Math.max(0, 1 - dist / INFLUENCE) * mouse.influence;
        const spring = HOME_SPRING_NEAR + (HOME_SPRING - HOME_SPRING_NEAR) * (1 - near);

        let ax = (star.homeX - star.x) * spring;
        let ay = (star.homeY - star.y) * spring;

        if (near > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const pull = ATTRACT * near * near;
          ax += nx * pull;
          ay += ny * pull;
          ax += -ny * SWIRL * near;
          ay += nx * SWIRL * near;
        }

        star.vx += ax * dt;
        star.vy += ay * dt;
        const damp = Math.exp(-DAMPING * dt);
        star.vx *= damp;
        star.vy *= damp;

        const speed = Math.hypot(star.vx, star.vy);
        if (speed > MAX_SPEED) {
          star.vx *= MAX_SPEED / speed;
          star.vy *= MAX_SPEED / speed;
        }

        star.x += star.vx * dt;
        star.y += star.vy * dt;

        const twinkle = 0.82 + 0.18 * Math.sin(now / 700 + star.phase);
        ctx.beginPath();
        ctx.fillStyle =
          star.hue === "violet"
            ? `rgba(167, 139, 250, ${star.alpha * twinkle})`
            : `rgba(244, 244, 245, ${star.alpha * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = window.requestAnimationFrame(step);
    }

    resize();
    lastTime = performance.now();
    frameId = window.requestAnimationFrame(step);

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    window.addEventListener("pointermove", readPointer, { passive: true });
    window.addEventListener("pointerleave", readPointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("pointermove", readPointer);
      window.removeEventListener("pointerleave", readPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="home-hero-field"
      aria-hidden="true"
    />
  );
}
