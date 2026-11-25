import React, { useState } from "react";
import { KARACHI_VENUES, KarachiVenue } from "../constants/cinemaData";
import { CinemaVenueMark } from "./FuturisticLogo";

interface PitchDeckModalProps {
  isOpen: boolean;
  currentVenue: KarachiVenue;
  onSelectVenue: (venue: KarachiVenue) => void;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  currentVenue,
  onSelectVenue,
  onClose,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "Playland" | "Packages">("ALL");

  if (!isOpen) return null;

  const filteredVenues = KARACHI_VENUES.filter(
    (v) => categoryFilter === "ALL" || v.category === categoryFilter
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#101115]/95 backdrop-blur-2xl border border-white/15 rounded-[28px] max-w-2xl w-full p-4 sm:p-6 max-h-[92dvh] overflow-y-auto relative my-auto shadow-[0_28px_80px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <CinemaVenueMark venue={currentVenue} size="md" />
            <div>
              <span
                className="text-[10px] font-mono uppercase tracking-[0.2em] block font-semibold"
                style={{ color: currentVenue.brandPrimary }}
              >
                Topsy Turvy Wing Switcher
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
                2nd Floor Playland &amp; Party Wings
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/12 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 my-3.5 bg-black/40 rounded-full border border-white/[0.08] text-xs font-medium">
          {(
            [
              { id: "ALL", label: `All Wings (${KARACHI_VENUES.length})` },
              { id: "Playland", label: "Playland (2)" },
              { id: "Packages", label: "Parties & Trips (1)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`flex-1 py-1.5 px-2.5 rounded-full text-center transition-all cursor-pointer truncate text-[11px] sm:text-xs ${
                categoryFilter === tab.id
                  ? "bg-[#eae0c8] text-[#09090b] font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theater Selection Grid with Individual Brand Logos & Colors */}
        <div className="my-3 sm:my-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {filteredVenues.map((v) => {
            const isSelected = v.id === currentVenue.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onSelectVenue(v);
                  onClose();
                }}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(135deg, ${v.brandPrimary}24 0%, ${v.brandBgTint} 100%)`,
                        borderColor: v.brandPrimary,
                        boxShadow: `0 12px 30px -6px ${v.brandGlow}`,
                      }
                    : undefined
                }
                className={`group p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "text-white scale-[1.01]"
                    : "bg-black/35 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <CinemaVenueMark
                    venue={v}
                    size="md"
                    className="group-hover:scale-105"
                  />
                  <div className="min-w-0">
                    <span className="font-heading font-bold text-xs block truncate text-white">
                      {v.name}
                    </span>
                    <span className="text-[11px] block mt-0.5 truncate text-zinc-400">
                      {v.hallName}
                    </span>
                    <span className="text-[10px] block mt-0.5 font-mono text-zinc-500 truncate">
                      {v.city}, {v.country} •{" "}
                      <span className={v.currency === "USD" ? "text-emerald-400 font-semibold" : "text-amber-300 font-semibold"}>
                        {v.currency}
                      </span>
                    </span>
                  </div>
                </div>

                <span
                  style={
                    isSelected
                      ? {
                          backgroundColor: v.brandPrimary,
                          color: "#09090b",
                        }
                      : {
                          color: v.brandPrimary,
                          borderColor: `${v.brandPrimary}38`,
                          backgroundColor: `${v.brandPrimary}12`,
                        }
                  }
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full flex-shrink-0 border ${
                    isSelected ? "font-bold border-transparent" : "font-medium"
                  }`}
                >
                  {isSelected ? "Selected" : v.badgeText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentVenue.brandPrimary }}
            />
            <span>
              Current Theater:{" "}
              <strong className="text-white">{currentVenue.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: currentVenue.brandPrimary,
              color: "#09090b",
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-full hover:opacity-90 font-heading font-extrabold text-xs transition-opacity cursor-pointer text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
