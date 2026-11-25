import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckoutModal } from "../../components/CheckoutModal";
import { FilmReelGallery } from "../../components/FilmReelGallery";
import { CinemaVenueMark, FuturisticLogo } from "../../components/FuturisticLogo";
import { LoadingSplashScreen } from "../../components/LoadingSplashScreen";
import { MovieOverviewView } from "../../components/MovieOverviewView";
import { PitchDeckModal } from "../../components/PitchDeckModal";
import { SeatSelectionView } from "../../components/SeatSelectionView";
import { SnackSelectionView } from "../../components/SnackSelectionView";
import {
  KARACHI_VENUES,
  KarachiVenue,
  MOVIE_CATALOG,
  MovieItem,
  PRE_RESERVED_SEATS,
} from "../../constants/cinemaData";

const FullScreenCinemaSimulator = React.lazy(() =>
  import("../../components/FullScreenCinemaSimulator").then((m) => ({
    default: m.FullScreenCinemaSimulator,
  }))
);

type BookingViewMode = "gallery" | "overview" | "seats" | "3d-preview" | "snacks";

const getInitialVenue = (): KarachiVenue => {
  if (typeof window !== "undefined") {
    const param = new URLSearchParams(window.location.search).get("venue");
    if (param) {
      const match = KARACHI_VENUES.find(
        (v) => v.id.toLowerCase() === param.toLowerCase()
      );
      if (match) return match;
    }
  }
  return KARACHI_VENUES[0];
};

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const [currentView, setCurrentView] = useState<BookingViewMode>("gallery");
  const [venue, setVenue] = useState<KarachiVenue>(getInitialVenue);
  const [movies, setMovies] = useState<MovieItem[]>(MOVIE_CATALOG);
  const [selectedMovieId, setSelectedMovieId] = useState<string>(
    MOVIE_CATALOG[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>("TODAY");

  const [selectedSeats, setSelectedSeats] = useState<string[]>(["C4"]);
  const [activeSeat, setActiveSeat] = useState<string>("C4");
  const [currency, setCurrency] = useState<"PKR" | "USD">(
    () => getInitialVenue().currency
  );
  const [venueFilter, setVenueFilter] = useState<"ALL" | "Playland" | "Packages">("ALL");
  const [copiedPitchLink, setCopiedPitchLink] = useState<boolean>(false);

  const [selectedConcessions, setSelectedConcessions] = useState<
    Record<string, number>
  >({
    "grip-socks": 1,
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedMovie =
    movies.find((m) => m.id === selectedMovieId) || movies[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsCinemaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.title = `${venue.name} | Packages Mall Lahore — 3D Playland`;
  }, [venue.name]);

  useEffect(() => {
    if (currentView === "overview" || currentView === "seats") {
      void import("../../components/FullScreenCinemaSimulator");
    }
  }, [currentView]);

  const handleSelectVenueWithSplash = useCallback((nextVenue: KarachiVenue) => {
    setIsCinemaDropdownOpen(false);
    setCopiedPitchLink(false);
    setVenue((prev) => {
      if (prev.id !== nextVenue.id) {
        setShowSplash(true);
      }
      return nextVenue;
    });
    if (nextVenue.currency) {
      setCurrency(nextVenue.currency);
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("venue", nextVenue.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleCopyPitchLink = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("venue", venue.id);
    const pitchUrl = url.toString();
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(pitchUrl);
    }
    setCopiedPitchLink(true);
    window.setTimeout(() => setCopiedPitchLink(false), 2200);
  }, [venue.id]);

  const handleSelectShowtime = (movieId: string, time: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, selectedTime: time } : m))
    );
  };

  const handleSelectMovieForOverview = (movie: MovieItem) => {
    setSelectedMovieId(movie.id);
    setSelectedDate(movie.releaseDateHeader);
    setCurrentView("overview");
  };

  const handleBookMovieDirect = (movie: MovieItem) => {
    setSelectedMovieId(movie.id);
    setSelectedDate(movie.releaseDateHeader);
    setCurrentView("seats");
  };

  const handleSeatSelect = (seatId: string) => {
    const isReserved = PRE_RESERVED_SEATS.includes(seatId);

    if (!isReserved) {
      setSelectedSeats((prev) => {
        const idx = prev.indexOf(seatId);
        if (idx > -1) {
          const next = prev.filter((s) => s !== seatId);
          if (next.length > 0) {
            setActiveSeat(next[next.length - 1]);
          }
          return next;
        } else {
          setActiveSeat(seatId);
          return [...prev, seatId];
        }
      });
    } else {
      setActiveSeat(seatId);
    }
  };

  const handleSelectCouplePair = () => {
    setSelectedSeats(["C4", "C5"]);
    setActiveSeat("C4");
  };

  const handleSetSeatsPreset = (seats: string[]) => {
    setSelectedSeats(seats);
    if (seats.length > 0) {
      setActiveSeat(seats[0]);
    }
  };

  const handleToggleConcession = (id: string, delta: number) => {
    setSelectedConcessions((prev) => {
      const nextQty = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: nextQty };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf2] text-slate-900 select-none">
      {/* Personalized Cinema Brand Splash Screen */}
      {showSplash && (
        <LoadingSplashScreen
          venue={venue}
          onComplete={handleSplashComplete}
        />
      )}

      {/* =====================================================================
          FLOATING 3-PILL HEADER (Hidden in 3D Immersive Seat View for Realism)
         ===================================================================== */}
      {currentView !== "3d-preview" && (
      <header className="fixed top-3 sm:top-4 inset-x-0 z-40 px-2 sm:px-6 md:px-8 pointer-events-none">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* PILL 1 (LEFT): Sleek Active Cinema Brand Identity Pill */}
          <div className="sleek-glass-pill pointer-events-auto rounded-full px-2.5 sm:px-3.5 py-1.5 flex items-center max-w-[34vw] sm:max-w-none">
            <FuturisticLogo
              venue={venue}
              onClick={() => setCurrentView("gallery")}
            />
          </div>

          {/* PILL 2 (CENTER): Sleek Minimalist Navigation Bar */}
          <nav className="sleek-glass-pill pointer-events-auto flex items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full">
            <button
              type="button"
              onClick={() => setCurrentView("gallery")}
              className={`relative text-[11px] xs:text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer ${
                currentView === "gallery"
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <span>Play Zones</span>
              {currentView === "gallery" && (
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-[2px] rounded-full bg-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentView("overview")}
              className={`relative text-[11px] xs:text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer ${
                currentView === "overview"
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <span>Zone Info</span>
              {currentView === "overview" && (
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-[2px] rounded-full bg-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentView("seats")}
              className={`relative text-[11px] xs:text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer ${
                currentView === "seats"
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <span>
                2D Map
                {selectedSeats.length > 0 && (
                  <span className="hidden xs:inline"> ({selectedSeats.length})</span>
                )}
              </span>
              {currentView === "seats" && (
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-[2px] rounded-full bg-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentView("3d-preview")}
              className="hidden sm:inline-block relative text-xs sm:text-[13px] tracking-wide transition-colors cursor-pointer text-slate-500 hover:text-slate-900 font-medium"
            >
              <span>3D Sightline</span>
            </button>

            {currentView === "snacks" && (
              <button
                type="button"
                className="relative text-[11px] xs:text-xs sm:text-[13px] tracking-wide text-slate-900 font-bold transition-colors cursor-pointer"
              >
                <span>Socks &amp; Café</span>
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-[2px] rounded-full bg-amber-500" />
              </button>
            )}
          </nav>

          {/* PILL 3 (RIGHT): Sleek Wing Logo + Currency Switcher + Dropdown Arrow */}
          <div ref={dropdownRef} className="relative pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {/* Direct Currency Toggle Pill */}
            <button
              type="button"
              onClick={() => setCurrency((prev) => (prev === "PKR" ? "USD" : "PKR"))}
              className="sleek-glass-pill rounded-full px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-700 hover:text-slate-950 transition-all cursor-pointer shadow-sm group"
              title={`Switch currency between PKR and USD (Current: ${currency})`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currency === "USD" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span>{currency}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCinemaDropdownOpen((prev) => !prev)}
              aria-label="Switch Playland Wing"
              aria-expanded={isCinemaDropdownOpen}
              className="sleek-glass-pill rounded-full p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 cursor-pointer group transition-all"
            >
              <CinemaVenueMark venue={venue} size="xs" />
              <span className="hidden md:inline text-xs font-semibold text-slate-800 group-hover:text-slate-950 truncate max-w-[110px]">
                {venue.shortName}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 transition-transform duration-200 ease-out ${
                  isCinemaDropdownOpen ? "rotate-180 text-slate-900" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Animated Molten Glass Cinema Dropdown Menu */}
            {isCinemaDropdownOpen && (
              <div className="molten-dropdown-menu absolute top-full right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-20px)] max-h-[calc(100dvh-80px)] rounded-[24px] p-2.5 z-50 shadow-2xl flex flex-col overflow-hidden">
                <div className="flex-shrink-0 px-3 py-1.5 flex items-center justify-between border-b border-white/10 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
                    Packages Mall • 2nd Floor
                  </span>
                  <span
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: venue.brandPrimary,
                      backgroundColor: `${venue.brandPrimary}18`,
                    }}
                  >
                    {venue.shortName} • {currency}
                  </span>
                </div>

                <div className="flex-shrink-0 flex items-center gap-1 px-1 py-1 mb-2 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-medium">
                  {(
                    [
                      { id: "ALL", label: `All (${KARACHI_VENUES.length})` },
                      { id: "Playland", label: "Playland (2)" },
                      { id: "Packages", label: "Parties (1)" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setVenueFilter(tab.id)}
                      className={`flex-1 py-1 px-1.5 rounded-full text-center transition-all cursor-pointer truncate ${
                        venueFilter === tab.id
                          ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-h-0 space-y-1.5 overflow-y-auto overscroll-contain no-scrollbar pr-0.5">
                  {KARACHI_VENUES.filter(
                    (v) => venueFilter === "ALL" || v.category === venueFilter
                  ).map((v) => {
                    const isSelected = v.id === venue.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVenueWithSplash(v)}
                        style={
                          isSelected
                            ? {
                                background: `linear-gradient(135deg, ${v.brandPrimary}22 0%, #fffbf2 100%)`,
                                borderColor: `${v.brandPrimary}99`,
                              }
                            : undefined
                        }
                        className={`w-full p-2.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? "text-slate-900 shadow-sm"
                            : "bg-white/70 hover:bg-white border-slate-200 hover:border-amber-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CinemaVenueMark venue={v} size="sm" />
                          <div className="min-w-0">
                            <span className="font-heading font-bold text-xs block truncate text-slate-900">
                              {v.name}
                            </span>
                            <span className="text-[10px] block text-slate-600 truncate mt-0.5">
                              {v.hallName}
                            </span>
                            <span className="text-[9px] block text-slate-400 font-mono truncate">
                              {v.city}, {v.country}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
                            style={
                              isSelected
                                ? {
                                    backgroundColor: v.brandPrimary,
                                    color: "#09090b",
                                  }
                                : {
                                    color: v.brandPrimary,
                                    borderColor: `${v.brandPrimary}40`,
                                    backgroundColor: `${v.brandPrimary}12`,
                                  }
                            }
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? "font-bold border-transparent"
                                : "font-medium"
                            }`}
                          >
                            {isSelected ? "Active" : v.badgeText}
                          </span>
                          <span className={`text-[8px] font-mono font-bold ${v.currency === "USD" ? "text-emerald-400" : "text-amber-400"}`}>
                            {v.currency}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Contact Info & Share Link Footer */}
                <div className="flex-shrink-0 pt-2 mt-2 border-t border-white/10 space-y-1.5">
                  <div className="px-2 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>{venue.phone}</span>
                    <span>Mall UAN: {venue.mallUan}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPitchLink}
                    className={`w-full py-2 px-3 rounded-xl text-[11px] font-mono font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                      copiedPitchLink
                        ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                        : "bg-white/[0.04] hover:bg-white/[0.09] border-white/10 text-zinc-300 hover:text-white"
                    }`}
                  >
                    <span className="truncate">
                      {copiedPitchLink
                        ? `✓ Copied Link for ${venue.shortName}`
                        : "Copy Topsy Turvy Booking Link"}
                    </span>
                    <span className="text-[9px] text-zinc-500 flex-shrink-0">
                      ?venue={venue.id}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      )}

      {/* Stage 1: Minimalist Movie Discovery View */}
      {currentView === "gallery" && (
        <FilmReelGallery
          movies={movies}
          venue={venue}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSelectVenue={handleSelectVenueWithSplash}
          onSelectShowtime={handleSelectShowtime}
          onSelectMovieForOverview={handleSelectMovieForOverview}
          onBookMovieDirect={handleBookMovieDirect}
          onOpenPitchModal={() => setIsCinemaDropdownOpen(true)}
        />
      )}

      {/* Stage 2: Movie Overview, Trailer & Cast View */}
      {currentView === "overview" && (
        <MovieOverviewView
          movie={selectedMovie}
          venue={venue}
          onBackToDiscovery={() => setCurrentView("gallery")}
          onProceedToBooking={() => setCurrentView("seats")}
          onPreview3DSightline={() => setCurrentView("3d-preview")}
        />
      )}

      {/* Stage 3: Unified Seat Map, Curved Screen, Slot Picker & Split-Pill Checkout */}
      {currentView === "seats" && (
        <SeatSelectionView
          venue={venue}
          selectedMovie={selectedMovie}
          selectedDate={selectedDate}
          selectedSeats={selectedSeats}
          activeSeat={activeSeat}
          currency={currency}
          onSelectDate={setSelectedDate}
          onSelectShowtime={(time) => handleSelectShowtime(selectedMovie.id, time)}
          onBackToOverview={() => setCurrentView("overview")}
          onSelectSeat={handleSeatSelect}
          onSelectCouplePair={handleSelectCouplePair}
          onSetSeatsPreset={handleSetSeatsPreset}
          onProceedToPreview={() => setCurrentView("3d-preview")}
          onProceedToSnacks={() => setCurrentView("snacks")}
          onBuyTicketsDirect={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* Auditorium Seat Sightline Preview */}
      {currentView === "3d-preview" && (
        <React.Suspense
          fallback={
            <div className="w-full h-screen bg-[#09090b] flex flex-col items-center justify-center gap-3 text-zinc-300">
              <span
                className="w-8 h-8 rounded-full border-2 border-white/15 animate-spin"
                style={{ borderTopColor: venue.brandPrimary }}
              />
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-400">
                Loading 3D Auditorium...
              </span>
            </div>
          }
        >
          <FullScreenCinemaSimulator
            venue={venue}
            selectedMovie={selectedMovie}
            selectedDate={selectedDate}
            selectedSeats={selectedSeats}
            activeSeat={activeSeat}
            currency={currency}
            onSelectDate={setSelectedDate}
            onSelectShowtime={(time) => handleSelectShowtime(selectedMovie.id, time)}
            onSelectSeat={handleSeatSelect}
            onPreviewSeat={(seatId) => setActiveSeat(seatId)}
            onBackToSeats={() => setCurrentView("seats")}
            onProceedToSnacks={() => setCurrentView("snacks")}
          />
        </React.Suspense>
      )}

      {/* Gourmet Concessions */}
      {currentView === "snacks" && (
        <SnackSelectionView
          venue={venue}
          selectedMovie={selectedMovie}
          selectedDate={selectedDate}
          selectedSeats={selectedSeats}
          selectedConcessions={selectedConcessions}
          currency={currency}
          onToggleConcession={handleToggleConcession}
          onBackTo3D={() => setCurrentView("seats")}
          onProceedCheckout={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        venue={venue}
        selectedMovie={selectedMovie}
        selectedDate={selectedDate}
        selectedSeats={selectedSeats}
        selectedConcessions={selectedConcessions}
        currency={currency}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Theater Switcher Modal (fallback if triggered) */}
      <PitchDeckModal
        isOpen={isPitchModalOpen}
        currentVenue={venue}
        onSelectVenue={handleSelectVenueWithSplash}
        onClose={() => setIsPitchModalOpen(false)}
      />
    </div>
  );
};

export default Home;
