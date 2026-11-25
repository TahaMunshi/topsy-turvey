export interface CastMember {
  name: string;
  role: string;
  avatar: string;
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

export type VenueCategory = "Pakistan" | "International";
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
}

export type CinemaVenue = KarachiVenue;

export function getVenueMovieBadge(venue: KarachiVenue, _defaultBadge?: string): string {
  if (venue.isIMAX) {
    if (venue.screenType === "imax-70mm") return "IMAX 15/70MM GT";
    return "IMAX DUAL LASER";
  }
  // Standard Normal screens for all Pakistani cinemas:
  if (venue.shortName === "NUEPLEX") return "ROYAL MAXIMA 3D";
  if (venue.shortName === "CINEPAX") return "CMAX 3D LASER";
  if (venue.shortName === "ATRIUM") return "CHRISTIE 4K DCI";
  if (venue.shortName === "ASKARI IV") return "BARCO 4K LASER";
  if (venue.shortName === "THE ARENA") return "VIP DOME SCOPE";
  return "STANDARD DCI 4K";
}

export function getVenueAspectRatio(venue: KarachiVenue): string {
  if (venue.screenType === "imax-70mm") return "1.43:1 Full IMAX GT";
  if (venue.screenType === "imax-laser") return "1.90:1 IMAX Laser";
  if (venue.screenType === "standard-flat") return "1.85:1 Flat Widescreen";
  return "2.39:1 Anamorphic Scope";
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

export const KARACHI_VENUES: KarachiVenue[] = [
  {
    id: "aetheria-clifton",
    name: "AETHERIA SEATVISION",
    shortName: "AETHERIA",
    location: "Marine Promenade, Clifton Block 2, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "Hall 4 • Laser Auditorium",
    screenType: "standard-scope",
    screenSpecs: "Standard DCI 4K Dual Laser Screen (2.39:1)",
    soundSpecs: "12.1 Ch Dolby Atmos Spatial",
    badgeText: "4K LASER",
    brandPrimary: "#eae0c8",
    brandSecondary: "#d4af37",
    brandBgTint: "#14110b",
    brandGlow: "rgba(234, 224, 200, 0.28)",
    splashSubtitle: "Flagship DCI 4K Dual Laser Exhibition • Clifton",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 18.0,
    screenHeightMeters: 7.6,
    screenCurveRadius: 36.0,
    screenElevationMeters: 1.95,
    isIMAX: false,
  },
  {
    id: "nueplex-dha",
    name: "NUEPLEX CINEMAS",
    shortName: "NUEPLEX",
    location: "The Place, Khayaban-e-Shaheen, DHA Phase VIII, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "Royal Maxima • Hall 1",
    screenType: "standard-scope",
    screenSpecs: "Royal Maxima Curved Scope Silver Screen (2.39:1)",
    soundSpecs: "Dolby Atmos 64-Channel",
    badgeText: "MAXIMA 3D",
    brandPrimary: "#f43f5e",
    brandSecondary: "#fb7185",
    brandBgTint: "#19070b",
    brandGlow: "rgba(244, 63, 94, 0.32)",
    splashSubtitle: "Pakistan's Largest Royal Maxima Curved Screen • DHA Phase VIII",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 19.5,
    screenHeightMeters: 8.2,
    screenCurveRadius: 32.0,
    screenElevationMeters: 1.95,
    isIMAX: false,
  },
  {
    id: "nueplex-askari",
    name: "NUEPLEX ASKARI IV",
    shortName: "ASKARI IV",
    location: "Rashid Minhas Road, Askari IV, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "Cinema 3 • Gold Lounge",
    screenType: "standard-flat",
    screenSpecs: "Barco 4K Flat Digital Cinema Screen (1.85:1)",
    soundSpecs: "Dolby 7.1 Surround Array",
    badgeText: "BARCO 4K",
    brandPrimary: "#f59e0b",
    brandSecondary: "#fcd34d",
    brandBgTint: "#181005",
    brandGlow: "rgba(245, 158, 11, 0.30)",
    splashSubtitle: "Luxury Gold Lounge Recliners & 4K Barco Laser • Askari IV",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 15.0,
    screenHeightMeters: 8.1,
    screenCurveRadius: 50.0,
    screenElevationMeters: 1.9,
    isIMAX: false,
  },
  {
    id: "cinepax-ocean",
    name: "CINEPAX OCEAN MALL",
    shortName: "CINEPAX",
    location: "Ocean Towers, Clifton Block 9, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "CMAX Ultra • Screen 2",
    screenType: "standard-scope",
    screenSpecs: "CMAX Ultra Large Widescreen • 2.39:1 Scope",
    soundSpecs: "DTS:X Immersive Audio",
    badgeText: "CMAX 3D",
    brandPrimary: "#38bdf8",
    brandSecondary: "#f97316",
    brandBgTint: "#06131c",
    brandGlow: "rgba(56, 189, 248, 0.32)",
    splashSubtitle: "CMAX Large Format 3D & Platinum VIP Lounge • Ocean Mall Clifton",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 17.5,
    screenHeightMeters: 7.4,
    screenCurveRadius: 38.0,
    screenElevationMeters: 1.95,
    isIMAX: false,
  },
  {
    id: "atrium-saddar",
    name: "ATRIUM CINEMAS",
    shortName: "ATRIUM",
    location: "MBL Panorama, Raja Ghazanfar Ali Rd, Saddar, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "Auditorium D • Christie 4K",
    screenType: "standard-flat",
    screenSpecs: "Christie 4K DCI Flat Cinema Screen (1.85:1)",
    soundSpecs: "Dolby Digital Surround EX",
    badgeText: "CHRISTIE 4K",
    brandPrimary: "#c084fc",
    brandSecondary: "#ec4899",
    brandBgTint: "#14081c",
    brandGlow: "rgba(192, 132, 252, 0.32)",
    splashSubtitle: "Premier Multi-Screen Christie 4K Digital Complex • Saddar",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 14.5,
    screenHeightMeters: 7.8,
    screenCurveRadius: 60.0,
    screenElevationMeters: 2.0,
    isIMAX: false,
  },
  {
    id: "arena-karsaz",
    name: "THE ARENA CINEMA",
    shortName: "THE ARENA",
    location: "Karsaz / Bahria Town Tower, Karachi",
    city: "Karachi",
    country: "Pakistan",
    category: "Pakistan",
    hallName: "VIP Velvet Recliner Dome",
    screenType: "standard-scope",
    screenSpecs: "Velvet Recliner Dome Silver Screen (2.39:1)",
    soundSpecs: "JBL Custom Acoustic Array",
    badgeText: "VIP DOME",
    brandPrimary: "#34d399",
    brandSecondary: "#fbbf24",
    brandBgTint: "#061611",
    brandGlow: "rgba(52, 211, 153, 0.30)",
    splashSubtitle: "Signature Velvet Recliner Dome & Laser 3D Theater • Karsaz",
    currency: "PKR",
    currencySymbol: "Rs.",
    paymentGateways: ["JAZZCASH", "EASYPAISA", "RAAST", "CARD"],
    screenWidthMeters: 16.0,
    screenHeightMeters: 6.8,
    screenCurveRadius: 28.0,
    screenElevationMeters: 1.95,
    isIMAX: false,
  },
  {
    id: "tcl-hollywood",
    name: "TCL CHINESE THEATRE",
    shortName: "TCL CHINESE",
    location: "6925 Hollywood Blvd, Hollywood, CA, USA",
    city: "Los Angeles",
    country: "United States",
    category: "International",
    hallName: "Palace 1 • IMAX Dual Laser",
    screenType: "imax-laser",
    screenSpecs: "94ft Curved IMAX 4K Dual Laser Screen (1.90:1)",
    soundSpecs: "Dolby Atmos 12.1 Custom Array",
    badgeText: "HOLLYWOOD IMAX",
    brandPrimary: "#ef4444",
    brandSecondary: "#f59e0b",
    brandBgTint: "#180808",
    brandGlow: "rgba(239, 68, 68, 0.35)",
    splashSubtitle: "Historic Hollywood Palace & Dual 4K Laser IMAX • Los Angeles, USA",
    currency: "USD",
    currencySymbol: "$",
    paymentGateways: ["STRIPE", "PAYPAL", "APPLE_PAY", "KLARNA"],
    screenWidthMeters: 23.0,
    screenHeightMeters: 12.0,
    screenCurveRadius: 26.0,
    screenElevationMeters: 1.95,
    isIMAX: true,
  },
  {
    id: "bfi-london",
    name: "BFI IMAX WATERLOO",
    shortName: "BFI IMAX",
    location: "1 Charlie Chaplin Walk, South Bank, London, UK",
    city: "London",
    country: "United Kingdom",
    category: "International",
    hallName: "Flagship 1.43:1 GT • Screen 1",
    screenType: "imax-70mm",
    screenSpecs: "26m x 20m 15-Perf 70mm IMAX Giant Screen (1.43:1)",
    soundSpecs: "IMAX 12-Channel Spatial Sound",
    badgeText: "70MM IMAX GT",
    brandPrimary: "#10b981",
    brandSecondary: "#38bdf8",
    brandBgTint: "#051610",
    brandGlow: "rgba(16, 185, 129, 0.32)",
    splashSubtitle: "Britain's Largest Cinema Screen & 70mm 15-Perf GT • London, UK",
    currency: "USD",
    currencySymbol: "$",
    paymentGateways: ["STRIPE", "PAYPAL", "APPLE_PAY", "KLARNA"],
    screenWidthMeters: 25.0,
    screenHeightMeters: 17.5,
    screenCurveRadius: 22.0,
    screenElevationMeters: 1.9,
    isIMAX: true,
  },
  {
    id: "vox-dubai",
    name: "VOX CINEMAS DUBAI",
    shortName: "VOX CINEMAS",
    location: "Mall of the Emirates, Al Barsha, Dubai, UAE",
    city: "Dubai",
    country: "United Arab Emirates",
    category: "International",
    hallName: "THEATRE by Rhodes • VIP Lounge",
    screenType: "standard-scope",
    screenSpecs: "Barco 4K Laser Luxury VIP Widescreen (2.39:1)",
    soundSpecs: "Dolby Atmos Master Spatial Audio",
    badgeText: "THEATRE VIP",
    brandPrimary: "#a855f7",
    brandSecondary: "#38bdf8",
    brandBgTint: "#12071f",
    brandGlow: "rgba(168, 85, 247, 0.34)",
    splashSubtitle: "Michelin-Curated In-Seat Dining & VIP Recliner Lounges • Dubai, UAE",
    currency: "USD",
    currencySymbol: "$",
    paymentGateways: ["STRIPE", "PAYPAL", "APPLE_PAY", "KLARNA"],
    screenWidthMeters: 16.5,
    screenHeightMeters: 7.0,
    screenCurveRadius: 36.0,
    screenElevationMeters: 1.9,
    isIMAX: false,
  },
  {
    id: "amc-lincoln",
    name: "AMC LINCOLN SQUARE",
    shortName: "AMC LINCOLN",
    location: "1998 Broadway, Upper West Side, New York, NY, USA",
    city: "New York",
    country: "United States",
    category: "International",
    hallName: "Loews Auditorium • IMAX 70mm",
    screenType: "imax-70mm",
    screenSpecs: "100ft x 75ft True 1.43:1 Americas Tallest 70mm Screen",
    soundSpecs: "IMAX Commercial Laser 12-Channel Audio",
    badgeText: "IMAX 70MM NYC",
    brandPrimary: "#e11d48",
    brandSecondary: "#f59e0b",
    brandBgTint: "#1a070e",
    brandGlow: "rgba(225, 29, 72, 0.32)",
    splashSubtitle: "Tallest IMAX Screen in the Western Hemisphere • Broadway New York, USA",
    currency: "USD",
    currencySymbol: "$",
    paymentGateways: ["STRIPE", "PAYPAL", "APPLE_PAY", "KLARNA"],
    screenWidthMeters: 26.0,
    screenHeightMeters: 18.2,
    screenCurveRadius: 23.0,
    screenElevationMeters: 1.9,
    isIMAX: true,
  },
];

export const ALL_VENUES = KARACHI_VENUES;

export const MOVIE_CATALOG: MovieItem[] = [
  {
    id: "dune",
    title: "DUNE: PART TWO",
    genre: "Sci-Fi / Action",
    duration: "2h 56m",
    rating: "PG-13",
    aspectRatio: "1.43:1 Dual Laser",
    tagline: "Beyond the golden sands lies the holy war across a million worlds.",
    synopsis:
      "Twelve years after ascending the Golden Lion Throne, Emperor Paul Atreides faces a galactic conspiracy uniting the Bene Gesserit, Spacing Guild, and Tleilaxu. As prophetic visions tighten around Arrakis, every choice demands an irreversible sacrifice.",
    releaseDateHeader: "12 JUN",
    imdbScore: "9.0",
    director: "Denis Villeneuve",
    showtimes: ["1:00 PM", "3:30 PM", "7:30 PM", "9:30 PM"],
    selectedTime: "1:00 PM",
    frameNumber: "FRAME #0049",
    badge: "IMAX 15-PERF",
    badgeColor: "border-orange-500/60 bg-orange-950/60 text-orange-300",
    gradient:
      "radial-gradient(circle at 50% 35%, #f59e0b 0%, #78350f 52%, #0c0a09 100%)",
    accentColor: 0xf59e0b,
    accentHex: "#f59e0b",
    posterImage: "/images/posters/dune-part-two.jpg",
    trailerYoutubeId: "Way9Dexny3w",
    cast: [
      {
        name: "Timothée Chalamet",
        role: "Paul Atreides",
        avatar: "/images/actors/timothee-chalamet.jpg",
      },
      {
        name: "Zendaya",
        role: "Chani Kynes",
        avatar: "/images/actors/zendaya.jpg",
      },
      {
        name: "Javier Bardem",
        role: "Stilgar",
        avatar: "/images/actors/javier-bardem.jpg",
      },
      {
        name: "Florence Pugh",
        role: "Princess Irulan",
        avatar: "/images/actors/florence-pugh.jpg",
      },
    ],
  },
  {
    id: "chrono",
    title: "F1: THE MOVIE",
    genre: "Sports / Action",
    duration: "2h 35m",
    rating: "PG-13",
    aspectRatio: "1.43:1 Large Format",
    tagline: "A Formula 1 legend returns to the grid for one final championship fight.",
    synopsis:
      "Dubbed 'the greatest that never was,' Sonny Hayes was Formula 1's most promising phenom of the 1990s until an accident on the track nearly ended his career. Thirty years later, he is approached by former teammate Ruben Cervantes to race alongside rookie Joshua Pearce for APXGP.",
    releaseDateHeader: "18 JUN",
    imdbScore: "9.1",
    director: "Joseph Kosinski",
    showtimes: ["1:00 PM", "3:30 PM", "7:30 PM", "9:30 PM"],
    selectedTime: "3:30 PM",
    frameNumber: "FRAME #0048",
    badge: "70MM EXCLUSIVE",
    badgeColor: "border-amber-500/60 bg-amber-950/60 text-amber-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #38bdf8 0%, #1e1b4b 55%, #05070c 100%)",
    accentColor: 0x38bdf8,
    accentHex: "#38bdf8",
    posterImage: "/images/posters/f1-the-movie.jpg",
    trailerYoutubeId: "R9LxZNQx7MQ",
    cast: [
      {
        name: "Brad Pitt",
        role: "Sonny Hayes",
        avatar: "/images/actors/brad-pitt.jpg",
      },
      {
        name: "Kerry Condon",
        role: "Kate McKenna",
        avatar: "/images/actors/kerry-condon.jpg",
      },
      {
        name: "Damson Idris",
        role: "Joshua Pearce",
        avatar: "/images/actors/damson-idris.jpg",
      },
      {
        name: "Javier Bardem",
        role: "Ruben Cervantes",
        avatar: "/images/actors/javier-bardem.jpg",
      },
    ],
  },
  {
    id: "interstellar",
    title: "INTERSTELLAR",
    genre: "Space Exploration",
    duration: "2h 49m",
    rating: "PG-13",
    aspectRatio: "70mm Celluloid Re-issue",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis:
      "When Earth's biosphere nears collapse, former NASA test pilot Cooper is recruited to pilot the Endurance through a newly discovered wormhole near Saturn, seeking a habitable world across relativistic time dilation.",
    releaseDateHeader: "24 JUN",
    imdbScore: "8.9",
    director: "Christopher Nolan",
    showtimes: ["1:00 PM", "3:30 PM", "7:30 PM", "9:30 PM"],
    selectedTime: "7:30 PM",
    frameNumber: "FRAME #0050",
    badge: "ANNIVERSARY 70MM",
    badgeColor: "border-cyan-500/60 bg-cyan-950/60 text-cyan-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #06b6d4 0%, #0f172a 60%, #020617 100%)",
    accentColor: 0x06b6d4,
    accentHex: "#06b6d4",
    posterImage: "/images/posters/interstellar.jpg",
    trailerYoutubeId: "zSWdZVtXT7E",
    cast: [
      {
        name: "Matthew McConaughey",
        role: "Joseph Cooper",
        avatar: "/images/actors/matthew-mcconaughey.jpg",
      },
      {
        name: "Anne Hathaway",
        role: "Dr. Amelia Brand",
        avatar: "/images/actors/anne-hathaway.jpg",
      },
      {
        name: "Jessica Chastain",
        role: "Murphy Cooper",
        avatar: "/images/actors/jessica-chastain.jpg",
      },
      {
        name: "Michael Caine",
        role: "Prof. John Brand",
        avatar: "/images/actors/michael-caine.jpg",
      },
    ],
  },
  {
    id: "cyberpunk",
    title: "BLADE RUNNER 2049",
    genre: "Sci-Fi / Neo-Noir",
    duration: "2h 44m",
    rating: "18+",
    aspectRatio: "IMAX 3D Laser",
    tagline: "The key to the future is finally unearthed.",
    synopsis:
      "Thirty years after the events of the first film, LAPD Officer K unearths a long-buried secret that has the potential to plunge what remains of society into chaos, leading him on a quest to find Rick Deckard.",
    releaseDateHeader: "02 JUL",
    imdbScore: "8.0",
    director: "Denis Villeneuve",
    showtimes: ["1:00 PM", "3:30 PM", "7:30 PM", "9:30 PM"],
    selectedTime: "9:30 PM",
    frameNumber: "FRAME #0051",
    badge: "3D LASER ULTRA",
    badgeColor: "border-purple-500/60 bg-purple-950/60 text-purple-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #ec4899 0%, #581c87 60%, #030712 100%)",
    accentColor: 0xec4899,
    accentHex: "#ec4899",
    posterImage: "/images/posters/blade-runner-2049.jpg",
    trailerYoutubeId: "gCcx85zbxz4",
    cast: [
      {
        name: "Kenjiro Tsuda",
        role: "Kaito Vance",
        avatar: "/images/actors/kenjiro-tsuda.jpg",
      },
      {
        name: "Hoyeon Jung",
        role: "Sora-9",
        avatar: "/images/actors/hoyeon-jung.jpg",
      },
      {
        name: "Riz Ahmed",
        role: "Zayn Malik-VII",
        avatar: "/images/actors/riz-ahmed.jpg",
      },
      {
        name: "Ana de Armas",
        role: "Lyra Voss",
        avatar: "/images/actors/ana-de-armas.jpg",
      },
    ],
  },
  {
    id: "maula-cyber",
    title: "THE LEGEND OF MAULA JATT",
    genre: "Pakistani Epic Action",
    duration: "2h 38m",
    rating: "PG-13",
    aspectRatio: "2.39:1 Anamorphic",
    tagline: "Forged in fire. The highest-grossing subcontinental spectacle remastered for large-format cinema.",
    synopsis:
      "When rival citadel warlords lay siege to the ancient river valley, an exiled gladiator must reclaim his ancestral bronze blade in a breathtaking theatrical spectacle.",
    releaseDateHeader: "10 JUL",
    imdbScore: "8.8",
    director: "Bilal Lashari",
    showtimes: ["1:00 PM", "3:30 PM", "7:30 PM", "9:30 PM"],
    selectedTime: "7:30 PM",
    frameNumber: "FRAME #0052",
    badge: "KARACHI PREMIERE",
    badgeColor: "border-emerald-500/60 bg-emerald-950/60 text-emerald-300",
    gradient:
      "radial-gradient(circle at 50% 30%, #10b981 0%, #064e3b 55%, #020617 100%)",
    accentColor: 0x10b981,
    accentHex: "#10b981",
    posterImage: "/images/posters/the-legend-of-maula-jatt.jpg",
    trailerYoutubeId: "pEWqOAcYgpQ",
    cast: [
      {
        name: "Fawad Khan",
        role: "Sovereign Sher",
        avatar: "/images/actors/fawad-khan.jpg",
      },
      {
        name: "Hamza Ali Abbasi",
        role: "Warlord Noori",
        avatar: "/images/actors/hamza-ali-abbasi.jpg",
      },
      {
        name: "Mahira Khan",
        role: "Lady Mukkho",
        avatar: "/images/actors/mahira-khan.jpg",
      },
      {
        name: "Humaima Malick",
        role: "Princess Daro",
        avatar: "/images/actors/humaima-malick.jpg",
      },
    ],
  },
];

export const CONCESSION_MENU: ConcessionItem[] = [
  {
    id: "popcorn-tub",
    name: "Caramel & Cheddar Mix Tub",
    subtitle: "Hand-tossed kettle caramel & aged cheddar",
    category: "Signature Popcorn",
    pricePKR: 850,
    priceUSD: 6.5,
    icon: "🍿",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "truffle-butter-popcorn",
    name: "Black Truffle & Sea Salt Popcorn",
    subtitle: "Warm infused white truffle butter & flaky salt",
    category: "Signature Popcorn",
    pricePKR: 950,
    priceUSD: 7.0,
    icon: "🍿",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "jalapeno-nachos",
    name: "Loaded Jalapeño Queso Nachos",
    subtitle: "Crisp tortilla chips, warm cheddar queso & salsa",
    category: "Warm Bites",
    pricePKR: 1100,
    priceUSD: 8.0,
    icon: "🌮",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "angus-sliders",
    name: "Double Smash Wagyu Sliders",
    subtitle: "Two brioche sliders, caramelized onion & fries",
    category: "Warm Bites",
    pricePKR: 1450,
    priceUSD: 10.5,
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "neon-slush",
    name: "Artisanal Berry & Citrus Freeze",
    subtitle: "Chilled wild berry & fresh lime crushed ice",
    category: "Beverages",
    pricePKR: 650,
    priceUSD: 4.5,
    icon: "🥤",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "premium-water",
    name: "Sparkling Mineral Water (500ml)",
    subtitle: "Chilled glass bottle with fresh lemon slice",
    category: "Beverages",
    pricePKR: 350,
    priceUSD: 2.5,
    icon: "💧",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=320&auto=format&fit=crop&q=80",
  },
];

export const ROWS = ["A", "B", "C", "D", "E", "F"] as const;
export const SEATS_PER_ROW = 8;

// Movie Screen Geometry Specs (in meters)
export const SCREEN_WIDTH = 22.0;
export const SCREEN_HEIGHT = 11.5;
export const SCREEN_CURVE_RADIUS = 26.0;
export const SCREEN_ELEVATION = 1.9;

export const ROW_METRICS: Record<
  string,
  { z: number; y: number; basePriceUSD: number; basePricePKR: number }
> = {
  A: { z: 5.4, y: 0.55, basePriceUSD: 16.0, basePricePKR: 1500 },
  B: { z: 7.2, y: 1.05, basePriceUSD: 18.5, basePricePKR: 1800 },
  C: { z: 9.1, y: 1.6, basePriceUSD: 22.0, basePricePKR: 2500 },
  D: { z: 11.0, y: 2.2, basePriceUSD: 22.0, basePricePKR: 2500 },
  E: { z: 12.9, y: 2.85, basePriceUSD: 18.0, basePricePKR: 1800 },
  F: { z: 14.9, y: 3.55, basePriceUSD: 16.0, basePricePKR: 1500 },
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
  { clothing: 0x1e3a8a, hair: 0x171717, heightOffset: 0.02 },
  { clothing: 0x991b1b, hair: 0x78350f, heightOffset: -0.03 },
  { clothing: 0x334155, hair: 0xd97706, heightOffset: 0.01 },
  { clothing: 0x14532d, hair: 0x0a0a0a, heightOffset: 0.04 },
  { clothing: 0x581c87, hair: 0x451a03, heightOffset: -0.01 },
  { clothing: 0x0f172a, hair: 0x27272a, heightOffset: 0.0 },
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
  const priceUSD = isVIP ? 22.0 : rowInfo.basePriceUSD;
  const pricePKR = isVIP ? 2500 : rowInfo.basePricePKR;
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

  // Calculate Acoustic Alignment % based on proximity to center sweet spot (Row C/D, Col 4.5)
  const idealZ = 10.0;
  const spatialDeviation = Math.hypot(x * 1.4, (z - idealZ) * 0.9);
  const acousticPct = Math.max(82, Math.min(99.8, 99.6 - spatialDeviation * 2.1));

  let rating = "Panoramic View";
  if (verticalGaze > 24) rating = "Front Immersion";
  else if (fovHoriz >= 52 && Math.abs(x) < 2.6) rating = "★ Sweet Spot";
  else if (fovHoriz >= 42) rating = "Optimal View";
  else rating = "Panoramic View";

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
    acousticScore: `${acousticPct.toFixed(1)}%`,
    rating,
  };
}

