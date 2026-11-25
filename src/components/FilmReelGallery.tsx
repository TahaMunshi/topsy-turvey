import React, { useCallback, useEffect, useRef, useState } from "react";
import { BranchInfo, PlayZoneItem } from "../constants/topsyData";
import { ArrowLeftIcon, ArrowRightIcon, TicketIcon } from "./Icons";

interface FilmReelGalleryProps {
  zones: PlayZoneItem[];
  branch: BranchInfo;
  onSelectZone: (zone: PlayZoneItem) => void;
  onQuickBook: (zone: PlayZoneItem) => void;
}

const AUTO_ADVANCE_MS = 6500;

export const FilmReelGallery: React.FC<FilmReelGalleryProps> = ({
  zones,
  branch,
  onSelectZone,
  onQuickBook,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const [progressKey, setProgressKey] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeZone = zones[activeIndex] || zones[0];

  const goToSlide = useCallback(
    (nextIndex: number) => {
      const normalized =
        ((nextIndex % zones.length) + zones.length) % zones.length;
      setActiveIndex(normalized);
      setProgressKey((k) => k + 1);
    },
    [zones.length]
  );

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (isPaused || zones.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % zones.length);
      setProgressKey((k) => k + 1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, zones.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const secondaryCtaLabel =
    activeZone.primaryFlow === "parties"
      ? "Book Birthday Party"
      : activeZone.primaryFlow === "school-trips"
        ? "Book School Trip"
        : "Buy Play Passes";

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:min-h-[560px] bg-[#FFFBF5] text-[#1F2A5A] flex flex-col-reverse lg:flex-row overflow-x-hidden lg:overflow-y-auto select-none"
    >
      {/* LEFT 50%: Inverted Hero Image + White Overlay + Editorial Copy */}
      <div className="relative z-20 w-full lg:w-1/2 flex flex-col justify-between pt-6 sm:pt-8 lg:pt-24 pb-5 sm:pb-6 px-5 sm:px-8 lg:px-10 xl:px-16 overflow-hidden">
        {/* Inverted Blurred Background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {zones.map((z, idx) => (
            <img
              key={`inv-${z.id}`}
              src={z.heroImage}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover object-center -scale-x-100 scale-105 blur-md transition-opacity duration-[1000ms] ease-out ${
                idx === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/75 to-white/65 backdrop-blur-sm" />
        </div>

        {/* Center Editorial Content */}
        <div
          key={`hero-copy-${activeZone.id}`}
          className="relative z-10 my-auto flex flex-col items-start text-left max-w-xl animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        >
          {/* Prominent Full Topsy Turvy Logo in Hero */}
          <img
            src="/images/brand/topsy-turvy-wordmark.png"
            alt="Topsy Turvy: Play, Learn, Celebrate"
            className="h-16 sm:h-20 lg:h-24 w-auto object-contain mb-3 drop-shadow-sm"
          />

          {/* Warm Brand Eyebrow */}
          <p
            className="text-sm font-bold mb-2.5"
            style={{ color: activeZone.accentHex }}
          >
            {activeZone.badge} · {activeZone.ageGroup}
          </p>

          {/* Display Title (fluid across all 16:9 screens) */}
          <h1 className="font-heading text-[clamp(1.85rem,3.3vw,3.4rem)] font-extrabold tracking-[-0.035em] text-[#1F2A5A] leading-[1.06]">
            {activeZone.shortTitle}
          </h1>

          {/* Tagline */}
          <p className="mt-3 text-[clamp(0.9rem,1.15vw,1.0625rem)] text-slate-700 font-normal leading-[1.6] max-w-lg">
            {activeZone.tagline}
          </p>

          {/* Clean Natural Feature Summary */}
          <div className="mt-4 pt-4 border-t border-[#1F2A5A]/12 w-full flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm font-medium text-[#1F2A5A]/80">
            <span>
              {activeZone.highlights
                .slice(0, 3)
                .map((item) => item.name)
                .join(" · ")}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{branch.hoursSummary}</span>
          </div>

          {/* Clean Dual CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectZone(activeZone)}
              style={{
                backgroundColor: activeZone.accentHex,
                color: "#ffffff",
                boxShadow: `0 12px 28px ${activeZone.accentHex}40`,
              }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-heading font-extrabold text-xs sm:text-sm tracking-tight flex items-center gap-2 hover:-translate-y-0.5 hover:scale-[1.04] hover:brightness-105 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Zone</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickBook(activeZone)}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 hover:bg-white border border-[#1F2A5A]/15 hover:border-[#1BA0DE] font-heading font-bold text-xs sm:text-sm text-[#1F2A5A] flex items-center gap-2 shadow-[0_6px_18px_rgba(31,42,90,0.1)] hover:shadow-[0_12px_26px_rgba(27,160,222,0.24)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <TicketIcon className="w-4 h-4 text-[#1BA0DE]" />
              <span>{secondaryCtaLabel}</span>
            </button>
          </div>
        </div>

        {/* Minimal Carousel Progress & Arrows */}
        <div className="relative z-10 flex items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2">
            {zones.map((z, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to ${z.shortTitle}`}
                  className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "w-10 bg-slate-200"
                      : "w-2.5 bg-slate-300/75 hover:bg-slate-400"
                  }`}
                >
                  {isSelected && (
                    <span
                      key={progressKey}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={
                        !isPaused
                          ? {
                              backgroundColor: activeZone.accentHex,
                              animation: `heroProgress ${AUTO_ADVANCE_MS}ms linear forwards`,
                            }
                          : { width: "100%", backgroundColor: activeZone.accentHex }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Zone"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center text-[#1F2A5A] shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Zone"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center text-[#1F2A5A] shadow-sm transition-all cursor-pointer"
            >
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT 50%: Full-Height Hero Image with Hover Bottom-Overlay & Center Transition */}
      <div
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onClick={() => setIsImageHovered((prev) => !prev)}
        className="group relative w-full lg:w-1/2 h-[44vh] sm:h-[48vh] lg:h-full overflow-hidden flex-shrink-0 cursor-pointer"
      >
        {zones.map((z, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={z.id}
              className={`absolute inset-0 transition-all duration-[1000ms] ease-out ${
                isCurrent
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <img
                src={z.heroImage}
                alt={z.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-linear ${
                  isImageHovered
                    ? "scale-105"
                    : isCurrent
                      ? "scale-105"
                      : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Resting Soft Bottom Gradient Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

        {/* Emerging Bottom Overlay on Hover (Zone-Colored) */}
        <div
          style={{
            background: `linear-gradient(to top, ${activeZone.accentHex}EB 0%, ${activeZone.accentHex}BF 55%, ${activeZone.accentHex}59 100%)`,
          }}
          className={`pointer-events-none absolute inset-0 z-10 backdrop-blur-[3px] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isImageHovered ? "translate-y-0" : "translate-y-full"
          }`}
        />

        {/* LAYER A: Travelling & Enlarging Title Block (Bottom-Right -> Centered) */}
        <div
          style={
            isImageHovered
              ? {
                  left: "50%",
                  top: "35%",
                  transform: "translate3d(-50%, -50%, 0) scale(1.22)",
                }
              : {
                  left: "calc(100% - 2rem)",
                  top: "calc(100% - 10rem)",
                  transform: "translate3d(-100%, 0, 0) scale(1)",
                }
          }
          className={`pointer-events-none absolute z-20 w-max max-w-[74%] transition-[top,left,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[top,left,transform] ${
            isImageHovered ? "text-center" : "text-right"
          }`}
        >
          <span className="text-base sm:text-lg font-extrabold tracking-wide text-[#F7D41B] block">
            {activeZone.badge}
          </span>
          <p className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-black tracking-tight text-white leading-tight mt-1 drop-shadow-md">
            {activeZone.subtitle}
          </p>
        </div>

        {/* LAYER B: Minimal Details & CTA Formed on Overlay */}
        <div
          className={`absolute inset-x-6 sm:inset-x-10 top-[50%] z-20 flex flex-col items-center text-center transition-all duration-500 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isImageHovered
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs sm:text-sm font-bold text-white/95">
            <span>{activeZone.ageGroup}</span>
            <span className="text-white/40">•</span>
            <span>{branch.city}</span>
          </span>

          <p className="mt-3.5 text-base sm:text-lg lg:text-[19px] font-medium text-white/95 leading-relaxed max-w-lg line-clamp-3">
            {activeZone.tagline}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectZone(activeZone);
            }}
            style={{
              backgroundColor: activeZone.accentHex,
              boxShadow: `0 12px 28px ${activeZone.accentHex}55`,
            }}
            className="mt-6 px-7 py-3.5 rounded-full text-white font-heading font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2 hover:-translate-y-0.5 hover:scale-[1.05] hover:brightness-105 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Explore {activeZone.shortTitle}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
