export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface CrowdInfo {
  level: "Quiet" | "Moderate" | "Busy" | "Peak";
  pct: number;
  colorClass: string;
  dotColor: string;
}

export interface MovieItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  aspectRatio: string;
  tagline: string;
  synopsis: string;
  releaseDateHeader: string;
  imdbScore: string;
  director: string;
  showtimes: string[];
  selectedTime: string;
  frameNumber: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  accentColor: number;
  accentHex: string;
  posterImage?: string;
  trailerYoutubeId: string;
  cast: CastMember[];
}

export type VenueCategory = "Playland" | "Packages";
export type ScreenFormatType = "standard-scope" | "standard-flat" | "imax-70mm" | "imax-laser";

export interface KarachiVenue {
  id: string;
  name: string;
  shortName: string;
  location: string;
  city: string;
  country: string;
  category: VenueCategory;
  hallName: string;
  screenType: ScreenFormatType;
  screenSpecs: string;
  soundSpecs: string;
  badgeText: string;
  brandPrimary: string;
  brandSecondary: string;
  brandBgTint: string;
  brandGlow: string;
  splashSubtitle: string;
  currency: "PKR" | "USD";
  currencySymbol: string;
  paymentGateways: string[];
  screenWidthMeters: number;
  screenHeightMeters: number;
  screenCurveRadius: number;
  screenElevationMeters: number;
  isIMAX: boolean;
  phone: string;
  mallUan: string;
}

export type CinemaVenue = KarachiVenue;

export const TOPSY_CONTACT = {
  phone: "+92 347 6850000",
  mallUan: "111-696-255",
  address: "2nd Floor, Packages Mall, Main Walton Road, Lahore",
  hours: "11:00 AM – 11:00 PM Daily",
};

export const TIME_SLOTS_11_TO_11 = [
  "11:00 AM",
  "1:30 PM",
  "4:00 PM",
  "6:30 PM",
  "9:00 PM",
] as const;

export function getTimeSlotCrowd(time: string): CrowdInfo {
  switch (time) {
    case "11:00 AM":
      return {
        level: "Quiet",
        pct: 22,
        colorClass: "text-emerald-300 border-emerald-400/35 bg-emerald-500/15",
        dotColor: "#34d399",
      };
    case "1:30 PM":
      return {
        level: "Moderate",
        pct: 48,
        colorClass: "text-sky-300 border-sky-400/35 bg-sky-500/15",
        dotColor: "#38bdf8",
      };
    case "4:00 PM":
      return {
        level: "Busy",
        pct: 74,
        colorClass: "text-amber-300 border-amber-400/35 bg-amber-500/15",
        dotColor: "#fbbf24",
      };
    case "6:30 PM":
      return {
        level: "Peak",
        pct: 92,
        colorClass: "text-rose-300 border-rose-400/35 bg-rose-500/15",
        dotColor: "#fb7185",
      };
    case "9:00 PM":
      return {
        level: "Moderate",
        pct: 55,
        colorClass: "text-sky-300 border-sky-400/35 bg-sky-500/15",
        dotColor: "#38bdf8",
      };
    default:
      return {
        level: "Moderate",
        pct: 50,
        colorClass: "text-sky-300 border-sky-400/35 bg-sky-500/15",
        dotColor: "#38bdf8",
      };
  }
}

export function getVenueMovieBadge(venue: KarachiVenue, defaultBadge?: string): string {
  if (defaultBadge) return defaultBadge;
  if (venue.shortName === "TODDLER WING") return "AGES 1–4 SAFE";
  if (venue.shortName === "PARTY LOUNGE") return "CUSTOM THEMES";
  return "2ND FLOOR • PACKAGES MALL";
}

export function getVenueAspectRatio(venue: KarachiVenue): string {
  if (venue.id === "topsy-toddler-wing") return "Montessori Soft-Play";
  if (venue.id === "topsy-party-lounge") return "Private Event Wing";
  return "11:00 AM – 11:00 PM";
}

export interface ConcessionItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  pricePKR: number;
  priceUSD: number;
  icon: string;
  image: string;
}

export interface PromoCodeInfo {
  code: string;
  label: string;
  description: string;
  type: "BOGO" | "PERCENT";
  percentOff?: number;
}

export const PROMO_CODES: PromoCodeInfo[] = [
  {
    code: "VOUCH365",
    label: "Vouch365 BOGO",
    description: "Buy 1 Get 1 Free on Play Passes (50% off pass pairs)",
    type: "BOGO",
  },
  {
    code: "BOGO",
    label: "BOGO Play Pass",
    description: "Buy 1 Get 1 Free on Playland Entry Passes",
    type: "BOGO",
  },
  {
    code: "PACKAGES10",
    label: "Packages Mall 10%",
    description: "10% off total booking (Passes + Café)",
    type: "PERCENT",
    percentOff: 10,
  },
];

export const KARACHI_VENUES: KarachiVenue[] = [
  {
    id: "topsy-main",
    name: "TOPSY TURVY",
    shortName: "TOPSY TURVY",
    location: "2nd Floor, Packages Mall, Main Walton Road, Lahore",
    city: "Lahore",
    country: "Pakistan",
    category: "Playland",
    hallName: "2nd Floor • Main Playland & Café",
    screenType: "standard-scope",
    screenSpecs: "Soft-Play Maze, Trampoline & Toddler Wing",
    soundSpecs: "Staff Supervised • Free Parent Wi-Fi",
    badgeText: "2ND FLOOR",
    brandPrimary: "#f59e0b",
    brandSecondary: "#38bdf8",
    brandBgTint: "#141008",
    brandGlow: "rgba(245, 158, 11, 0.32)",
    splashSubtitle: "Indoor Edutainment Playland & Parent Café • Packages Mall, Lahore",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 22.0,
    screenHeightMeters: 11.5,
    screenCurveRadius: 36.0,
    screenElevationMeters: 1.9,
    isIMAX: false,
    phone: TOPSY_CONTACT.phone,
    mallUan: TOPSY_CONTACT.mallUan,
  },
  {
    id: "topsy-toddler-wing",
    name: "TOPSY TURVY TODDLERS",
    shortName: "TODDLER WING",
    location: "2nd Floor West Wing, Packages Mall, Lahore",
    city: "Lahore",
    country: "Pakistan",
    category: "Playland",
    hallName: "Montessori Wing • Ages 1–4",
    screenType: "standard-flat",
    screenSpecs: "Ball Pit, Mini Kitchens & Soft Blocks",
    soundSpecs: "Padded Floor • Dedicated Attendants",
    badgeText: "AGES 1–4",
    brandPrimary: "#38bdf8",
    brandSecondary: "#34d399",
    brandBgTint: "#07131a",
    brandGlow: "rgba(56, 189, 248, 0.32)",
    splashSubtitle: "Sensory Ball Pit & Pretend-Play Mini Kitchens • Packages Mall",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 18.0,
    screenHeightMeters: 9.0,
    screenCurveRadius: 45.0,
    screenElevationMeters: 1.9,
    isIMAX: false,
    phone: TOPSY_CONTACT.phone,
    mallUan: TOPSY_CONTACT.mallUan,
  },
  {
    id: "topsy-party-lounge",
    name: "TOPSY TURVY PARTIES",
    shortName: "PARTY LOUNGE",
    location: "2nd Floor Party Deck, Packages Mall, Lahore",
    city: "Lahore",
    country: "Pakistan",
    category: "Packages",
    hallName: "Birthday & School Trip Deck",
    screenType: "standard-scope",
    screenSpecs: "Private Party Tables & Face Painting",
    soundSpecs: "Custom Themes • Group Catering",
    badgeText: "EVENTS",
    brandPrimary: "#ec4899",
    brandSecondary: "#f59e0b",
    brandBgTint: "#190813",
    brandGlow: "rgba(236, 72, 153, 0.32)",
    splashSubtitle: "Custom Birthday Celebrations & School Field Trips • Packages Mall",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 20.0,
    screenHeightMeters: 10.5,
    screenCurveRadius: 36.0,
    screenElevationMeters: 1.9,
    isIMAX: false,
    phone: TOPSY_CONTACT.phone,
    mallUan: TOPSY_CONTACT.mallUan,
  },
];

export const ALL_VENUES = KARACHI_VENUES;

export const MOVIE_CATALOG: MovieItem[] = [
  {
    id: "soft-play-maze",
    title: "SOFT-PLAY MAZE",
    genre: "Multi-Level Jungle Gym",
    duration: "2h Play Pass",
    rating: "AGES 3–12",
    aspectRatio: "3-Tier Padded Maze",
    tagline: "Climb, crawl, and slide through three levels of padded obstacle bridges and spiral slides.",
    synopsis:
      "Our signature multi-level soft-play labyrinth at Packages Mall features foam-padded bridges, sensory squeeze rollers, net tunnels, and twin wave slides—designed for active energy burn under trained staff supervision while parents relax in the adjoining café.",
    releaseDateHeader: "ZONE 01",
    imdbScore: "4.8",
    director: "2nd Floor Center",
    showtimes: [...TIME_SLOTS_11_TO_11],
    selectedTime: "4:00 PM",
    frameNumber: "ZONE #01",
    badge: "MOST POPULAR",
    badgeColor: "border-amber-500/60 bg-amber-950/60 text-amber-300",
    gradient:
      "radial-gradient(circle at 50% 35%, #f59e0b 0%, #78350f 52%, #0c0a09 100%)",
    accentColor: 0xf59e0b,
    accentHex: "#f59e0b",
    posterImage:
      "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=900&auto=format&fit=crop&q=80",
    trailerYoutubeId: "",
    cast: [
      {
        name: "Wave Slides",
        role: "Twin Spiral",
        avatar:
          "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Crawl Tunnels",
        role: "3-Level Netting",
        avatar:
          "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Foam Rollers",
        role: "Sensory Path",
        avatar:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Grip Socks",
        role: "Required Gear",
        avatar:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "trampoline-climbing",
    title: "TRAMPOLINE & CLIMBING",
    genre: "Active Jump & Climb",
    duration: "2h Play Pass",
    rating: "AGES 4–12",
    aspectRatio: "Padded Jump Arena",
    tagline: "Bounce high on spring-loaded trampolines and scale colorful indoor climbing ladders.",
    synopsis:
      "Built for high-energy explorers, the Trampoline & Climbing Zone pairs interconnected bounce mats with safety-netted climbing walls and rope ladders. Supervised by floor marshals with full sightline visibility from the Parent Café.",
    releaseDateHeader: "ZONE 02",
    imdbScore: "4.9",
    director: "2nd Floor East Wing",
    showtimes: [...TIME_SLOTS_11_TO_11],
    selectedTime: "6:30 PM",
    frameNumber: "ZONE #02",
    badge: "HIGH ENERGY",
    badgeColor: "border-sky-500/60 bg-sky-950/60 text-sky-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #38bdf8 0%, #0c4a6e 55%, #05070c 100%)",
    accentColor: 0x38bdf8,
    accentHex: "#38bdf8",
    posterImage:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=900&auto=format&fit=crop&q=80",
    trailerYoutubeId: "",
    cast: [
      {
        name: "Jump Mats",
        role: "Spring Arena",
        avatar:
          "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Climbing Wall",
        role: "Padded Holds",
        avatar:
          "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Rope Ladders",
        role: "Balance Climb",
        avatar:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Safety Nets",
        role: "360° Enclosure",
        avatar:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "toddler-ball-pit",
    title: "TODDLER BALL PIT & MINI KITCHENS",
    genre: "Montessori Soft Play",
    duration: "2h Toddler Pass",
    rating: "AGES 1–4",
    aspectRatio: "Gentle Sensory Zone",
    tagline: "A calm, cushioned world of pastel ball pits, mini playhouses, and pretend kitchens.",
    synopsis:
      "Designed specifically for toddlers aged 1 to 4, this Montessori-inspired sanctuary encourages sensory development and social play with a sanitized ball pit, miniature wooden kitchens, soft building blocks, and low-angle toddler slides.",
    releaseDateHeader: "ZONE 03",
    imdbScore: "4.9",
    director: "2nd Floor West Wing",
    showtimes: [...TIME_SLOTS_11_TO_11],
    selectedTime: "11:00 AM",
    frameNumber: "ZONE #03",
    badge: "TODDLER SAFE",
    badgeColor: "border-emerald-500/60 bg-emerald-950/60 text-emerald-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #10b981 0%, #064e3b 55%, #020617 100%)",
    accentColor: 0x10b981,
    accentHex: "#10b981",
    posterImage:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&auto=format&fit=crop&q=80",
    trailerYoutubeId: "",
    cast: [
      {
        name: "Ball Pit",
        role: "Sanitized Pool",
        avatar:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Mini Kitchens",
        role: "Pretend Play",
        avatar:
          "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Playhouses",
        role: "Roleplay Town",
        avatar:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Soft Blocks",
        role: "Motor Skills",
        avatar:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "birthday-packages",
    title: "BIRTHDAY PACKAGES",
    genre: "Custom Theme Celebrations",
    duration: "3h Party Slot",
    rating: "ALL AGES",
    aspectRatio: "Private Party Deck",
    tagline: "Themed decorations, dedicated party hosts, face painting, and full playland access.",
    synopsis:
      "Celebrate your child's big day at Topsy Turvy Packages Mall. Packages include reserved Parent Café booths, custom balloon & backdrop themes, full access to the Soft-Play Maze and Trampolines, face painting add-ons, and kids' meal combos.",
    releaseDateHeader: "ZONE 04",
    imdbScore: "5.0",
    director: "Party & Events Desk",
    showtimes: [...TIME_SLOTS_11_TO_11],
    selectedTime: "4:00 PM",
    frameNumber: "ZONE #04",
    badge: "PARTY DECK",
    badgeColor: "border-pink-500/60 bg-pink-950/60 text-pink-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #ec4899 0%, #581c87 60%, #030712 100%)",
    accentColor: 0xec4899,
    accentHex: "#ec4899",
    posterImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&auto=format&fit=crop&q=80",
    trailerYoutubeId: "",
    cast: [
      {
        name: "Party Host",
        role: "Games & MC",
        avatar:
          "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Face Painting",
        role: "Theme Art",
        avatar:
          "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Reserved Tables",
        role: "Parent Lounge",
        avatar:
          "https://images.unsplash.com/photo-1555244162-803834f70033?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "All-Zone Pass",
        role: "Maze + Jump",
        avatar:
          "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=300&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "school-trips",
    title: "SCHOOL TRIPS",
    genre: "Group Edutainment",
    duration: "Morning / Noon",
    rating: "GROUPS 15+",
    aspectRatio: "Full Playland Booking",
    tagline: "Supervised school field trips with structured group activities and discounted student rates.",
    synopsis:
      "Ideal for Lahore preschools and primary grades, our School Trip program offers quiet morning hours (11:00 AM – 1:30 PM), dedicated safety marshals, grip socks bundles, and wholesome snack boxes in a climate-controlled Packages Mall setting.",
    releaseDateHeader: "ZONE 05",
    imdbScore: "4.8",
    director: "+92 347 6850000",
    showtimes: [...TIME_SLOTS_11_TO_11],
    selectedTime: "11:00 AM",
    frameNumber: "ZONE #05",
    badge: "SCHOOL GROUPS",
    badgeColor: "border-cyan-500/60 bg-cyan-950/60 text-cyan-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #06b6d4 0%, #0f172a 60%, #020617 100%)",
    accentColor: 0x06b6d4,
    accentHex: "#06b6d4",
    posterImage:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop&q=80",
    trailerYoutubeId: "",
    cast: [
      {
        name: "Floor Marshals",
        role: "Group Safety",
        avatar:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Morning Slot",
        role: "11:00 AM Quiet",
        avatar:
          "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Snack Boxes",
        role: "Kids Meals",
        avatar:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
      },
      {
        name: "Teachers Free",
        role: "Café Wi-Fi",
        avatar:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80",
      },
    ],
  },
];

export const CONCESSION_MENU: ConcessionItem[] = [
  {
    id: "grip-socks",
    name: "Topsy Turvy Grip Socks",
    subtitle: "Mandatory anti-slip socks for Maze & Trampoline",
    category: "Safety & Gear",
    pricePKR: 350,
    priceUSD: 2.0,
    icon: "🧦",
    image:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "face-painting",
    name: "Themed Face Painting",
    subtitle: "Skin-safe butterflies, superheroes & glitter art",
    category: "Activities",
    pricePKR: 600,
    priceUSD: 4.0,
    icon: "🎨",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cafe-cappuccino-combo",
    name: "Parent Café Cappuccino & Brownie",
    subtitle: "Fresh espresso cappuccino + warm chocolate brownie",
    category: "Parent Café",
    pricePKR: 950,
    priceUSD: 6.0,
    icon: "☕",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cafe-panini-latte",
    name: "Grilled Chicken Panini & Iced Latte",
    subtitle: "Artisan sourdough panini served to your café table",
    category: "Parent Café",
    pricePKR: 1350,
    priceUSD: 8.5,
    icon: "🥪",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "kids-nuggets-meal",
    name: "Kids' Crispy Nuggets & Juice Box",
    subtitle: "6 golden chicken bites, fries & apple juice",
    category: "Parent Café",
    pricePKR: 750,
    priceUSD: 4.5,
    icon: "🍟",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "party-balloon-pack",
    name: "Birthday Balloon & Host Add-On",
    subtitle: "Helium balloon bouquet + 45m dedicated host",
    category: "Activities",
    pricePKR: 2500,
    priceUSD: 15.0,
    icon: "🎈",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80",
  },
];

export const ROWS = ["A", "B", "C", "D", "E", "F"] as const;
export const SEATS_PER_ROW = 8;

// Playland Arena Geometry Specs (in meters)
export const SCREEN_WIDTH = 22.0;
export const SCREEN_HEIGHT = 11.5;
export const SCREEN_CURVE_RADIUS = 26.0;
export const SCREEN_ELEVATION = 1.9;

export const ROW_METRICS: Record<
  string,
  { z: number; y: number; basePriceUSD: number; basePricePKR: number; zoneLabel: string }
> = {
  A: { z: 5.4, y: 0.45, basePriceUSD: 10.0, basePricePKR: 1500, zoneLabel: "Glass-Front Table" },
  B: { z: 7.2, y: 0.75, basePriceUSD: 10.0, basePricePKR: 1500, zoneLabel: "Glass-Front Table" },
  C: { z: 9.1, y: 1.15, basePriceUSD: 13.0, basePricePKR: 2000, zoneLabel: "VIP Sightline Booth" },
  D: { z: 11.0, y: 1.55, basePriceUSD: 13.0, basePricePKR: 2000, zoneLabel: "VIP Sightline Booth" },
  E: { z: 12.9, y: 1.95, basePriceUSD: 11.0, basePricePKR: 1650, zoneLabel: "Café Lounge Table" },
  F: { z: 14.9, y: 2.35, basePriceUSD: 11.0, basePricePKR: 1650, zoneLabel: "Party & Group Deck" },
};

export const PRE_RESERVED_SEATS = [
  "A2",
  "A3",
  "A4",
  "A7",
  "B2",
  "B6",
  "C1",
  "C7",
  "C8",
  "D3",
  "D5",
  "E4",
  "E5",
  "F3",
];

export const AUDIENCE_PROFILES = [
  { clothing: 0xf59e0b, hair: 0x171717, heightOffset: 0.02 },
  { clothing: 0x38bdf8, hair: 0x78350f, heightOffset: -0.03 },
  { clothing: 0xec4899, hair: 0xd97706, heightOffset: 0.01 },
  { clothing: 0x10b981, hair: 0x0a0a0a, heightOffset: 0.04 },
  { clothing: 0x8b5cf6, hair: 0x451a03, heightOffset: -0.01 },
  { clothing: 0xf97316, hair: 0x27272a, heightOffset: 0.0 },
];

export interface SeatSpatialData {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  z: number;
  eyeHeight: number;
  isVIP: boolean;
  priceUSD: number;
  pricePKR: number;
  distToCenter: string;
  fovHoriz: string;
  verticalGaze: string;
  acousticScore: string;
  rating: string;
  zoneLabel: string;
}

export function getSeatSpatialData(
  seatId: string,
  venue?: KarachiVenue
): SeatSpatialData {
  const row = seatId[0];
  const col = parseInt(seatId.slice(1), 10);
  const rowInfo = ROW_METRICS[row] || ROW_METRICS["B"];

  const spacingX = 1.15;
  const x = (col - (SEATS_PER_ROW + 1) / 2) * spacingX;
  const y = rowInfo.y + 0.48;
  const z = rowInfo.z;

  const isVIP = (row === "C" || row === "D") && col >= 3 && col <= 6;
  const priceUSD = isVIP ? 13.0 : rowInfo.basePriceUSD;
  const pricePKR = isVIP ? 2000 : rowInfo.basePricePKR;
  const eyeHeight = y + 0.68;

  const scrW = venue?.screenWidthMeters ?? SCREEN_WIDTH;
  const scrH = venue?.screenHeightMeters ?? SCREEN_HEIGHT;
  const scrElev = venue?.screenElevationMeters ?? SCREEN_ELEVATION;

  const screenCenterY = scrElev + scrH / 2;
  const distToCenter = Math.sqrt(
    x * x + Math.pow(screenCenterY - eyeHeight, 2) + z * z
  );
  const fovHoriz = 2 * Math.atan(scrW / 2 / z) * (180 / Math.PI);
  const verticalGaze =
    Math.atan((screenCenterY - eyeHeight) / z) * (180 / Math.PI);

  // Calculate Parent Sightline Coverage % based on central view of Maze + Toddler + Trampoline
  const idealZ = 10.0;
  const spatialDeviation = Math.hypot(x * 1.4, (z - idealZ) * 0.9);
  const sightlinePct = Math.max(84, Math.min(99.8, 99.6 - spatialDeviation * 2.0));

  let rating = "Full Playland View";
  if (row === "A" || row === "B") rating = "Glass-Front Toddler View";
  else if (isVIP) rating = "★ Prime Parent Sightline";
  else if (row === "E" || row === "F") rating = "Elevated Café View";

  return {
    id: seatId,
    row,
    number: col,
    x,
    y,
    z,
    eyeHeight,
    isVIP,
    priceUSD,
    pricePKR,
    distToCenter: distToCenter.toFixed(1),
    fovHoriz: fovHoriz.toFixed(1),
    verticalGaze: verticalGaze.toFixed(1),
    acousticScore: `${sightlinePct.toFixed(1)}%`,
    rating,
    zoneLabel: rowInfo.zoneLabel,
  };
}
