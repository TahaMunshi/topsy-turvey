import React, { useEffect, useRef, useState } from "react";
import {
  getSeatSpatialData,
  getTimeSlotCrowd,
  KarachiVenue,
  MovieItem,
  PRE_RESERVED_SEATS,
  ROWS,
  SEATS_PER_ROW,
} from "../constants/cinemaData";
import { soundEngine } from "../utils/audioEffects";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LightbulbIcon,
  TheaterIcon,
} from "./Icons";
import { ThreeCinemaSimulator } from "./ThreeCinemaSimulator";

interface FullScreenCinemaSimulatorProps {
  venue: KarachiVenue;
  selectedMovie: MovieItem;
  selectedDate: string;
  selectedSeats: string[];
  activeSeat: string;
  currency: "PKR" | "USD";
  onSelectDate: (date: string) => void;
  onSelectShowtime: (time: string) => void;
  onSelectSeat: (seatId: string) => void;
  onPreviewSeat?: (seatId: string) => void;
  onBackToSeats: () => void;
  onProceedToSnacks: () => void;
}

const AVAILABLE_DAYS = ["TODAY", "TOMORROW", "SAT", "SUN"];

export const FullScreenCinemaSimulator: React.FC<FullScreenCinemaSimulatorProps> = ({
  venue,
  selectedMovie,
  selectedDate,
  selectedSeats,
  activeSeat,
  currency,
  onSelectDate,
  onSelectShowtime,
  onSelectSeat,
  onPreviewSeat,
  onBackToSeats,
  onProceedToSnacks,
}) => {
  const [isSeatPickerOpen, setIsSeatPickerOpen] = useState<boolean>(false);
  const [openTopMenu, setOpenTopMenu] = useState<"date" | "time" | null>(null);
  const topPillRef = useRef<HTMLDivElement | null>(null);
  const [lightingMode, setLightingMode] = useState<"dimmed" | "house">("house");
  const [cameraMode, setCameraMode] = useState<"pov" | "overview">("pov");
  const [trailerMuted, setTrailerMuted] = useState<boolean>(true);
  const [isHudIdle, setIsHudIdle] = useState<boolean>(false);
  const [blockedSeatNotice, setBlockedSeatNotice] = useState<{
    seatId: string;
    nonce: number;
  } | null>(null);
  const blockedTimerRef = useRef<number | null>(null);
  const hudIdleTimerRef = useRef<number | null>(null);

  const availableDates = AVAILABLE_DAYS;

  useEffect(() => {
    if (!openTopMenu) return;
    const handlePointerDownOutside = (e: MouseEvent) => {
      if (
        topPillRef.current &&
        !topPillRef.current.contains(e.target as Node)
      ) {
        setOpenTopMenu(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDownOutside);
    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
    };
  }, [openTopMenu]);

  useEffect(() => {
    return () => {
      if (blockedTimerRef.current !== null) {
        window.clearTimeout(blockedTimerRef.current);
      }
      if (hudIdleTimerRef.current !== null) {
        window.clearTimeout(hudIdleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lightingMode !== "dimmed" || isSeatPickerOpen || openTopMenu !== null) {
      if (hudIdleTimerRef.current !== null) {
        window.clearTimeout(hudIdleTimerRef.current);
        hudIdleTimerRef.current = null;
      }
      setIsHudIdle(false);
      return;
    }

    const scheduleIdleFade = () => {
      if (hudIdleTimerRef.current !== null) {
        window.clearTimeout(hudIdleTimerRef.current);
      }
      setIsHudIdle(false);
      hudIdleTimerRef.current = window.setTimeout(() => {
        setIsHudIdle(true);
      }, 3200);
    };

    scheduleIdleFade();

    const handleUserActivity = () => {
      scheduleIdleFade();
    };

    window.addEventListener("pointermove", handleUserActivity, { passive: true });
    window.addEventListener("pointerdown", handleUserActivity, { passive: true });
    window.addEventListener("wheel", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      if (hudIdleTimerRef.current !== null) {
        window.clearTimeout(hudIdleTimerRef.current);
        hudIdleTimerRef.current = null;
      }
      window.removeEventListener("pointermove", handleUserActivity);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("wheel", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [lightingMode, isSeatPickerOpen, openTopMenu]);

  const triggerBlockedSeatIsland = (seatId: string) => {
    soundEngine.playUnavailableTap();
    if (blockedTimerRef.current !== null) {
      window.clearTimeout(blockedTimerRef.current);
    }
    setBlockedSeatNotice({ seatId, nonce: Date.now() });
    blockedTimerRef.current = window.setTimeout(() => {
      setBlockedSeatNotice(null);
      blockedTimerRef.current = null;
    }, 2600);
  };

  const activeSeatData = getSeatSpatialData(activeSeat, venue);

  const handlePreviewSeat = (seatId: string) => {
    if (PRE_RESERVED_SEATS.includes(seatId)) {
      triggerBlockedSeatIsland(seatId);
      return;
    }

    if (blockedTimerRef.current !== null) {
      window.clearTimeout(blockedTimerRef.current);
      blockedTimerRef.current = null;
    }
    setBlockedSeatNotice(null);
    soundEngine.playSeatClick(
      seatId === "C4" ||
        seatId === "D4" ||
        seatId.startsWith("C") ||
        seatId.startsWith("D")
    );

    if (onPreviewSeat) {
      onPreviewSeat(seatId);
    } else {
      onSelectSeat(seatId);
    }
  };

  const seatsTotal = selectedSeats.reduce((acc, id) => {
    const d = getSeatSpatialData(id, venue);
    return acc + (currency === "PKR" ? d.pricePKR : d.priceUSD);
  }, 0);

  const formatMoney = (val: number) =>
    currency === "PKR" ? `Rs. ${val.toLocaleString()}` : `$${val.toFixed(2)}`;

  const handleToggleLights = () => {
    soundEngine.playSeatClick(true);
    setLightingMode((prev) => (prev === "house" ? "dimmed" : "house"));
  };

  const isActiveSeatSelected = selectedSeats.includes(activeSeat);
  const isActiveSeatReserved = PRE_RESERVED_SEATS.includes(activeSeat);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030407] flex flex-col select-none animate-fade-in">
      {/* 3D Auditorium Canvas */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <ThreeCinemaSimulator
          venue={venue}
          selectedMovie={selectedMovie}
          selectedSeats={selectedSeats}
          activeSeat={activeSeat}
          cameraMode={cameraMode}
          lightingMode={lightingMode}
          audienceVisible={true}
          screenMode="movie"
          reclineAngle={0}
          laserConeVisible={false}
          resetTrigger={0}
          takenSeatFlashTrigger={blockedSeatNotice?.nonce ?? 0}
          trailerMuted={trailerMuted}
          showHelperTooltip={false}
          onSelectSeat={(seatId) => {
            handlePreviewSeat(seatId);
          }}
        />
      </div>

      {/* Floating Island Indicator when clicking a Taken / Unavailable Seat */}
      {blockedSeatNotice && (
        <div
          key={blockedSeatNotice.nonce}
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] pointer-events-none max-w-[92vw]"
        >
          <div className="floating-island-pop flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-[#16080b]/95 backdrop-blur-2xl border border-[#dc2626]/45 shadow-[0_18px_50px_rgba(0,0,0,0.85),0_0_26px_rgba(185,28,28,0.3)]">
            <span className="relative w-6 h-6 rounded-full bg-[#3f0e16] border border-[#dc2626]/50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3.5 h-3.5 text-[#fca5a5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L5.636 18.364"
                />
              </svg>
            </span>
            <span className="font-heading font-bold text-xs text-white leading-tight whitespace-nowrap">
              Table {blockedSeatNotice.seatId} is currently occupied
            </span>
          </div>
        </div>
      )}

      {/* Ultra-Clean Single Top Row: Back to Seats | Movie • Date • Time | Sound / Lights / Theatre View */}
      <div
        className={`relative z-20 w-full px-3 sm:px-6 pt-3 sm:pt-5 flex items-center justify-between gap-2 pointer-events-none transition-all duration-700 ease-out ${
          isHudIdle ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <button
          type="button"
          onClick={onBackToSeats}
          className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-[#0d0e12]/80 hover:bg-[#171920] text-zinc-200 hover:text-white border border-white/10 backdrop-blur-xl transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg flex-shrink-0"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>2D Map</span>
        </button>

        {/* Center Showtime Context Pill: Movie Name + Interactive Date & Showtime Dropdowns */}
        <div
          ref={topPillRef}
          className="relative pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-[#0d0e12]/80 backdrop-blur-xl border border-white/10 px-3 sm:px-4 py-1.5 rounded-full shadow-lg text-[11px] sm:text-xs text-zinc-200 min-w-0 max-w-[60vw] sm:max-w-none"
        >
          <span className="font-heading font-bold text-white truncate">
            {selectedMovie.title}
          </span>

          <span className="text-zinc-600 flex-shrink-0">•</span>

          {/* Date Dropdown Trigger */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSeatClick(false);
                setOpenTopMenu((prev) => (prev === "date" ? null : "date"));
              }}
              title="Change available date"
              className={`font-mono whitespace-nowrap flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                openTopMenu === "date"
                  ? "bg-white/15 text-white"
                  : "text-zinc-300 hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              <span>{selectedDate.toUpperCase()}</span>
              <span
                className={`text-[9px] text-zinc-400 transition-transform duration-150 ${
                  openTopMenu === "date" ? "rotate-180 text-white" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openTopMenu === "date" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-36 rounded-2xl bg-[#0d0e12]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 animate-fade-in">
                <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 border-b border-white/[0.06] mb-1">
                  Available Dates
                </div>
                {availableDates.map((d) => {
                  const isCurrent = selectedDate.trim().toUpperCase() === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        soundEngine.playSeatClick(false);
                        onSelectDate(d);
                        setOpenTopMenu(null);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? "bg-[#eae0c8] text-[#09090b] font-bold"
                          : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span>{d}</span>
                      {isCurrent && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="text-zinc-600 flex-shrink-0">•</span>

          {/* Showtime Dropdown Trigger */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSeatClick(false);
                setOpenTopMenu((prev) => (prev === "time" ? null : "time"));
              }}
              title="Change available showtime"
              className={`font-mono font-semibold whitespace-nowrap flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                openTopMenu === "time"
                  ? "bg-[#eae0c8]/25 text-white"
                  : "text-[#eae0c8] hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              <span>{selectedMovie.selectedTime}</span>
              <span
                className={`text-[9px] text-[#eae0c8]/75 transition-transform duration-150 ${
                  openTopMenu === "time" ? "rotate-180 text-white" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {openTopMenu === "time" && (
              <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2.5 w-36 rounded-2xl bg-[#0d0e12]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 animate-fade-in">
                <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 border-b border-white/[0.06] mb-1">
                  Available Times
                </div>
                {selectedMovie.showtimes.map((time) => {
                  const isCurrent = selectedMovie.selectedTime === time;
                  const crowd = getTimeSlotCrowd(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        soundEngine.playSeatClick(false);
                        onSelectShowtime(time);
                        setOpenTopMenu(null);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? "bg-amber-400 text-[#09090b] font-bold"
                          : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span>{time}</span>
                      <span className="text-[9px] opacity-80">{crowd.level}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Official Trailer Sound Toggle (shown only when movie is playing in dark mode) */}
          {lightingMode === "dimmed" && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSeatClick(false);
                setTrailerMuted((prev) => !prev);
              }}
              title={
                trailerMuted
                  ? "Unmute official movie trailer audio"
                  : "Mute trailer audio"
              }
              className={`px-3 py-1.5 rounded-full border backdrop-blur-xl transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg ${
                !trailerMuted
                  ? "bg-amber-400/20 text-amber-200 border-amber-400/45 shadow-[0_0_16px_rgba(251,191,36,0.2)]"
                  : "bg-[#0d0e12]/80 hover:bg-[#171920] text-zinc-300 hover:text-white border-white/10"
              }`}
            >
              {trailerMuted ? (
                <svg
                  className="w-3.5 h-3.5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
              <span className="hidden sm:inline">
                {trailerMuted ? "Muted" : "Sound On"}
              </span>
            </button>
          )}

          {/* Close Lights / Open Lights Toggle */}
          <button
            type="button"
            onClick={handleToggleLights}
            className={`px-3.5 py-1.5 rounded-full border backdrop-blur-xl transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg ${
              lightingMode === "house"
                ? "bg-[#eae0c8] text-[#09090b] border-white font-semibold shadow-[0_0_22px_rgba(234,224,200,0.4)]"
                : "bg-[#0d0e12]/80 hover:bg-[#171920] text-zinc-200 hover:text-white border-white/10"
            }`}
          >
            <LightbulbIcon
              className={`w-3.5 h-3.5 ${
                lightingMode === "house" ? "text-[#09090b]" : "text-[#eae0c8]"
              }`}
            />
            <span>
              {lightingMode === "house" ? "Party Glow" : "Daylight Mall"}
            </span>
          </button>

          {/* Table Sightline POV vs Full 3D Playland Orbit */}
          <button
            type="button"
            onClick={() =>
              setCameraMode((prev) => (prev === "pov" ? "overview" : "pov"))
            }
            title="Switch between Parent Café Sightline POV and Full 3D Playland Orbit"
            className={`px-3.5 py-1.5 rounded-full border backdrop-blur-xl transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg ${
              cameraMode === "overview"
                ? "bg-white/15 text-white border-white/30"
                : "bg-[#0d0e12]/80 hover:bg-[#171920] text-zinc-300 hover:text-white border-white/10"
            }`}
          >
            <TheaterIcon className="w-3.5 h-3.5 text-[#eae0c8]" />
            <span>
              {cameraMode === "overview" ? "Table Sightline" : "3D Playland"}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          "CHANGE SEAT" POPUP MODAL
         ===================================================================== */}
      {isSeatPickerOpen && (
        <div
          onClick={() => setIsSeatPickerOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-[32px] bg-[#101115]/95 border border-white/15 p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden animate-slide-up"
          >
            {/* Ambient Blurred Movie Poster Glow Inside Modal */}
            <div className="pointer-events-none absolute inset-0 opacity-25 overflow-hidden">
              <img
                src={selectedMovie.posterImage || "/images/posters/dune-part-two.jpg"}
                alt=""
                className="w-full h-full object-cover scale-125 blur-[55px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#101115]/50 via-[#101115]/75 to-[#101115]" />
            </div>

            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Switch Seat View
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tap any seat to preview its perspective in {venue.hallName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSeatPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white text-xs flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mini Curved Cinema Screen Preview */}
            <div className="relative z-10 w-full flex flex-col items-center my-5">
              <div
                className="w-4/5 h-8 rounded-t-[100%] rounded-b-[30%] overflow-hidden border-t border-white/40 shadow-[0_10px_25px_rgba(255,255,255,0.1)]"
                style={{ transform: "perspective(260px) rotateX(-18deg)" }}
              >
                <img
                  src={selectedMovie.posterImage || "/images/posters/dune-part-two.jpg"}
                  alt="Screen"
                  className="w-full h-full object-cover opacity-85"
                />
              </div>
              <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-400 uppercase mt-1">
                {venue.isIMAX ? "IMAX CURVED SCREEN" : "STANDARD 4K SCREEN"}
              </span>
            </div>

            {/* Curved Mini Recliner Seat Grid */}
            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2 items-center my-2">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-1 sm:gap-2">
                  <span className="w-3 xs:w-4 text-right font-mono text-[9px] xs:text-[10px] text-zinc-500">
                    {row}
                  </span>

                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map(
                      (col) => {
                        const seatId = `${row}${col}`;
                        const isReserved = PRE_RESERVED_SEATS.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        const isCurrent = activeSeat === seatId;
                        const isVIP =
                          (row === "C" || row === "D") && col >= 3 && col <= 6;

                        return (
                          <React.Fragment key={seatId}>
                            <button
                              type="button"
                              aria-disabled={isReserved}
                              onClick={() => {
                                handlePreviewSeat(seatId);
                                if (!isReserved) {
                                  setIsSeatPickerOpen(false);
                                }
                              }}
                              className={`w-6 xs:w-7 sm:w-9 h-6 xs:h-7 sm:h-8 rounded-lg text-[8px] xs:text-[9px] sm:text-[10px] font-mono font-semibold transition-all flex flex-col items-center justify-between py-0.5 px-1 cursor-pointer ${
                                isReserved
                                  ? "bg-gradient-to-b from-[#3f0e16] to-[#1d060a] text-[#fca5a5]/75 cursor-not-allowed border border-[#991b1b]/55"
                                  : isCurrent
                                  ? "bg-gradient-to-b from-[#d4c7ae] to-[#a6987e] text-[#09090b] font-bold shadow-[0_4px_14px_rgba(212,199,174,0.25)] scale-105 border border-[#eae0c8]/80"
                                  : isSelected
                                  ? "bg-[#221e18] text-[#d8ccb4] border border-[#eae0c8]/40"
                                  : isVIP
                                  ? "bg-gradient-to-b from-[#151310] to-[#0b0a08] hover:from-[#1d1a16] text-zinc-400 hover:text-zinc-200 border border-[#eae0c8]/15"
                                  : "bg-gradient-to-b from-[#111217] to-[#090a0d] hover:from-[#171920] text-zinc-500 hover:text-zinc-200 border border-white/[0.07]"
                              }`}
                            >
                              <span
                                className={`w-[72%] h-[1.5px] rounded-full ${
                                  isReserved
                                    ? "bg-[#ef4444]/30"
                                    : isCurrent
                                    ? "bg-[#09090b]/30"
                                    : "bg-white/10"
                                }`}
                              />
                              <span className="leading-none">{seatId}</span>
                              <span
                                className={`w-[85%] h-1 rounded-t-sm ${
                                  isReserved
                                    ? "bg-[#4a111a]"
                                    : isCurrent
                                    ? "bg-[#8c7f67]/60"
                                    : isVIP
                                    ? "bg-[#1e1b16]"
                                    : "bg-[#161820]"
                                }`}
                              />
                            </button>

                            {(col === 2 || col === 6) && (
                              <div className="w-1 sm:w-2" />
                            )}
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>

                  <span className="w-3 xs:w-4 text-left font-mono text-[9px] xs:text-[10px] text-zinc-500">
                    {row}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer Legend & Close */}
            <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15161c] border border-white/20" />
                  <span>Standard</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1a1815] border border-[#eae0c8]/50" />
                  <span>VIP</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eae0c8]" />
                  <span className="text-white">Viewing</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f0e16] border border-[#991b1b]/70" />
                  <span className="text-red-300/80">Taken</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsSeatPickerOpen(false)}
                className="px-5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 hover:text-white text-xs font-medium cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Compact Bottom Booking Dock */}
      <div
        className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[94%] max-w-xl z-30 transition-all duration-700 ease-out ${
          isHudIdle
            ? "opacity-0 translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="bg-[#0d0e12]/85 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 sm:p-2 pl-3.5 sm:pl-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Current Viewing Seat & Total */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-white text-xs sm:text-sm">
                Table {activeSeatData.id}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300">
                {activeSeatData.isVIP ? "VIP Booth" : "Café Table"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 block truncate">
              {selectedSeats.length > 0
                ? `${selectedSeats.join(", ")} • ${formatMoney(seatsTotal)}`
                : `No tables selected • ${formatMoney(0)}`}
            </span>
          </div>

          {/* Right: Add Seat, Change Seat Popup & Continue */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {!isActiveSeatReserved && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSeatClick(activeSeatData.isVIP);
                  onSelectSeat(activeSeat);
                }}
                className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-full font-heading font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer border ${
                  isActiveSeatSelected
                    ? "bg-[#eae0c8]/15 text-[#eae0c8] border-[#eae0c8]/40 hover:bg-[#eae0c8]/25"
                    : "bg-white/[0.08] hover:bg-white/[0.16] text-[#eae0c8] border-[#eae0c8]/30"
                }`}
              >
                {isActiveSeatSelected
                  ? `✓ ${activeSeat}`
                  : `+ Add ${activeSeat}`}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSeatPickerOpen(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] text-zinc-200 hover:text-white border border-white/10 font-heading font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer"
            >
              Switch Table
            </button>

            <button
              type="button"
              onClick={onProceedToSnacks}
              className="py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#09090b] font-heading font-bold text-[11px] sm:text-xs transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <span>Socks &amp; Café</span>
              <ArrowRightIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#09090b]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
