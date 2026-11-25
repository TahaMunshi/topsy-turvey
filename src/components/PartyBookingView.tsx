import React, { useEffect } from "react";
import {
  BranchInfo,
  formatPKR,
  PARTY_ADVANCE_PCT,
  PARTY_EXTRAS,
  SCHOOL_TRIP_DEFAULT_PKR,
} from "../constants/topsyData";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";

export interface PartyBookingDraft {
  packageId: string;
  room: string;
  date: string;
  slot: string;
  kidsCount: number;
  celebrantName: string;
  celebrantAge: string;
  themeNote: string;
  extraIds: string[];
}

export interface SchoolTripDraft {
  schoolName: string;
  teacherName: string;
  date: string;
  slot: string;
  studentsCount: number;
  teachersCount: number;
  ratePerStudent: number;
}

interface PartyBookingViewProps {
  branch: BranchInfo;
  activeTab: "birthday" | "school";
  partyDraft: PartyBookingDraft;
  schoolDraft: SchoolTripDraft;
  onChangeTab: (tab: "birthday" | "school") => void;
  onUpdateParty: (patch: Partial<PartyBookingDraft>) => void;
  onUpdateSchool: (patch: Partial<SchoolTripDraft>) => void;
  onBackToZones: () => void;
  onCheckoutParty: () => void;
  onCheckoutSchool: () => void;
}

const PARTY_DATE_OPTIONS = ["This Saturday", "Next Saturday", "Next Friday", "Custom Date"];

export const PartyBookingView: React.FC<PartyBookingViewProps> = ({
  branch,
  activeTab,
  partyDraft,
  schoolDraft,
  onChangeTab,
  onUpdateParty,
  onUpdateSchool,
  onBackToZones,
  onCheckoutParty,
  onCheckoutSchool,
}) => {
  const selectedPkg =
    branch.partyPackages.find((p) => p.id === partyDraft.packageId) ||
    branch.partyPackages[0];

  // Ensure valid package and slot when switching branch
  useEffect(() => {
    const pkgValid = branch.partyPackages.some((p) => p.id === partyDraft.packageId);
    if (!pkgValid) {
      const nextPkg = branch.partyPackages[0];
      onUpdateParty({
        packageId: nextPkg.id,
        kidsCount: Math.max(partyDraft.kidsCount, nextPkg.minKids),
        slot: branch.timeSlots[2] || branch.timeSlots[0],
      });
    }
  }, [branch, partyDraft.packageId, partyDraft.kidsCount, onUpdateParty]);

  const toggleExtra = (id: string) => {
    const exists = partyDraft.extraIds.includes(id);
    onUpdateParty({
      extraIds: exists
        ? partyDraft.extraIds.filter((e) => e !== id)
        : [...partyDraft.extraIds, id],
    });
  };

  const kidsTooLow = partyDraft.kidsCount < selectedPkg.minKids;
  const packageSubtotal = partyDraft.kidsCount * selectedPkg.pricePKR;
  const extrasSubtotal = PARTY_EXTRAS.filter((ex) =>
    partyDraft.extraIds.includes(ex.id)
  ).reduce(
    (sum, ex) =>
      sum + (ex.perChild ? ex.pricePKR * partyDraft.kidsCount : ex.pricePKR),
    0
  );
  const partyTotal = packageSubtotal + extrasSubtotal;
  const partyAdvance = Math.round((partyTotal * PARTY_ADVANCE_PCT) / 100);
  const partyBalance = partyTotal - partyAdvance;

  const schoolTooLow = schoolDraft.studentsCount < 15;
  const schoolTotal = schoolDraft.studentsCount * schoolDraft.ratePerStudent;
  const schoolAdvance = Math.round((schoolTotal * PARTY_ADVANCE_PCT) / 100);
  const schoolBalance = schoolTotal - schoolAdvance;

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#FFFBF5] text-[#1F2A5A] pt-22 sm:pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Top Bar + Mode Toggle */}
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
                {activeTab === "birthday"
                  ? `${branch.city} Birthday Parties`
                  : `${branch.city} School Trips`}
              </h1>
              <p className="text-xs text-slate-600">
                {branch.name} • Lock your slot online with a {PARTY_ADVANCE_PCT}% advance
              </p>
            </div>
          </div>

          <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => onChangeTab("birthday")}
              className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === "birthday"
                  ? "bg-[#E83E8C] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#1F2A5A]"
              }`}
            >
              🎂 Birthday Parties
            </button>
            <button
              type="button"
              onClick={() => onChangeTab("school")}
              className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                activeTab === "school"
                  ? "bg-[#F28C28] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#1F2A5A]"
              }`}
            >
              🚌 School Trips
            </button>
          </div>
        </div>

        {activeTab === "birthday" ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Package, Room & Details */}
            <div className="lg:col-span-8 space-y-5">
              {/* Step 1: Branch Package Selector */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                  1. Choose {branch.city} Birthday Package
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {branch.partyPackages.map((pkg) => {
                    const selected = selectedPkg.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() =>
                          onUpdateParty({
                            packageId: pkg.id,
                            kidsCount: Math.max(partyDraft.kidsCount, pkg.minKids),
                          })
                        }
                        style={
                          selected
                            ? {
                                borderColor: pkg.accentHex,
                                backgroundColor: `${pkg.accentHex}0d`,
                              }
                            : undefined
                        }
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          selected
                            ? "shadow-md"
                            : "bg-[#FFFBF5] border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-base font-extrabold text-[#1F2A5A]">
                              {pkg.name}
                            </span>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white"
                              style={{ backgroundColor: pkg.accentHex }}
                            >
                              {formatPKR(pkg.pricePKR)} / child
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-500 mt-1">
                            Minimum {pkg.minKids} kids • {pkg.duration}
                          </p>
                          <ul className="mt-2.5 space-y-1 text-xs text-slate-600">
                            {pkg.highlights.map((h) => (
                              <li key={h}>• {h}</li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Room, Date, Slot & Kids */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                  2. Party Room, Schedule &amp; Guest Count
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                      Party Room (15 to 100 Kids Capacity)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {branch.rooms.map((rm) => (
                        <button
                          key={rm}
                          type="button"
                          onClick={() => onUpdateParty({ room: rm })}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-heading font-bold cursor-pointer transition-all ${
                            partyDraft.room === rm
                              ? "bg-[#E83E8C] text-white border-[#E83E8C]"
                              : "bg-slate-50 text-[#1F2A5A] border-slate-200 hover:bg-white"
                          }`}
                        >
                          {rm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                      Number of Children (Min {selectedPkg.minKids})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateParty({
                            kidsCount: Math.max(1, partyDraft.kidsCount - 1),
                          })
                        }
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white font-bold text-base cursor-pointer"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={partyDraft.kidsCount}
                        onChange={(e) =>
                          onUpdateParty({
                            kidsCount: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className="w-20 text-center py-2 rounded-xl border border-slate-200 font-mono font-bold text-base text-[#1F2A5A]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateParty({
                            kidsCount: Math.min(100, partyDraft.kidsCount + 1),
                          })
                        }
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white font-bold text-base cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    {kidsTooLow && (
                      <p className="text-xs font-semibold text-rose-600 mt-1.5">
                        {selectedPkg.name} needs at least {selectedPkg.minKids} kids (you have {partyDraft.kidsCount}).
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                      Party Date
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PARTY_DATE_OPTIONS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => onUpdateParty({ date: d })}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                            partyDraft.date === d
                              ? "bg-[#1F2A5A] text-white border-[#1F2A5A]"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                      Time Slot (2-Hour Slot)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {branch.timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => onUpdateParty({ slot })}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                            partyDraft.slot === slot
                              ? "bg-[#E83E8C] text-white border-[#E83E8C]"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <input
                    type="text"
                    value={partyDraft.celebrantName}
                    onChange={(e) =>
                      onUpdateParty({ celebrantName: e.target.value })
                    }
                    placeholder="Birthday Child Name"
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] focus:outline-none focus:border-[#E83E8C]"
                  />
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={partyDraft.celebrantAge}
                    onChange={(e) =>
                      onUpdateParty({ celebrantAge: e.target.value })
                    }
                    placeholder="Turning Age (e.g. 6)"
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] focus:outline-none focus:border-[#E83E8C]"
                  />
                  <input
                    type="text"
                    value={partyDraft.themeNote}
                    onChange={(e) =>
                      onUpdateParty({ themeNote: e.target.value })
                    }
                    placeholder="Theme (e.g. Unicorn, Superhero)"
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] focus:outline-none focus:border-[#E83E8C]"
                  />
                </div>
              </div>

              {/* Step 3: Optional Add-Ons */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                  3. Optional Party Add-Ons &amp; Theme Decor
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PARTY_EXTRAS.map((ex) => {
                    const checked = partyDraft.extraIds.includes(ex.id);
                    return (
                      <label
                        key={ex.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          checked
                            ? "bg-[#E83E8C]/8 border-[#E83E8C]"
                            : "bg-[#FFFBF5] border-slate-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleExtra(ex.id)}
                            className="w-4 h-4 accent-[#E83E8C] rounded cursor-pointer flex-shrink-0"
                          />
                          <span className="text-xs font-semibold text-[#1F2A5A] truncate">
                            {ex.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-600 flex-shrink-0">
                          {formatPKR(ex.pricePKR)}
                          {ex.perChild ? "/kid" : ""}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Live 20% Advance Calculator */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                  Party Booking Summary
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E83E8C]/12 text-[#E83E8C] text-[10px] font-mono font-bold">
                  {partyDraft.room}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Package</span>
                  <span className="font-bold text-[#1F2A5A]">
                    {selectedPkg.name}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Schedule</span>
                  <span className="font-semibold text-[#1F2A5A]">
                    {partyDraft.date} • {partyDraft.slot}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    {partyDraft.kidsCount} kids × {formatPKR(selectedPkg.pricePKR)}
                  </span>
                  <span className="font-mono font-bold text-[#1F2A5A]">
                    {formatPKR(packageSubtotal)}
                  </span>
                </div>
                {extrasSubtotal > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Add-Ons ({partyDraft.extraIds.length})</span>
                    <span className="font-mono font-bold text-[#1F2A5A]">
                      {formatPKR(extrasSubtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-100">
                  <span>Estimated Party Total</span>
                  <span className="font-mono font-bold text-[#1F2A5A]">
                    {formatPKR(partyTotal)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E83E8C]/10 border border-[#E83E8C]/30 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-heading font-bold text-[#E83E8C]">
                    20% Advance Due Now
                  </span>
                  <span className="font-heading text-2xl font-black text-[#1F2A5A]">
                    {formatPKR(partyAdvance)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Remaining balance ({formatPKR(partyBalance)}) is collected at Counter 1 on party day.
                </p>
              </div>

              <button
                type="button"
                disabled={kidsTooLow}
                onClick={onCheckoutParty}
                className="w-full py-3.5 px-5 rounded-full bg-[#E83E8C] hover:bg-[#cf2d79] disabled:opacity-45 disabled:cursor-not-allowed text-white font-heading font-extrabold text-sm shadow-[0_12px_28px_rgba(232,62,140,0.32)] hover:shadow-[0_18px_36px_rgba(232,62,140,0.44)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Pay 20% Advance &amp; Lock Room</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* SCHOOL TRIPS TAB */
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-heading text-sm sm:text-base font-extrabold text-[#1F2A5A]">
                School Trip Details (Groups 15+ • Teachers Enter Free)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={schoolDraft.schoolName}
                    onChange={(e) =>
                      onUpdateSchool({ schoolName: e.target.value })
                    }
                    placeholder="e.g. The City School / Beaconhouse"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-sm text-[#1F2A5A] focus:outline-none focus:border-[#F28C28]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    Coordinator / Teacher Name
                  </label>
                  <input
                    type="text"
                    value={schoolDraft.teacherName}
                    onChange={(e) =>
                      onUpdateSchool({ teacherName: e.target.value })
                    }
                    placeholder="Lead Teacher Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-sm text-[#1F2A5A] focus:outline-none focus:border-[#F28C28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    Students (Min 15)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSchool({
                          studentsCount: Math.max(1, schoolDraft.studentsCount - 1),
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 font-bold cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={150}
                      value={schoolDraft.studentsCount}
                      onChange={(e) =>
                        onUpdateSchool({
                          studentsCount: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="w-20 text-center py-2 rounded-xl border border-slate-200 font-mono font-bold text-[#1F2A5A]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSchool({
                          studentsCount: Math.min(150, schoolDraft.studentsCount + 1),
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  {schoolTooLow && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">
                      School trips require at least 15 students.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    Teachers (Free Entry)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSchool({
                          teachersCount: Math.max(1, schoolDraft.teachersCount - 1),
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 font-bold cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-[#1F2A5A]">
                      {schoolDraft.teachersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSchool({
                          teachersCount: schoolDraft.teachersCount + 1,
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    Preferred Morning Slot
                  </label>
                  <select
                    value={schoolDraft.slot}
                    onChange={(e) => onUpdateSchool({ slot: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFFBF5] border border-slate-200 text-xs font-bold text-[#1F2A5A]"
                  >
                    {branch.timeSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                  School Trip Summary
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F28C28]/15 text-[#F28C28] text-[10px] font-mono font-bold">
                  {formatPKR(SCHOOL_TRIP_DEFAULT_PKR)}/kid
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    {schoolDraft.studentsCount} students ×{" "}
                    {formatPKR(schoolDraft.ratePerStudent)}
                  </span>
                  <span className="font-mono font-bold text-[#1F2A5A]">
                    {formatPKR(schoolTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Teachers ({schoolDraft.teachersCount})</span>
                  <span className="font-mono font-bold text-[#1FA246]">FREE</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F28C28]/10 border border-[#F28C28]/30 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-heading font-bold text-[#F28C28]">
                    20% Advance Due Now
                  </span>
                  <span className="font-heading text-2xl font-black text-[#1F2A5A]">
                    {formatPKR(schoolAdvance)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Remaining {formatPKR(schoolBalance)} paid on arrival at Counter 1.
                </p>
              </div>

              <button
                type="button"
                disabled={schoolTooLow}
                onClick={onCheckoutSchool}
                className="w-full py-3.5 px-5 rounded-full bg-[#F28C28] hover:bg-[#dc7a18] disabled:opacity-45 disabled:cursor-not-allowed text-white font-heading font-extrabold text-sm shadow-[0_12px_28px_rgba(242,140,40,0.32)] hover:shadow-[0_18px_36px_rgba(242,140,40,0.44)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Pay 20% Advance &amp; Reserve Trip</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 2: What Every Celebration Includes */}
        <div className="mt-12 pt-10 border-t border-[#1F2A5A]/10">
          <div className="mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1F2A5A]">
              Stress-Free Celebrations &amp; Group Trips
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Multi-purpose party rooms scale from 15 to 100 children at {branch.shortName}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#E83E8C]">
                Dedicated Party Host
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Our Performing Arts &amp; Early Childhood team handles games, entertainment, room setup, and post-party cleanup.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#6A3A97]">
                Miki &amp; Juju Mascot Fun
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Birthday ceremonies, Wheel of Fortune spins, and custom themes including Unicorn, Superhero, Lego, and Princess.
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-heading text-base font-extrabold text-[#1FA246]">
                20% Advance Lock-In
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Reserve Room A or Room B online with a 20% deposit and settle the remaining balance at Counter 1 on the event day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
