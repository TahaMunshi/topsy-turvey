import React, { useState } from "react";
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

const AVAILABLE_DAYS = ["TODAY", "TOMORROW", "SAT", "SUN"];

const TABLE_PRESETS = [
  { count: 1, label: "1 Child + Table", subtitle: "Solo Parent Table", seats: ["C4"] },
  { count: 2, label: "2 Kids + Booth", subtitle: "Prime Sightline Pair", seats: ["C4", "C5"] },
  { count: 3, label: "3 Kids + Booth", subtitle: "Family VIP Trio", seats: ["C3", "C4", "C5"] },
  { count: 4, label: "4+ Birthday / Group", subtitle: "Full VIP Row", seats: ["C3", "C4", "C5", "C6"] },
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
  const [highlightedZone, setHighlightedZone] = useState<"toddler" | "maze" | "trampoline">(
    selectedMovie.id === "toddler-ball-pit"
      ? "toddler"
      : selectedMovie.id === "trampoline-climbing"
      ? "trampoline"
      : "maze"
  );

  const isRecommendedTable = (row: string, col: number) => {
    if (highlightedZone === "toddler") return (row === "A" || row === "B") && col <= 4;
    if (highlightedZone === "trampoline") return (row === "A" || row === "B") && col >= 5;
    return (row === "C" || row === "D") && col >= 3 && col <= 6;
  };

  const seatsTotal = selectedSeats.reduce((acc, id) => {
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

  const activeCrowd = getTimeSlotCrowd(selectedMovie.selectedTime);

  return (
    <div className="relative w-full min-h-screen lg:h-screen bg-[#09090b] text-[#f4efe6] flex flex-col justify-between px-2 sm:px-8 pt-16 sm:pt-20 pb-6 lg:pb-3 select-none overflow-y-auto lg:overflow-hidden">
      {/* Dynamic Full-Bleed Blurred Playland Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          key={selectedMovie.id}
          src={selectedMovie.posterImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-110 blur-[70px] saturate-150 opacity-35 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/65 via-[#09090b]/55 to-[#09090b]/92" />
      </div>

      {/* 1. TOP HEADER BAR */}
      <div className="relative z-30 w-full max-w-[1320px] mx-auto flex items-center justify-between gap-4">
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
              • 2nd Floor Playland &amp; Parent Café
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Day Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateMenuOpen((prev) => !prev);
                setIsSeatModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#121316]/85 hover:bg-[#1a1c22] backdrop-blur-md border border-white/12 text-xs font-medium text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>{selectedDate}</span>
              <span className="text-[10px] text-zinc-500">▾</span>
            </button>

            {isDateMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#121316]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-2xl z-50 animate-fade-in">
                {AVAILABLE_DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onSelectDate(d);
                      setIsDateMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                      selectedDate.toUpperCase() === d
                        ? "bg-amber-400 text-[#09090b] font-bold"
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

          {/* Group / Table Preset Trigger */}
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
                ? "Pick Tables"
                : `${selectedSeats.length} ${selectedSeats.length === 1 ? "Table" : "Tables"}`}
            </span>
            <span className="text-[10px] text-zinc-500">▾</span>
          </button>

          {/* 3D Sightline View Button */}
          <button
            type="button"
            onClick={onProceedToPreview}
            className="px-3.5 py-1.5 rounded-full bg-amber-400/15 hover:bg-amber-400/25 backdrop-blur-md border border-amber-400/35 text-xs font-medium text-amber-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <EyeIcon className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">3D Sightline ({activeSeat})</span>
          </button>
        </div>
      </div>

      {/* 2. 2ND-FLOOR PLAYLAND FLOORPLAN + PARENT CAFÉ SUPERVISION TABLE SELECTOR */}
      <div className="relative z-10 flex-1 w-full max-w-[1320px] mx-auto flex flex-col items-center justify-between py-2">
        {/* 2nd Floor Playland Interactive Zones Banner */}
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          <div className="w-[96%] sm:w-[90%] grid grid-cols-3 gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-[#121316]/85 border border-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              onClick={() => setHighlightedZone("toddler")}
              className={`rounded-xl px-2 py-1.5 sm:py-2 text-center transition-all cursor-pointer border ${
                highlightedZone === "toddler"
                  ? "bg-emerald-500/25 border-emerald-400/70 shadow-[0_0_20px_rgba(16,185,129,0.22)]"
                  : "bg-emerald-500/10 border-emerald-400/25 hover:bg-emerald-500/20"
              }`}
            >
              <span className="text-[9px] sm:text-[11px] font-heading font-bold text-emerald-300 block truncate">
                Toddler Ball Pit &amp; Mini Kitchens
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-emerald-200/75 hidden sm:block">
                Best Sightline: Tables A1–B4
              </span>
            </button>

            <button
              type="button"
              onClick={() => setHighlightedZone("maze")}
              className={`rounded-xl px-2 py-1.5 sm:py-2 text-center transition-all cursor-pointer border ${
                highlightedZone === "maze"
                  ? "bg-amber-500/25 border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.22)]"
                  : "bg-amber-500/10 border-amber-400/25 hover:bg-amber-500/20"
              }`}
            >
              <span className="text-[9px] sm:text-[11px] font-heading font-bold text-amber-300 block truncate">
                Multi-Level Soft-Play Maze
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-amber-200/75 hidden sm:block">
                Best Sightline: VIP Booths C3–D6
              </span>
            </button>

            <button
              type="button"
              onClick={() => setHighlightedZone("trampoline")}
              className={`rounded-xl px-2 py-1.5 sm:py-2 text-center transition-all cursor-pointer border ${
                highlightedZone === "trampoline"
                  ? "bg-sky-500/25 border-sky-400/70 shadow-[0_0_20px_rgba(56,189,248,0.22)]"
                  : "bg-sky-500/10 border-sky-400/25 hover:bg-sky-500/20"
              }`}
            >
              <span className="text-[9px] sm:text-[11px] font-heading font-bold text-sky-300 block truncate">
                Trampoline &amp; Climbing Wall
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-sky-200/75 hidden sm:block">
                Best Sightline: Tables A5–B8
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[9px] font-mono tracking-[0.22em] text-amber-300/90 uppercase">
              GLASS SIGHTLINE PARTITION • PARENT CAFÉ SUPERVISION DECK
            </span>
            <span className="text-[8px] font-mono text-zinc-600 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={onProceedToPreview}
              className="text-[9px] font-mono text-amber-300 hover:text-white underline underline-offset-2 hidden sm:inline cursor-pointer"
            >
              Launch 3D Explorer →
            </button>
          </div>
        </div>

        {/* Parent Café Supervision Tables Grid */}
        <div className="w-full flex flex-col items-center justify-center gap-1.5 sm:gap-2 my-auto">
          {ROWS.map((row) => {
            const isVIPRow = row === "C" || row === "D";
            const rowTag =
              row === "A" || row === "B"
                ? "Glass"
                : isVIPRow
                ? "VIP"
                : "Café";
            return (
              <div
                key={row}
                className="w-full flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-3"
              >
                <div className="w-8 sm:w-12 text-right font-mono text-[9px] sm:text-[10px] text-zinc-400">
                  <span className="font-bold text-zinc-300">{row}</span>
                  <span className="hidden sm:inline text-zinc-500"> {rowTag}</span>
                </div>

                <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2.5 lg:gap-3.5">
                  {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map((col) => {
                    const seatId = `${row}${col}`;
                    const isReserved = PRE_RESERVED_SEATS.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const isVIP = isVIPRow && col >= 3 && col <= 6;
                    const isBestSightline = !isReserved && !isSelected && isRecommendedTable(row, col);

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
                          title={
                            isReserved
                              ? `Table ${seatId} Occupied`
                              : `Table ${seatId} (${isVIP ? "VIP Sightline Booth" : "Parent Café Table"}${isBestSightline ? " • Best Sightline for Selected Zone" : ""})`
                          }
                          className={`group relative w-7 xs:w-8 sm:w-14 md:w-16 lg:w-20 xl:w-22 h-7 xs:h-8 sm:h-9 lg:h-10 rounded-xl flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer ${
                            isReserved
                              ? "bg-[#2a0c12] border-[#991b1b]/55 text-[#fca5a5]/70 opacity-85 cursor-not-allowed"
                              : isSelected
                              ? "bg-gradient-to-b from-amber-300 to-amber-500 text-[#09090b] border-amber-200 font-bold scale-[1.05] shadow-[0_4px_16px_rgba(245,158,11,0.35)] z-10"
                              : isBestSightline
                              ? "bg-[#16201b] hover:bg-[#1e2d26] border-emerald-400/65 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                              : isVIP
                              ? "bg-[#1a1610] hover:bg-[#251f15] border-amber-400/35 hover:border-amber-300/70 text-amber-200"
                              : "bg-[#12141a] hover:bg-[#1a1d26] border-white/12 hover:border-white/30 text-zinc-300"
                          }`}
                        >
                          <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-mono font-semibold leading-none">
                            {seatId}
                          </span>
                          <span
                            className={`hidden sm:block text-[7px] font-mono uppercase mt-0.5 leading-none ${
                              isSelected
                                ? "text-[#09090b]/75 font-bold"
                                : isVIP
                                ? "text-amber-300/70"
                                : "text-zinc-500"
                            }`}
                          >
                            {isReserved ? "Busy" : isVIP ? "Booth" : "Table"}
                          </span>
                        </button>

                        {(col === 2 || col === 6) && (
                          <div className="w-1.5 xs:w-2.5 sm:w-5 lg:w-7" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="w-8 sm:w-12 text-left font-mono text-[9px] sm:text-[10px] text-zinc-500">
                  {row}
                </div>
              </div>
            );
          })}

          {/* 2nd Floor Landmarks Strip */}
          <div className="w-[96%] sm:w-[90%] max-w-5xl mt-1.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[9px] sm:text-[10px] font-mono text-zinc-400">
            <span>🧦 Check-In &amp; Grip Socks Desk</span>
            <span className="hidden sm:inline text-emerald-300/90">
              ● Highlighted tables = Best sightline for selected zone
            </span>
            <span>☕ Espresso Bar &amp; Free Wi-Fi</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR: 11 AM - 11 PM TIME SLOTS WITH CROWD LEVELS + LEGEND + CTA */}
      <div className="relative z-20 w-full max-w-[1320px] mx-auto pt-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Time Slots (11:00 AM - 11:00 PM) with Crowd Levels */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="text-xs font-medium text-zinc-400">Slots:</span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${activeCrowd.colorClass}`}
            >
              {activeCrowd.level} ({activeCrowd.pct}%)
            </span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {selectedMovie.showtimes.map((time) => {
              const isSelected = time === selectedMovie.selectedTime;
              const crowd = getTimeSlotCrowd(time);
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectShowtime(time)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1d1f26] text-white border border-amber-400/60 font-semibold"
                      : "bg-[#121316]/85 text-zinc-400 hover:text-zinc-200 border border-white/10"
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: crowd.dotColor }}
                  />
                  <span>{time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Legend & Socks/Café Link */}
        <div className="hidden xl:flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#12141a] border border-white/25" />
            <span>Café Table</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#1a1610] border border-amber-400/50" />
            <span>VIP Booth</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" />
            <span className="text-zinc-200">Selected</span>
          </span>
          <span className="text-zinc-700">|</span>
          <button
            type="button"
            onClick={onProceedToSnacks}
            className="text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PopcornIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Grip Socks &amp; Café</span>
          </button>
        </div>

        {/* Right: Split-Pill Book Pass & Table CTA */}
        <div className="w-full sm:w-auto min-w-0 sm:min-w-[290px] rounded-full bg-[#121316]/95 border border-white/15 p-1 flex items-center justify-between shadow-2xl">
          <button
            type="button"
            disabled={selectedSeats.length === 0}
            onClick={onBuyTicketsDirect}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-[#09090b] font-heading font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Book Pass &amp; Table
          </button>

          <div className="px-3 sm:px-4 py-1 text-right flex flex-col items-end justify-center">
            <span className="font-mono-numbers text-sm sm:text-base font-bold text-white leading-tight">
              {formatMoney(seatsTotal)}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 leading-tight">
              {selectedSeats.length > 0 ? `Tables: ${selectedSeats.join(", ")}` : "Pick a table"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. GROUP / PARTY TABLE PRESET MODAL */}
      {isSeatModalOpen && (
        <div
          onClick={() => setIsSeatModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[32px] bg-[#101115]/95 border border-white/15 p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden animate-slide-up"
          >
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Pick Café Supervision Tables
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose your preferred supervision row &amp; group size
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

            <div className="relative z-10 mt-4">
              <span className="text-[11px] font-medium text-zinc-400 block mb-2">
                Preferred Supervision Zone
              </span>
              <div className="grid grid-cols-4 gap-1.5 bg-[#15161c] p-1 rounded-2xl border border-white/[0.07]">
                {[
                  { row: "B", tag: "Glass Front" },
                  { row: "C", tag: "VIP Sightline" },
                  { row: "D", tag: "VIP Booth" },
                  { row: "F", tag: "Party Deck" },
                ].map((z) => {
                  const active = preferredRow === z.row;
                  return (
                    <button
                      key={z.row}
                      type="button"
                      onClick={() => setPreferredRow(z.row)}
                      className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        active
                          ? "bg-amber-400 text-[#09090b] font-bold shadow-sm"
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

            <div className="relative z-10 grid grid-cols-2 gap-2.5 my-4">
              {TABLE_PRESETS.map((preset) => {
                const isActive = selectedSeats.length === preset.count;
                return (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => handleApplyPartyCount(preset.count, preferredRow)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-amber-400 text-[#09090b] border-white shadow-lg scale-[1.01]"
                        : "bg-[#161820]/90 hover:bg-[#1e212b] text-zinc-200 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-heading text-xs sm:text-sm font-bold">
                        {preset.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-2">
                      <span
                        className={`text-[11px] ${
                          isActive ? "text-[#09090b]/75" : "text-zinc-400"
                        }`}
                      >
                        {preset.subtitle}
                      </span>
                      <span className="text-xs font-mono font-bold">
                        Row {preferredRow}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Tables:{" "}
                <strong className="text-white">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </strong>{" "}
                • {formatMoney(seatsTotal)}
              </div>
              <button
                type="button"
                onClick={() => setIsSeatModalOpen(false)}
                className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-[#09090b] font-heading font-bold text-xs cursor-pointer transition-colors"
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
