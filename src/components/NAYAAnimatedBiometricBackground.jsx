import React, { useEffect, useRef } from "react";

/**
 * NAYAAnimatedBiometricBackground.jsx (Universal Tech Theme)
 * --------------------------------------------------------------
 * Fullscreen animated background that blends a static hero image
 * (imageUrl) with a dynamic "universal technology" vibe:
 * - Circuit/grid lines (hardware feel)
 * - Network graph with pulsing nodes & links
 * - Rotating globe wireframe (global scale)
 * - Data sweep beam & lightweight packet particles
 *
 * Keeps the same API as the previous biometric version to avoid breaking changes.
 *
 * Props:
 *  - imageUrl: string (path to background image in /public)
 *  - primary: string (hex accent color)
 *  - secondary: string (hex accent color 2)
 *  - density: number (0.5..2) amount of elements
 *  - speed: number (0.5..2) animation speed
 *  - overlayOpacity: number (0..1) dark overlay for text contrast
 */
export default function NAYAAnimatedBiometricBackground({
  imageUrl = "/bg/fingeriris1.png", // ganti ke /bg/tech-universal.jpg jika punya
  primary = "#38bdf8",
  secondary = "#a78bfa",
  density = 1,
  speed = 1,
  overlayOpacity = 0.55,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = 0,
      h = 0,
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onResize = () => resize();
    resize();
    window.addEventListener("resize", onResize);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let paused = document.hidden || prefersReducedMotion;
    const onVisibilityChange = () => {
      paused = document.hidden || prefersReducedMotion;
      if (!paused) {
        last = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ---- Assets
    const img = new Image();
    img.src = imageUrl;

    // ---- Scene data -------------------------------------------------
    // Network graph (nodes + links)
    const NODE_COUNT = Math.floor(18 * density);
    const nodes = new Array(NODE_COUNT).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.2 + Math.random() * 1.8,
      t: Math.random() * 1000, // phase for pulse
    }));
    // build sparse links: each node connects to k random others
    const K = 2;
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let k = 0; k < K; k++) {
        const j = Math.floor(Math.random() * nodes.length);
        if (j !== i) links.push([i, j, Math.random() * 1]);
      }
    }

    // Packet-like particles (small squares drifting)
    const PACKETS = Math.floor(70 * density);
    const packets = new Array(PACKETS).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: (0.2 + Math.random() * 0.8) * speed, // speed
      sz: 0.8 + Math.random() * 1.8, // size
      dir: Math.random() * Math.PI * 2,
      hueMix: Math.random(),
    }));

    // Grid spacing
    const GRID = Math.max(24, Math.min(42, 36 / Math.sqrt(density)));

    // Globe parameters
    const globe = {
      cx: () => w * 0.65,
      cy: () => h * 0.55,
      r: () => Math.min(w, h) * 0.42,
    };

    const mix = (c1, c2, t) => {
      const p = (h) => [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
      ];
      const [r1, g1, b1] = p(c1),
        [r2, g2, b2] = p(c2);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      return `rgb(${r},${g},${b})`;
    };

    // ---- Draw helpers -----------------------------------------------
    const drawImageLayer = (now) => {
      const driftX = Math.sin((now / 8000) * speed) * 10;
      const driftY = Math.cos((now / 9000) * speed) * 8;

      if (img.complete && img.naturalWidth > 0) {
        const ratio = Math.max(w / img.width, h / img.height);
        const iw = img.width * ratio;
        const ih = img.height * ratio;
        const ix = (w - iw) / 2 + driftX;
        const iy = (h - ih) / 2 + driftY;
        ctx.drawImage(img, ix, iy, iw, ih);
      } else {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#07121f");
        grad.addColorStop(1, "#0b1730");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // dark overlay for contrast
      ctx.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
      ctx.fillRect(0, 0, w, h);
    };

    const drawCircuitGrid = (now) => {
      ctx.save();
      ctx.lineWidth = 1;
      const t = (now / 1200) * speed;
      for (let x = 0; x < w; x += GRID) {
        const alpha = 0.04 + 0.03 * Math.sin(t + x * 0.02);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += GRID) {
        const alpha = 0.04 + 0.03 * Math.cos(t + y * 0.02);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // occasional glowing junctions
      for (let i = 0; i < 18 * density; i++) {
        const gx = Math.floor(Math.random() * (w / GRID)) * GRID + GRID / 2;
        const gy = Math.floor(Math.random() * (h / GRID)) * GRID + GRID / 2;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `${primary}66`;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawNetworkGraph = (now) => {
      const pulse = 0.5 + 0.5 * Math.sin((now / 700) * speed);
      // links
      links.forEach(([a, b, wgt]) => {
        const na = nodes[a];
        const nb = nodes[b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + wgt * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      // nodes
      nodes.forEach((n, i) => {
        n.t += 0.02 * speed;
        const sz = n.r + Math.sin(n.t) * 0.6 * (i % 3 === 0 ? 1.2 : 1);
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, sz), 0, Math.PI * 2);
        ctx.fillStyle = mix(primary, secondary, pulse);
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const drawGlobeWireframe = (now) => {
      const cx = globe.cx();
      const cy = globe.cy();
      const r = globe.r();
      const rot = ((now / 6000) * speed) % (Math.PI * 2);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;

      // longitudes
      for (let i = -5; i <= 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 12);
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // latitudes
      for (let j = -3; j <= 3; j++) {
        const rr = r * Math.cos((j * Math.PI) / 8);
        ctx.beginPath();
        ctx.ellipse(0, 0, rr, rr * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // equator glow
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${primary}44`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawDataSweep = (now) => {
      const angle = ((now / 3000) * speed) % (Math.PI * 2);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(angle);
      const grd = ctx.createLinearGradient(-w, 0, w, 0);
      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(0.5, `${secondary}22`);
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(-w, -h, w * 2, h * 2);
      ctx.restore();
    };

    const drawPackets = (dt) => {
      packets.forEach((p) => {
        p.x += Math.cos(p.dir) * p.s * (dt / 16);
        p.y += Math.sin(p.dir) * p.s * (dt / 16);
        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.dir);
        ctx.fillStyle = mix(primary, secondary, p.hueMix);
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz);
        ctx.globalAlpha = 1;
        ctx.restore();
      });
    };

    let last = performance.now();
    const loop = (now) => {
      if (paused) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = now - last;
      last = now;

      // clear
      ctx.clearRect(0, 0, w, h);

      // layers
      drawImageLayer(now);
      drawCircuitGrid(now);
      drawNetworkGraph(now);
      drawGlobeWireframe(now);
      drawDataSweep(now);
      drawPackets(dt);

      // subtle vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.6, w / 2, h / 2, Math.max(w, h));
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.3)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [density, imageUrl, overlayOpacity, primary, secondary, speed]);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* top/bottom gradients for readability over content */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
    </div>
  );
}
