import React, { useState } from "react";
import {
  BranchInfo,
  CAFE_MENU,
  formatPKR,
  GRIP_SOCKS_PKR,
  PARTY_ADVANCE_PCT,
  PARTY_EXTRAS,
  PLAY_PASSES,
  PROMO_CODES,
} from "../constants/topsyData";
import { TopsyBrandMark } from "./FuturisticLogo";
import { ChildPassEntry } from "./PassBookingView";
import { PartyBookingDraft, SchoolTripDraft } from "./PartyBookingView";

export type CheckoutMode = "passes" | "party" | "school";

interface CheckoutModalProps {
  isOpen: boolean;
  mode: CheckoutMode;
  branch: BranchInfo;
  visitDate: string;
  visitTime: string;
  childrenList: ChildPassEntry[];
  cafeCart: Record<string, number>;
  partyDraft: PartyBookingDraft;
  schoolDraft: SchoolTripDraft;
  onClose: () => void;
}

type PaymentMethod = "CARD" | "JAZZCASH" | "EASYPAISA" | "RAAST";

function buildQrCells(code: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  const drawFinder = (r0: number, c0: number) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const isEdge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const isCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        grid[r0 + dr][c0 + dc] = isEdge || isCore;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let seed = 2166136261;
  for (let i = 0; i < code.length; i++) {
    seed ^= code.charCodeAt(i);
    seed = Math.imul(seed, 16777619) >>> 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      if (r === 6 || c === 6) {
        grid[r][c] = (r + c) % 2 === 0;
        continue;
      }

      const h =
        Math.imul(seed ^ (r * 73856093) ^ (c * 19349663), 0x45d9f3b) >>> 0;
      grid[r][c] = (h & 1) === 1;
    }
  }

  return grid;
}

function shortNumericHash(input: string, digits: number): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const mod = Math.pow(10, digits);
  return String(h % mod).padStart(digits, "0");
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  mode,
  branch,
  visitDate,
  visitTime,
  childrenList,
  cafeCart,
  partyDraft,
  schoolDraft,
  onClose,
}) => {
  const [step, setStep] = useState<"payment" | "confirmed">("payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("JAZZCASH");
  const [parentName, setParentName] = useState<string>("Ayesha Khan");
  const [parentPhone, setParentPhone] = useState<string>("0300-8219402");
  const [promoInput, setPromoInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  if (!isOpen) return null;

  // Passes calculation
  const passPrices = childrenList.map((c) => {
    const p = PLAY_PASSES.find((opt) => opt.id === c.passId) || PLAY_PASSES[0];
    return p.pricePKR;
  });
  const passesOnlySubtotal = passPrices.reduce((a, b) => a + b, 0);
  const socksSubtotal =
    childrenList.filter((c) => c.includeSocks).length * GRIP_SOCKS_PKR;
  const cafeSubtotal = CAFE_MENU.reduce(
    (sum, item) => sum + (cafeCart[item.id] || 0) * item.pricePKR,
    0
  );

  const activePromoObj = PROMO_CODES.find(
    (p) => p.code.toUpperCase() === (appliedPromo || "").toUpperCase()
  );

  let discountAmount = 0;
  if (mode === "passes" && activePromoObj) {
    if (activePromoObj.type === "BOGO" && passPrices.length > 0) {
      const sorted = [...passPrices].sort((a, b) => a - b);
      if (sorted.length >= 2) {
        const freeCount = Math.floor(sorted.length / 2);
        discountAmount = sorted.slice(0, freeCount).reduce((a, b) => a + b, 0);
      } else {
        discountAmount = Math.round(sorted[0] * 0.5);
      }
    } else if (activePromoObj.type === "PERCENT" && activePromoObj.percentOff) {
      discountAmount = Math.round(
        ((passesOnlySubtotal + socksSubtotal + cafeSubtotal) *
          activePromoObj.percentOff) /
          100
      );
    }
  }

  // Party calculation
  const selectedPkg =
    branch.partyPackages.find((p) => p.id === partyDraft.packageId) ||
    branch.partyPackages[0];
  const partyExtrasTotal = PARTY_EXTRAS.filter((ex) =>
    partyDraft.extraIds.includes(ex.id)
  ).reduce(
    (sum, ex) =>
      sum + (ex.perChild ? ex.pricePKR * partyDraft.kidsCount : ex.pricePKR),
    0
  );
  const partyFullTotal =
    partyDraft.kidsCount * selectedPkg.pricePKR + partyExtrasTotal;
  const partyAdvanceDue = Math.round(
    (partyFullTotal * PARTY_ADVANCE_PCT) / 100
  );

  // School calculation
  const schoolFullTotal = schoolDraft.studentsCount * schoolDraft.ratePerStudent;
  const schoolAdvanceDue = Math.round(
    (schoolFullTotal * PARTY_ADVANCE_PCT) / 100
  );

  const payableNow =
    mode === "passes"
      ? Math.max(0, passesOnlySubtotal + socksSubtotal + cafeSubtotal - discountAmount)
      : mode === "party"
        ? partyAdvanceDue
        : schoolAdvanceDue;

  const balanceAtCounter =
    mode === "party"
      ? partyFullTotal - partyAdvanceDue
      : mode === "school"
        ? schoolFullTotal - schoolAdvanceDue
        : 0;

  // POS-compatible booking / ticket ID
  const posCode =
    mode === "passes"
      ? `${branch.code}-WEB-${shortNumericHash(
          `${parentName}-${visitDate}-${visitTime}-${childrenList.length}`,
          6
        )}`
      : mode === "party"
        ? `PTY-${branch.code}-${shortNumericHash(
            `${partyDraft.celebrantName}-${partyDraft.room}-${partyDraft.slot}-${partyDraft.kidsCount}`,
            4
          )}`
        : `SCH-${branch.code}-${shortNumericHash(
            `${schoolDraft.schoolName}-${schoolDraft.slot}-${schoolDraft.studentsCount}`,
            4
          )}`;

  const qrCells = buildQrCells(posCode);

  const paymentOptions: Array<{
    id: PaymentMethod;
    label: string;
    sub: string;
  }> = [
    { id: "JAZZCASH", label: "JazzCash", sub: "Mobile Wallet" },
    { id: "EASYPAISA", label: "EasyPaisa", sub: "Instant Transfer" },
    { id: "RAAST", label: "RAAST / Bank", sub: "Instant Transfer" },
    { id: "CARD", label: "Card", sub: "Visa / Mastercard" },
  ];

  const handleClose = () => {
    setStep("payment");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1F2A5A]/45 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-[28px] max-w-lg w-full p-5 sm:p-6 max-h-[92dvh] overflow-y-auto relative my-auto shadow-2xl text-[#1F2A5A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <TopsyBrandMark size="md" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] block font-bold text-[#E31E3C]">
                {step === "confirmed"
                  ? "Counter-Ready QR Pass"
                  : mode === "passes"
                    ? "Play Pass Checkout"
                    : mode === "party"
                      ? "20% Party Advance"
                      : "20% School Trip Advance"}
              </span>
              <h2 className="font-heading text-base font-extrabold text-[#1F2A5A]">
                {branch.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1F2A5A] text-sm font-bold flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {step === "payment" ? (
          <div className="mt-4 space-y-4">
            {/* Summary Box */}
            <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-slate-200 space-y-1.5 text-xs">
              {mode === "passes" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {childrenList.length} Child Pass(es) • {visitDate} {visitTime}
                    </span>
                    <span className="font-mono font-bold">
                      {formatPKR(passesOnlySubtotal + socksSubtotal)}
                    </span>
                  </div>
                  {cafeSubtotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Parent Café Pre-Order</span>
                      <span className="font-mono font-bold">
                        {formatPKR(cafeSubtotal)}
                      </span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#1FA246] font-semibold">
                      <span>Promo ({appliedPromo})</span>
                      <span className="font-mono">-{formatPKR(discountAmount)}</span>
                    </div>
                  )}
                </>
              )}

              {mode === "party" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {selectedPkg.name} • {partyDraft.room} • {partyDraft.kidsCount} kids
                    </span>
                    <span className="font-mono font-bold">
                      {formatPKR(partyFullTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Balance at Counter on Party Day</span>
                    <span className="font-mono">{formatPKR(balanceAtCounter)}</span>
                  </div>
                </>
              )}

              {mode === "school" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {schoolDraft.schoolName || "School Trip"} •{" "}
                      {schoolDraft.studentsCount} students (Teachers Free)
                    </span>
                    <span className="font-mono font-bold">
                      {formatPKR(schoolFullTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Balance at Counter on Arrival</span>
                    <span className="font-mono">{formatPKR(balanceAtCounter)}</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-heading font-bold text-sm">
                  {mode === "passes" ? "Total Payable" : "20% Advance Payable Now"}
                </span>
                <span className="font-heading text-xl font-black text-[#E31E3C]">
                  {formatPKR(payableNow)}
                </span>
              </div>
            </div>

            {/* Promo Code (Passes Mode Only) */}
            {mode === "passes" && (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (try VOUCH365, BOGO, TOPSY10)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1F2A5A] focus:outline-none focus:border-[#1BA0DE]"
                  />
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(promoInput.trim() || null)}
                    className="px-4 py-2 rounded-xl bg-[#1F2A5A] text-white text-xs font-heading font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROMO_CODES.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => {
                        setPromoInput(p.code);
                        setAppliedPromo(p.code);
                      }}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-[#1BA0DE]/15 text-[#1F2A5A] cursor-pointer"
                    >
                      {p.code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Parent / Contact Info */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Parent / Coordinator Name"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] focus:outline-none focus:border-[#1BA0DE]"
                />
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="Phone (03XX-XXXXXXX)"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#1F2A5A] focus:outline-none focus:border-[#1BA0DE]"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                For Counter 1 lookup only. We never message or spam customers.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2">
              {paymentOptions.map((opt) => {
                const selected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selected
                        ? "bg-[#1BA0DE]/10 border-[#1BA0DE]"
                        : "bg-slate-50 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <span className="text-xs font-heading font-extrabold block text-[#1F2A5A]">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-500">{opt.sub}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep("confirmed")}
              className="w-full py-3.5 px-6 rounded-full bg-[#1FA246] hover:bg-[#19893b] text-white font-heading font-extrabold text-sm shadow-[0_12px_28px_rgba(31,162,70,0.32)] hover:shadow-[0_18px_36px_rgba(31,162,70,0.44)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] cursor-pointer transition-all duration-200"
            >
              Confirm &amp; Pay {formatPKR(payableNow)}
            </button>
          </div>
        ) : (
          /* CONFIRMED QR PASS */
          <div className="mt-5 space-y-4 text-center">
            <div className="p-3 rounded-2xl bg-[#1FA246]/10 border border-[#1FA246]/30 text-xs font-semibold text-[#1FA246]">
              Show this QR at Counter 1 to print wristbands &amp; check in.
            </div>

            <div className="inline-block p-4 rounded-3xl bg-white border-2 border-[#1F2A5A]/15 shadow-md">
              <div
                className="grid gap-[2px] bg-white"
                style={{
                  gridTemplateColumns: `repeat(${qrCells.length}, minmax(0, 1fr))`,
                  width: "160px",
                  height: "160px",
                }}
              >
                {qrCells.flatMap((row, r) =>
                  row.map((on, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={on ? "bg-[#1F2A5A]" : "bg-white"}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">
                POS Reference Code
              </span>
              <p className="font-mono text-lg font-extrabold text-[#1F2A5A] mt-0.5">
                {posCode}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {parentName} • {branch.shortName} • Paid {formatPKR(payableNow)}
                {balanceAtCounter > 0
                  ? ` (Balance at counter: ${formatPKR(balanceAtCounter)})`
                  : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1F2A5A] font-heading font-bold text-xs cursor-pointer"
              >
                Print Pass
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-4 rounded-full bg-[#1F2A5A] text-white font-heading font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
