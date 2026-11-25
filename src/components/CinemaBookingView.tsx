import React from "react";
import {
  CONCESSION_MENU,
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
  PRE_RESERVED_SEATS,
  ROWS,
  SEATS_PER_ROW,
} from "../constants/cinemaData";
import { soundEngine } from "../utils/audioEffects";
import {
  ArmchairIcon,
  ArrowLeftIcon,
  CrosshairIcon,
  EyeIcon,
  LaserIcon,
  LightbulbIcon,
  MonitorIcon,
  PopcornIcon,
  SparklesIcon,
  TheaterIcon,
  TicketIcon,
  UsersIcon,
} from "./Icons";
import { ThreeCinemaSimulator } from "./ThreeCinemaSimulator";

interface CinemaBookingViewProps {
  venue: KarachiVenue;
  selectedMovie: MovieItem;
  selectedDate: string;
  selectedSeats: string[];
  activeSeat: string;
  currency: "PKR" | "USD";
  cameraMode: "pov" | "overview";
  lightingMode: "dimmed" | "house";
  audienceVisible: boolean;
  screenMode: "movie" | "pattern";
  reclineAngle: number;
  laserConeVisible: boolean;
  resetTrigger: number;
  selectedConcessions: Record<string, number>;
  onToggleConcession: (id: string, delta: number) => void;
  onBackToGallery: () => void;
  onSelectSeat: (seatId: string) => void;
  onSelectCouplePair: () => void;
  onChangeCameraMode: (mode: "pov" | "overview") => void;
  onToggleLighting: () => void;
  onToggleAudience: () => void;
  onToggleScreenMode: () => void;
  onCycleRecline: () => void;
  onToggleLaserCone: () => void;
  onResetCamera: () => void;
  onProceedCheckout: () => void;
}

export const CinemaBookingView: React.FC<CinemaBookingViewProps> = ({
  venue,
  selectedMovie,
  selectedDate,
  selectedSeats,
  activeSeat,
  currency,
  cameraMode,
  lightingMode,
  audienceVisible,
  screenMode,
  reclineAngle,
  laserConeVisible,
  resetTrigger,
  selectedConcessions,
  onToggleConcession,
  onBackToGallery,
  onSelectSeat,
  onSelectCouplePair,
  onChangeCameraMode,
  onToggleLighting,
  onToggleAudience,
  onToggleScreenMode,
  onCycleRecline,
  onToggleLaserCone,
  onResetCamera,
  onProceedCheckout,
}) => {
  const activeSeatData = getSeatSpatialData(activeSeat);
  const isReservedActive = PRE_RESERVED_SEATS.includes(activeSeat);

  // Totals Calculation
  const seatsTotal = selectedSeats.reduce((acc, id) => {
    const d = getSeatSpatialData(id);
    return acc + (currency === "PKR" ? d.pricePKR : d.priceUSD);
  }, 0);

  const concessionsTotal = CONCESSION_MENU.reduce((acc, item) => {
    const qty = selectedConcessions[item.id] || 0;
    const unitPrice = currency === "PKR" ? item.pricePKR : item.priceUSD;
    return acc + qty * unitPrice;
  }, 0);

  const grandTotal = seatsTotal + concessionsTotal;

  const formatMoney = (val: number) =>
    currency === "PKR" ? `Rs. ${val.toLocaleString()}` : `$${val.toFixed(2)}`;

  const posterStyle = selectedMovie.posterImage
    ? {
        backgroundImage: `url('${selectedMovie.posterImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: selectedMovie.gradient,
      };

  return (
    <section className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden bg-[#08090c]">
      {/* LEFT PANEL: 2D Interactive Seat Map, Legends & Reservation */}
      <aside className="w-full lg:w-[420px] xl:w-[450px] flex-shrink-0 flex flex-col bg-[#08090c] border-r border-zinc-800 overflow-y-auto p-4 sm:p-5 gap-4 max-h-[calc(100vh-64px)] animate-slide-right">
        {/* Navigation & Venue Label */}
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
          <button
            type="button"
            onClick={onBackToGallery}
            className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1.5 transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Back to Feature Catalog</span>
          </button>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {venue.hallName}
          </span>
        </div>

        {/* Selected Movie Summary Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">
          <div className="w-12 h-16 rounded-md bg-zinc-950 flex-shrink-0 overflow-hidden relative border border-zinc-800">
            <div className="w-full h-full" style={posterStyle} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <span className="px-1 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px]">
                {selectedMovie.rating}
              </span>
              <span className="truncate">{selectedMovie.duration}</span>
            </div>
            <h2 className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
              {selectedMovie.title}
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {selectedDate.split("•")[0].trim()} • {selectedMovie.selectedTime}
            </p>
          </div>
        </div>

        {/* 2D Seating Selector Container */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-xs text-zinc-200">
                Auditorium Seating Matrix
              </h3>
              <p className="text-[11px] text-zinc-400">
                Click any seat in 2D or 3D to switch perspective
              </p>
            </div>
            <span className="text-[10px] bg-zinc-900 text-zinc-400 font-mono font-medium px-2 py-0.5 rounded border border-zinc-800">
              48 Seats
            </span>
          </div>

          {/* 2D Curved Cinema Screen Line */}
          <div className="relative py-2 mb-2 flex flex-col items-center">
            <div className="w-4/5 h-2 rounded-t-full border-t-2 border-red-500/80 shadow-[0_-2px_8px_rgba(239,68,68,0.3)]" />
            <span className="text-[9px] tracking-[0.2em] uppercase font-mono font-medium text-zinc-500 mt-1">
              Curved IMAX Screen (22m)
            </span>
          </div>

          {/* 2D Seat Grid */}
          <div className="flex flex-col gap-1.5 items-center justify-center my-1 py-1">
            {ROWS.map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-3 text-center font-mono text-[11px] text-zinc-500">
                  {row}
                </span>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map((col) => {
                    const seatId = `${row}${col}`;
                    const isReserved = PRE_RESERVED_SEATS.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const isCurrentActive = activeSeat === seatId;
                    const isVIP = (row === "C" || row === "D") && col >= 3 && col <= 6;

                    let btnClass =
                      "w-6 h-6 sm:w-7 sm:h-7 rounded font-mono text-[10px] font-semibold flex items-center justify-center seat-button relative cursor-pointer ";

                    if (isReserved) {
                      btnClass += "bg-zinc-900 border border-zinc-800 text-zinc-600 hover:border-zinc-700";
                    } else if (isSelected) {
                      btnClass += "bg-red-500 text-white font-bold border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                    } else if (isVIP) {
                      btnClass += "bg-zinc-800/90 border border-zinc-600 text-zinc-200 hover:border-zinc-500";
                    } else {
                      btnClass += "bg-zinc-800/60 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500";
                    }

                    if (isCurrentActive) {
                      btnClass += " ring-2 ring-white ring-offset-1 ring-offset-[#08090c]";
                    }

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          type="button"
                          onClick={() => onSelectSeat(seatId)}
                          title={`${seatId} ${
                            isReserved
                              ? "(Occupied - Click for sightline preview)"
                              : isVIP
                              ? "(VIP Recliner)"
                              : "(Standard)"
                          }`}
                          className={btnClass}
                        >
                          {isReserved ? "–" : col}
                        </button>
                        {col === 4 && <div className="w-2" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-3 text-center font-mono text-[11px] text-zinc-500">
                  {row}
                </span>
              </div>
            ))}
          </div>

          {/* Seat Color Legend */}
          <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-700" />
              <span>Standard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-zinc-800 border border-zinc-500" />
              <span>VIP Tier</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500 border border-red-400" />
              <span className="text-zinc-200 font-semibold">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[8px]">
                –
              </div>
              <span>Occupied</span>
            </div>
          </div>

          {/* Smart Seat Quick-Picks with Icons */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onSelectSeat("C4")}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer font-mono text-[11px]"
            >
              <CrosshairIcon className="w-3 h-3 text-red-400" />
              <span>Sweet (C4)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectSeat("D4")}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer font-mono text-[11px]"
            >
              <SparklesIcon className="w-3 h-3 text-red-400" />
              <span>VIP (D4)</span>
            </button>
            <button
              type="button"
              onClick={onSelectCouplePair}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer font-mono text-[11px]"
            >
              <UsersIcon className="w-3 h-3 text-red-400" />
              <span>Pair (C4+C5)</span>
            </button>
          </div>
        </div>

        {/* Viewport Raytrace & Audience Switches */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Audience</span>
            </span>
            <button
              type="button"
              onClick={onToggleAudience}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors duration-150 cursor-pointer ${
                audienceVisible
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                  : "bg-zinc-950 border-zinc-800 text-zinc-500"
              }`}
            >
              {audienceVisible ? "Visible" : "Hidden"}
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1.5">
              <LaserIcon className="w-3.5 h-3.5 text-red-400" />
              <span>Laser Cone</span>
            </span>
            <button
              type="button"
              onClick={onToggleLaserCone}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors duration-150 cursor-pointer ${
                laserConeVisible
                  ? "bg-red-500 text-white border-red-500 font-semibold shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                  : "bg-zinc-950 border-zinc-800 text-zinc-500"
              }`}
            >
              {laserConeVisible ? "Active" : "Off"}
            </button>
          </div>
        </div>

        {/* In-Seat Concessions with Popcorn Icon */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <PopcornIcon className="w-3.5 h-3.5 text-red-400" />
              <span>In-Seat Gourmet Pre-Order</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Optional
            </span>
          </div>
          <div className="space-y-1.5">
            {CONCESSION_MENU.map((item) => {
              const qty = selectedConcessions[item.id] || 0;
              const price = currency === "PKR" ? item.pricePKR : item.priceUSD;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-medium text-zinc-200 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {formatMoney(price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 font-mono">
                    <button
                      type="button"
                      onClick={() => onToggleConcession(item.id, -1)}
                      disabled={qty === 0}
                      className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 font-bold flex items-center justify-center cursor-pointer border border-zinc-800 transition-colors duration-150"
                    >
                      –
                    </button>
                    <span className="w-4 text-center text-xs font-semibold text-zinc-100">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleConcession(item.id, 1)}
                      className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center cursor-pointer border border-zinc-700 transition-colors duration-150"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Primary CTA */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Summary
            </span>
            <span className="text-xs font-mono text-zinc-300">
              {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[24px] items-center">
            {selectedSeats.map((id) => {
              const itemData = getSeatSpatialData(id);
              const p = currency === "PKR" ? itemData.pricePKR : itemData.priceUSD;
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-300 font-mono"
                >
                  <span className="font-semibold text-zinc-100">{id}</span>
                  <span className="text-zinc-500 text-[10px]">({formatMoney(p)})</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block font-mono">
                Total Payable ({currency})
              </span>
              <span className="text-xl font-bold font-mono-numbers text-zinc-100">
                {formatMoney(grandTotal)}
              </span>
            </div>
            {/* Primary Crimson CTA */}
            <button
              type="button"
              onClick={onProceedCheckout}
              className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-all duration-150 shadow-[0_0_15px_rgba(239,68,68,0.35)] active:translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <TicketIcon className="w-4 h-4 text-white" />
              <span>Confirm & Reserve →</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: 3D Interactive Perspective Simulator */}
      <section className="flex-1 flex flex-col relative bg-[#08090c] overflow-hidden h-[500px] lg:h-[calc(100vh-64px)]">
        {/* Clean Floating HUD Readout */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
          {/* Active Perspective Badge */}
          <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg px-3.5 py-2 shadow-lg pointer-events-auto flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Eye-Level POV:</span>
                <span className="font-semibold text-xs sm:text-sm text-zinc-100 font-mono">
                  Row {activeSeatData.row}, Seat {activeSeatData.number}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isReservedActive
                      ? "bg-zinc-950 text-zinc-400 border-zinc-800"
                      : activeSeatData.isVIP
                      ? "bg-red-950/30 text-red-400 border-red-500/40"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800"
                  }`}
                >
                  {isReservedActive
                    ? "Occupied"
                    : activeSeatData.isVIP
                    ? "VIP Recliner"
                    : "Standard"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Dolby Atmos Acoustic Alignment: {activeSeatData.acousticScore}
              </p>
            </div>
          </div>

          {/* Metric Telemetry Panels */}
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto font-mono">
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg px-2.5 py-1.5 text-right">
              <span className="text-[9px] text-zinc-400 block uppercase">Screen Dist.</span>
              <span className="text-xs font-semibold font-mono-numbers text-zinc-200">
                {activeSeatData.distToCenter} m
              </span>
            </div>
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg px-2.5 py-1.5 text-right">
              <span className="text-[9px] text-zinc-400 block uppercase">Field of View</span>
              <span className="text-xs font-semibold font-mono-numbers text-zinc-200">
                {activeSeatData.fovHoriz}°
              </span>
            </div>
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg px-2.5 py-1.5 text-right">
              <span className="text-[9px] text-zinc-400 block uppercase">Gaze Angle</span>
              <span className="text-xs font-semibold font-mono-numbers text-zinc-200">
                +{activeSeatData.verticalGaze}°
              </span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md rounded-lg px-2.5 py-1.5">
              <span className="text-[9px] text-zinc-400 block uppercase">Sightline</span>
              <span className="text-xs font-semibold text-red-400">
                {activeSeatData.rating}
              </span>
            </div>
          </div>
        </div>

        {/* 3D Three.js Simulator Canvas */}
        <div className="flex-1 w-full relative overflow-hidden">
          <ThreeCinemaSimulator
            venue={venue}
            selectedMovie={selectedMovie}
            selectedSeats={selectedSeats}
            activeSeat={activeSeat}
            cameraMode={cameraMode}
            lightingMode={lightingMode}
            audienceVisible={audienceVisible}
            screenMode={screenMode}
            reclineAngle={reclineAngle}
            laserConeVisible={laserConeVisible}
            resetTrigger={resetTrigger}
            onSelectSeat={(seatId) => {
              soundEngine.playSeatClick(seatId === "C4" || seatId === "D4");
              onSelectSeat(seatId);
            }}
          />

          {/* Quick Row Hop Bar for Pitching Sightline Comparisons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg shadow-lg">
            <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1 hidden sm:inline">
              Compare Rows:
            </span>
            {ROWS.map((r) => {
              const isCurrentRow = activeSeatData.row === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    soundEngine.playSeatClick(r === "C" || r === "D");
                    onSelectSeat(`${r}4`);
                  }}
                  className={`w-7 h-6 rounded text-xs font-mono transition-colors duration-150 cursor-pointer flex items-center justify-center ${
                    isCurrentRow
                      ? "bg-red-500 text-white font-bold shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 bg-zinc-900 border border-zinc-800"
                  }`}
                  title={`Hop to Row ${r} Sightline`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Viewport Control Toolbar with Icons */}
        <div className="bg-[#08090c]/95 border-t border-zinc-800 px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
          {/* Segmented View Mode Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => onChangeCameraMode("pov")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                cameraMode === "pov"
                  ? "bg-red-500 text-white shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              <span>Eye-Level POV</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeCameraMode("overview")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                cameraMode === "overview"
                  ? "bg-red-500 text-white shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <TheaterIcon className="w-3.5 h-3.5" />
              <span>Auditorium Overview</span>
            </button>
          </div>

          {/* Atmosphere & View Controls with Relevant Icons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleScreenMode}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800 transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <MonitorIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Screen: {screenMode === "movie" ? "Trailer" : "Pattern"}</span>
            </button>

            <button
              type="button"
              onClick={onToggleLighting}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800 transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <LightbulbIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Lighting: {lightingMode === "dimmed" ? "Dimmed" : "House"}</span>
            </button>

            <button
              type="button"
              onClick={onCycleRecline}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800 transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <ArmchairIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Recline: {reclineAngle}°</span>
            </button>

            <button
              type="button"
              onClick={onResetCamera}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800 transition-colors duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <CrosshairIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Center Screen</span>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};
