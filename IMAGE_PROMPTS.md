# Topsy Turvy (Packages Mall, Lahore) — Gemini Image Generation Guide

This document lists **every image required** to replace all placeholder Unsplash URLs and legacy cinema assets across the Topsy Turvy web app.

---

## Global Art Direction (Keep Consistent Across All Prompts)
- **Aesthetic:** Bright, sunlit, warm daytime family & Montessori-inspired indoor edutainment center.
- **Lighting:** Clean natural/warm LED daylight (`4000K–5000K`), airy, spotless, inviting, zero dark/neon/cinema vibes.
- **Palette:** Warm cream (`#fffbf2`), natural birch wood, pastel mint, sky blue, soft amber, and cheerful coral/pink accents.
- **Photography Style:** Shot on 35mm f/2.8, shallow depth of field, editorial lifestyle photography, crisp textures, no text overlays or watermarks unless explicitly requested (e.g., Logo).

---

## 1. Brand & Meta Assets (`public/images/brand/`)

| File Path | Aspect Ratio | Usage |
| :--- | :--- | :--- |
| `public/images/brand/topsy-turvy-logo.png` | `1:1` | App header, splash screen, QR digital pass |
| `public/images/brand/og-cover.jpg` | `16:9` | Social share / OpenGraph preview banner |

### `public/images/brand/topsy-turvy-logo.png` (`1:1`)
> **Prompt:** Minimalist, playful modern vector logo mark for a luxury Montessori-inspired indoor children's playland and parent café named "Topsy Turvy". Features a whimsical stylized archway, slide curve, and warm sun/smile motif in warm amber gold, mint emerald, and sky blue on a clean warm cream (#fffbf2) background. Flat geometric design, friendly rounded shapes, crisp edges, no clutter, no photorealism.

### `public/images/brand/og-cover.jpg` (`16:9`)
> **Prompt:** Wide-angle editorial photograph of a bright, upscale indoor children's playland and adjoining glass-front parent café inside a modern shopping mall. Natural warm daylight, clean birch wood finishes, pastel soft-play maze in the background, parents relaxing with specialty coffee in the foreground looking through clear safety glass. Joyful, safe, spotless, photorealistic 35mm lens.

---

## 2. Play Zone Hero Posters (`public/images/zones/`)
*Used in `MOVIE_CATALOG[].posterImage` (`FilmReelGallery.tsx`, `MovieOverviewView.tsx`, `FullScreenCinemaSimulator.tsx`).*  
**Target Aspect Ratio:** `3:4` (Portrait)

| File Path | Zone |
| :--- | :--- |
| `public/images/zones/soft-play-maze.jpg` | Zone 01 — Soft-Play Maze |
| `public/images/zones/trampoline-climbing.jpg` | Zone 02 — Trampoline & Climbing |
| `public/images/zones/toddler-ball-pit.jpg` | Zone 03 — Toddler Ball Pit & Mini Kitchens |
| `public/images/zones/birthday-packages.jpg` | Zone 04 — Birthday Packages |
| `public/images/zones/school-trips.jpg` | Zone 05 — School Trips |

### `public/images/zones/soft-play-maze.jpg` (`3:4`)
> **Prompt:** Vertical editorial photograph of a bright, spotless 3-level indoor soft-play maze and jungle gym for kids aged 3 to 12. Features warm amber and pastel padded obstacle bridges, colorful twin wave slides, clean safety netting, and foam squeeze rollers. Sunlit modern mall interior, joyful South Asian children playing safely in grip socks, warm natural lighting, 35mm lifestyle photography, no text.

### `public/images/zones/trampoline-climbing.jpg` (`3:4`)
> **Prompt:** Vertical editorial photograph of a modern indoor trampoline and climbing arena for children. Interconnected spring-loaded jump mats with sky-blue and slate safety pads, a colorful padded indoor climbing wall with rounded holds, and 360-degree safety netting. Brightly lit, airy indoor playland, energetic kids mid-jump wearing anti-slip grip socks, crisp 35mm photography, no text.

### `public/images/zones/toddler-ball-pit.jpg` (`3:4`)
> **Prompt:** Vertical editorial photograph of a calm, Montessori-inspired toddler play sanctuary for ages 1 to 4. Features a pristine ball pit filled with pastel mint, pearl white, and soft yellow balls, alongside natural birch-wood miniature play kitchens and pastel playhouses. Soft cushioned flooring, warm sunlit atmosphere, happy toddlers exploring safely, shallow depth of field, no text.

### `public/images/zones/birthday-packages.jpg` (`3:4`)
> **Prompt:** Vertical editorial photograph of a private indoor playland birthday party deck. Features a tasteful pastel pink, warm gold, and cream balloon arch, a neatly set kids' party table with festive hats and treats, and a bright soft-play maze visible through glass behind it. Warm celebratory daylight, inviting luxury family aesthetic, 35mm lifestyle photography, no text.

### `public/images/zones/school-trips.jpg` (`3:4`)
> **Prompt:** Vertical editorial photograph of a bright, spacious indoor children's playland during a quiet morning school field trip. A small group of cheerful primary school children in neat school-trip vests playing together under the watchful eye of a friendly uniformed floor marshal. Clean, sunlit, organized, safe edutainment environment, 35mm photography, no text.

---

## 3. Zone Highlight Thumbnails (`public/images/zones/highlights/`)
*Used in `MOVIE_CATALOG[].cast[].avatar` (4 highlights per zone).*  
**Target Aspect Ratio:** `1:1` (Square)

> **Note:** Two highlights (`Grip Socks` in Zone 01 and `Face Painting` in Zone 04) can directly reuse `public/images/cafe/grip-socks.jpg` and `public/images/cafe/face-painting.jpg` from Section 4 to avoid duplicate assets.

### Zone 01 — Soft-Play Maze
1. **`public/images/zones/highlights/wave-slides.jpg` (`1:1`)**
   > **Prompt:** Square close-up lifestyle photo of twin glossy pastel amber and cream indoor soft-play wave slides leading onto a thick cushioned landing mat. Bright, clean, sunlit indoor playland, 35mm f/2.8, no text.
2. **`public/images/zones/highlights/crawl-tunnels.jpg` (`1:1`)**
   > **Prompt:** Square photo looking into a clean, brightly lit padded indoor soft-play crawl tunnel with transparent netting and colorful soft foam arches. Cheerful, safe, spotless, warm daylight, no text.
3. **`public/images/zones/highlights/foam-rollers.jpg` (`1:1`)**
   > **Prompt:** Square photo of vertical padded sensory squeeze rollers in warm amber, mint, and sky blue inside a modern indoor soft-play obstacle course. Bright lighting, crisp textures, no text.

### Zone 02 — Trampoline & Climbing
4. **`public/images/zones/highlights/jump-mats.jpg` (`1:1`)**
   > **Prompt:** Square photo of interconnected black and sky-blue spring trampoline jump mats with thick padded safety borders in a brightly lit indoor play arena. Clean, modern, energetic, no text.
5. **`public/images/zones/highlights/climbing-wall.jpg` (`1:1`)**
   > **Prompt:** Square photo of a kid-friendly indoor padded climbing wall with colorful ergonomic climbing holds and thick safety crash mats below. Bright natural-style lighting, clean design, no text.
6. **`public/images/zones/highlights/rope-ladders.jpg` (`1:1`)**
   > **Prompt:** Square photo of sturdy, colorful braided indoor rope ladders and a padded balance bridge suspended safely over foam mats inside a modern playland. Bright, airy, no text.
7. **`public/images/zones/highlights/safety-nets.jpg` (`1:1`)**
   > **Prompt:** Square architectural detail photo of taut, clean 360-degree safety enclosure netting and foam-wrapped steel posts around an indoor trampoline zone. Bright, reassuringly safe, no text.

### Zone 03 — Toddler Ball Pit & Mini Kitchens
8. **`public/images/zones/highlights/ball-pit.jpg` (`1:1`)**
   > **Prompt:** Square overhead-angle photo of a spotless toddler ball pit filled with matte pastel mint, cream, soft peach, and white play balls. Soft warm daylight, clean Montessori aesthetic, no text.
9. **`public/images/zones/highlights/mini-kitchens.jpg` (`1:1`)**
   > **Prompt:** Square photo of a charming Montessori-style miniature birch-wood play kitchen with pastel mint cabinets, wooden play food, and tiny utensils in a toddler play zone. Warm sunlit aesthetic, no text.
10. **`public/images/zones/highlights/playhouses.jpg` (`1:1`)**
    > **Prompt:** Square photo of cute miniature pastel wooden roleplay houses (a tiny bakery and mini market) inside a bright indoor toddler village. Clean, inviting, shallow depth of field, no text.
11. **`public/images/zones/highlights/soft-blocks.jpg` (`1:1`)**
    > **Prompt:** Square photo of giant, clean pastel foam building blocks stacked neatly on a cushioned playroom floor. Montessori colors (sage, cream, terracotta, sky blue), soft daylight, no text.

### Zone 04 — Birthday Packages
12. **`public/images/zones/highlights/party-host.jpg` (`1:1`)**
    > **Prompt:** Square lifestyle photo of a friendly, smiling young party host in a neat pastel polo shirt holding colorful helium balloons and organizing a fun kids' game in a bright indoor playland. Warm, candid, no text.
13. **`public/images/zones/highlights/reserved-tables.jpg` (`1:1`)**
    > **Prompt:** Square photo of a stylish, cozy Parent Café supervision booth with warm oak tables, upholstered seating, and a crystal-clear glass partition overlooking a sunlit indoor playland. No text.
14. **`public/images/zones/highlights/all-zone-pass.jpg` (`1:1`)**
    > **Prompt:** Square wide-angle lifestyle photo showing both a multi-level soft-play maze and a trampoline zone side by side in a bright, spacious indoor family entertainment center. Sunlit, joyful, no text.

### Zone 05 — School Trips
15. **`public/images/zones/highlights/floor-marshals.jpg` (`1:1`)**
    > **Prompt:** Square lifestyle photo of an attentive, friendly playland safety marshal in a clean bright polo shirt supervising children near a soft-play slide. Warm, trustworthy, bright indoor lighting, no text.
16. **`public/images/zones/highlights/morning-slot.jpg` (`1:1`)**
    > **Prompt:** Square photo of a calm, freshly sanitized indoor playland at 11:00 AM morning opening, flooded with warm daylight, spotless floors, and empty pastel play structures ready for guests. No text.
17. **`public/images/zones/highlights/snack-boxes.jpg` (`1:1`)**
    > **Prompt:** Square photo of neat, wholesome kids' Kraft snack boxes containing mini sandwiches, fruit cups, and apple juice boxes arranged on a clean café counter. Bright editorial food photography, no text.
18. **`public/images/zones/highlights/teachers-free.jpg` (`1:1`)**
    > **Prompt:** Square lifestyle photo of a relaxed parent or teacher sitting at a bright café table with a hot cappuccino and an open tablet, with a clear glass view of the kids' playland behind them. Warm daylight, no text.

---

## 4. Add-Ons & Parent Café Menu (`public/images/cafe/`)
*Used in `CONCESSION_MENU[].image` (`SnackSelectionView.tsx`).*  
**Target Aspect Ratio:** `1:1` (Square)

| File Path | Menu Item |
| :--- | :--- |
| `public/images/cafe/grip-socks.jpg` | Topsy Turvy Grip Socks |
| `public/images/cafe/face-painting.jpg` | Themed Face Painting |
| `public/images/cafe/cappuccino-brownie.jpg` | Parent Café Cappuccino & Brownie |
| `public/images/cafe/panini-latte.jpg` | Grilled Chicken Panini & Iced Latte |
| `public/images/cafe/kids-nuggets-meal.jpg` | Kids' Crispy Nuggets & Juice Box |
| `public/images/cafe/party-balloon-pack.jpg` | Birthday Balloon & Host Add-On |

### `public/images/cafe/grip-socks.jpg` (`1:1`)
> **Prompt:** Square studio product photograph of a pair of clean, cheerful kids' anti-slip trampoline grip socks in warm amber, mint green, and cream stripes, angled to clearly show the white silicone grip dots on the sole. Placed on a soft warm cream surface (#fffbf2), bright diffused daylight, no text.

### `public/images/cafe/face-painting.jpg` (`1:1`)
> **Prompt:** Square close-up lifestyle portrait of a smiling 6-year-old South Asian child with delicate, colorful pastel butterfly and glitter face painting on one cheek, photographed in a bright, sunlit indoor playland. Joyful, natural skin tones, shallow depth of field, no text.

### `public/images/cafe/cappuccino-brownie.jpg` (`1:1`)
> **Prompt:** Square editorial food photograph of a fresh café cappuccino with rosetta latte art in a ceramic cup alongside a warm, fudgy chocolate brownie dusted with cocoa on a light oak serving tray. Bright sunlit café table, warm morning aesthetic, 35mm f/2.8, no text.

### `public/images/cafe/panini-latte.jpg` (`1:1`)
> **Prompt:** Square editorial food photograph of a golden-toasted grilled chicken and melted cheese sourdough panini cut in half on a white ceramic plate, paired with a tall glass of iced caramel latte. Bright modern café table with soft daylight, crisp textures, no text.

### `public/images/cafe/kids-nuggets-meal.jpg` (`1:1`)
> **Prompt:** Square editorial food photograph of 6 golden crispy chicken nuggets, crinkle-cut fries, a small ketchup ramekin, and a cheerful apple juice box arranged neatly on a pastel kids' café tray. Bright, appetizing, clean family café lighting, no text.

### `public/images/cafe/party-balloon-pack.jpg` (`1:1`)
> **Prompt:** Square studio-style photograph of a festive helium balloon bouquet in pastel pink, mint, sky blue, and warm gold with curled ribbons, floating beside a bright indoor birthday party table. Cheerful daylight, clean background, no text.

---

## 5. Newly Added Prompts (From `topsyturvy.pk` Real Attractions & Add-Ons)
*Generate these 6 additional `1:1` square images to give dedicated visuals to the newly surfaced attractions and add-ons from `topsyturvy.pk`:*

1. **`public/images/zones/highlights/space-shuttle.jpg` (`1:1`)**
   > **Prompt:** Square editorial photo of a playful, brightly colored indoor soft-play Space Shuttle climbing structure and a cozy padded "Disco Pen" nook with soft warm party lights tucked under a slide in a modern indoor playland. Clean, safe, sunlit mall setting, 35mm f/2.8, no text.
2. **`public/images/zones/highlights/arts-crafts-garden.jpg` (`1:1`)**
   > **Prompt:** Square photo of a bright, Montessori-inspired indoor "Arts & Crafts Garden" corner for kids, featuring child-sized birch wood tables, pastel stools, safe crayons, paper crafts, and playful leafy wall accents. Warm sunlit daylight, spotless, no text.
3. **`public/images/zones/highlights/race-track.jpg` (`1:1`)**
   > **Prompt:** Square photo of a cheerful indoor kids' pedal/ride-on Race Track with colorful padded track borders and cute miniature ride-on cars in a bright modern indoor playland. Crisp 35mm lifestyle photography, no text.
4. **`public/images/zones/highlights/miki-juju-mascot.jpg` (`1:1`)**
   > **Prompt:** Square joyful photo of two friendly, colorful plush playland mascot characters waving beside a bright pastel "Wheel of Fortune" prize spinner in an indoor kids' birthday party room. Warm celebratory lighting, no text.
5. **`public/images/cafe/cotton-candy-popcorn.jpg` (`1:1`)**
   > **Prompt:** Square editorial food photo of fluffy pastel pink and sky-blue cotton candy swirls alongside a striped cup of golden caramel popcorn on a clean warm-cream café counter. Bright family-friendly lighting, 35mm f/2.8, no text.
6. **`public/images/cafe/pinata-party.jpg` (`1:1`)**
   > **Prompt:** Square studio-style photo of a cheerful, colorful handmade pastel star-shaped birthday piñata with ribbons hanging in a bright, sunlit indoor party room. Warm, festive, crisp textures, no text.

---

## 6. Integration Checklist (After Generating Images)
1. Save all generated files into the exact paths under `public/images/brand/`, `public/images/zones/`, `public/images/zones/highlights/`, and `public/images/cafe/`.
2. Update `src/constants/cinemaData.ts` to point `posterImage`, `cast[].avatar`, and `CONCESSION_MENU[].image` to the local `/images/...` paths.
3. Replace fallback `/images/posters/dune-part-two.jpg` references in `src/components/FilmReelGallery.tsx` and `src/components/FullScreenCinemaSimulator.tsx` with `/images/zones/soft-play-maze.jpg`.
4. Update `index.html` favicon / `og:image` meta tag to use `/images/brand/topsy-turvy-logo.png` and `/images/brand/og-cover.jpg`.
