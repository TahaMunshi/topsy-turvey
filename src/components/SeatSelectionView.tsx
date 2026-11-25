import React, { useState } from "react";
import {
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
  PRE_RESERVED_SEATS,
  ROWS,
  SEATS_PER_ROW,
} from "../constants/cinemaData";
import { soundEngine } from "../utils/audioEffects";
import { ArrowLeftIcon, EyeIcon, PopcornIcon } from "./Icons";

interface SeatSelectionViewProps {
  venue: KarachiVenue;
  selectedMovie: MovieItem;
  selectedDate: string;
  selectedSeats: string[];
  activeSeat: string;
  currency: "PKR" | "USD";
  onSelectDate: (date: string) => void;
  onSelectShowtime: (time: string) => void;
  onBackToOverview: () => void;
  onSelectSeat: (seatId: string) => void;
  onSelectCouplePair: () => void;
  onSetSeatsPreset?: (seats: string[]) => void;
  onProceedToPreview: () => void;
  onProceedToSnacks: () => void;
  onBuyTicketsDirect: () => void;
}

const getAvailableDatesForMovie = (releaseDateHeader: string): string[] => {
  const baseStr = releaseDateHeader.trim().toUpperCase();
  const parts = baseStr.split(/\s+/);
  const startDay = parseInt(parts[0], 10);
  const monthStr = parts[1] || "JUN";
  if (Number.isNaN(startDay)) {
    return ["12 JUN", "13 JUN", "14 JUN", "15 JUN"];
  }
  const monthLengths: Record<string, number> = {
    JAN: 31,
    FEB: 28,
    MAR: 31,
    APR: 30,
    MAY: 31,
    JUN: 30,
    JUL: 31,
    AUG: 31,
    SEP: 30,
    OCT: 31,
    NOV: 30,
    DEC: 31,
  };
  const nextMonths: Record<string, string> = {
    JAN: "FEB",
    FEB: "MAR",
    MAR: "APR",
    APR: "MAY",
    MAY: "JUN",
    JUN: "JUL",
    JUL: "AUG",
    AUG: "SEP",
    SEP: "OCT",
    OCT: "NOV",
    NOV: "DEC",
    DEC: "JAN",
  };
  const maxDay = monthLengths[monthStr] || 30;
  return Array.from({ length: 4 }, (_, i) => {
    const rawDay = startDay + i;
    if (rawDay <= maxDay) {
      return `${String(rawDay).padStart(2, "0")} ${monthStr}`;
    }
    const wrappedDay = rawDay - maxDay;
    const nextMonth = nextMonths[monthStr] || monthStr;
    return `${String(wrappedDay).padStart(2, "0")} ${nextMonth}`;
  });
};

const SEAT_PRESETS = [
  { count: 1, label: "1 Seat", subtitle: "Center Solo", seats: ["C4"], pricePKR: 2500 },
  { count: 2, label: "2 Seats", subtitle: "Center Pair", seats: ["C4", "C5"], pricePKR: 5000 },
  { count: 3, label: "3 Seats", subtitle: "VIP Trio", seats: ["C3", "C4", "C5"], pricePKR: 7500 },
  { count: 4, label: "4 Seats", subtitle: "Full VIP Row", seats: ["C3", "C4", "C5", "C6"], pricePKR: 10000 },
];

export const SeatSelectionView: React.FC<SeatSelectionViewProps> = ({
  venue,
  selectedMovie,
  selectedDate,
  selectedSeats,
  activeSeat,
  currency,
  onSelectDate,
  onSelectShowtime,
  onBackToOverview,
  onSelectSeat,
  onSetSeatsPreset,
  onProceedToPreview,
  onProceedToSnacks,
  onBuyTicketsDirect,
}) => {
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [preferredRow, setPreferredRow] = useState<string>("C");

  const seatsTotal = selectedSeats.reduce((acc, id) => {
    const d = getSeatSpatialData(id);
    const d = getSeatSpatialData(id, venue);
    return acc + (currency === "PKR" ? d.pricePKR : d.priceUSD);
  }, 0);

  const formatMoney = (val: number) =>
    currency === "PKR" ? `Rs. ${val.toLocaleString()}` : `$${val.toFixed(2)}`;

  const handleApplyPartyCount = (count: number, targetRow = preferredRow) => {
    const colsByCount: Record<number, number[]> = {
      1: [4],
      2: [4, 5],
      3: [3, 4, 5],
      4: [3, 4, 5, 6],
    };
    const cols = colsByCount[count] || [4, 5];
    const nextSeats = cols
      .map((c) => `${targetRow}${c}`)
      .filter((s) => !PRE_RESERVED_SEATS.includes(s));

    const finalSeats = nextSeats.length > 0 ? nextSeats : ["C4", "C5"].slice(0, count);
    if (onSetSeatsPreset) {
      onSetSeatsPreset(finalSeats);
    }
    setIsSeatModalOpen(false);
  };

  return (
    <div className="relative w-full min-h-screen lg:h-screen bg-[#09090b] text-[#f4efe6] flex flex-col justify-between px-2 sm:px-8 pt-16 sm:pt-20 pb-6 lg:pb-3 select-none overflow-y-auto lg:overflow-hidden">
      {/* Dynamic Full-Bleed Blurred Movie Poster Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          key={selectedMovie.id}
          src={selectedMovie.posterImage || "/images/posters/dune-part-two.jpg"}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-110 blur-[70px] saturate-150 opacity-45 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/60 via-[#09090b]/45 to-[#09090b]/88" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_15%,rgba(9,9,11,0.82)_85%)]" />
      </div>

      {/* =====================================================================
          1. SINGLE-ROW MINIMALIST HEADER BAR (Zero Buzzwords, Zero Wrapping)
         ===================================================================== */}
      <div className="relative z-30 w-full max-w-[1320px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Back Pill + Movie Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToOverview}
            className="px-3.5 py-1.5 rounded-full bg-[#121316]/85 hover:bg-[#1a1c22] backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-baseline gap-2.5 truncate">
            <h1 className="font-heading text-sm sm:text-base lg:text-lg font-extrabold tracking-wide text-white uppercase truncate">
              {selectedMovie.title}
            </h1>
            <span className="hidden md:inline text-xs text-zinc-400">
              • {venue.hallName}
            </span>
          </div>
        </div>

        {/* Right: Date Selector, Change Seats Popup Trigger & Seat View */}
        {/* Right: Date Selector & Seat View */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateMenuOpen((prev) => !prev);
                setIsSeatModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#121316]/85 hover:bg-[#1a1c22] backdrop-blur-md border border-white/12 text-xs font-medium text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>{selectedDate.includes("•") ? selectedMovie.releaseDateHeader : selectedDate}</span>
              <span className="text-[10px] text-zinc-500">▾</span>
            </button>

            {isDateMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#121316]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-2xl z-50 animate-fade-in">
                {getAvailableDatesForMovie(selectedMovie.releaseDateHeader).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onSelectDate(d);
                      setIsDateMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                      selectedDate.toUpperCase() === d
                        ? "bg-[#eae0c8] text-[#09090b] font-bold"
                        : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span>{d}</span>
                    {selectedDate.toUpperCase() === d && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sexy "Change Seats / Party Size" Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsSeatModalOpen(true);
              setIsDateMenuOpen(false);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#121316]/85 hover:bg-[#1a1c22] backdrop-blur-md border border-white/12 text-xs font-medium text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>
              {selectedSeats.length === 0
                ? "Pick Seats"
                : `${selectedSeats.length} ${selectedSeats.length === 1 ? "Seat" : "Seats"}`}
            </span>
            <span className="text-[10px] text-zinc-500">▾</span>
          </button>

          {/* Seat View Button */}
          <button
            type="button"
            onClick={onProceedToPreview}
            className="px-3.5 py-1.5 rounded-full bg-[#121316]/85 hover:bg-[#1a1c22] backdrop-blur-md border border-white/12 text-xs font-medium text-[#eae0c8] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <EyeIcon className="w-3.5 h-3.5 text-[#eae0c8]" />
            <span className="hidden sm:inline">View from {activeSeat}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. FULL-WIDTH CURVED SCREEN & MINIMALIST STADIUM SEATS
         ===================================================================== */}
      <div className="relative z-10 flex-1 w-full max-w-[1320px] mx-auto flex flex-col items-center justify-between py-2">
        {/* Clean Curved Cinema Screen (No Buzzword Subtitles) */}
        <div
          onClick={onProceedToPreview}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onProceedToPreview();
          }}
          title="Click screen to preview view from your seat"
          className="relative w-full max-w-5xl flex flex-col items-center cursor-pointer group"
        >
          <div
            className="relative w-[90%] sm:w-[86%] h-12 sm:h-14 lg:h-16 rounded-t-[100%] rounded-b-[28%] overflow-hidden border-t border-white/35 shadow-[0_14px_45px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-[1.01]"
            style={{
              transform: venue.isIMAX
                ? "perspective(480px) rotateX(-20deg)"
                : "perspective(720px) rotateX(-10deg)",
            }}
          >
            <img
              src={selectedMovie.posterImage || "/images/posters/dune-part-two.jpg"}
              alt="Screen"
              className="w-full h-full object-cover object-center brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/85" />
          </div>

          <div className="flex items-center gap-2 mt-1.5 transition-colors">
            <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-400 group-hover:text-zinc-200 uppercase">
              {venue.isIMAX
                ? venue.screenType === "imax-70mm"
                  ? "COLOSSAL 70MM IMAX SCREEN"
                  : "IMAX DUAL LASER SCREEN"
                : "STANDARD DCI 4K SCREEN"}
            </span>
            <span className="text-[8px] font-mono text-zinc-600 hidden sm:inline">•</span>
            <span className="text-[9px] font-mono text-zinc-500 hidden sm:inline">
              {venue.screenSpecs}
            </span>
          </div>
        </div>

        {/* Enlarged Minimalist Recliner Seats Spanning the 16:9 Width */}
        <div className="w-full flex flex-col items-center justify-center gap-1 sm:gap-2 my-auto">
          {ROWS.map((row) => {
            const isVIPRow = row === "C" || row === "D";
            return (
              <div
                key={row}
                className="w-full flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-4"
              >
                <div className="w-3 xs:w-4 sm:w-5 text-right font-mono text-[9px] xs:text-[10px] sm:text-[11px] text-zinc-500">
                  {row}
                </div>

                <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2.5 lg:gap-3.5">
                  {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map((col) => {
                    const seatId = `${row}${col}`;
                    const isReserved = PRE_RESERVED_SEATS.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const isVIP = isVIPRow && col >= 3 && col <= 6;

                    const distFromCenter = col - 4.5;
                    const curveLiftPx = Math.round(Math.abs(distFromCenter) * 1.1);
                    const curveAngleDeg = -distFromCenter * 1.2;

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          type="button"
                          disabled={isReserved}
                          onClick={() => {
                            if (!isReserved) {
                              soundEngine.playSeatClick(isVIP);
                              onSelectSeat(seatId);
                            }
                          }}
                          style={{
                            transform: `translateY(-${curveLiftPx}px) rotate(${curveAngleDeg}deg)`,
                          }}
                          className={`group relative w-7 xs:w-8 sm:w-14 md:w-16 lg:w-20 xl:w-24 h-7 xs:h-8 sm:h-9 lg:h-10 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isReserved
                              ? "opacity-90 cursor-not-allowed"
                              : isSelected
                              ? "scale-[1.04] z-10"
                              : "hover:scale-[1.03]"
                          }`}
                        >
                          {/* Left Sculpted Padded Armrest */}
                          <span
                            className={`hidden sm:block w-1.5 lg:w-2 h-[72%] rounded-l-md border-y border-l transition-colors ${
                              isReserved
                                ? "bg-[#26090e] border-[#7f1d1d]/40"
                                : isSelected
                                ? "bg-[#9e9178] border-[#dfd3bc]/50"
                                : isVIP
                                ? "bg-[#0e0d0b] border-[#eae0c8]/15 group-hover:border-[#eae0c8]/30"
                                : "bg-[#0a0b0e] border-white/[0.06] group-hover:border-white/15"
                            }`}
                          />

                          {/* Main Contoured Leather Cushion & Quilted Backrest */}
                          <span
                            className={`relative flex-1 h-full rounded-lg sm:rounded-md flex flex-col items-center justify-between px-1 py-0.5 border transition-all overflow-hidden ${
                              isReserved
                                ? "bg-gradient-to-b from-[#3f0e16] via-[#2c0910] to-[#1b0509] border-[#991b1b]/55 text-[#fca5a5]/75 shadow-[inset_0_1px_0_rgba(248,113,113,0.14),0_4px_10px_rgba(0,0,0,0.65)]"
                                : isSelected
                                ? "bg-gradient-to-b from-[#d4c7ae] via-[#c2b49a] to-[#a6987e] text-[#09090b] border-[#eae0c8]/80 shadow-[0_4px_16px_rgba(212,199,174,0.22),inset_0_1px_1px_rgba(255,255,255,0.45)]"
                                : isVIP
                                ? "bg-gradient-to-b from-[#161411] via-[#11100d] to-[#0b0a08] hover:from-[#1d1a16] hover:to-[#110f0c] border-[#eae0c8]/[0.14] group-hover:border-[#eae0c8]/35 text-zinc-400 group-hover:text-zinc-200 shadow-[inset_0_1px_0_rgba(234,224,200,0.08),0_4px_10px_rgba(0,0,0,0.65)]"
                                : "bg-gradient-to-b from-[#121318] via-[#0e0f13] to-[#090a0d] hover:from-[#181a21] hover:to-[#0d0e12] border-white/[0.07] group-hover:border-white/20 text-zinc-500 group-hover:text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_10px_rgba(0,0,0,0.65)]"
                            }`}
                          >
                            {/* Contoured Waterfall Front Cushion Roll (facing screen) */}
                            <span
                              className={`w-[78%] h-[2px] rounded-full ${
                                isReserved
                                  ? "bg-[#ef4444]/30"
                                  : isSelected
                                  ? "bg-[#09090b]/25"
                                  : isVIP
                                  ? "bg-[#eae0c8]/15"
                                  : "bg-white/[0.08]"
                              }`}
                            />

                            {/* Subdued Seat ID */}
                            <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-mono font-semibold tracking-tight leading-none my-auto">
                              {seatId}
                            </span>

                            {/* Sculpted Recliner Headrest Bolster (at back of chair) */}
                            <span
                              className={`w-[86%] h-1 sm:h-1.5 rounded-t-md rounded-b-sm border-t ${
                                isReserved
                                  ? "bg-[#4a111a] border-[#991b1b]/45"
                                  : isSelected
                                  ? "bg-[#8c7f67]/55 border-[#09090b]/20"
                                  : isVIP
                                  ? "bg-[#1e1b16] border-[#eae0c8]/15"
                                  : "bg-[#171920] border-white/[0.08]"
                              }`}
                            />
                          </span>

                          {/* Right Sculpted Padded Armrest */}
                          <span
                            className={`hidden sm:block w-1.5 lg:w-2 h-[72%] rounded-r-md border-y border-r transition-colors ${
                              isReserved
                                ? "bg-[#26090e] border-[#7f1d1d]/40"
                                : isSelected
                                ? "bg-[#9e9178] border-[#dfd3bc]/50"
                                : isVIP
                                ? "bg-[#0e0d0b] border-[#eae0c8]/15 group-hover:border-[#eae0c8]/30"
                                : "bg-[#0a0b0e] border-white/[0.06] group-hover:border-white/15"
                            }`}
                          />
                        </button>

                        {/* Clean Aisle Spacer (No vertical text) */}
                        {(col === 2 || col === 6) && (
                          <div className="w-1.5 xs:w-2.5 sm:w-5 lg:w-8" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="w-3 xs:w-4 sm:w-5 text-left font-mono text-[9px] xs:text-[10px] sm:text-[11px] text-zinc-500">
                  {row}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          3. MINIMALIST BOTTOM BAR (Showtimes + Simple Legend + Split-Pill Buy CTA)
         ===================================================================== */}
      <div className="relative z-20 w-full max-w-[1320px] mx-auto pt-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Showtime Slot Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-zinc-400 mr-1">
            Slot:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {selectedMovie.showtimes.map((time) => {
              const isSelected = time === selectedMovie.selectedTime;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectShowtime(time)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1d1f26] text-white border border-white/50 font-semibold"
                      : "bg-[#121316]/85 text-zinc-400 hover:text-zinc-200 border border-white/10"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Ultra-Minimalist Legend & Snacks Link (No FOV/Atmos Buzzwords) */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#161820] border border-white/20" />
            <span>Standard</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1f1d18] border border-[#eae0c8]/50" />
            <span>VIP</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eae0c8]" />
            <span className="text-zinc-200">Selected</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f0e16] border border-[#991b1b]/70" />
            <span className="text-red-300/80">Taken</span>
          </span>
          <span className="text-zinc-700">|</span>
          <button
            type="button"
            onClick={onProceedToSnacks}
            className="text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PopcornIcon className="w-3.5 h-3.5 text-[#eae0c8]" />
            <span>Snacks</span>
          </button>
        </div>

        {/* Right: Signature Split-Pill Buy Tickets + Total Price */}
        <div className="w-full sm:w-auto min-w-0 sm:min-w-[280px] rounded-full bg-[#121316]/95 border border-white/15 p-1 flex items-center justify-between shadow-2xl">
          <button
            type="button"
            disabled={selectedSeats.length === 0}
            onClick={onBuyTicketsDirect}
            className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-[#eae0c8] hover:bg-[#f4efe6] disabled:opacity-40 text-[#09090b] font-heading font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Buy Tickets
          </button>

          <div className="px-3 sm:px-5 py-1 text-right flex flex-col items-end justify-center">
            <span className="font-mono-numbers text-sm sm:text-base font-bold text-white leading-tight">
              {formatMoney(seatsTotal)}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 leading-tight">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Select seats"}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. SEXY "CHANGE SEATS" POPUP MODAL
         ===================================================================== */}
      {isSeatModalOpen && (
        <div
          onClick={() => setIsSeatModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[32px] bg-[#101115]/95 border border-white/15 p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden animate-slide-up"
          >
            {/* Ambient Blurred Movie Poster Glow Inside Popup */}
            <div className="pointer-events-none absolute inset-0 opacity-25 overflow-hidden">
              <img
                src={selectedMovie.posterImage || "/images/posters/dune-part-two.jpg"}
                alt=""
                className="w-full h-full object-cover scale-125 blur-[55px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#101115]/40 via-[#101115]/75 to-[#101115]" />
            </div>

            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Change Seats
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select party size and preferred auditorium zone
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSeatModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Preferred Row Zone Selector */}
            <div className="relative z-10 mt-4">
              <span className="text-[11px] font-medium text-zinc-400 block mb-2">
                Preferred Row Zone
              </span>
              <div className="grid grid-cols-4 gap-1.5 bg-[#15161c] p-1 rounded-2xl border border-white/[0.07]">
                {[
                  { row: "B", tag: "Front" },
                  { row: "C", tag: "VIP Center" },
                  { row: "D", tag: "VIP Prime" },
                  { row: "F", tag: "Rear" },
                ].map((z) => {
                  const active = preferredRow === z.row;
                  return (
                    <button
                      key={z.row}
                      type="button"
                      onClick={() => setPreferredRow(z.row)}
                      className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        active
                          ? "bg-[#eae0c8] text-[#09090b] font-bold shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold block">
                        Row {z.row}
                      </span>
                      <span
                        className={`text-[9px] block ${
                          active ? "text-[#09090b]/75" : "text-zinc-500"
                        }`}
                      >
                        {z.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Party Size Quick-Cards */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 my-4">
              {SEAT_PRESETS.map((preset) => {
                const isActive = selectedSeats.length === preset.count;
                return (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => handleApplyPartyCount(preset.count, preferredRow)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-[#eae0c8] text-[#09090b] border-white shadow-lg scale-[1.01]"
                        : "bg-[#161820]/90 hover:bg-[#1e212b] text-zinc-200 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-heading text-sm font-bold">
                        {preset.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#09090b]/15 text-[#09090b] font-semibold"
                            : "bg-white/[0.06] text-zinc-400"
                        }`}
                      >
                        Row {preferredRow}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2.5">
                      <span
                        className={`text-[11px] ${
                          isActive ? "text-[#09090b]/75" : "text-zinc-400"
                        }`}
                      >
                        {preset.subtitle}
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {preset.count}×
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Summary & Done CTA */}
            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Selected:{" "}
                <strong className="text-white">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </strong>{" "}
                • {formatMoney(seatsTotal)}
              </div>
              <button
                type="button"
                onClick={() => setIsSeatModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#eae0c8] hover:bg-[#f4efe6] text-[#09090b] font-heading font-bold text-xs cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
