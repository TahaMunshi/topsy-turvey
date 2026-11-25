import React from "react";
import {
  BranchInfo,
  formatPKR,
  PLAY_PASSES,
  PlayZoneItem,
  SCHOOL_TRIP_DEFAULT_PKR,
} from "../constants/topsyData";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";

interface MovieOverviewViewProps {
  zone: PlayZoneItem;
  branch: BranchInfo;
  onBackToZones: () => void;
  onProceedToBooking: (flow: "passes" | "parties" | "school-trips") => void;
}

export const MovieOverviewView: React.FC<MovieOverviewViewProps> = ({
  zone,
  branch,
  onBackToZones,
  onProceedToBooking,
}) => {
  const ctaLabel =
    zone.primaryFlow === "parties"
      ? "Configure Party (20% Advance)"
      : zone.primaryFlow === "school-trips"
        ? "Plan School Trip (20% Advance)"
        : "Buy Child Play Passes";

  return (
    <div className="w-full bg-[#FFFBF5] text-[#1F2A5A] pt-[76px] sm:pt-[88px] animate-slide-up">
      {/* Section 1: Half-Screen 16:4.5 Banner with Light Zone-Colored Overlay */}
      <section
        className="relative w-full min-h-[280px] sm:min-h-[320px] lg:aspect-[16/4.5] overflow-hidden flex flex-col justify-between py-6 sm:py-8 px-5 sm:px-10 lg:px-16 text-white select-none"
        style={{ backgroundColor: zone.accentHex }}
      >
        {/* Background Photo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            key={zone.id}
            src={zone.heroImage}
            alt={zone.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/20" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${zone.accentHex}DB 0%, ${zone.accentHex}85 45%, transparent 85%)`,
            }}
          />
        </div>

        {/* Minimal Back Pill */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto">
          <button
            type="button"
            onClick={onBackToZones}
            className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-semibold text-white transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>All Play Zones</span>
          </button>
        </div>

        {/* Minimal Banner Headline */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto mt-auto pt-4">
          <p className="text-xs sm:text-sm font-bold tracking-wide text-[#F7D41B]">
            {zone.badge} · {zone.ageGroup} · {branch.shortName}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.06] mt-1 drop-shadow-md max-w-3xl">
            {zone.title}
          </h1>
        </div>
      </section>

      {/* Section 2: Rest of the Details & Attractions Below */}
      <section className="w-full py-10 sm:py-14 px-5 sm:px-10 lg:px-16">
        <div className="w-full max-w-[1440px] mx-auto space-y-10">
          {/* Overview + CTA Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {zone.synopsis}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onProceedToBooking(zone.primaryFlow)}
                  style={{
                    backgroundColor: zone.accentHex,
                    boxShadow: `0 12px 28px ${zone.accentHex}40`,
                  }}
                  className="px-7 py-3.5 rounded-full font-heading font-extrabold text-sm sm:text-base text-white inline-flex items-center gap-2.5 hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              {zone.primaryFlow === "parties" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branch.partyPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-base font-extrabold text-[#1F2A5A]">
                          {pkg.name}
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: pkg.accentHex }}
                        >
                          {formatPKR(pkg.pricePKR)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Min {pkg.minKids} kids · {pkg.duration}
                      </p>
                    </div>
                  ))}
                </div>
              ) : zone.primaryFlow === "school-trips" ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-extrabold text-[#1F2A5A]">
                      School Trip Rate
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#F28C28]/15 text-[#F28C28] text-xs font-bold">
                      {formatPKR(SCHOOL_TRIP_DEFAULT_PKR)} / student
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Accompanying teachers enter free. Reserve with a 20% advance online.
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <span className="font-heading text-sm font-extrabold text-[#1F2A5A] block">
                    Play Pass Options
                  </span>
                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    {PLAY_PASSES.map((p) => (
                      <span
                        key={p.id}
                        className="px-3 py-1.5 rounded-xl bg-[#FFFBF5] border border-slate-200"
                      >
                        {p.name}:{" "}
                        <strong style={{ color: p.accentHex }}>
                          {formatPKR(p.pricePKR)}
                        </strong>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Parents enter free · First-Aid certified staff · Free Café Wi-Fi
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attractions Grid */}
          <div className="pt-8 border-t border-[#1F2A5A]/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: zone.accentHex }}
                >
                  Inside {zone.shortTitle}
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1F2A5A] mt-0.5">
                  Attractions, Safety &amp; Supervision
                </h2>
              </div>
              <span className="text-xs sm:text-sm text-slate-500">
                {branch.address}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {zone.highlights.map((item) => (
                <div
                  key={item.name}
                  className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
