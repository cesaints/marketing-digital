"use client";

import * as React from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  ph: number;
  cool: number; // 0..1 (mistura azul/ciano)
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  len: number;
  w: number;
  hue: number;
};

type Props = {
  className?: string;

  starCount?: number;
  twinkle?: number;

  meteorRate?: number; // por segundo
  meteorSpeed?: number;

  tintHue?: number; // azul/ciano: 205..230 | roxo: 265..285
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function StarSky({
  className,
  starCount = 320,
  twinkle = 0.6,
  meteorRate = 0.14, // ~1 a cada 7s (média)
  meteorSpeed = 1.05,
  tintHue = 218, // mais azulado
}: Props) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const DPR = clamp(window.devicePixelRatio || 1, 1, 2);

    let w = 0;
    let h = 0;

    let raf = 0;
    let t0 = performance.now();

    const stars: Star[] = [];
    const meteors: Meteor[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const resize = () => {
      const iw = window.innerWidth;
      const ih = window.innerHeight;

      canvas.width = Math.floor(iw * DPR);
      canvas.height = Math.floor(ih * DPR);
      canvas.style.width = `${iw}px`;
      canvas.style.height = `${ih}px`;

      w = canvas.width;
      h = canvas.height;

      // re-seed stars
      stars.length = 0;

      // densidade proporcional à área com limites
      const area = (w * h) / (DPR * DPR);
      const target = clamp(Math.round((area / 7000) * (starCount / 320)), 220, 700);

      for (let i = 0; i < target; i++) {
        // raio com distribuição “natural”: muitas pequenas, poucas grandes
        const pick = Math.random();
        const r =
          (pick < 0.86 ? rand(0.5, 1.25) : rand(1.3, 2.2)) * DPR;

        const a =
          pick < 0.88 ? rand(0.08, 0.45) : rand(0.45, 0.95);

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          a,
          tw: rand(0.5, 1.7),
          ph: rand(0, Math.PI * 2),
          cool: Math.random(),
        });
      }

      ctx.clearRect(0, 0, w, h);
    };

    const spawnMeteor = () => {
      // entrando do topo ou da esquerda, indo pra baixo/direita
      const fromTop = Math.random() < 0.6;

      const x = fromTop ? rand(0.05 * w, 0.98 * w) : rand(-0.25 * w, 0.15 * w);
      const y = fromTop ? rand(-0.25 * h, 0.18 * h) : rand(0.05 * h, 0.55 * h);

      const base = (reduceMotion ? 0.6 : 1) * meteorSpeed;

      const vx = rand(950, 1500) * base * DPR;
      const vy = rand(520, 900) * base * DPR;

      // meteoro levemente mais “ciano” que as estrelas
      const hue = rand(tintHue - 8, tintHue + 14);

      meteors.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        len: rand(240, 520) * DPR,
        w: rand(1.1, 2.1) * DPR,
        hue,
      });
    };

    const drawBackgroundGlow = () => {
      // Glow que combina com seu theme: azul + um toque violeta
      const g1x = w * 0.30;
      const g1y = h * 0.18;
      const r1 = Math.min(w, h) * 0.9;

      const g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, r1);
      g1.addColorStop(0, `hsla(${tintHue}, 90%, 55%, 0.10)`);
      g1.addColorStop(0.55, `hsla(${tintHue}, 95%, 45%, 0.05)`);
      g1.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // segundo glow (violeta bem sutil)
      const violetHue = 272;
      const g2x = w * 0.12;
      const g2y = h * 0.12;
      const r2 = Math.min(w, h) * 0.75;

      const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, r2);
      g2.addColorStop(0, `hsla(${violetHue}, 90%, 55%, 0.06)`);
      g2.addColorStop(0.6, "rgba(0,0,0,0)");
      g2.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    const drawStars = (time: number) => {
      for (const s of stars) {
        const twk = reduceMotion
          ? 1
          : 1 + Math.sin(time * 0.001 * s.tw + s.ph) * 0.42 * twinkle;

        const alpha = clamp(s.a * twk, 0.03, 1);

        // mistura de tons: azul -> ciano, com ocasional roxinho sutil
        const hue = tintHue + s.cool * 10 - 4;

        ctx.fillStyle = `hsla(${hue}, 70%, 92%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // brilho em poucas estrelas (glow)
        if (s.a > 0.78) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = alpha * 0.22;
          ctx.fillStyle = `hsla(${hue}, 85%, 82%, 1)`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    const drawMeteors = (dt: number) => {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        m.x += m.vx * dt;
        m.y += m.vy * dt;

        m.life -= dt * (reduceMotion ? 1.25 : 1);

        const alpha = clamp(m.life, 0, 1);

        const vlen = Math.hypot(m.vx, m.vy) || 1;
        const nx = m.vx / vlen;
        const ny = m.vy / vlen;

        const x2 = m.x - nx * m.len;
        const y2 = m.y - ny * m.len;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const g = ctx.createLinearGradient(m.x, m.y, x2, y2);
        g.addColorStop(0, `hsla(${m.hue}, 95%, 88%, ${0.9 * alpha})`);
        g.addColorStop(0.25, `hsla(${m.hue}, 95%, 78%, ${0.35 * alpha})`);
        g.addColorStop(1, `hsla(${m.hue}, 95%, 70%, 0)`);

        ctx.strokeStyle = g;
        ctx.lineWidth = m.w;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // cabeça
        ctx.globalAlpha = 0.55 * alpha;
        ctx.fillStyle = `hsla(${m.hue}, 95%, 88%, 1)`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.w * 2.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (m.life <= 0 || m.x > w + m.len || m.y > h + m.len) {
          meteors.splice(i, 1);
        }
      }
    };

    const step = (time: number) => {
      const dt = clamp((time - t0) / 1000, 0, 0.05);
      t0 = time;

      ctx.clearRect(0, 0, w, h);

      drawBackgroundGlow();
      drawStars(time);

      if (!reduceMotion) {
        const rate = clamp(meteorRate, 0, 3);
        if (Math.random() < rate * dt) {
          if (meteors.length < 2) spawnMeteor();
        }
      }

      drawMeteors(dt);

      raf = requestAnimationFrame(step);
    };

    resize();
    t0 = performance.now();
    raf = requestAnimationFrame(step);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [starCount, twinkle, meteorRate, meteorSpeed, tintHue]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
