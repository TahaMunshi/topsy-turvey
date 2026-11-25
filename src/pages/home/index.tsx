import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckoutModal, CheckoutMode } from "../../components/CheckoutModal";
import { FilmReelGallery } from "../../components/FilmReelGallery";
import { Footer } from "../../components/Footer";
import { TopsyBrandMark, TopsyHeaderLogo } from "../../components/FuturisticLogo";
import { TicketIcon } from "../../components/Icons";
import { MovieOverviewView } from "../../components/MovieOverviewView";
import {
  PartyBookingDraft,
  PartyBookingView,
  SchoolTripDraft,
} from "../../components/PartyBookingView";
import {
  ChildPassEntry,
  PassBookingView,
} from "../../components/PassBookingView";
import { PartySplashScreen } from "../../components/PartySplashScreen";
import { SnackSelectionView } from "../../components/SnackSelectionView";
import {
  BRANCHES,
  BranchInfo,
  PLAY_ZONES,
  PlayZoneItem,
  SCHOOL_TRIP_DEFAULT_PKR,
} from "../../constants/topsyData";

type ActiveView = "hero" | "zone-detail" | "passes" | "parties" | "cafe";

const getInitialBranch = (): BranchInfo => {
  if (typeof window !== "undefined") {
    const param = new URLSearchParams(window.location.search).get("branch");
    if (param) {
      const match = BRANCHES.find(
        (b) => b.id.toLowerCase() === param.toLowerCase()
      );
      if (match) return match;
    }
  }
  return BRANCHES[0];
};

const Home: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const [branch, setBranch] = useState<BranchInfo>(getInitialBranch);
  const [activeView, setActiveView] = useState<ActiveView>("hero");
  const [selectedZoneId, setSelectedZoneId] = useState<string>(PLAY_ZONES[0].id);
  const [partyTab, setPartyTab] = useState<"birthday" | "school">("birthday");

  const [visitDate, setVisitDate] = useState<string>("Today");
  const [visitTime, setVisitTime] = useState<string>(
    () => getInitialBranch().timeSlots[2] || getInitialBranch().timeSlots[0]
  );
  const [childrenList, setChildrenList] = useState<ChildPassEntry[]>([
    {
      id: "child-1",
      name: "",
      age: "",
      passId: "two-hour",
      includeSocks: true,
    },
  ]);
  const [extraAdults, setExtraAdults] = useState<number>(1);
  const [cafeCart, setCafeCart] = useState<Record<string, number>>({});

  const [partyDraft, setPartyDraft] = useState<PartyBookingDraft>(() => ({
    packageId: getInitialBranch().partyPackages[0].id,
    room: "Room A",
    date: "This Saturday",
    slot: getInitialBranch().timeSlots[2] || getInitialBranch().timeSlots[0],
    kidsCount: getInitialBranch().partyPackages[0].minKids,
    celebrantName: "",
    celebrantAge: "",
    themeNote: "",
    extraIds: [],
  }));

  const [schoolDraft, setSchoolDraft] = useState<SchoolTripDraft>(() => ({
    schoolName: "",
    teacherName: "",
    date: "Next Week",
    slot: getInitialBranch().timeSlots[0],
    studentsCount: 25,
    teachersCount: 3,
    ratePerStudent: SCHOOL_TRIP_DEFAULT_PKR,
  }));

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>("passes");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedZone =
    PLAY_ZONES.find((z) => z.id === selectedZoneId) || PLAY_ZONES[0];

  useEffect(() => {
    document.title = `Topsy Turvy | ${branch.shortName} | Play, Learn, Celebrate`;
  }, [branch.shortName]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeView]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsBranchMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectBranch = useCallback((nextBranch: BranchInfo) => {
    setBranch(nextBranch);
    setIsBranchMenuOpen(false);
    setVisitTime(nextBranch.timeSlots[2] || nextBranch.timeSlots[0]);
    setPartyDraft((prev) => ({
      ...prev,
      packageId: nextBranch.partyPackages[0].id,
      slot: nextBranch.timeSlots[2] || nextBranch.timeSlots[0],
      kidsCount: Math.max(prev.kidsCount, nextBranch.partyPackages[0].minKids),
    }));
    setSchoolDraft((prev) => ({
      ...prev,
      slot: nextBranch.timeSlots[0],
    }));

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("branch", nextBranch.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleSelectZone = (zone: PlayZoneItem) => {
    setSelectedZoneId(zone.id);
    setActiveView("zone-detail");
  };

  const handleRouteFromZone = (flow: "passes" | "parties" | "school-trips") => {
    if (flow === "parties") {
      setPartyTab("birthday");
      setActiveView("parties");
    } else if (flow === "school-trips") {
      setPartyTab("school");
      setActiveView("parties");
    } else {
      setActiveView("passes");
    }
  };

  const handleQuickBook = (zone: PlayZoneItem) => {
    setSelectedZoneId(zone.id);
    handleRouteFromZone(zone.primaryFlow);
  };

  const handleToggleCafeItem = (id: string, delta: number) => {
    setCafeCart((prev) => {
      const nextQty = Math.max(0, (prev[id] || 0) + delta);
      if (nextQty === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const cafeItemCount = Object.values(cafeCart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1F2A5A] relative">
      {showSplash && (
        <PartySplashScreen
          branch={branch}
          onComplete={handleSplashComplete}
        />
      )}

      {/* FULL-WIDTH TOP HEADER BAR */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/92 backdrop-blur-xl border-b border-[#1F2A5A]/10">
        <div className="h-1 w-full tt-rainbow-bar" />
        <div className="w-full px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[84px] flex items-center justify-between gap-2 sm:gap-4">
          {/* LEFT: Official Topsy Turvy Brand Logo */}
          <div className="flex items-center max-w-[36vw] sm:max-w-none flex-shrink-0">
            <TopsyHeaderLogo
              branch={branch}
              onClick={() => setActiveView("hero")}
            />
          </div>

          {/* CENTER: Clean 4-Tab Navigation */}
          <nav className="flex items-center gap-3 sm:gap-5 lg:gap-7 xl:gap-9 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveView("hero")}
              className={`relative py-1.5 text-xs sm:text-sm lg:text-[15px] tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "hero" || activeView === "zone-detail"
                  ? "text-[#1F2A5A] font-extrabold"
                  : "text-slate-600 hover:text-[#1F2A5A] font-medium"
              }`}
            >
              <span>Play Zones</span>
              {(activeView === "hero" || activeView === "zone-detail") && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#E31E3C]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView("passes")}
              className={`relative py-1.5 text-xs sm:text-sm lg:text-[15px] tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "passes"
                  ? "text-[#1F2A5A] font-extrabold"
                  : "text-slate-600 hover:text-[#1F2A5A] font-medium"
              }`}
            >
              <span>Buy Passes ({childrenList.length})</span>
              {activeView === "passes" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#1BA0DE]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView("parties")}
              className={`relative py-1.5 text-xs sm:text-sm lg:text-[15px] tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "parties"
                  ? "text-[#1F2A5A] font-extrabold"
                  : "text-slate-600 hover:text-[#1F2A5A] font-medium"
              }`}
            >
              <span>Parties &amp; Trips</span>
              {activeView === "parties" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#E83E8C]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView("cafe")}
              className={`relative py-1.5 text-xs sm:text-sm lg:text-[15px] tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "cafe"
                  ? "text-[#1F2A5A] font-extrabold"
                  : "text-slate-600 hover:text-[#1F2A5A] font-medium"
              }`}
            >
              <span>
                Parent Café{cafeItemCount > 0 ? ` (${cafeItemCount})` : ""}
              </span>
              {activeView === "cafe" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#1FA246]" />
              )}
            </button>
          </nav>

          {/* RIGHT: 2-Branch Selector + Quick Checkout */}
          <div ref={dropdownRef} className="relative flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setCheckoutMode("passes");
                setIsCheckoutOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-[#E31E3C] hover:bg-[#c81833] text-white text-xs sm:text-sm font-heading font-bold shadow-[0_6px_16px_rgba(227,30,60,0.28)] hover:shadow-[0_10px_24px_rgba(227,30,60,0.42)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <TicketIcon className="w-4 h-4" />
              <span>Counter QR</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBranchMenuOpen((prev) => !prev)}
              aria-label="Switch Branch"
              aria-expanded={isBranchMenuOpen}
              className="rounded-xl px-3 py-2 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <TopsyBrandMark size="xs" />
              <span className="hidden md:inline xl:hidden text-xs sm:text-sm font-heading font-bold text-[#1F2A5A] whitespace-nowrap">
                {branch.city}
              </span>
              <span className="hidden xl:inline text-xs sm:text-sm font-heading font-bold text-[#1F2A5A] whitespace-nowrap">
                {branch.shortName}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  isBranchMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isBranchMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-24px)] rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 space-y-1.5">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                  Select Branch
                </div>
                {BRANCHES.map((b) => {
                  const active = b.id === branch.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBranch(b)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        active
                          ? "bg-[#1BA0DE]/10 border-[#1BA0DE]"
                          : "bg-slate-50/70 hover:bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-heading font-extrabold text-xs text-[#1F2A5A] block">
                          {b.shortName}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {b.address}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {b.hoursSummary} • {b.phone}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          active
                            ? "bg-[#1BA0DE] text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {b.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* STAGE 1: 50/50 Editorial Hero Carousel */}
      {activeView === "hero" && (
        <FilmReelGallery
          zones={PLAY_ZONES}
          branch={branch}
          onSelectZone={handleSelectZone}
          onQuickBook={handleQuickBook}
        />
      )}

      {/* STAGE 2: Zone Detail & Package Overview */}
      {activeView === "zone-detail" && (
        <MovieOverviewView
          zone={selectedZone}
          branch={branch}
          onBackToZones={() => setActiveView("hero")}
          onProceedToBooking={handleRouteFromZone}
        />
      )}

      {/* STAGE 3: Per-Child Play Passes */}
      {activeView === "passes" && (
        <PassBookingView
          branch={branch}
          visitDate={visitDate}
          visitTime={visitTime}
          childrenList={childrenList}
          extraAdults={extraAdults}
          cafeCart={cafeCart}
          onChangeVisitDate={setVisitDate}
          onChangeVisitTime={setVisitTime}
          onUpdateChildren={setChildrenList}
          onChangeExtraAdults={setExtraAdults}
          onBackToZones={() => setActiveView("hero")}
          onGoToCafe={() => setActiveView("cafe")}
          onProceedCheckout={() => {
            setCheckoutMode("passes");
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* STAGE 4: Birthday Parties & School Trips (20% Advance) */}
      {activeView === "parties" && (
        <PartyBookingView
          branch={branch}
          activeTab={partyTab}
          partyDraft={partyDraft}
          schoolDraft={schoolDraft}
          onChangeTab={setPartyTab}
          onUpdateParty={(patch) =>
            setPartyDraft((prev) => ({ ...prev, ...patch }))
          }
          onUpdateSchool={(patch) =>
            setSchoolDraft((prev) => ({ ...prev, ...patch }))
          }
          onBackToZones={() => setActiveView("hero")}
          onCheckoutParty={() => {
            setCheckoutMode("party");
            setIsCheckoutOpen(true);
          }}
          onCheckoutSchool={() => {
            setCheckoutMode("school");
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* STAGE 5: Parent Café & Play Add-Ons */}
      {activeView === "cafe" && (
        <SnackSelectionView
          branch={branch}
          visitDate={visitDate}
          visitTime={visitTime}
          childrenList={childrenList}
          cafeCart={cafeCart}
          onToggleItem={handleToggleCafeItem}
          onBackToPasses={() => setActiveView("passes")}
          onProceedCheckout={() => {
            setCheckoutMode("passes");
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* POS-READY QR CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        mode={checkoutMode}
        branch={branch}
        visitDate={visitDate}
        visitTime={visitTime}
        childrenList={childrenList}
        cafeCart={cafeCart}
        partyDraft={partyDraft}
        schoolDraft={schoolDraft}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* SHARED SITE FOOTER (ALL PAGES) */}
      <Footer
        branch={branch}
        onNavigate={(view) => setActiveView(view)}
        onSelectBranch={handleSelectBranch}
      />
    </div>
  );
};

export default Home;
