import React from "react";
import {
  BranchInfo,
  CAFE_MENU,
  EXTRA_ADULT_PKR,
  formatPKR,
  getTimeSlotCrowd,
  GRIP_SOCKS_PKR,
  OVERTIME_30MIN_PKR,
  PLAY_PASSES,
} from "../constants/topsyData";
import { ArrowLeftIcon, ArrowRightIcon, TicketIcon } from "./Icons";

export interface ChildPassEntry {
  id: string;
  name: string;
  age: string;
  passId: "two-hour" | "full-day";
  includeSocks: boolean;
}

interface PassBookingViewProps {
  branch: BranchInfo;
  visitDate: string;
  visitTime: string;
  childrenList: ChildPassEntry[];
  extraAdults: number;
  cafeCart: Record<string, number>;
  onChangeVisitDate: (date: string) => void;
  onChangeVisitTime: (time: string) => void;
  onUpdateChildren: (next: ChildPassEntry[]) => void;
  onChangeExtraAdults: (count: number) => void;
  onBackToZones: () => void;
  onGoToCafe: () => void;
  onProceedCheckout: () => void;
}

const DATE_OPTIONS = ["Today", "Tomorrow", "This Weekend"];

export const PassBookingView: React.FC<PassBookingViewProps> = ({
  branch,
  visitDate,
  visitTime,
  childrenList,
  extraAdults,
  cafeCart,
  onChangeVisitDate,
  onChangeVisitTime,
  onUpdateChildren,
  onChangeExtraAdults,
  onBackToZones,
  onGoToCafe,
  onProceedCheckout,
}) => {
  const handleAddChild = () => {
    const nextIdx = childrenList.length + 1;
    onUpdateChildren([
      ...childrenList,
      {
        id: `child-${Date.now()}-${nextIdx}`,
        name: "",
        age: "",
        passId: "two-hour",
        includeSocks: true,
      },
    ]);
  };

  const handleRemoveChild = (id: string) => {
    if (childrenList.length <= 1) return;
    onUpdateChildren(childrenList.filter((c) => c.id !== id));
  };

  const handlePatchChild = (
    id: string,
    patch: Partial<ChildPassEntry>
  ) => {
    onUpdateChildren(
      childrenList.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const passesSubtotal = childrenList.reduce((sum, child) => {
    const pass = PLAY_PASSES.find((p) => p.id === child.passId) || PLAY_PASSES[0];
    return sum + pass.pricePKR;
  }, 0);

  const socksCount = childrenList.filter((c) => c.includeSocks).length;
  const socksSubtotal = socksCount * GRIP_SOCKS_PKR;

  const cafeTotal = CAFE_MENU.reduce((sum, item) => {
    const qty = cafeCart[item.id] || 0;
    return sum + qty * item.pricePKR;
  }, 0);

  const cafeItemCount = Object.values(cafeCart).reduce((a, b) => a + b, 0);
  const grandTotal = passesSubtotal + socksSubtotal + cafeTotal;
  const crowd = getTimeSlotCrowd(visitTime);

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#FFFBF5] text-[#1F2A5A] pt-22 sm:pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1F2A5A]/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToZones}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#1F2A5A] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Play Zones</span>
            </button>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1F2A5A] tracking-tight">
                Buy Child Play Passes
              </h1>
              <p className="text-xs text-slate-600">
                {branch.name} • {branch.hoursSummary}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-2 ${crowd.colorClass}`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: crowd.dotColor }}
            />
            <span>
              {visitTime}: {crowd.level} ({crowd.pct}% full)
            </span>
          </span>
        </div>

        {/* Main 12-Column Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: Slot Picker + Children List */}
          <div className="lg:col-span-8 space-y-5">
            {/* Step 1: Visit Date & Arrival Time */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                  1. Pick Visit Date &amp; Arrival Slot
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  Wristband timer starts at Counter 1 check-in
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DATE_OPTIONS.map((d) => {
                  const active = visitDate === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => onChangeVisitDate(d)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        active
                          ? "bg-[#1F2A5A] text-white border-[#1F2A5A] shadow-sm"
                          : "bg-slate-50 hover:bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {branch.timeSlots.map((slot) => {
                  const active = visitTime === slot;
                  const slotCrowd = getTimeSlotCrowd(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onChangeVisitTime(slot)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-[#1BA0DE]/10 border-[#1BA0DE] shadow-sm"
                          : "bg-slate-50/70 hover:bg-white border-slate-200"
                      }`}
                    >
                      <span className="text-xs font-heading font-bold text-[#1F2A5A] block">
                        {slot}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-slate-600">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: slotCrowd.dotColor }}
                        />
                        {slotCrowd.level}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Children & Passes */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                    2. Children &amp; Play Passes
                  </h2>
                  <p className="text-xs text-slate-500">
                    Synced with POS counter passes • Parents &amp; guardians enter free
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddChild}
                  className="px-4 py-2 rounded-full bg-[#1BA0DE] hover:bg-[#168dc4] text-white text-xs font-heading font-bold shadow-[0_6px_16px_rgba(27,160,222,0.28)] hover:shadow-[0_10px_22px_rgba(27,160,222,0.4)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  + Add Child
                </button>
              </div>

              <div className="space-y-3">
                {childrenList.map((child, idx) => (
                  <div
                    key={child.id}
                    className="p-4 rounded-2xl bg-[#FFFBF5] border border-slate-200/90 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F2A5A]">
                        Child #{idx + 1}
                      </span>
                      {childrenList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(child.id)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) =>
                          handlePatchChild(child.id, { name: e.target.value })
                        }
                        placeholder={`Child ${idx + 1} Name (for wristband)`}
                        className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] placeholder:text-slate-400 focus:outline-none focus:border-[#1BA0DE]"
                      />
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={child.age}
                        onChange={(e) =>
                          handlePatchChild(child.id, { age: e.target.value })
                        }
                        placeholder="Age (1 to 12)"
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] placeholder:text-slate-400 focus:outline-none focus:border-[#1BA0DE]"
                      />
                    </div>

                    {/* Pass Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PLAY_PASSES.map((pass) => {
                        const selected = child.passId === pass.id;
                        return (
                          <button
                            key={pass.id}
                            type="button"
                            onClick={() =>
                              handlePatchChild(child.id, { passId: pass.id })
                            }
                            style={
                              selected
                                ? {
                                    borderColor: pass.accentHex,
                                    backgroundColor: `${pass.accentHex}12`,
                                  }
                                : undefined
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selected
                                ? "shadow-sm"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-heading font-extrabold text-[#1F2A5A]">
                                {pass.name}
                              </span>
                              <span
                                className="text-xs font-mono font-bold"
                                style={{ color: pass.accentHex }}
                              >
                                {formatPKR(pass.pricePKR)}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 block mt-0.5">
                              {pass.durationLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Grip Socks Checkbox */}
                    <label className="flex items-center justify-between gap-3 pt-1 cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={child.includeSocks}
                          onChange={(e) =>
                            handlePatchChild(child.id, {
                              includeSocks: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-[#1FA246] rounded cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[#1F2A5A]">
                          Include Topsy Turvy Grip Socks{" "}
                          <span className="font-normal text-slate-500">
                            (uncheck if bringing your own)
                          </span>
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#1FA246]">
                        {child.includeSocks ? `+${formatPKR(GRIP_SOCKS_PKR)}` : "PKR 0"}
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Accompanying Adults */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-heading font-bold text-[#1F2A5A] block">
                    Accompanying Parents / Guardians
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Free entry ({formatPKR(EXTRA_ADULT_PKR)}) • Free Wi-Fi in Parent Café
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeExtraAdults(Math.max(1, extraAdults - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-white font-bold text-sm cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-mono font-bold">
                    {extraAdults}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChangeExtraAdults(extraAdults + 1)}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-white font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Order Summary */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-[#1BA0DE]" />
                <h2 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                  Play Pass Summary
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold text-[#1F2A5A]">
                {branch.code}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Branch</span>
                <span className="font-semibold text-[#1F2A5A]">
                  {branch.shortName}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Slot</span>
                <span className="font-semibold text-[#1F2A5A]">
                  {visitDate} • {visitTime}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Play Passes ({childrenList.length})</span>
                <span className="font-mono font-bold text-[#1F2A5A]">
                  {formatPKR(passesSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Grip Socks ({socksCount})</span>
                <span className="font-mono font-bold text-[#1F2A5A]">
                  {formatPKR(socksSubtotal)}
                </span>
              </div>
              {cafeItemCount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Parent Café Pre-Order ({cafeItemCount})</span>
                  <span className="font-mono font-bold text-[#1F2A5A]">
                    {formatPKR(cafeTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Adults ({extraAdults})</span>
                <span className="font-mono font-semibold text-[#1FA246]">
                  FREE
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Total
              </span>
              <span className="font-heading text-2xl font-black text-[#1F2A5A]">
                {formatPKR(grandTotal)}
              </span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <strong>Overtime note:</strong> 2-Hour passes allow easy extensions at the counter ({formatPKR(OVERTIME_30MIN_PKR)} per extra 30 min). Vouch365 &amp; BOGO promo codes apply at checkout.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={onProceedCheckout}
                className="w-full py-3.5 px-5 rounded-full bg-[#1BA0DE] hover:bg-[#168dc4] text-white font-heading font-extrabold text-sm shadow-[0_12px_28px_rgba(27,160,222,0.32)] hover:shadow-[0_18px_36px_rgba(27,160,222,0.44)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Checkout &amp; Get Counter QR</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onGoToCafe}
                className="w-full py-2.5 px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#1F2A5A] font-heading font-bold text-xs shadow-[0_4px_14px_rgba(31,42,90,0.07)] hover:shadow-[0_10px_22px_rgba(31,42,90,0.12)] hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>☕ Add Parent Café Snacks &amp; Juices</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: How Counter 1 Check-In Works */}
        <div className="mt-12 pt-10 border-t border-[#1F2A5A]/10">
          <div className="mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1F2A5A]">
              How Counter 1 Check-In Works
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Skip the queue at {branch.shortName} with your instant QR pass.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1BA0DE]/12 text-[#1BA0DE] text-xs font-extrabold mb-2">
                Step 1
              </span>
              <h3 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                Pick Passes &amp; Grip Socks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Choose 2-Hour or Full-Day passes per child and include Grip Socks ({formatPKR(GRIP_SOCKS_PKR)}) if needed. Adults enter free.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1FA246]/12 text-[#1FA246] text-xs font-extrabold mb-2">
                Step 2
              </span>
              <h3 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                Scan QR at Counter 1
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Show your digital QR pass on arrival. Our cashier prints color-coded wristbands for each child in seconds.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E31E3C]/12 text-[#E31E3C] text-xs font-extrabold mb-2">
                Step 3
              </span>
              <h3 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                Flexible Extensions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Your 2-hour play timer starts only when wristbands are printed. Extra 30-minute extensions are {formatPKR(OVERTIME_30MIN_PKR)} at the counter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
