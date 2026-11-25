import React, { useEffect, useRef, useState } from "react";
import {
  getVenueMovieBadge,
  KARACHI_VENUES,
  KarachiVenue,
  MovieItem,
} from "../constants/cinemaData";
import { CinemaVenueMark } from "./FuturisticLogo";
import {
  ArmchairIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FilmIcon,
} from "./Icons";

interface FilmReelGalleryProps {
  movies: MovieItem[];
  venue: KarachiVenue;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectVenue?: (venue: KarachiVenue) => void;
  onSelectShowtime: (movieId: string, time: string) => void;
  onSelectMovieForOverview: (movie: MovieItem) => void;
  onBookMovieDirect: (movie: MovieItem) => void;
  onOpenPitchModal?: () => void;
}

const CLEAN_SHORT_TITLES: Record<string, string> = {
  "soft-play-maze": "Soft-Play Maze",
  "trampoline-climbing": "Trampoline & Climb",
  "toddler-ball-pit": "Toddler Ball Pit",
  "birthday-packages": "Birthday Packages",
  "school-trips": "School Trips",
};

function getCyclicOffset(index: number, activeIndex: number, total: number): number {
  let diff = index - activeIndex;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
}

export const FilmReelGallery: React.FC<FilmReelGalleryProps> = ({
  movies,
  venue,
  onSelectVenue,
  onSelectMovieForOverview,
  onBookMovieDirect,
  onOpenPitchModal,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSettled, setIsSettled] = useState<boolean>(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setIsSettled(false);
    const timer = window.setTimeout(() => {
      setIsSettled(true);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  const activeMovie = movies[activeIndex] || movies[0];

  const handlePrevMovie = () => {
    setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleNextMovie = () => {
    setActiveIndex((prev) => (prev + 1) % movies.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNextMovie();
      } else {
        handlePrevMovie();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getCardStyle = (offset: number) => {
    if (offset === 0) {
      return {
        transform: "translate3d(0, 0, 0) scale(1)",
        zIndex: 20,
        opacity: 1,
        pointerEvents: "auto" as const,
      };
    }
    if (offset === 1) {
      return {
        transform: "translate3d(calc(100% + 28px), 0, 0) scale(0.92)",
        zIndex: 10,
        opacity: 0.65,
        pointerEvents: "auto" as const,
      };
    }
    if (offset === -1) {
      return {
        transform: "translate3d(calc(-100% - 28px), 0, 0) scale(0.92)",
        zIndex: 0,
        opacity: 0.35,
        pointerEvents: "auto" as const,
      };
    }
    if (offset > 1) {
      return {
        transform: "translate3d(calc(200% + 56px), 0, 0) scale(0.85)",
        zIndex: 0,
        opacity: 0,
        pointerEvents: "none" as const,
      };
    }
    return {
      transform: "translate3d(calc(-200% - 56px), 0, 0) scale(0.85)",
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  const handleCycleVenue = () => {
    if (!onSelectVenue) return;
    const idx = KARACHI_VENUES.findIndex((v) => v.id === venue.id);
    const nextVenue = KARACHI_VENUES[(idx + 1) % KARACHI_VENUES.length];
    onSelectVenue(nextVenue);
  };

  return (
    <div className="relative w-full h-screen bg-[#fffbf2] text-slate-900 flex flex-col justify-between pt-20 pb-3 px-4 sm:px-8 overflow-hidden select-none">
      {/* Soft Pastel Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          key={activeMovie.id}
          src={activeMovie.posterImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-110 blur-[80px] saturate-150 opacity-20 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf2]/80 via-[#fffbf2]/65 to-[#fffbf2]/95" />
      </div>

      {/* Left Vertical Play Zone Selector Bar */}
      <aside className="hidden md:flex flex-col gap-2.5 absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-56 lg:w-64">
        <span className="text-[10px] font-mono tracking-[0.22em] text-slate-500 uppercase px-2 mb-0.5 font-semibold">
          Play Zones • 2nd Floor
        </span>
        {movies.map((m, idx) => {
          const isSelected = idx === activeIndex;
          const shortTitle = CLEAN_SHORT_TITLES[m.id] || m.title.split(":")[0];

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group w-full text-left p-2 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer border ${
                isSelected
                  ? "bg-white backdrop-blur-2xl border-amber-400 text-slate-900 shadow-[0_12px_28px_rgba(245,158,11,0.18)] scale-[1.02]"
                  : "bg-white/75 hover:bg-white backdrop-blur-md text-slate-700 hover:text-slate-950 border-slate-200/80 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={m.posterImage}
                  alt={shortTitle}
                  className="w-10 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-xs sm:text-[13px] font-heading font-bold truncate block text-slate-900">
                    {shortTitle}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                    {m.genre.split("/")[0].trim()} • ★ {m.imdbScore}
                  </span>
                </div>
              </div>

              <span
                style={
                  isSelected
                    ? {
                        backgroundColor: venue.brandPrimary,
                        color: "#0f172a",
                      }
                    : undefined
                }
                className={`text-[10px] font-mono px-2.5 py-1 rounded-full flex-shrink-0 ${
                  isSelected
                    ? "font-bold shadow-sm"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.releaseDateHeader}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Center Editorial Showcase with Enlarged Main Card */}
      <div className="relative z-20 flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-0 my-auto">
        {/* Bold Editorial Header ("ZONE 01") */}
        <div className="flex flex-col items-center mb-1.5 sm:mb-2.5">
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.28em] text-amber-700 uppercase mb-0.5 font-semibold">
            TOPSY TURVY • PACKAGES MALL LAHORE
          </span>
          <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            {activeMovie.releaseDateHeader}
          </h1>
        </div>

        {/* Enlarged Main Rounded 1:1 Poster Card & Carousel Controls with Smooth Sliding Transitions */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full flex items-center justify-center touch-pan-y"
        >
          {/* Ambient Projection Glow Behind Centered Card */}
          <div
            className={`pointer-events-none absolute h-[52vh] sm:h-[58vh] max-h-[470px] min-h-[320px] aspect-square rounded-[34px] blur-2xl transition-opacity duration-500 ${
              isSettled ? "opacity-55" : "opacity-15"
            }`}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeMovie.accentHex}38 0%, rgba(234,224,200,0.12) 45%, transparent 75%)`,
            }}
          />

          {/* 1:1 Square Poster Carousel Stage Container */}
          <div className="relative h-[52vh] sm:h-[58vh] max-h-[470px] min-h-[320px] aspect-square max-w-[86vw]">
            {/* Sliding Movie Cards Track */}
            {movies.map((m, idx) => {
              const offset = getCyclicOffset(idx, activeIndex, movies.length);
              const isCenter = offset === 0;
              const isRight = offset === 1;
              const isLeft = offset === -1;
              const isSide = Math.abs(offset) === 1;

              const cardStyle = getCardStyle(offset);

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (isCenter) {
                      onSelectMovieForOverview(m);
                    } else if (isRight) {
                      handleNextMovie();
                    } else if (isLeft) {
                      handlePrevMovie();
                    }
                  }}
                  role="button"
                  tabIndex={isCenter || isSide ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (isCenter) onSelectMovieForOverview(m);
                      else if (isRight) handleNextMovie();
                      else if (isLeft) handlePrevMovie();
                    }
                  }}
                  aria-label={
                    isCenter
                      ? `View ${m.title}`
                      : isRight
                      ? `Next: ${m.title}`
                      : `Previous: ${m.title}`
                  }
                  style={{
                    ...cardStyle,
                    borderColor:
                      isCenter && isSettled
                        ? "rgba(234, 224, 200, 0.78)"
                        : undefined,
                    boxShadow:
                      isCenter && isSettled
                        ? `0 0 0 1px rgba(234, 224, 200, 0.42), 0 0 34px rgba(234, 224, 200, 0.28), 0 0 72px ${m.accentHex}42, 0 28px 75px rgba(0,0,0,0.9)`
                        : undefined,
                    transition:
                      "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 520ms ease-out, border-color 480ms ease-out",
                  }}
                  className={`absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[30px] overflow-hidden bg-[#0a0b0e] border ${
                    isCenter
                      ? "border-white/20 shadow-[0_28px_75px_rgba(0,0,0,0.88)] cursor-pointer"
                      : isRight
                      ? "border-white/15 shadow-[0_22px_60px_rgba(0,0,0,0.8)] cursor-pointer hover:border-white/30 max-sm:opacity-0 max-sm:pointer-events-none"
                      : "border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.75)] cursor-pointer hover:border-white/20 max-sm:opacity-0 max-sm:pointer-events-none"
                  }`}
                >
                  <img
                    src={m.posterImage || "/images/posters/dune-part-two.jpg"}
                    alt={m.title}
                    className={`block w-full h-full object-cover object-center transition-transform duration-700 ${
                      isCenter ? "group-hover:scale-[1.03]" : "hover:scale-105"
                    }`}
                  />

                  {/* Smooth Multi-Stop Editorial Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/40 to-transparent" />

                  {/* LAYER A: CENTER CARD DETAILS (Smoothly Fades when isCenter) */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
                      isCenter
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Minimalist Slim Top-Corner Micro-Labels */}
                    <div className="p-2.5 sm:p-3.5 flex items-center justify-between gap-2">
                      <div className="px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                        <span className="text-amber-300 text-[10px] leading-none">
                          ★
                        </span>
                        <span className="text-[10px] font-semibold text-white/95 font-mono-numbers">
                          {m.imdbScore}
                        </span>
                        <span className="text-white/25 text-[9px]">•</span>
                        <span className="text-[9px] font-mono tracking-wider text-zinc-300">
                          {m.rating}
                        </span>
                      </div>

                      <div className="px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: venue.brandPrimary }}
                        />
                        <span className="text-[9px] font-mono font-medium tracking-[0.12em] text-zinc-200 uppercase">
                          {getVenueMovieBadge(venue, m.badge)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Full Editorial Showcase */}
                    <div className="p-4 sm:p-6 pt-10 sm:pt-14 bg-gradient-to-t from-[#070709] via-[#070709]/85 to-transparent flex flex-col items-start text-left">
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] uppercase text-[#eae0c8] mb-0.5 sm:mb-1">
                        <span>{m.genre}</span>
                        <span className="text-white/30">•</span>
                        <span>{m.duration}</span>
                      </div>

                      <h2 className="font-heading text-lg xs:text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight text-white uppercase leading-[1.1] drop-shadow-md">
                        {m.title}
                      </h2>

                      <div className="w-full mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-white/12 flex items-center justify-between gap-2 sm:gap-3">
                        <div className="min-w-0 pr-1">
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400 block truncate">
                            {m.director} • 11 AM – 11 PM
                          </span>
                          <span className="text-[11px] sm:text-xs font-medium text-zinc-200 truncate block mt-0.5">
                            {m.cast[0]?.name} &amp; {m.cast[1]?.name}
                          </span>
                        </div>

                        <span
                          style={{
                            backgroundColor: venue.brandPrimary,
                            color: "#09090b",
                          }}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-heading font-extrabold text-[11px] sm:text-xs tracking-tight flex items-center gap-1 sm:gap-1.5 flex-shrink-0 shadow-lg hover:scale-105 transition-transform"
                        >
                          <span>Explore</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LAYER B: RIGHT CARD PREVIEW ("UP NEXT") */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-5 transition-opacity duration-300 ${
                      isRight
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="flex justify-end">
                      <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-200 uppercase">
                        UP NEXT • {m.releaseDateHeader}
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-zinc-400 block">
                        {m.genre.split("/")[0].trim()} • {m.duration}
                      </span>
                      <h3 className="font-heading text-sm sm:text-lg font-bold text-white uppercase tracking-tight truncate mt-0.5">
                        {m.title}
                      </h3>
                      <span
                        style={{ color: venue.brandPrimary }}
                        className="text-xs font-semibold mt-1 inline-flex items-center gap-1"
                      >
                        <span>Up next</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>

                  {/* LAYER C: LEFT CARD PREVIEW ("PREVIOUS") */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-5 transition-opacity duration-300 ${
                      isLeft
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="flex justify-start">
                      <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-300 uppercase">
                        {m.releaseDateHeader}
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-zinc-400 block">
                        {m.genre.split("/")[0].trim()} • {m.duration}
                      </span>
                      <h3 className="font-heading text-sm sm:text-lg font-bold text-white uppercase tracking-tight truncate mt-0.5">
                        {m.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Previous Film Arrow Button */}
            <button
              type="button"
              onClick={handlePrevMovie}
              aria-label="Previous Zone"
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-xl"
            >
              <ArrowLeftIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>

            {/* Next Zone Arrow Button */}
            <button
              type="button"
              onClick={handleNextMovie}
              aria-label="Next Zone"
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-xl"
            >
              <ArrowRightIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Mobile-Only Compact Selector Strip */}
        <div className="flex md:hidden mt-2 items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full px-2 py-0.5">
          {movies.map((m, idx) => {
            const isSelected = idx === activeIndex;
            const shortTitle = CLEAN_SHORT_TITLES[m.id] || m.title.split(":")[0];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "bg-white/85 text-slate-700 border border-slate-200"
                }`}
              >
                {shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Quick-Action Dock Pill */}
      <div className="relative z-20 w-full flex items-center justify-center pt-1">
        <div className="sleek-glass-pill inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full">
          <button
            type="button"
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] sm:text-xs font-bold text-slate-900 flex items-center gap-1 sm:gap-1.5 cursor-pointer"
          >
            <span className="inline-flex" style={{ color: "#d97706" }}>
              <FilmIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </span>
            <span>Play Zones</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMovieForOverview(activeMovie)}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full hover:bg-slate-900/5 text-[11px] sm:text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Zone Info
          </button>

          <button
            type="button"
            onClick={() => onBookMovieDirect(activeMovie)}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full hover:bg-slate-900/5 text-[11px] sm:text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer"
          >
            <ArmchairIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-600" />
            <span>Book Table</span>
          </button>

          <button
            type="button"
            onClick={onOpenPitchModal || handleCycleVenue}
            className="px-2 sm:px-3 py-1 rounded-full hover:bg-slate-900/5 text-[11px] sm:text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CinemaVenueMark venue={venue} size="xs" />
            <span className="hidden xs:inline">{venue.shortName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
