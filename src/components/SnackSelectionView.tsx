import React, { useState } from "react";
import {
  CONCESSION_MENU,
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
} from "../constants/cinemaData";
import { CinemaVenueMark } from "./FuturisticLogo";
import {
  ArrowLeftIcon,
  PopcornIcon,
  TicketIcon,
} from "./Icons";

interface SnackSelectionViewProps {
  venue: KarachiVenue;
  selectedMovie: MovieItem;
  selectedDate: string;
  selectedSeats: string[];
  selectedConcessions: Record<string, number>;
  currency: "PKR" | "USD";
  onToggleConcession: (id: string, delta: number) => void;
  onBackTo3D: () => void;
  onProceedCheckout: () => void;
}

export const SnackSelectionView: React.FC<SnackSelectionViewProps> = ({
  venue,
  selectedMovie,
  selectedDate,
  selectedSeats,
  selectedConcessions,
  currency,
  onToggleConcession,
  onBackTo3D,
  onProceedCheckout,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", "Safety & Gear", "Activities", "Parent Café"];

  const filteredItems = CONCESSION_MENU.filter((item) => {
    if (activeCategory === "ALL") return true;
    return item.category === activeCategory;
  });

  const seatsTotal = selectedSeats.reduce((acc, id) => {
    const d = getSeatSpatialData(id, venue);
    return acc + (currency === "PKR" ? d.pricePKR : d.priceUSD);
  }, 0);

  const concessionItemsList = CONCESSION_MENU.filter(
    (item) => (selectedConcessions[item.id] || 0) > 0
  );

  const totalSnackCount = concessionItemsList.reduce(
    (acc, item) => acc + (selectedConcessions[item.id] || 0),
    0
  );

  const concessionsTotal = concessionItemsList.reduce((acc, item) => {
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
    <section className="relative w-full min-h-screen lg:h-screen bg-[#fffbf2] text-slate-900 flex flex-col justify-between px-3 sm:px-8 pt-16 sm:pt-20 pb-8 lg:pb-4 select-none overflow-y-auto lg:overflow-hidden">
      {/* Soft Sunlit Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(251, 191, 36, 0.14) 0%, rgba(56, 189, 248, 0.06) 45%, #fffbf2 85%)",
          }}
        />
      </div>

      {/* Top Bar: Back Button, Clean Title & Category Filter Pills */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackTo3D}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back to Tables</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900 uppercase">
              Grip Socks &amp; Parent Café
            </h1>
            <span className="hidden md:inline-block text-xs text-slate-500">
              {selectedSeats.length > 0
                ? `• Served to Café Table ${selectedSeats.join(", ")}`
                : "• Mandatory Grip Socks, Face Painting & Café"}
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-slate-200 p-1 rounded-full overflow-x-auto no-scrollbar shadow-sm">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3.5 py-1 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {cat === "ALL" ? "All Menu" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 12-Column Landscape Content Area */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto flex-1 min-h-0 my-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 8 Columns: 3x2 Gourmet & Gear Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3.5 h-full">
          {filteredItems.map((item) => {
            const qty = selectedConcessions[item.id] || 0;
            const unitPrice = currency === "PKR" ? item.pricePKR : item.priceUSD;
            const hasQty = qty > 0;

            return (
              <div
                key={item.id}
                className={`group rounded-[24px] border p-3.5 flex flex-col justify-between transition-all duration-200 min-h-[225px] lg:min-h-0 ${
                  hasQty
                    ? "bg-white border-amber-400 shadow-[0_12px_30px_rgba(245,158,11,0.16)]"
                    : "bg-white/85 border-slate-200 hover:border-amber-300 hover:bg-white shadow-sm"
                }`}
              >
                <div className="relative w-full flex-1 min-h-[115px] rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200/70">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] text-slate-800 font-semibold">
                    {item.category}
                  </span>

                  {hasQty && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow">
                      {qty}× Added
                    </span>
                  )}
                </div>

                {/* Item Title & Description */}
                <div className="pt-2.5">
                  <h3 className="font-heading font-bold text-xs sm:text-[13.5px] text-slate-900 leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom Price & Quantity Stepper Row */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-mono-numbers text-xs sm:text-[13px] font-bold text-amber-700 leading-tight">
                      {formatMoney(unitPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {hasQty
                        ? `${qty}× • ${formatMoney(qty * unitPrice)}`
                        : "Served at Parent Café / Desk"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full p-0.5">
                    <button
                      type="button"
                      onClick={() => onToggleConcession(item.id, -1)}
                      disabled={qty === 0}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white hover:bg-slate-50 disabled:opacity-35 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors text-xs shadow-xs"
                    >
                      –
                    </button>
                    <span className="w-5 text-center text-xs font-bold font-mono-numbers text-slate-900">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleConcession(item.id, 1)}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center cursor-pointer transition-colors text-xs shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 4 Columns: Clean White Order Summary Card */}
        <div className="lg:col-span-4 rounded-[28px] bg-white/95 backdrop-blur-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <CinemaVenueMark venue={venue} size="xs" />
                <span className="text-[11px] uppercase tracking-[0.16em] text-slate-600 font-bold">
                  Order Summary
                </span>
              </div>
              <span
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold"
                style={{
                  color: "#b45309",
                  borderColor: `${venue.brandPrimary}55`,
                  backgroundColor: `${venue.brandPrimary}18`,
                }}
              >
                {venue.hallName}
              </span>
            </div>

            {/* Play Zone Info Pill */}
            <div className="flex gap-3.5 items-center p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex-shrink-0">
              <div className="w-12 h-16 rounded-xl bg-slate-200 border border-slate-200 overflow-hidden flex-shrink-0">
                <div className="w-full h-full" style={posterStyle} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                  {selectedMovie.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {venue.name} • Packages Mall
                </p>
                <p className="text-[11px] text-amber-700 font-mono font-semibold mt-0.5">
                  {selectedDate} • {selectedMovie.selectedTime}
                </p>
              </div>
            </div>

            {/* Tables Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-1.5 text-xs flex-shrink-0">
              <div className="flex justify-between items-center text-slate-500">
                <span>Café Supervision Tables ({selectedSeats.length})</span>
                <span className="text-slate-900 font-mono font-bold">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "No tables selected"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pt-1.5 border-t border-slate-200/70">
                <span>Play Passes Subtotal</span>
                <span className="text-slate-900 font-mono-numbers font-semibold">
                  {formatMoney(seatsTotal)}
                </span>
              </div>
            </div>

            {/* Socks, Activities & Café Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 flex flex-col justify-between gap-2 text-xs flex-1 min-h-0">
              <div className="flex justify-between items-center text-slate-500 flex-shrink-0">
                <span className="flex items-center gap-1.5">
                  <PopcornIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Socks, Face Paint &amp; Café</span>
                </span>
                <span className="text-slate-700 font-mono text-[11px] font-semibold">
                  {totalSnackCount > 0 ? `${totalSnackCount} Selected` : "None"}
                </span>
              </div>

              {concessionItemsList.length > 0 ? (
                <div className="space-y-1.5 py-2 border-y border-slate-200/70 flex-1 overflow-y-auto no-scrollbar">
                  {concessionItemsList.map((c) => {
                    const qty = selectedConcessions[c.id] || 0;
                    const unitPrice =
                      currency === "PKR" ? c.pricePKR : c.priceUSD;
                    return (
                      <div
                        key={c.id}
                        className="flex justify-between items-center text-xs text-slate-700"
                      >
                        <span className="truncate pr-2">
                          <strong className="text-amber-700 font-mono">
                            {qty}×
                          </strong>{" "}
                          {c.name}
                        </span>
                        <span className="text-slate-900 font-mono-numbers flex-shrink-0 font-medium">
                          {formatMoney(qty * unitPrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2 border-y border-slate-200/70 flex-1 flex items-center text-[11px] text-slate-400">
                  No items added yet — add Grip Socks, Face Painting, or Parent Café combos.
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 flex-shrink-0">
                <span>Add-ons Subtotal</span>
                <span className="text-slate-900 font-mono-numbers font-semibold">
                  {formatMoney(concessionsTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Total & Checkout CTA */}
          <div className="pt-3.5 mt-3 border-t border-slate-200 space-y-3 flex-shrink-0">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-700 font-semibold block">
                  Total Payable ({currency})
                </span>
                <span className="text-[10px] text-slate-500">
                  Apply Vouch365 / BOGO promo in next step
                </span>
              </div>
              <span className="font-heading font-extrabold text-2xl text-slate-900 font-mono-numbers">
                {formatMoney(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedCheckout}
              className="w-full py-3 px-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs sm:text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <TicketIcon className="w-4 h-4 text-slate-950" />
              <span>Continue to Payment</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
