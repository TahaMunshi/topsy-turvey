import React, { useEffect, useState } from "react";
import {
  getVenueAspectRatio,
  getVenueMovieBadge,
  KarachiVenue,
  MovieItem,
} from "../constants/cinemaData";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon } from "./Icons";

interface MovieOverviewViewProps {
  movie: MovieItem;
  venue: KarachiVenue;
  onBackToDiscovery: () => void;
  onProceedToBooking: () => void;
  onPreview3DSightline: () => void;
}

export const MovieOverviewView: React.FC<MovieOverviewViewProps> = ({
  movie,
  venue,
  onBackToDiscovery,
  onProceedToBooking,
  onPreview3DSightline,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    setIsPlayingTrailer(false);
    setIsExpanded(false);
  }, [movie.id]);

  return (
    <div className="relative w-full min-h-screen lg:h-screen bg-[#09090b] text-[#f4efe6] flex flex-col justify-between pt-16 sm:pt-20 pb-8 lg:pb-3 px-3 sm:px-8 overflow-y-auto lg:overflow-hidden select-none animate-slide-up">
      {/* Dynamic Full-Bleed Blurred Movie Poster Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          key={movie.id}
          src={movie.posterImage || "/images/posters/dune-part-two.jpg"}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-110 blur-[65px] saturate-150 opacity-50 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/60 via-[#09090b]/45 to-[#09090b]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,transparent_15%,rgba(9,9,11,0.78)_85%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col flex-1 justify-between min-h-0">
        {/* 1. Top Navigation & Metadata Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
          <button
            type="button"
            onClick={onBackToDiscovery}
            className="px-3.5 py-1 rounded-full bg-[#121316] hover:bg-[#1a1c22] border border-white/10 text-xs font-medium text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#121316] border border-white/10 text-[11px] font-medium text-zinc-300">
              {movie.genre.split("/")[0].trim()}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#121316] border border-white/10 text-[11px] font-mono text-zinc-300">
              {movie.duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#121316] border border-white/10 text-[11px] font-mono font-semibold text-[#eae0c8] flex items-center gap-1">
              <span>★</span>
              <span>{movie.imdbScore}</span>
            </span>
          </div>
        </div>

        {/* 2. 16:9 Landscape Two-Column Split (Scrollable on mobile, Fits 1366x768 on desktop) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-auto py-2 min-h-0">
          {/* Left 7 Columns: Rounded Hero Media Card with "Watch Trailer" Pill */}
          <div className="lg:col-span-7 relative w-full h-[260px] xs:h-[320px] sm:h-[42vh] lg:h-[68vh] max-h-[430px] rounded-[24px] overflow-hidden bg-[#121316] border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
            <img
              src={movie.posterImage || "/images/posters/dune-part-two.jpg"}
              alt={movie.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlayingTrailer ? "scale-105 brightness-105" : "group-hover:scale-[1.02]"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-black/25" />

            {/* Top-Center Director Credit */}
            <div className="absolute top-3.5 inset-x-0 text-center pointer-events-none">
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/80 font-medium">
                {movie.director}
              </span>
            </div>

            {/* Inline Trailer Preview */}
            {isPlayingTrailer && (
              <div className="absolute inset-0 z-20 bg-black animate-fade-in">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none&hl=en`}
                  title={`${movie.title} Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
                <button
                  type="button"
                  onClick={() => setIsPlayingTrailer(false)}
                  className="absolute top-3 right-3 z-30 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black border border-white/20 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5 shadow-xl cursor-pointer transition-colors"
                >
                  <span>✕</span>
                  <span>Close Trailer</span>
                </button>
              </div>
            )}

            {/* Bottom-Left Format Tag & Bottom-Right Watch Trailer Pill (hidden during playback so controls stay unobstructed) */}
            {!isPlayingTrailer && (
              <>
                <div className="absolute bottom-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-full bg-[#09090b]/80 backdrop-blur-md border border-white/12 text-[10px] font-mono text-zinc-300 uppercase">
                    {getVenueMovieBadge(venue, movie.badge)} • {getVenueAspectRatio(venue)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-full bg-[#09090b]/85 hover:bg-[#09090b] backdrop-blur-md border border-white/15 text-xs font-medium text-white flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center text-[8px]">
                    ▶
                  </span>
                  <span>Watch Trailer</span>
                </button>
              </>
            )}
          </div>

          {/* Right 5 Columns: Title, Synopsis, Cast Portraits & Action CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-auto lg:h-full max-lg:max-h-none max-h-[430px] text-left space-y-3 pb-2 lg:pb-0">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                {venue.name} • {venue.hallName}
              </span>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white uppercase mt-0.5">
                {movie.title}
              </h1>

              <p
                className={`text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2 ${
                  isExpanded ? "" : "line-clamp-3"
                }`}
              >
                {movie.synopsis}
              </p>

              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="mt-1 text-xs font-medium text-zinc-200 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            </div>

            {/* Cast Portrait Row */}
            <div>
              <h2 className="font-heading text-xs sm:text-sm font-bold text-white mb-2">
                Cast
              </h2>

              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {movie.cast.map((actor) => (
                  <div key={actor.name} className="flex flex-col text-left group">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#121316] border border-white/10 group-hover:border-white/20 transition-colors">
                      <img
                        src={actor.avatar}
                        alt={actor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-100 truncate mt-1">
                      {actor.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate">
                      {actor.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 w-full">
              <button
                type="button"
                onClick={onPreview3DSightline}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-full bg-[#121316] hover:bg-[#1a1c22] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                title="Preview seat view in auditorium"
              >
                <EyeIcon className="w-4 h-4 text-zinc-400" />
                <span>Auditorium View</span>
              </button>

              <button
                type="button"
                onClick={onProceedToBooking}
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-6 rounded-full bg-[#eae0c8] hover:bg-[#f4efe6] text-[#09090b] font-heading font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select Seats &amp; Showtimes</span>
                <ArrowRightIcon className="w-4 h-4 text-[#09090b]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
