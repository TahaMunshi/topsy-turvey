# Topsy Turvy (Packages Mall, Lahore) — Developer Handoff & Source of Truth

**Repository:** `https://github.com/TahaMunshi/topsy-turvey` (`main`)  
**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, Three.js (`three`), Redux Toolkit  
**Current Status:** Functional prototype converted from a 3D cinema booking template (`Aetheria SeatVision`) into a Topsy Turvy Playland & Parent Café Sightline Explorer. Ready for visual/brand overhaul, real media assets, booking-model refinement, and backend integration.

---

## 1. Product Goal & Direction

### Vision
Build the flagship digital booking and pre-visit experience for **Topsy Turvy at Packages Mall, Lahore**, solving the #1 parent friction point at indoor playlands:
1. **Transparency before arrival:** Parents can explore the 2nd-floor playland in **3D** and preview the exact **eye-level sightline** from any Parent Café supervision table before booking.
2. **Crowd & slot visibility:** Parents can pick **11:00 AM – 11:00 PM** time slots with live crowd-level indicators (`Quiet`, `Moderate`, `Busy`, `Peak`) to avoid weekend bottlenecks.
3. **Seamless all-in-one checkout:** Bundle child play passes, mandatory **Grip Socks**, **Face Painting**, **Parent Café** food/coffee, and **Vouch365 / BOGO** promo codes into a single QR pass.

### Design Direction (Critical Next Shift)
* **Move away from the inherited dark cinema theme (`#09090b`)** toward a **bright, warm, daytime family & Montessori-inspired UI** (clean whites, warm creams, pastel mint/amber/sky accents) that matches the brightly lit 3D Playland scene and appeals to parents and young families.
* Keep interactions **fast, mobile-first, and clutter-free** (Parents often book on mobile while walking through Packages Mall).

---

## 2. Business Details (Packages Mall, Lahore)

| Field | Verified Details |
| :--- | :--- |
| **Brand Name** | Topsy Turvy |
| **Location** | 2nd Floor, Packages Mall, Main Walton Road / Nishtar Town, Lahore (near Bounce, Super Space, Cinepax) |
| **Operating Hours** | **11:00 AM – 11:00 PM** daily (aligned with Packages Mall hours) |
| **Playland Phone** | `+92 347 6850000` |
| **Packages Mall UAN** | `111-696-255` (111-MY-MALL) |
| **Target Age Group** | Toddlers & children aged **1 to 12 years** |
| **Concept** | Montessori-inspired indoor edutainment & soft-play center encouraging physical activity, sensory development, and social play under trained staff supervision |

### Core Play Zones & Offerings
1. **Soft-Play Maze (Ages 3–12):** 3-level padded jungle gym, wave slides, crawl tunnels, foam squeeze rollers, net bridges.
2. **Trampoline & Climbing (Ages 4–12):** Interconnected spring trampolines with safety pads, padded climbing walls, rope ladders.
3. **Toddler Ball Pit & Mini Kitchens (Ages 1–4):** Sanitized pastel ball pit, pretend-play miniature houses/kitchens, soft building blocks.
4. **Birthday Packages (All Ages):** Custom-themed decor, dedicated party host, face painting, reserved Parent Café tables/deck, kids' meals.
5. **School Trips (Groups 15+):** Morning/noon slots (`11:00 AM – 1:30 PM` quiet hours), floor marshals, grip socks bundles, student meal boxes.

### Facilities, Add-ons & Discounts
* **Parent Café:** Adjoining supervision seating with espresso/coffee, snacks, and **free Wi-Fi** (parents can supervise or drop off kids while shopping/dining).
* **Safety & Gear:** Anti-slip **Grip Socks** (required for play zones).
* **Activities:** Themed **Face Painting**, Birthday balloon & host add-ons.
* **Promotions:** Historically listed on **Vouch365** (*Leisure* category, BOGO / Buy 1 Get 1 Free offers).
* **Pricing Note:** Exact counter PKR rates fluctuate seasonally; confirm official tariffs with management (`+92 347 6850000`) before going live.

### Known Visitor Feedback (Design Opportunities)
* **Peak crowding:** Weekends/evenings (`4:00 PM – 9:00 PM`) get busy—highlight quiet morning slots (`11:00 AM`) and live crowd percentages.
* **Socks & cleanliness:** Reviews note socks enforcement can be inconsistent—make Grip Socks a clear, pre-checked or prompted add-on during booking.
* **Dim maze corners:** Reviews mention some soft-play maze corners feel dim—keep the 3D Explorer brightly lit and transparent.

---

## 3. Current Codebase Architecture

### Run & Build Commands
```bash
npm install
npm run dev -- --port 5174 --strictPort --host   # Local dev server
npm run build                                    # TypeScript check (tsc -b) + Vite production build
npm run lint                                     # ESLint check
```

### Active File Map (`src/`)
| File | Current Role |
| :--- | :--- |
| [src/constants/cinemaData.ts](src/constants/cinemaData.ts) | Source data: `KARACHI_VENUES` (3 Topsy Turvy wings), `MOVIE_CATALOG` (5 Play Zones), `TIME_SLOTS_11_TO_11`, `getTimeSlotCrowd()`, `CONCESSION_MENU` (Grip Socks, Face Painting, Parent Café), `PROMO_CODES` (`VOUCH365`, `BOGO`, `PACKAGES10`), `ROW_METRICS` & `getSeatSpatialData()` for 48 tables (`A1`–`F8`). |
| [src/pages/home/index.tsx](src/pages/home/index.tsx) | Main app shell, 3-pill floating header, currency toggle (`PKR`/`USD`), wing switcher, view state (`gallery` \| `overview` \| `seats` \| `3d-preview` \| `snacks`). |
| [src/components/FilmReelGallery.tsx](src/components/FilmReelGallery.tsx) | Stage 1: Interactive Play Zone carousel & left quick-select sidebar. |
| [src/components/MovieOverviewView.tsx](src/components/MovieOverviewView.tsx) | Stage 2: Selected Play Zone details, Zone Highlights, and CTA to 2D Map or 3D Sightline. |
| [src/components/SeatSelectionView.tsx](src/components/SeatSelectionView.tsx) | Stage 3: Interactive 2nd-Floor Playland Zone Map (click a zone to highlight best-sightline Café Tables), 2nd-floor landmarks (Check-In/Socks Desk & Espresso Bar), Parent Café Supervision Table selector (`A1`–`F8`), and 11 AM–11 PM time slots with crowd levels. |
| [src/components/ThreeCinemaSimulator.tsx](src/components/ThreeCinemaSimulator.tsx) | Three.js 3D Playland & Parent-Sightline Explorer (Soft-Play Maze, Toddler Ball Pit & Mini Kitchens, Trampoline & Climbing Wall, glass partition, 48 interactive Café Tables, Daylight vs. Party Glow lighting, plus `focusZone` camera presets). |
| [src/components/FullScreenCinemaSimulator.tsx](src/components/FullScreenCinemaSimulator.tsx) | Stage 4: Full-screen HUD wrapper for the 3D Explorer (date/slot/crowd dropdowns, Daylight/Party Glow toggle, quick 3D Zone Camera Presets, Table Sightline POV vs. 3D Playland Orbit, table switcher modal). |
| [src/components/SnackSelectionView.tsx](src/components/SnackSelectionView.tsx) | Stage 5: Add-ons & Parent Café menu (`Safety & Gear`, `Activities`, `Parent Café`) + order summary. |
| [src/components/CheckoutModal.tsx](src/components/CheckoutModal.tsx) | Checkout modal with `VOUCH365` / `BOGO` / `PACKAGES10` promo codes, payment method selector (JazzCash, EasyPaisa, RAAST, Card / Stripe, PayPal, Apple Pay), and deterministic QR Digital Pass. |
| [src/components/LoadingSplashScreen.tsx](src/components/LoadingSplashScreen.tsx) | Branded splash loader with Packages Mall location & phone numbers. |
| [src/components/FuturisticLogo.tsx](src/components/FuturisticLogo.tsx) | Vector brand marks (`topsy-main`, `topsy-toddler-wing`, `topsy-party-lounge`). |
| [src/components/PitchDeckModal.tsx](src/components/PitchDeckModal.tsx) | Fallback wing switcher modal. |

---

## 4. Prioritized Next Steps (Roadmap for Next Developer)

### Phase 1: Brand, Theme & Real Assets (Immediate)
1. **Light / Family-Friendly Theme Overhaul:**
   * *(Completed)* Converted [index.html](index.html), [src/index.css](src/index.css), and all primary views (`FilmReelGallery`, `MovieOverviewView`, `SeatSelectionView`, `SnackSelectionView`, `CheckoutModal`, `LoadingSplashScreen`) to a bright, warm sunlit `#fffbf2` family-friendly palette with frosted white glass pills and amber/emerald/sky accents.
2. **Replace Stock Photography:**
   * Replace all Unsplash URLs in [src/constants/cinemaData.ts](src/constants/cinemaData.ts) with real, high-res photos of Topsy Turvy Packages Mall (stored in `public/images/zones/` and `public/images/cafe/`).
   * Add the official Topsy Turvy logo in `public/images/` and [FuturisticLogo.tsx](src/components/FuturisticLogo.tsx).
3. **Checkout Copy:** *(Completed)* WhatsApp share strings and contact fallbacks in [src/components/CheckoutModal.tsx](src/components/CheckoutModal.tsx) are updated to Topsy Turvy Playland terminology.

### Phase 2: Booking & Pricing Model (Core Business Logic)
1. **Decouple Child Play Passes from Parent Café Tables:**
   * Currently, total price is calculated from selected Café Tables (`A1`–`F8`).
   * Refactor state so users select:
     * **Number of Children** + **Age Tier** (*Toddler 1–4* vs. *Kids 3–12*) + **Pass Duration** (e.g., 2-Hour Pass vs. Full-Day Pass).
     * **Grip Socks** auto-suggested/required per child (with an "I already have Topsy Turvy grip socks" toggle).
     * **Parent Café Table** reservation (complimentary with pass, or VIP Booth minimum spend).
2. **Dedicated Birthday & School Trip Flows:**
   * **Birthday Packages:** Package tier selector (Silver/Gold/Custom), guest child count, theme picker, cake/decor/face-painting add-ons, and deposit payment.
   * **School Trips:** Group size (`15+`), school name, preferred morning slot (`11:00 AM` / `1:30 PM`), and direct inquiry/WhatsApp submission to `+92 347 6850000`.
3. **Official Tariff Sync:**
   * Confirm exact PKR prices and Vouch365 terms (e.g., valid weekdays only vs. all week, max BOGO redemptions per visit) with Topsy Turvy management.

### Phase 3: 2D Map & 3D Explorer Polish
1. **2D Map ([src/components/SeatSelectionView.tsx](file:///d:/Projects/topsy-turvey/src/components/SeatSelectionView.tsx)):**
   * *(Completed)* Interactive zone buttons highlight best-sightline Café Tables (`A1–B4` for Toddler Ball Pit, `C3–D6` for Soft-Play Maze, `A5–B8` for Trampoline) and display 2nd-floor landmarks (Check-In/Grip Socks Desk & Espresso Bar).
2. **3D Playland Explorer ([src/components/ThreeCinemaSimulator.tsx](file:///d:/Projects/topsy-turvey/src/components/ThreeCinemaSimulator.tsx)):**
   * *(Completed)* Quick 3D zone camera presets (`Table POV`, `Soft-Play Maze`, `Toddler Ball Pit`, `Trampoline`) are live in the 3D Explorer HUD.
   * **Remaining:** Add floating 3D zone labels (`CSS3DObject` or sprite badges), subtle ambient animations (bouncing ball-pit spheres, gentle character motion), and a visual sightline cone from the active Café Table.

### Phase 4: Backend, Payments & Legacy Cleanup
1. **Backend & Live Inventory:**
   * Replace `PRE_RESERVED_SEATS` and static `getTimeSlotCrowd()` in [src/constants/cinemaData.ts](src/constants/cinemaData.ts) with API-backed slot capacity, live table availability, and booking persistence.
   * Integrate real payment gateways (JazzCash, EasyPaisa, RAAST, Card) and automated WhatsApp/SMS QR pass dispatch.
2. **Legacy Cinema Cleanup:**
   * Delete unused cinema files: `public/models/cinema/`, `public/images/posters/`, `public/images/actors/`, `src/components/CinemaBookingView.tsx`, `src/components/NueplexQuickBookingBar.tsx`, `Aetheria_SeatVision_Pitch_Deck.pptx`, `imax_seatvision_70mm_film_reel_gallery_3d_cinema_simulator.html`.
   * Rename legacy TypeScript interfaces and filenames (`MovieItem` → `PlayZoneItem`, `KarachiVenue` → `PlaylandWing`, `cinemaData.ts` → `topsyData.ts`, `ThreeCinemaSimulator.tsx` → `ThreePlaylandSimulator.tsx`).
