"use client";

import { useEffect, useRef } from "react";

const REPEL_RADIUS = 160;
const REPEL = 2800;
const HOME_SPRING = 18;
const DAMPING = 1.8;
const MAX_SPEED = 420;
const DRIFT = 10;

function circumcircle(ax, ay, bx, by, cx, cy) {
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-8) {
    return null;
  }
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
  const rx = ux - ax;
  const ry = uy - ay;
  return { ux, uy, r2: rx * rx + ry * ry };
}

function uniqueEdges(bad) {
  const seen = new Map();
  function add(a, b) {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  for (let i = 0; i < bad.length; i += 1) {
    const t = bad[i];
    add(t[0], t[1]);
    add(t[1], t[2]);
    add(t[2], t[0]);
  }
  const edges = [];
  seen.forEach((count, key) => {
    if (count === 1) {
      const parts = key.split(":");
      edges.push([Number(parts[0]), Number(parts[1])]);
    }
  });
  return edges;
}

function triangulate(points) {
  const n = points.length;
  if (n < 3) {
    return [];
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = minX;
  let maxY = minY;
  for (let i = 1; i < n; i += 1) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }

  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;
  const dmax = Math.max(dx, dy) * 3;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const pts = points.concat([
    { x: midX - 2 * dmax, y: midY - dmax },
    { x: midX, y: midY + 2 * dmax },
    { x: midX + 2 * dmax, y: midY - dmax },
  ]);

  let triangles = [[n, n + 1, n + 2]];

  for (let i = 0; i < n; i += 1) {
    const bad = [];
    for (let t = 0; t < triangles.length; t += 1) {
      const tri = triangles[t];
      const circle = circumcircle(
        pts[tri[0]].x,
        pts[tri[0]].y,
        pts[tri[1]].x,
        pts[tri[1]].y,
        pts[tri[2]].x,
        pts[tri[2]].y,
      );
      if (!circle) {
        bad.push(tri);
        continue;
      }
      const ex = pts[i].x - circle.ux;
      const ey = pts[i].y - circle.uy;
      if (ex * ex + ey * ey <= circle.r2 + 1e-4) {
        bad.push(tri);
      }
    }

    const boundary = uniqueEdges(bad);
    triangles = triangles.filter((tri) => !bad.includes(tri));
    for (let e = 0; e < boundary.length; e += 1) {
      triangles.push([boundary[e][0], boundary[e][1], i]);
    }
  }

  return triangles.filter(
    (tri) => tri[0] < n && tri[1] < n && tri[2] < n,
  );
}

export function MeshField() {
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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mouse = { x: 0, y: 0, inside: false, influence: 0 };
    let nodes = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let lastTime = performance.now();

    function nodeCount(w, h) {
      return Math.round(Math.min(64, Math.max(28, (w * h) / 16000)));
    }

    function spawn(w, h) {
      const next = [];
      const count = nodeCount(w, h);
      const pad = 24;
      for (let i = 0; i < count; i += 1) {
        const x = pad + Math.random() * (w - pad * 2);
        const y = pad + Math.random() * (h - pad * 2);
        next.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
      nodes = next;
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
      if (sizeChanged || nodes.length === 0) {
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
      const dt = Math.min(0.033, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      mouse.influence += ((mouse.inside ? 1 : 0) - mouse.influence) * Math.min(1, dt * 10);

      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          const driftX = Math.sin(now / 1400 + node.phase) * DRIFT;
          const driftY = Math.cos(now / 1600 + node.phase) * DRIFT;
          let ax = (node.homeX + driftX - node.x) * HOME_SPRING;
          let ay = (node.homeY + driftY - node.y) * HOME_SPRING;

          if (mouse.influence > 0.01) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            if (dist < REPEL_RADIUS) {
              const force =
                REPEL * mouse.influence * (1 - dist / REPEL_RADIUS);
              ax += (dx / dist) * force;
              ay += (dy / dist) * force;
            }
          }

          node.vx += ax * dt;
          node.vy += ay * dt;
          const damp = Math.exp(-DAMPING * dt);
          node.vx *= damp;
          node.vy *= damp;
          const speed = Math.hypot(node.vx, node.vy);
          if (speed > MAX_SPEED) {
            node.vx *= MAX_SPEED / speed;
            node.vy *= MAX_SPEED / speed;
          }
          node.x += node.vx * dt;
          node.y += node.vy * dt;
        }
      }

      const meshPoints = nodes.slice();
      if (mouse.influence > 0.35) {
        meshPoints.push({ x: mouse.x, y: mouse.y, cursor: true });
      }
      const triangles = triangulate(meshPoints);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let t = 0; t < triangles.length; t += 1) {
        const [ia, ib, ic] = triangles[t];
        const a = meshPoints[ia];
        const b = meshPoints[ib];
        const c = meshPoints[ic];
        const mx = (a.x + b.x + c.x) / 3;
        const my = (a.y + b.y + c.y) / 3;
        const near = mouse.influence
          ? Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / 280)
          : 0;
        const touchesCursor = a.cursor || b.cursor || c.cursor;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();
        ctx.fillStyle = touchesCursor
          ? `rgba(167, 139, 250, ${0.07 + near * 0.08})`
          : `rgba(196, 181, 253, ${0.03 + near * 0.05})`;
        ctx.fill();
        ctx.strokeStyle = touchesCursor
          ? `rgba(233, 213, 255, ${0.28 + near * 0.25})`
          : `rgba(196, 181, 253, ${0.12 + near * 0.22})`;
        ctx.lineWidth = touchesCursor ? 1 : 0.8;
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const near = mouse.influence
          ? Math.max(0, 1 - Math.hypot(node.x - mouse.x, node.y - mouse.y) / 200)
          : 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 244, 245, ${0.35 + near * 0.45})`;
        ctx.arc(node.x, node.y, 1.4 + near * 0.8, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="audience-hero-field" aria-hidden="true" />;
}
