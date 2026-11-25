# Prompt: Topsy Turvy POS — single-file HTML prototype

Copy everything below this line into your AI coding tool. Attach the two Topsy Turvy logo PNGs (the full "TOPSY TURVY" wordmark and the "TT" mouse icon) with it.

---

You are a senior front-end engineer and product designer. Build a **working, clickable prototype** of a counter POS system for **Topsy Turvy**, an indoor kids' play and party venue in Pakistan (tagline: "PLAY • LEARN • CELEBRATE"). It will be used in a **live client demo**, so it must feel like a real product, run smoothly, and never break mid-demo.

## 1. Technical rules (must follow)

- Deliver **one file: `index.html`**, containing all HTML, CSS and JavaScript. No build step, no framework install, no backend.
- Plain HTML/CSS/vanilla JavaScript (ES2020). Allowed external resources: Google Fonts (Fredoka for headings, Inter for body/numbers) with system-font fallbacks. Everything must still work if the internet is off; draw QR codes with a small inline QR generator (no CDN dependency).
- Persist all data in `localStorage` under one key (`tt_pos_demo_v1`). Seed realistic demo data on first load. Add **Settings → Reset demo data** to restore the seed.
- Logos: reference `./logo-wordmark.png` and `./logo-tt.png`; if an image fails to load, fall back to a styled text logo "Topsy Turvy" in the brand colours. (If the logos are attached, embed them as base64 so the single file is self-contained.)
- Designed for a **1366×768 touchscreen** and up; must also look fine at 1920×1080 and on a TV. Minimum tap target 48px. No horizontal scrolling.
- Currency: **PKR**, formatted `PKR 1,600`. Time format: `3:45 PM`. Timezone: the browser's local time.
- Code organised in clear sections: state/store, seed data, demo clock, router, screens, components, print templates, utilities. Comment each section.

## 2. Demo clock (critical for the live demo)

The real 2-hour timers are too slow for a demo, so add a **Demo Controls** pill (bottom-right, collapsible) with:
- Speed: **1×, 10×, 60×** (60× = one real second is one demo minute).
- **"+10 min"** button that jumps the demo clock forward.
- **"Pause"** toggle.
- All timers, alerts, business dates and reports use this demo clock, not `Date.now()` directly.

## 3. App shell

- **Top bar**: TT icon logo, branch selector (**Karachi — Ocean Mall**, **Lahore — Packages Mall**), counter name (Counter 1 / 2 / 3), counter status pill (Open = green, Closed = grey), demo clock time, logged-in user with role, Lock button.
- **Alert strip** directly under the top bar, always visible: shows active time alerts (see §6). Empty state: a thin strip "All children within time ✓".
- **Left sidebar** (icons + labels): Home, New Ticket, Floor Board, Café, Bookings, Cash Drawer, Close Day, Deposits, Reports, Settings. Hide items the current role cannot use.
- **PIN login screen** on start and after Lock: 4-digit keypad, branch + counter selection. Demo users (show them as hint chips on the login screen):
  - Sara — Cashier — PIN 1111
  - Bilal — Floor Staff — PIN 2222
  - Hina — Manager — PIN 3333
  - Owner — Admin — PIN 9999

### Role permissions
| Action | Cashier | Floor Staff | Manager | Admin |
|---|---|---|---|---|
| Sell tickets / café / take bookings | ✓ | – | ✓ | ✓ |
| Floor Board: Mark Out / Extend | ✓ | ✓ | ✓ | ✓ |
| Open / close own counter, cash in/out | ✓ | – | ✓ | ✓ |
| Void, refund, discount, approve variance, cash out > PKR 5,000 | needs manager PIN | – | ✓ | ✓ |
| Deposits | – | – | ✓ | ✓ |
| Settings | – | – | – | ✓ |
| Reports | own shift | – | own branch | all branches |

When a cashier attempts a manager action, show a **Manager PIN** modal instead of blocking.

## 4. Business rules

- **Opening hours (both branches)**: Sun–Thu 12:00 PM–11:00 PM, Fri 3:00 PM–12:00 AM, Sat 12:00 PM–12:00 AM.
- **Business date**: a shift belongs to the date it was opened, even if it closes after midnight.
- **Passes** (demo prices, editable in Settings):
  - 2-Hour Pass — PKR 1,000 — 120 minutes — colour blue
  - Full-Day Pass — PKR 1,800 — until closing — colour green
- **Add-ons**: Grip socks PKR 300, Extra adult PKR 0, Extra 30 min PKR 500.
- **Overtime**: PKR 500 per started 30 minutes past end time.
- **Alerts**: 10 minutes before end (amber) and at end (red). Full-Day Pass: one alert 30 minutes before closing.
- **Party packages** (per child, 2 hours incl. 1-hour private room):
  - Spectac-U-Lar — PKR 1,600 — minimum 15 kids — includes kids meal + 1 beverage, play area access, wristband + name tag
  - Premier — PKR 1,950 — minimum 10 kids — includes kids meal + 2 beverages, birthday present + certificate, balloon bending or face painting, wristband
  - Party rooms: Room A, Room B.
- **School trips**: price per child entered manually (default PKR 800); teachers free.
- **Advance**: **20%** of the booking total to confirm any party or school trip. Balance collected on the day.
- **Payments**: Cash (with amount received + change), Card, Other (JazzCash / Easypaisa / Bank transfer, with reference). Split payments allowed.
- **Cash denominations** for counting: 5000, 1000, 500, 100, 50, 20, 10, plus "Coins" as a single amount.
- **Expected cash** = opening float + cash sales + cash advances/balances + cash in − cash out − cash refunds.
- Variance above **PKR 500** (either direction) requires a reason and Manager PIN.
- No SMS, WhatsApp or email anywhere in the product.

## 5. Screens

### 5.1 Home
Cards: Children on floor now (with count of amber/red), Today's ticket sales, Today's café sales, Advances collected today, Drawer cash expected, Next party (name, time, room, kids). Big quick-action buttons: **New Ticket**, **Café Order**, **New Party**, **Floor Board**. If the counter is closed, show a large "Open Day" call to action instead.

### 5.2 Open Day
Denomination grid with +/− steppers and live total → "Request approval" → Manager PIN → counter becomes Open. Selling is disabled while the counter is closed (show a friendly prompt).

### 5.3 New Ticket
- Two large pass buttons (2-Hour, Full-Day) with price and duration.
- Child rows: name (required), age (optional), pass type per child; **+ Add child**; remove row.
- Optional parent name and phone (label: "for lookup only — we never message customers").
- Add-ons with quantity steppers.
- Right panel: live order summary and total; **Pay** button.
- Payment modal: method tabs, quick-cash buttons (exact, 2000, 5000), change due, split payment.
- After payment: success screen with **receipt preview** and **one wristband preview per child**, buttons **Print receipt**, **Print wristbands**, **Done**. Each child is added to the Floor Board with start = payment time, end = start + duration.

### 5.4 Wristband and receipt print
- Wristband layout: long thin band (about 25mm × 250mm, landscape), left-to-right: TT logo, pass colour stripe, **child name in very large bold text**, pass type, "Start 3:10 PM", **"Ends 5:10 PM" large**, ticket number (e.g. `KHI-C1-000123`), QR code (encodes ticket number). Party bands are pink with the booking name; school-trip bands are orange with the school name.
- Receipt layout: 80mm thermal style — logo, branch, counter, cashier, date/time, sale number, lines, total, payment, change, "Thank you for playing at Topsy Turvy!".
- Use `@media print` and a hidden print container so `window.print()` prints only the band(s) or receipt.

### 5.5 Live Floor Board
- Grid of child cards sorted by time left (most urgent first). Card: name, age, pass chip, start → end, big countdown (mm:ss or "+12 min over"), sold by counter, group label for parties/trips.
- Colours: green > 10 min, amber ≤ 10 min, red = over time (pulsing border).
- Filters: All / Amber / Red / Parties / School trips; search by name or ticket number; "Scan wristband" field (typing a ticket number opens that card, simulating a QR scan).
- Card actions: **Mark Out**, **Extend 30 min** (creates a pending overtime charge that must be paid at the counter; new end time), **Reprint band**.
- Group cards for party/school bookings expand to show each child.
- **TV mode** button: full-screen, dark-on-light, large names, no prices, logo header, shows the alert banner; exit with Esc.

### 5.6 Alerts (core feature)
- When a child hits 10 minutes left: amber banner in the alert strip — "⏰ **Ayaan Khan** — 2-Hour Pass ends in 10 min (5:10 PM)" — and a soft chime (WebAudio, two short tones).
- At end time: red banner — "🔴 **Ayaan Khan** — time is up" — louder three-tone chime, repeats every 2 demo minutes until acted on.
- Banners stack (max 3 visible, "+N more" chip opens the Floor Board filtered to Red/Amber).
- Banner buttons: **Mark Out**, **Extend 30 min**, **Snooze 5 min** (red only, once per child). Amber banners can be dismissed; red cannot be dismissed without an action.
- Log every alert and action (who, when) for the reports.
- Mute toggle in the top bar (for the demo).

### 5.7 Café POS
- Category tabs: **Snacks, Sandwiches, Juices, Treats**, plus **Party Meals** (hidden category used by bookings).
- Seed menu (demo prices): Fries 350, Nuggets (6 pc) 550, Popcorn 250, Nachos 450; Club Sandwich 750, Chicken Mayo Sandwich 600, Grilled Cheese 500, Kids Mini Burger 650; Fresh Orange Juice 450, Mint Lemonade 400, Mango Shake 500, Mineral Water 100, Juice Box 150; Brownie 350, Cupcake 300, Ice Cream Cup 300, Cotton Candy 250; Kids Meal (party) 0 (included), Party Juice 0 (included).
- Item tiles with emoji or simple icon, name, price; tap to add, cart on the right with qty steppers, line notes, discount (manager PIN), **Pay**.
- Optional "Link to child" (search Floor Board name / scan band) so the receipt shows the child's name.
- Prints receipt and a kitchen slip. Low-stock badge on items with stock < 5 (seed a couple).

### 5.8 Bookings
- **Calendar**: week view with day columns and rows for Room A and Room B; 2-hour slots within opening hours; booked slots coloured (party = pink, school trip = orange) with name and kid count; click empty slot → New Party prefilled.
- **List view** tab: upcoming bookings with status chips (Enquiry, Confirmed, Checked in, Completed, Cancelled), advance paid, balance due.
- **New Party** form: package cards (Spectac-U-Lar / Premier with inclusions), date, slot, room (prevent double booking), birthday child name + age, parent name + phone, number of kids (enforce minimum with a clear message), theme / notes. Live price box: kids × price = total, **Advance 20%**, balance. **Take advance** → payment modal → status Confirmed → print booking receipt with booking number (`PTY-KHI-0012`).
- **New School Trip** form: school name, teacher name + phone, date, slot, number of children, number of teachers, price per child, notes; same 20% advance logic (`SCH-KHI-0004`).
- **Booking detail / Check-in**: guest list editor (paste names one per line or auto-number "Guest 1…N"), **Check in & print all wristbands** (adds all children to the Floor Board as one group with 120 min), add extra kids or café items to the same bill, **Collect balance** → payment → Completed. Cancel booking (manager PIN, advance kept as non-refundable in the demo).

### 5.9 Cash Drawer
- Shows opening float, running totals by method, cash in/out log, expected cash now.
- **Cash In** / **Cash Out** modals: amount, reason (Change top-up, Petty expense, Owner withdrawal, Other), note. Cash out > PKR 5,000 requires Manager PIN.

### 5.10 Close Day
- Block closing if there are unpaid overtime charges for this counter (list them).
- Step 1: **Blind count** — denomination grid without showing expected cash.
- Step 2: Summary — expected vs counted, variance (green if 0, amber within ±500, red beyond), card and other totals "to match with card machine / statements".
- Variance beyond ±500 → reason + Manager PIN.
- Step 3: **Z-report** preview (printable 80mm) with sales by category, payments by method, cash movements, variance, opened/closed by. Counter becomes Closed.

### 5.11 Deposits
- List of deposits with date, bank, slip no., amount, linked business dates, photo thumbnail.
- **Add deposit**: pick closed shifts (checkbox list with cash totals; pre-fills amount), bank (HBL, Meezan, UBL, MCB, Bank Alfalah, Other), account (last 4 digits), slip number, deposit date, amount, photo upload (stored as a downscaled data URL) with preview.
- Show the difference between selected closing cash and amount deposited.
- Red "Missing deposit" warnings for closed business dates with no linked deposit.

### 5.12 Reports
- Filters: branch (or All for Admin), date range presets (Today, Yesterday, This week, This month).
- KPI tiles: total revenue, tickets sold, children served, café revenue, advances collected, average spend per child, total variance.
- Charts drawn with inline SVG (no chart library): revenue by day (bars), tickets by hour of day (bars — shows busy hours), café sales by category (horizontal bars), payment method split.
- Tables: sales by counter and cashier; top café items; bookings with advances and balances; closings with variances; deposits vs cash collected.
- **Export CSV** button for each table.

### 5.13 Settings (Admin)
Tabs: Branches & hours, Counters, Users & PINs, Passes & add-ons, Overtime & alert timings, Café menu (add/edit/disable items, stock), Party packages & minimums, Advance % (default 20), Receipt footer text, **Reset demo data**.

## 6. Seed data (so the demo looks alive)

- Today: Karachi Counter 1 already **open** with a float of PKR 10,000; Counter 3 (café) open; Counter 2 closed.
- **8 children on the floor** at varied times relative to the demo clock: 3 green, 2 starting within ~3 minutes of turning amber, 1 amber, 1 red by 4 minutes, 1 Full-Day pass. Use local names: Ayaan Khan, Hoorain Ali, Zayan Ahmed, Inaya Siddiqui, Rayyan Sheikh, Anaya Raza, Musa Qureshi, Eshaal Butt.
- 12 earlier ticket sales and 9 café orders today across Sara and Hina, mixed payment methods.
- Bookings: 1 Spectac-U-Lar party today in 3 hours (Room A, 18 kids, "Aleena's 6th — Unicorn theme", advance paid), 1 Premier party in 2 days (Room B, 12 kids), 1 school trip next week (The City School — 40 children, 4 teachers), 1 Enquiry with no advance.
- Last 14 days of history for both branches (generate plausibly, weekends busier, Lahore ~70% of Karachi) with closings, small variances, and deposits for all but one day (so the "Missing deposit" warning shows).

## 7. Visual design

- Brand palette (from the logo): Red `#E31E3C`, Blue `#1BA0DE`, Green `#1FA246`, Purple `#6A3A97`, Yellow `#F7D41B`, Orange `#F28C28`, Pink `#E83E8C`, Lime `#8CC63F`, Navy text `#1F2A5A`, background `#F7F8FC`, cards white.
- Playful but professional: rounded corners (16px cards, 12px buttons), soft shadows, Fredoka headings, Inter for numbers (tabular figures). Each sidebar section gets one brand accent colour. Use the mouse mascot in empty states ("No children on the floor yet").
- Status colours must stay consistent everywhere: green = OK, amber = warning, red = over time / problem.
- Smooth but quick transitions (≤150ms). Toast notifications for success ("Ticket KHI-C1-000124 printed").
- Accessible contrast; large readable numbers on the Floor Board.

## 8. Demo script the prototype must support end to end

1. Log in as Sara (1111) on Karachi Counter 1.
2. Sell a 2-Hour Pass to two siblings with socks, pay cash 5,000, see change, print 2 wristbands and a receipt.
3. Open the Floor Board; set the demo speed to 60×; watch a child turn amber, then red, with banners and chimes.
4. Extend one child 30 min (pay the overtime) and Mark Out another from the banner.
5. Café: sell Fries + Mango Shake linked to a child; print receipt.
6. Book a Premier party for 12 kids next Saturday in Room B, take the 20% advance (PKR 4,680), print the booking receipt.
7. Open today's Spectac-U-Lar party, check in, paste guest names, print all bands, see the group on the Floor Board, collect the balance.
8. Cash Out PKR 1,500 for petty expense.
9. Close Day with a blind count that is PKR 700 short → reason + Manager PIN (3333) → Z-report.
10. Log in as Hina, add a deposit slip with a photo for the closing.
11. Log in as Owner (9999), view Reports for All branches this week; export a CSV.
12. Switch to TV mode on the Floor Board.

## 9. Quality bar

- No console errors; every button does something or shows a clear "coming in phase 2" toast (use sparingly).
- Validation messages are friendly and specific ("Premier needs at least 10 kids — you have 8").
- Numbers always add up: receipts, Z-report, reports and deposits must reconcile with each other.
- Keep the file under ~4,000 lines; prefer reusable render functions over copy-paste.

Output the complete `index.html` only.
