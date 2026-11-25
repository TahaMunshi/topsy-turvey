import React, { useState } from "react";
import {
  BranchInfo,
  CAFE_MENU,
  CafeCategory,
  formatPKR,
  GRIP_SOCKS_PKR,
  PLAY_PASSES,
} from "../constants/topsyData";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";
import { ChildPassEntry } from "./PassBookingView";

interface SnackSelectionViewProps {
  branch: BranchInfo;
  visitDate: string;
  visitTime: string;
  childrenList: ChildPassEntry[];
  cafeCart: Record<string, number>;
  onToggleItem: (id: string, delta: number) => void;
  onBackToPasses: () => void;
  onProceedCheckout: () => void;
}

const CATEGORIES: Array<"ALL" | CafeCategory> = [
  "ALL",
  "Play Add-Ons",
  "Snacks",
  "Sandwiches",
  "Juices",
  "Treats",
];

export const SnackSelectionView: React.FC<SnackSelectionViewProps> = ({
  branch,
  visitDate,
  visitTime,
  childrenList,
  cafeCart,
  onToggleItem,
  onBackToPasses,
  onProceedCheckout,
}) => {
  const [activeCategory, setActiveCategory] = useState<"ALL" | CafeCategory>("ALL");

  const filteredItems = CAFE_MENU.filter((item) =>
    activeCategory === "ALL" ? true : item.category === activeCategory
  );

  const passesSubtotal = childrenList.reduce((sum, c) => {
    const pass = PLAY_PASSES.find((p) => p.id === c.passId) || PLAY_PASSES[0];
    return sum + pass.pricePKR + (c.includeSocks ? GRIP_SOCKS_PKR : 0);
  }, 0);

  const cartItems = CAFE_MENU.filter((item) => (cafeCart[item.id] || 0) > 0);
  const cafeTotal = cartItems.reduce(
    (sum, item) => sum + (cafeCart[item.id] || 0) * item.pricePKR,
    0
  );
  const cafeCount = cartItems.reduce(
    (sum, item) => sum + (cafeCart[item.id] || 0),
    0
  );
  const grandTotal = passesSubtotal + cafeTotal;

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#FFFBF5] text-[#1F2A5A] pt-24 sm:pt-28 pb-12 px-5 sm:px-8 lg:px-12">
      <div className="w-full">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#1F2A5A]/10">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onBackToPasses}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1F2A5A] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Play Passes</span>
            </button>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#1F2A5A] tracking-tight leading-none">
                Parent Café &amp; Play Add-Ons
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                {branch.name} • Free Wi-Fi included • Exact Counter 3 prices
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-full overflow-x-auto no-scrollbar shadow-sm max-w-full">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap font-semibold ${
                    active
                      ? "bg-[#1F2A5A] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#1F2A5A]"
                  }`}
                >
                  {cat === "ALL" ? "All Menu" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-Width 12-Column Grid: Menu (Left 9) + Clean Cart (Right 3) */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
            {filteredItems.map((item) => {
              const qty = cafeCart[item.id] || 0;
              const hasQty = qty > 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border p-3.5 flex flex-col justify-between transition-all ${
                    hasQty
                      ? "bg-white border-[#1FA246] shadow-[0_12px_28px_rgba(31,162,70,0.16)]"
                      : "bg-white/90 border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono font-bold text-[#1F2A5A]">
                      {item.category}
                    </span>
                    <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm shadow-sm">
                      {item.icon}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-heading text-sm font-extrabold text-[#1F2A5A] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-extrabold text-[#1F2A5A]">
                      {formatPKR(item.pricePKR)}
                    </span>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => onToggleItem(item.id, 1)}
                        className="px-3.5 py-1.5 rounded-full bg-[#1FA246]/12 hover:bg-[#1FA246] text-[#1FA246] hover:text-white text-xs font-heading font-bold transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-[#1F2A5A] text-white rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onToggleItem(item.id, -1)}
                          className="w-5 h-5 rounded-full hover:bg-white/15 font-bold text-xs cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-xs font-mono font-bold min-w-[14px] text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleItem(item.id, 1)}
                          className="w-5 h-5 rounded-full hover:bg-white/15 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 3 Columns: Clean Order Summary */}
          <div className="lg:col-span-3 p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                Order Summary
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1FA246]/12 text-[#1FA246] text-[11px] font-bold">
                {branch.code} · Café
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Visit Slot</span>
                <span className="font-semibold text-[#1F2A5A]">
                  {visitDate} · {visitTime}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Play Passes &amp; Socks ({childrenList.length} kids)</span>
                <span className="font-bold text-[#1F2A5A]">
                  {formatPKR(passesSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Café &amp; Extras ({cafeCount} items)</span>
                <span className="font-bold text-[#1F2A5A]">
                  {formatPKR(cafeTotal)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Grand Total
              </span>
              <span className="font-heading text-2xl font-black text-[#1F2A5A]">
                {formatPKR(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedCheckout}
              className="w-full py-3.5 px-5 rounded-full bg-[#1FA246] hover:bg-[#19893b] text-white font-heading font-extrabold text-sm shadow-[0_12px_28px_rgba(31,162,70,0.32)] hover:shadow-[0_18px_36px_rgba(31,162,70,0.44)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <span>Checkout &amp; Get Counter QR</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 2: Parent Café Experience */}
        <div className="mt-12 pt-10 border-t border-[#1F2A5A]/10">
          <div className="mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1F2A5A]">
              While Kids Play, You Relax
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Everything on this menu matches our Counter 3 Café prices at {branch.shortName}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#1FA246]">
                Free High-Speed Wi-Fi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Catch up on work or unwind in our adjoining Parent Café seating area with complimentary Wi-Fi throughout your visit.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#F28C28]">
                Freshly Made Snacks &amp; Juices
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                From club sandwiches and grilled cheese toasties to freshly squeezed orange juice, mint lemonade, and mango shakes.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#1BA0DE]">
                Pre-Order With Your Pass
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Bundle Grip Socks, snacks, and drinks into one Counter QR so your family order is ready as soon as you arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
