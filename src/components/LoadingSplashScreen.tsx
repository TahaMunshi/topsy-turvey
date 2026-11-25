import React, { useEffect, useRef, useState } from "react";
import { KarachiVenue } from "../constants/cinemaData";
import { CinemaVenueMark } from "./FuturisticLogo";

interface LoadingSplashScreenProps {
  venue: KarachiVenue;
  onComplete: () => void;
}

export const LoadingSplashScreen: React.FC<LoadingSplashScreenProps> = ({
  venue,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 320);
  };

  useEffect(() => {
    setProgress(0);
    setFadeOut(false);
    const startTime = performance.now();
    const duration = 1250;
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFadeOut(true);
        }, 160);
        setTimeout(() => {
          onCompleteRef.current();
        }, 480);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [venue.id]);

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
      className={`fixed inset-0 z-50 bg-[#09090b] text-[#f4efe6] flex flex-col justify-between p-6 sm:p-10 select-none transition-opacity duration-350 cursor-pointer overflow-hidden ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Personalized Cinema Brand Ambient Glow Backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 46%, ${venue.brandPrimary}26 0%, ${venue.brandSecondary}12 32%, ${venue.brandBgTint} 65%, #09090b 100%)`,
          }}
        />
        {/* Subtle Anamorphic Horizontal Brand Flare */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[1px] opacity-45 blur-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${venue.brandPrimary} 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* Top Architectural Frame Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: venue.brandPrimary,
              boxShadow: `0 0 10px ${venue.brandPrimary}`,
            }}
          />
          <span className="text-white font-semibold">{venue.name}</span>
        </div>
        <span className="hidden sm:inline text-zinc-400">
          {venue.hallName} • {venue.screenSpecs}
        </span>
        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
          style={{
            color: venue.brandPrimary,
            borderColor: `${venue.brandPrimary}45`,
            backgroundColor: `${venue.brandPrimary}15`,
          }}
        >
          {venue.badgeText}
        </span>
      </div>

      {/* Center Bespoke Logo & Brand Identity Frame */}
      <div className="relative z-10 my-auto w-full max-w-xl mx-auto flex flex-col items-center text-center py-12 px-6">
        {/* Corner Registration Crop Marks in Cinema's Brand Color */}
        <div
          className="absolute top-0 left-4 sm:left-8 w-4 h-4 border-t-2 border-l-2"
          style={{ borderColor: `${venue.brandPrimary}66` }}
        />
        <div
          className="absolute top-0 right-4 sm:right-8 w-4 h-4 border-t-2 border-r-2"
          style={{ borderColor: `${venue.brandPrimary}66` }}
        />
        <div
          className="absolute bottom-0 left-4 sm:left-8 w-4 h-4 border-b-2 border-l-2"
          style={{ borderColor: `${venue.brandPrimary}66` }}
        />
        <div
          className="absolute bottom-0 right-4 sm:right-8 w-4 h-4 border-b-2 border-r-2"
          style={{ borderColor: `${venue.brandPrimary}66` }}
        />

        {/* Individual Cinema Vector Emblem */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className="absolute -inset-4 rounded-full blur-2xl opacity-50"
            style={{ backgroundColor: venue.brandGlow }}
          />
          <CinemaVenueMark venue={venue} size="xl" />
        </div>

        <span
          className="text-[10px] font-mono tracking-[0.28em] uppercase font-bold mb-2"
          style={{ color: venue.brandPrimary }}
        >
          {venue.hallName}
        </span>

        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
          {venue.name}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 max-w-md leading-relaxed">
          {venue.splashSubtitle}
        </p>

        {/* Brand-Colored Progress Bar */}
        <div className="w-56 h-[2px] bg-white/10 rounded-full mt-8 overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${venue.brandPrimary}, ${venue.brandSecondary})`,
              boxShadow: `0 0 12px ${venue.brandPrimary}`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <span
            className="font-bold tabular-nums"
            style={{ color: venue.brandPrimary }}
          >
            {String(progress).padStart(3, "0")}%
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-300">{venue.soundSpecs}</span>
        </div>
      </div>

      {/* Bottom Architectural Footer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/[0.08] pt-4">
        <span className="truncate pr-4">{venue.location}</span>
        <span
          className="font-semibold transition-colors flex-shrink-0"
          style={{ color: venue.brandPrimary }}
        >
          Click anywhere to enter →
        </span>
      </div>
    </div>
  );
};
