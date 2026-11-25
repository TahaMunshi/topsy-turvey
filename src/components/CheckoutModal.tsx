import React, { useState } from "react";
import {
  CONCESSION_MENU,
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
  PROMO_CODES,
} from "../constants/cinemaData";
import { soundEngine } from "../utils/audioEffects";
import { CinemaVenueMark } from "./FuturisticLogo";

interface CheckoutModalProps {
  isOpen: boolean;
  venue: KarachiVenue;
  selectedMovie: MovieItem;
  selectedDate: string;
  selectedSeats: string[];
  selectedConcessions: Record<string, number>;
  currency: "PKR" | "USD";
  onClose: () => void;
}

type PaymentMethod =
  | "JAZZCASH"
  | "EASYPAISA"
  | "CARD"
  | "RAAST"
  | "STRIPE"
  | "PAYPAL"
  | "APPLE_PAY"
  | "KLARNA";

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

      const h = Math.imul(seed ^ (r * 73856093) ^ (c * 19349663), 0x45d9f3b) >>> 0;
      grid[r][c] = (h & 1) === 1;
    }
  }

  return grid;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  venue,
  selectedMovie,
  selectedDate,
  selectedSeats,
  selectedConcessions,
  currency,
  onClose,
}) => {
  const isUSD = currency === "USD";
  const [step, setStep] = useState<"payment" | "confirmed">("payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    isUSD ? "STRIPE" : "JAZZCASH"
  );
  const [guestName, setGuestName] = useState<string>(
    isUSD ? "Alexander Vance" : "Taha Jawed"
  );
  const [guestContact, setGuestContact] = useState<string>(
    isUSD ? "parent@topsyturvy.pk" : "0300-8219402"
  );
  const [walletAdded, setWalletAdded] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Sync default payment method & contact when currency or venue changes
  React.useEffect(() => {
    if (isUSD) {
      setPaymentMethod("STRIPE");
      setGuestName((prev) => (prev === "Taha Jawed" ? "Alexander Vance" : prev));
      setGuestContact((prev) => (prev === "0300-8219402" ? "parent@topsyturvy.pk" : prev));
    } else {
      setPaymentMethod("JAZZCASH");
      setGuestName((prev) => (prev === "Alexander Vance" ? "Taha Jawed" : prev));
      setGuestContact((prev) => (prev === "parent@topsyturvy.pk" ? "0300-8219402" : prev));
    }
  }, [isUSD, venue.id]);

  if (!isOpen) return null;

  const seatsTotal = selectedSeats.reduce((acc, id) => {
    const d = getSeatSpatialData(id, venue);
    return acc + (isUSD ? d.priceUSD : d.pricePKR);
  }, 0);

  const concessionItemsList = CONCESSION_MENU.filter(
    (item) => (selectedConcessions[item.id] || 0) > 0
  );

  const concessionsTotal = concessionItemsList.reduce((acc, item) => {
    const qty = selectedConcessions[item.id] || 0;
    const unitPrice = isUSD ? item.priceUSD : item.pricePKR;
    return acc + qty * unitPrice;
  }, 0);

  const activePromoObj = PROMO_CODES.find(
    (p) => p.code.toUpperCase() === (appliedPromo || "").toUpperCase()
  );

  let discountAmount = 0;
  if (activePromoObj) {
    if (activePromoObj.type === "BOGO" && selectedSeats.length > 0) {
      const passPrices = selectedSeats
        .map((id) => {
          const d = getSeatSpatialData(id, venue);
          return isUSD ? d.priceUSD : d.pricePKR;
        })
        .sort((a, b) => a - b);
      if (passPrices.length >= 2) {
        const freeCount = Math.floor(passPrices.length / 2);
        discountAmount = passPrices.slice(0, freeCount).reduce((a, b) => a + b, 0);
      } else {
        discountAmount = passPrices[0] * 0.5;
      }
    } else if (activePromoObj.type === "PERCENT" && activePromoObj.percentOff) {
      discountAmount = ((seatsTotal + concessionsTotal) * activePromoObj.percentOff) / 100;
    }
  }

  const grandTotal = Math.max(0, seatsTotal + concessionsTotal - discountAmount);

  const formatMoney = (val: number) =>
    isUSD ? `$${val.toFixed(2)}` : `Rs. ${val.toLocaleString()}`;

  const passCode = `${venue.shortName.slice(0, 3)}-${selectedSeats.length > 0 ? selectedSeats.join("") : "GA"}-${selectedMovie.selectedTime.replace(/[^0-9]/g, "")}`;

  const paymentOptions = isUSD
    ? [
        { id: "STRIPE", label: "Stripe", sub: "Cards • Apple/Google Pay", badge: "Instant" },
        { id: "PAYPAL", label: "PayPal", sub: "1-Click Express Checkout", badge: "Global" },
        { id: "APPLE_PAY", label: "Apple Pay", sub: "Face ID / Touch ID", badge: "1-Tap" },
        { id: "KLARNA", label: "Klarna", sub: "Pay in 4 (0% APR)", badge: "BNPL" },
      ]
    : [
        { id: "JAZZCASH", label: "JazzCash", sub: "Mobile Wallet", badge: "Direct" },
        { id: "EASYPAISA", label: "EasyPaisa", sub: "Instant Transfer", badge: "Direct" },
        { id: "RAAST", label: "RAAST", sub: "Instant QR Payment", badge: "State Bank" },
        { id: "CARD", label: "Card", sub: "Visa / Mastercard", badge: "Secure" },
      ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={() => {
        setStep("payment");
        onClose();
      }}
    >
      <div
        className="bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[28px] max-w-lg w-full p-4 sm:p-6 max-h-[92dvh] overflow-y-auto relative my-auto shadow-2xl text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <CinemaVenueMark venue={venue} size="md" />
            <div>
              <span
                className="text-[10px] font-mono uppercase tracking-[0.2em] block font-bold"
                style={{ color: "#b45309" }}
              >
                {step === "confirmed" ? "Digital Playland Pass" : "Checkout"}
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mt-0.5">
                {step === "confirmed" ? "Booking Confirmed" : "Complete Reservation"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("payment");
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {step === "payment" ? (
          <div className="my-4 space-y-4 text-xs">
            {/* Booking Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Play Zone</span>
                <span className="font-bold text-slate-900 text-right">
                  {selectedMovie.title}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Location</span>
                <span className="text-slate-800 text-right">
                  {venue.name} • Packages Mall, Lahore
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Time Slot</span>
                <span className="font-mono text-amber-700 font-semibold">
                  {selectedDate} • {selectedMovie.selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200">
                <span>Café Tables ({selectedSeats.length})</span>
                <span className="font-bold text-slate-900 font-mono">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Walk-In Pass"}
                </span>
              </div>
              {concessionItemsList.length > 0 && (
                <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-200">
                  <span>Socks, Activities &amp; Café</span>
                  <span className="text-slate-800 text-right font-medium">
                    {concessionItemsList
                      .map((c) => `${selectedConcessions[c.id]}x ${c.name.split(" ")[0]}`)
                      .join(", ")}
                  </span>
                </div>
              )}
              {activePromoObj && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 pt-2 border-t border-slate-200 font-mono font-bold">
                  <span>Promo ({activePromoObj.code})</span>
                  <span>-{formatMoney(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Vouch365 / BOGO Promo Code Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold">
                  Vouch365 / BOGO Promo Code
                </span>
                <div className="flex items-center gap-1">
                  {PROMO_CODES.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => {
                        setPromoInput(p.code);
                        setAppliedPromo(p.code);
                      }}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                        appliedPromo === p.code
                          ? "bg-emerald-500 text-white border-emerald-600 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:border-amber-400"
                      }`}
                    >
                      {p.code}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Enter VOUCH365, BOGO, or PACKAGES10"
                  className="flex-1 bg-white border border-slate-200 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = PROMO_CODES.find(
                      (p) => p.code === promoInput.trim().toUpperCase()
                    );
                    setAppliedPromo(match ? match.code : null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-bold text-xs cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </div>
              {activePromoObj && (
                <p className="text-[10px] text-emerald-700 font-mono font-semibold">
                  ✓ {activePromoObj.label}: {activePromoObj.description}
                </p>
              )}
            </div>

            {/* Parent Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-semibold">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={isUSD ? "e.g. Alexander Vance" : "e.g. Taha Jawed"}
                  className="w-full bg-white border border-slate-200 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5 font-semibold">
                  {isUSD ? "Email & Mobile (Wallet Pass)" : "WhatsApp Pass Number"}
                </label>
                <input
                  type="text"
                  value={guestContact}
                  onChange={(e) => setGuestContact(e.target.value)}
                  placeholder={isUSD ? "parent@topsyturvy.pk" : "0300-8219402"}
                  className="w-full bg-white border border-slate-200 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono outline-none transition-colors"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Payment Method {isUSD ? "(Global Gateway)" : "(Local Gateway)"}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Currency: <strong className="text-slate-900">{isUSD ? "USD ($)" : "PKR (Rs.)"}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentOptions.map((pm) => {
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        active
                          ? "bg-amber-400 border-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold block">{pm.label}</span>
                        <span
                          className={`text-[8px] font-mono px-1 py-0.2 rounded ${
                            active
                              ? "bg-black/15 text-slate-950 font-bold"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {pm.badge}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] block mt-1 leading-tight ${
                          active ? "text-slate-900 font-medium" : "text-slate-500"
                        }`}
                      >
                        {pm.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total and Checkout CTA */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Total Payable ({paymentMethod})
                </span>
                <span className="text-xl font-heading font-extrabold font-mono-numbers text-slate-900">
                  {formatMoney(grandTotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  setStep("confirmed");
                }}
                className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs transition-all cursor-pointer shadow-md"
              >
                Confirm &amp; Issue Pass →
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: CONFIRMED MINIMALIST BOARDING PASS */
          <div className="my-4 space-y-4 text-xs">
            <div className="relative bg-black/50 border border-white/12 rounded-2xl overflow-hidden">
              {/* Top Brand Accent Bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: venue.brandPrimary }}
              />

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      {venue.name} • ADMISSION PASS
                    </span>
                    <h4 className="font-heading font-bold text-base text-white mt-0.5">
                      {selectedMovie.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#eae0c8] text-[#09090b] flex-shrink-0">
                    PAID • {paymentMethod}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[11px] font-mono">
                  <div>
                    <span className="text-[9px] text-zinc-500 block">LOCATION</span>
                    <span className="text-zinc-200 font-semibold">Packages Mall 2F</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block">TIME SLOT</span>
                    <span className="text-zinc-200 font-semibold">
                      {selectedDate} • {selectedMovie.selectedTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block">CAFÉ TABLES</span>
                    <span className="text-amber-300 font-bold">
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "WALK-IN"}
                    </span>
                  </div>
                </div>

                {concessionItemsList.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 truncate pr-2">
                      Snacks:{" "}
                      <strong className="text-zinc-200 font-medium">
                        {concessionItemsList.reduce(
                          (acc, item) => acc + (selectedConcessions[item.id] || 0),
                          0
                        )}{" "}
                        items
                      </strong>
                      {selectedSeats.length > 0
                        ? ` • Delivered to Seat ${selectedSeats.join(", ")}`
                        : ""}
                    </span>
                    <span className="font-mono text-zinc-300 flex-shrink-0">
                      {formatMoney(concessionsTotal)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px]">
                  <span className="text-zinc-400">
                    Guest: <strong className="text-zinc-200">{guestName}</strong>
                  </span>
                  <span className="font-mono text-zinc-400">{passCode}</span>
                </div>
              </div>

              {/* Classic Perforated Tear-Line with Edge Notches */}
              <div className="relative flex items-center my-0.5">
                <span className="w-3 h-6 rounded-r-full bg-[#101115] border-y border-r border-white/12 -ml-px" />
                <div className="flex-1 border-t border-dashed border-white/15 mx-1.5" />
                <span className="w-3 h-6 rounded-l-full bg-[#101115] border-y border-l border-white/12 -mr-px" />
              </div>

              {/* Crisp Deterministic QR Pass Stub */}
              <div className="p-4 pt-3 flex flex-col items-center justify-center bg-[#f4efe6] text-[#09090b]">
                <svg
                  className="w-20 h-20 text-[#09090b]"
                  viewBox="0 0 21 21"
                  shapeRendering="crispEdges"
                  aria-label={`QR Admission Code ${passCode}`}
                >
                  {buildQrCells(passCode).map((rowCells, rIdx) =>
                    rowCells.map((filled, cIdx) =>
                      filled ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx}
                          y={rIdx}
                          width={1}
                          height={1}
                          fill="currentColor"
                        />
                      ) : null
                    )
                  )}
                </svg>
                <span className="font-mono text-xs tracking-widest text-[#09090b] mt-2 font-bold">
                  {passCode}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 mt-0.5 text-center">
                  Scan at Topsy Turvy 2nd Floor Reception • {venue.phone} / UAN {venue.mallUan}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-400">Total Paid</span>
              <span className="text-lg font-heading font-extrabold font-mono-numbers text-white">
                {formatMoney(grandTotal)}
              </span>
            </div>

            {isUSD ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWalletAdded(true);
                      soundEngine.playSuccessChime();
                    }}
                    className={`py-2.5 px-3 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      walletAdded
                        ? "bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]"
                        : "bg-white/[0.08] hover:bg-white/15 text-white border-white/15"
                    }`}
                  >
                    <span>{walletAdded ? "✓ Added to Apple Wallet" : "Add to Apple Wallet"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const shareText = encodeURIComponent(
                        `*${venue.name} Digital Playland Pass*\n` +
                          `Play Zone: ${selectedMovie.title}\n` +
                          `Location: Packages Mall (2nd Floor)\n` +
                          `Time Slot: ${selectedDate} @ ${selectedMovie.selectedTime}\n` +
                          `Café Tables: ${selectedSeats.length > 0 ? selectedSeats.join(", ") : "Walk-In"}\n` +
                          `Pass Code: ${passCode}\n` +
                          `Total Paid: ${formatMoney(grandTotal)}`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
                    }}
                    className="py-2.5 px-3 rounded-full bg-white/[0.06] hover:bg-white/12 text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <span>Share Pass (WhatsApp / Email)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("payment");
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-full bg-[#eae0c8] hover:bg-[#f4efe6] text-[#09090b] font-heading font-extrabold text-xs transition-colors cursor-pointer text-center"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const shareText = encodeURIComponent(
                      `*${venue.name} Digital Playland Pass*\n` +
                        `Play Zone: ${selectedMovie.title}\n` +
                        `Location: Packages Mall (2nd Floor)\n` +
                        `Time Slot: ${selectedDate} @ ${selectedMovie.selectedTime}\n` +
                        `Café Tables: ${selectedSeats.length > 0 ? selectedSeats.join(", ") : "Walk-In"}\n` +
                        `Pass Code: ${passCode}\n` +
                        `Total Paid: ${formatMoney(grandTotal)}`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
                  }}
                  className="py-2.5 rounded-full bg-white/[0.06] hover:bg-white/12 text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("payment");
                    onClose();
                  }}
                  className="py-2.5 rounded-full bg-[#eae0c8] hover:bg-[#f4efe6] text-[#09090b] font-heading font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
