import React from "react";
import { BRANCHES, BranchInfo } from "../constants/topsyData";

interface FooterProps {
  branch: BranchInfo;
  onNavigate: (view: "hero" | "passes" | "parties" | "cafe") => void;
  onSelectBranch: (branch: BranchInfo) => void;
}

export const Footer: React.FC<FooterProps> = ({
  branch,
  onNavigate,
  onSelectBranch,
}) => {
  return (
    <footer className="relative bg-white text-[#1F2A5A] border-t border-[#1F2A5A]/10">
      <div className="h-1 w-full tt-rainbow-bar" />

      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <img
              src="/images/brand/topsy-turvy-wordmark.png"
              alt="Topsy Turvy: Play, Learn, Celebrate"
              className="h-12 w-auto object-contain"
            />
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Dedicated indoor Montessori softplay, birthday celebration rooms, and Parent Café in Lahore &amp; Karachi.
            </p>
            <p className="text-xs font-semibold text-[#1FA246]">
              First-Aid Certified Staff · Free Parent Café Wi-Fi
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#1F2A5A]/70">
              Explore
            </h3>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("hero")}
                  className="hover:text-[#E31E3C] transition-colors cursor-pointer"
                >
                  Play Zones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("passes")}
                  className="hover:text-[#1BA0DE] transition-colors cursor-pointer"
                >
                  Buy Play Passes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("parties")}
                  className="hover:text-[#E83E8C] transition-colors cursor-pointer"
                >
                  Birthday Parties &amp; School Trips
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("cafe")}
                  className="hover:text-[#1FA246] transition-colors cursor-pointer"
                >
                  Parent Café Menu
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-[#1F2A5A]/70">
              Locations &amp; Hours
            </h3>
            <div className="space-y-2.5">
              {BRANCHES.map((b) => {
                const isActive = b.id === branch.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBranch(b)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FFFBF5] border-[#1BA0DE]/50"
                        : "bg-slate-50/70 hover:bg-[#FFFBF5] border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-xs font-extrabold text-[#1F2A5A]">
                        {b.shortName}
                      </span>
                      <span className="text-xs font-semibold text-[#1BA0DE]">
                        {b.phone}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {b.hoursSummary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Topsy Turvy Playland. All rights reserved.</span>
          <span>info@topsyturvy.pk · Play, Learn &amp; Celebrate</span>
        </div>
      </div>
    </footer>
  );
};
