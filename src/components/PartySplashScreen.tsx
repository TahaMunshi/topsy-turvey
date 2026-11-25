import React, { useCallback, useEffect, useRef, useState } from "react";
import { BranchInfo } from "../constants/topsyData";

interface PartySplashScreenProps {
  branch: BranchInfo;
  onComplete: () => void;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  shape: "rect" | "circle" | "ribbon" | "star";
  wobblePhase: number;
  wobbleSpeed: number;
  alpha: number;
}

const BRAND_CONFETTI_COLORS = [
  "#E31E3C",
  "#F28C28",
  "#F7D41B",
  "#1FA246",
  "#1BA0DE",
  "#6A3A97",
  "#E83E8C",
];

const FLOATING_BALLOONS = [
  { left: "7%", top: "16%", color: "#E83E8C", delay: "0s", size: 46 },
  { left: "16%", top: "68%", color: "#1BA0DE", delay: "0.6s", size: 38 },
  { left: "86%", top: "18%", color: "#F7D41B", delay: "0.3s", size: 48 },
  { left: "78%", top: "64%", color: "#1FA246", delay: "0.9s", size: 42 },
  { left: "48%", top: "10%", color: "#F28C28", delay: "0.45s", size: 36 },
];

const PartyPopperSvg: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const isRight = side === "right";
  return (
    <svg
      viewBox="0 0 120 120"
      className={`w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-lg ${
        isRight ? "-scale-x-100" : ""
      }`}
      aria-hidden="true"
    >
      {/* Popper Cone Body */}
      <g transform="rotate(-12 60 60)">
        <polygon
          points="18,98 54,28 90,64"
          fill="#F7D41B"
          stroke="#1F2A5A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Playful Diagonal Stripes */}
        <path
          d="M34 68 L52 84 M44 48 L72 74"
          stroke="#E31E3C"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M40 58 L62 79"
          stroke="#1BA0DE"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Rim */}
        <ellipse
          cx="72"
          cy="46"
          rx="25"
          ry="9"
          transform="rotate(45 72 46)"
          fill="#E83E8C"
          stroke="#1F2A5A"
          strokeWidth="3.5"
        />
        {/* Pop Sparks */}
        <circle cx="96" cy="22" r="5" fill="#1FA246" />
        <circle cx="108" cy="38" r="4" fill="#1BA0DE" />
        <circle cx="84" cy="12" r="4" fill="#E31E3C" />
        <path
          d="M90 34 Q102 22 110 18"
          stroke="#F28C28"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export const PartySplashScreen: React.FC<PartySplashScreenProps> = ({
  branch,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [exiting, setExiting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const dismissedRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setExiting(true);
    window.setTimeout(() => {
      onCompleteRef.current();
    }, 360);
  }, []);

  // Progress bar + auto-exit over ~1900ms
  useEffect(() => {
    const start = performance.now();
    const duration = 1900;
    let rafId = 0;

    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          handleDismiss();
        }, 160);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [handleDismiss]);

  // Real Canvas Party-Popper Confetti Burst
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: ConfettiParticle[] = [];
    const shapes: ConfettiParticle["shape"][] = [
      "rect",
      "circle",
      "ribbon",
      "star",
    ];

    const emitBurst = (countPerSide: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const leftOrigin = { x: w * 0.12, y: h * 0.78 };
      const rightOrigin = { x: w * 0.88, y: h * 0.78 };

      const spawnFrom = (origin: { x: number; y: number }, dirX: number) => {
        for (let i = 0; i < countPerSide; i++) {
          const angle = -Math.PI / 2 + dirX * (0.18 + Math.random() * 0.65);
          const speed = 9 + Math.random() * 11;
          particles.push({
            x: origin.x,
            y: origin.y,
            vx: Math.cos(angle) * speed + dirX * (2 + Math.random() * 4),
            vy: Math.sin(angle) * speed - Math.random() * 4,
            size: 6 + Math.random() * 7,
            color:
              BRAND_CONFETTI_COLORS[
                Math.floor(Math.random() * BRAND_CONFETTI_COLORS.length)
              ],
            rotation: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.22,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.08 + Math.random() * 0.08,
            alpha: 1,
          });
        }
      };

      spawnFrom(leftOrigin, 1);
      spawnFrom(rightOrigin, -1);
    };

    // Initial party popper blast + celebratory second pop
    emitBurst(46);
    const secondBurstTimer = window.setTimeout(() => emitBurst(34), 420);

    let rafId = 0;
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.28; // gravity
        p.vx *= 0.985; // air drag
        p.vy *= 0.99;
        p.wobblePhase += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobblePhase) * 0.9;
        p.y += p.vy;
        p.rotation += p.vr;

        if (p.y > h + 40) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.fillRect(-p.size * 0.22, -p.size * 0.8, p.size * 0.44, p.size * 1.6);
        } else {
          // 4-point sparkle star
          const r = p.size * 0.55;
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            const a = (s * Math.PI) / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.lineTo(
              Math.cos(a + Math.PI / 4) * (r * 0.38),
              Math.sin(a + Math.PI / 4) * (r * 0.38)
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(secondBurstTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      onClick={handleDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          handleDismiss();
        }
      }}
      aria-label="Enter Topsy Turvy"
      className={`fixed inset-0 z-50 h-[100dvh] bg-[#FFFBF5] text-[#1F2A5A] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none cursor-pointer transition-all duration-350 ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Top Rainbow Strip */}
      <div className="absolute top-0 inset-x-0 h-1.5 tt-rainbow-bar z-20" />

      {/* Pastel Ambient Corner Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F7D41B]/25 blur-[90px]" />
        <div className="absolute -top-20 -right-24 w-96 h-96 rounded-full bg-[#1BA0DE]/20 blur-[90px]" />
        <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full bg-[#E83E8C]/20 blur-[90px]" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-[#1FA246]/20 blur-[90px]" />

        {/* Gently Floating Pastel Balloons */}
        {FLOATING_BALLOONS.map((b, idx) => (
          <div
            key={idx}
            style={{
              left: b.left,
              top: b.top,
              animation: `ttFloatBalloon 3.8s ease-in-out ${b.delay} infinite`,
            }}
            className="absolute opacity-35"
          >
            <div
              style={{
                width: b.size,
                height: b.size * 1.18,
                backgroundColor: b.color,
              }}
              className="rounded-full shadow-inner relative"
            >
              <div className="absolute top-2 left-2.5 w-2.5 h-4 rounded-full bg-white/45 rotate-[-20deg]" />
              <div
                className="w-[1.5px] h-8 bg-[#1F2A5A]/30 mx-auto"
                style={{ marginTop: b.size * 1.18 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Real Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10"
      />

      {/* Top Greeting Bar */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-between text-xs font-heading font-bold text-[#1F2A5A]">
        <span>Topsy Turvy</span>
        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-[#1F2A5A]">
          {branch.shortName}
        </span>
      </div>

      {/* Center Celebration Stage */}
      <div className="relative z-20 my-auto flex flex-col items-center text-center max-w-xl px-4">
        {/* Official Wordmark with Elastic Pop */}
        <div style={{ animation: "ttElasticPop 680ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
          <img
            src="/images/brand/topsy-turvy-wordmark.png"
            alt="Topsy Turvy: Play, Learn, Celebrate"
            className="h-[clamp(4.5rem,16vh,9.5rem)] w-auto object-contain drop-shadow-[0_14px_28px_rgba(31,42,90,0.14)]"
          />
        </div>

        {/* Staggered PLAY • LEARN • CELEBRATE Pills */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { label: "PLAY", color: "#E31E3C", delay: "100ms" },
            { label: "LEARN", color: "#1FA246", delay: "220ms" },
            { label: "CELEBRATE", color: "#1BA0DE", delay: "340ms" },
          ].map((pill) => (
            <span
              key={pill.label}
              style={{
                backgroundColor: pill.color,
                animation: `ttElasticPop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) ${pill.delay} both`,
              }}
              className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider shadow-md"
            >
              {pill.label}
            </span>
          ))}
        </div>

        <h2 className="mt-3 sm:mt-4 font-heading text-lg sm:text-2xl font-extrabold text-[#1F2A5A]">
          Welcome to {branch.shortName}!
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {branch.hoursSummary} • Fun, safe indoor play &amp; parties
        </p>

        {/* Candy-Bright Rainbow Progress Bar */}
        <div className="w-56 sm:w-64 h-2.5 bg-slate-200/80 rounded-full mt-4 sm:mt-5 overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full tt-rainbow-bar transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flanking Party Poppers (Bottom Left & Bottom Right) */}
      <div
        className="pointer-events-none absolute bottom-6 left-3 sm:left-10 z-20"
        style={{ animation: "ttPopperKick 700ms ease-out forwards" }}
      >
        <PartyPopperSvg side="left" />
      </div>
      <div
        className="pointer-events-none absolute bottom-6 right-3 sm:right-10 z-20"
        style={{ animation: "ttPopperKickRight 700ms ease-out forwards" }}
      >
        <PartyPopperSvg side="right" />
      </div>

      {/* Bottom Tap Hint */}
      <div className="relative z-20 text-xs font-heading font-bold text-[#1F2A5A]/75">
        Tap anywhere to jump right in 🎉
      </div>

      <style>{`
        @keyframes ttElasticPop {
          0% { opacity: 0; transform: scale(0.65) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ttFloatBalloon {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(3deg); }
        }
        @keyframes ttPopperKick {
          0% { transform: scale(0.75) rotate(-18deg); }
          35% { transform: scale(1.12) rotate(6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes ttPopperKickRight {
          0% { transform: scale(0.75) rotate(18deg); }
          35% { transform: scale(1.12) rotate(-6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
