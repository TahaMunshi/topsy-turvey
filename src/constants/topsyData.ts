export type BranchId = "lahore-packages" | "karachi-ocean";

export interface PartyPackageSpec {
  id: string;
  name: string;
  pricePKR: number;
  minKids: number;
  duration: string;
  accentHex: string;
  highlights: string[];
}

export interface BranchInfo {
  id: BranchId;
  code: "LHR" | "KHI";
  name: string;
  shortName: string;
  city: string;
  address: string;
  phone: string;
  mallUan: string;
  email: string;
  hoursSummary: string;
  rooms: string[];
  timeSlots: string[];
  partyPackages: PartyPackageSpec[];
}

export interface PlayPassOption {
  id: "two-hour" | "full-day";
  name: string;
  pricePKR: number;
  durationLabel: string;
  accentHex: string;
  description: string;
}

export interface CrowdInfo {
  level: "Quiet" | "Moderate" | "Busy" | "Peak";
  pct: number;
  colorClass: string;
  dotColor: string;
}

export interface ZoneHighlight {
  name: string;
  role: string;
  image: string;
}

export interface PlayZoneItem {
  id: string;
  zoneLabel: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  ageGroup: string;
  badge: string;
  tagline: string;
  synopsis: string;
  accentHex: string;
  heroImage: string;
  primaryFlow: "passes" | "parties" | "school-trips";
  highlights: ZoneHighlight[];
}

export interface PartyExtraOption {
  id: string;
  name: string;
  pricePKR: number;
  perChild: boolean;
}

export type CafeCategory =
  | "Play Add-Ons"
  | "Snacks"
  | "Sandwiches"
  | "Juices"
  | "Treats";

export interface CafeMenuItem {
  id: string;
  name: string;
  subtitle: string;
  category: CafeCategory;
  pricePKR: number;
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

export const GRIP_SOCKS_PKR = 300;
export const OVERTIME_30MIN_PKR = 500;
export const EXTRA_ADULT_PKR = 0;
export const PARTY_ADVANCE_PCT = 20;
export const SCHOOL_TRIP_DEFAULT_PKR = 800;

export function formatPKR(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString("en-PK")}`;
}

export const BRANCHES: BranchInfo[] = [
  {
    id: "lahore-packages",
    code: "LHR",
    name: "Topsy Turvy, Packages Mall",
    shortName: "Packages Mall, Lahore",
    city: "Lahore",
    address: "2nd Floor, Packages Mall, Main Walton Road, Lahore",
    phone: "+92 347 6850000",
    mallUan: "111-696-255",
    email: "info@topsyturvy.pk",
    hoursSummary: "11:00 AM to 11:00 PM Daily",
    rooms: ["Room A", "Room B"],
    timeSlots: ["11:00 AM", "1:30 PM", "4:00 PM", "6:30 PM", "9:00 PM"],
    partyPackages: [
      {
        id: "spectacular-lhr",
        name: "Spectac-U-Lar",
        pricePKR: 1800,
        minKids: 15,
        duration: "2 Hours (1h Private Room)",
        accentHex: "#E83E8C",
        highlights: [
          "Access to Softplay Area, Arts & Crafts Garden, Mouse House, Brick House & Mice Market",
          "Dedicated Party Host & Birthday Ceremony with mascot appearance",
          "Kids meal with 1 beverage (juice or bottled water)",
          "Balloon & wristband for each guest + invitation cards at booking",
        ],
      },
      {
        id: "razmatazz-lhr",
        name: "Raz-Ma-Tazz",
        pricePKR: 2200,
        minKids: 15,
        duration: "2 Hours (1h Private Room)",
        accentHex: "#6A3A97",
        highlights: [
          "Private Party Room (1 hr) with colorful balloon decor + Wheel of Fortune spin",
          "Exclusive photo opportunity with Miki & Juju mascots",
          "Choice of Kids meal + 2 beverages (juice and bottled water)",
          "Choice of Balloon Bending or Face Painting",
        ],
      },
    ],
  },
  {
    id: "karachi-ocean",
    code: "KHI",
    name: "Topsy Turvy, Ocean Mall",
    shortName: "Ocean Mall, Karachi",
    city: "Karachi",
    address: "Ocean Mall, Clifton Block 9, Karachi",
    phone: "+92 21 35166705",
    mallUan: "021-35166705",
    email: "info@topsyturvy.pk",
    hoursSummary: "Sun to Thu 12 to 11 PM • Fri 3 PM to 12 AM • Sat 12 to 12 AM",
    rooms: ["Room A", "Room B"],
    timeSlots: ["12:00 PM", "2:30 PM", "5:00 PM", "7:30 PM", "9:30 PM"],
    partyPackages: [
      {
        id: "spectacular-khi",
        name: "Spectac-U-Lar",
        pricePKR: 1600,
        minKids: 15,
        duration: "2 Hours (1h Private Room)",
        accentHex: "#E83E8C",
        highlights: [
          "Play Area & Arts & Crafts Garden access with Dedicated Entertainer & Party Host",
          "2 organized non-elimination games where every guest wins treats or stickers",
          "Kids meal with 1 beverage (juice or bottled water) + helium balloon",
          "Colorful balloon decor, name tag, wristband & invitation cards",
        ],
      },
      {
        id: "premier-khi",
        name: "Premier",
        pricePKR: 1950,
        minKids: 10,
        duration: "2 Hours (1h Private Room)",
        accentHex: "#6A3A97",
        highlights: [
          "2 organized games by our Party Team + Private Party Room (1 hr)",
          "Choice of Kids meal + 2 beverages (juice and bottled water)",
          "Birthday Present and Birthday Certificate for the Celebrant",
          "Choice of Balloon Bending or Face Painting + wristband for each guest",
        ],
      },
    ],
  },
];

export const PLAY_PASSES: PlayPassOption[] = [
  {
    id: "two-hour",
    name: "2-Hour Pass",
    pricePKR: 1000,
    durationLabel: "120 minutes",
    accentHex: "#1BA0DE",
    description:
      "Full access to Softplay Area, Mouse House Village, and Arts & Crafts Garden for 2 hours.",
  },
  {
    id: "full-day",
    name: "Full-Day Pass",
    pricePKR: 1800,
    durationLabel: "Until closing",
    accentHex: "#1FA246",
    description:
      "Unlimited play until branch closing with a re-entry wristband.",
  },
];

export function getTimeSlotCrowd(time: string): CrowdInfo {
  switch (time) {
    case "11:00 AM":
    case "12:00 PM":
      return {
        level: "Quiet",
        pct: 22,
        colorClass: "text-emerald-700 border-emerald-200 bg-emerald-50",
        dotColor: "#1FA246",
      };
    case "1:30 PM":
    case "2:30 PM":
      return {
        level: "Moderate",
        pct: 48,
        colorClass: "text-sky-700 border-sky-200 bg-sky-50",
        dotColor: "#1BA0DE",
      };
    case "4:00 PM":
    case "5:00 PM":
      return {
        level: "Busy",
        pct: 74,
        colorClass: "text-amber-700 border-amber-200 bg-amber-50",
        dotColor: "#F28C28",
      };
    case "6:30 PM":
    case "7:30 PM":
      return {
        level: "Peak",
        pct: 92,
        colorClass: "text-rose-700 border-rose-200 bg-rose-50",
        dotColor: "#E31E3C",
      };
    default:
      return {
        level: "Moderate",
        pct: 54,
        colorClass: "text-sky-700 border-sky-200 bg-sky-50",
        dotColor: "#1BA0DE",
      };
  }
}

export const PLAY_ZONES: PlayZoneItem[] = [
  {
    id: "softplay-disco",
    zoneLabel: "ZONE 01",
    shortTitle: "Softplay & Disco Pen",
    title: "Softplay Area & Disco Pen",
    subtitle: "Water Slide • Space Shuttle • Disco Pen",
    ageGroup: "Ages 1 to 12",
    badge: "Signature Play",
    tagline:
      "Our soft play area keeps children engaged for hours, from the water slide to the space shuttle and a cool disco pen hidden under the slides!",
    synopsis:
      "At Topsy Turvy, kids Play, Learn and Celebrate in a bright, Montessori-inspired softplay environment. Featuring a thrilling water slide, Space Shuttle climb, hidden Disco Pen under the slides, and padded obstacle bridges, supervised by First-Aid certified Performing Arts and Early Childhood staff while parents relax with Free Wi-Fi in our café.",
    accentHex: "#E31E3C",
    heroImage: "/images/zones/soft-play-maze.jpg",
    primaryFlow: "passes",
    highlights: [
      {
        name: "Water Slide",
        role: "Twin Spiral",
        image: "/images/zones/highlights/wave-slides.jpg",
      },
      {
        name: "Space Shuttle",
        role: "Climb & Crawl",
        image: "/images/zones/highlights/crawl-tunnels.jpg",
      },
      {
        name: "Disco Pen",
        role: "Under-Slide Zone",
        image: "/images/zones/highlights/foam-rollers.jpg",
      },
      {
        name: "Grip Socks",
        role: "PKR 300 Required",
        image: "/images/cafe/grip-socks.jpg",
      },
    ],
  },
  {
    id: "race-track-jump",
    zoneLabel: "ZONE 02",
    shortTitle: "Race Track & Jump",
    title: "Race Track & Trampoline Arena",
    subtitle: "Race Track • Trampolines • Climbing Wall",
    ageGroup: "Ages 4 to 12",
    badge: "Active Play",
    tagline:
      "Zoom around the indoor Race Track (PKR 200/child), bounce on spring-loaded trampolines, and scale colorful padded climbing walls.",
    synopsis:
      "Built for high-energy explorers, this active zone pairs Topsy Turvy's indoor Race Track with interconnected trampoline jump mats, padded climbing walls, rope ladders, and 360° safety enclosures supervised by First-Aid certified floor staff.",
    accentHex: "#1BA0DE",
    heroImage: "/images/zones/trampoline-climbing.jpg",
    primaryFlow: "passes",
    highlights: [
      {
        name: "Race Track",
        role: "PKR 200 Add-On",
        image: "/images/zones/highlights/jump-mats.jpg",
      },
      {
        name: "Climbing Wall",
        role: "Padded Holds",
        image: "/images/zones/highlights/climbing-wall.jpg",
      },
      {
        name: "Rope Ladders",
        role: "Balance Climb",
        image: "/images/zones/highlights/rope-ladders.jpg",
      },
      {
        name: "Safety Nets",
        role: "360° Enclosure",
        image: "/images/zones/highlights/safety-nets.jpg",
      },
    ],
  },
  {
    id: "mouse-house-village",
    zoneLabel: "ZONE 03",
    shortTitle: "Mouse House Village",
    title: "Mouse House, Brick House & Mice Market",
    subtitle: "Arts & Crafts • Ball Pit • Pretend Play",
    ageGroup: "Ages 1 to 5",
    badge: "Montessori",
    tagline:
      "Our Montessori-inspired layout features the Mouse House, Brick House, Mice Market, Arts & Crafts Garden, and sanitized Ball Pit.",
    synopsis:
      "Playing is an integral part of a child's mental and sensory development. Little explorers build confidence and social skills inside the Mouse House, Brick House, and Mice Market, get creative in the Arts & Crafts Garden, and enjoy our sanitized pastel Ball Pit.",
    accentHex: "#1FA246",
    heroImage: "/images/zones/toddler-ball-pit.jpg",
    primaryFlow: "passes",
    highlights: [
      {
        name: "Mouse House",
        role: "Pretend Village",
        image: "/images/zones/highlights/playhouses.jpg",
      },
      {
        name: "Mice Market",
        role: "Mini Kitchens",
        image: "/images/zones/highlights/mini-kitchens.jpg",
      },
      {
        name: "Arts & Crafts",
        role: "Creative Garden",
        image: "/images/zones/highlights/soft-blocks.jpg",
      },
      {
        name: "Ball Pit",
        role: "Sensory Pool",
        image: "/images/zones/highlights/ball-pit.jpg",
      },
    ],
  },
  {
    id: "birthday-parties",
    zoneLabel: "ZONE 04",
    shortTitle: "Birthday Parties",
    title: "Birthday Parties & Celebrations",
    subtitle: "Room A & Room B • 15 to 100 Kids",
    ageGroup: "15 to 100 Kids",
    badge: "20% Advance",
    tagline:
      "Multi-purpose party rooms for 15 to 100 children, complete with party hosts, Miki & Juju mascots, kids' meals, and custom themes.",
    synopsis:
      "Parents just sit back and relax and let our events team handle the planning, games & entertainment, setup, cleanup, and cake. Confirm any Spectac-U-Lar, Raz-Ma-Tazz, or Premier party package with a 20% advance online and pay the remaining balance at the venue.",
    accentHex: "#E83E8C",
    heroImage: "/images/zones/birthday-packages.jpg",
    primaryFlow: "parties",
    highlights: [
      {
        name: "Party Host",
        role: "Games & MC",
        image: "/images/zones/highlights/party-host.jpg",
      },
      {
        name: "Face Painting",
        role: "Theme Art",
        image: "/images/cafe/face-painting.jpg",
      },
      {
        name: "Private Rooms",
        role: "Room A & Room B",
        image: "/images/zones/highlights/reserved-tables.jpg",
      },
      {
        name: "Full Play Access",
        role: "All Zones",
        image: "/images/zones/highlights/all-zone-pass.jpg",
      },
    ],
  },
  {
    id: "school-trips",
    zoneLabel: "ZONE 05",
    shortTitle: "School Trips",
    title: "School Trips & Group Play",
    subtitle: "PKR 800 / Student • Teachers Free",
    ageGroup: "Groups 15+",
    badge: "20% Advance",
    tagline:
      "Planning a school trip? Book with our First-Aid certified Performing Arts & Early Childhood team in a safe, Montessori-inspired space.",
    synopsis:
      "Designed for Lahore and Karachi preschools and primary grades, our School Trip program combines structured play across the Softplay Area, Arts & Crafts Garden, Mouse House, and Mice Market with free entry for accompanying teachers and Free Wi-Fi in the café.",
    accentHex: "#F28C28",
    heroImage: "/images/zones/school-trips.jpg",
    primaryFlow: "school-trips",
    highlights: [
      {
        name: "First-Aid Staff",
        role: "Early Childhood",
        image: "/images/zones/highlights/floor-marshals.jpg",
      },
      {
        name: "Morning Slots",
        role: "Quiet Play",
        image: "/images/zones/highlights/morning-slot.jpg",
      },
      {
        name: "Snack Boxes",
        role: "Optional Meals",
        image: "/images/zones/highlights/snack-boxes.jpg",
      },
      {
        name: "Teachers Free",
        role: "Café Wi-Fi",
        image: "/images/zones/highlights/teachers-free.jpg",
      },
    ],
  },
];

export const PARTY_EXTRAS: PartyExtraOption[] = [
  { id: "race-track", name: "Race Track Tickets", pricePKR: 200, perChild: true },
  { id: "balloon-bending", name: "Balloon Bending", pricePKR: 100, perChild: true },
  { id: "cotton-candy", name: "Cotton Candy", pricePKR: 150, perChild: true },
  { id: "pinata", name: "Piñata", pricePKR: 1500, perChild: false },
  {
    id: "character-appearance",
    name: "Character (Batman / Spider-Man / Princess)",
    pricePKR: 2000,
    perChild: false,
  },
  { id: "backdrop", name: "Customized Backdrop", pricePKR: 2500, perChild: false },
  { id: "magician", name: "Magician Show", pricePKR: 5000, perChild: false },
  { id: "photographer", name: "Photographer", pricePKR: 5000, perChild: false },
  {
    id: "theme-decor",
    name: "Theme Decor (Superhero / Princess / Unicorn / Lego)",
    pricePKR: 15000,
    perChild: false,
  },
  {
    id: "mickey-decor",
    name: "Mickey / Minnie Mouse Theme Decor",
    pricePKR: 20000,
    perChild: false,
  },
];

export const CAFE_MENU: CafeMenuItem[] = [
  {
    id: "grip-socks",
    name: "Topsy Turvy Grip Socks",
    subtitle: "Anti-slip play socks (required for Softplay & Trampolines)",
    category: "Play Add-Ons",
    pricePKR: 300,
    icon: "🧦",
    image: "/images/cafe/grip-socks.jpg",
  },
  {
    id: "race-track-ticket",
    name: "Race Track Ticket",
    subtitle: "Indoor Race Track ride per child",
    category: "Play Add-Ons",
    pricePKR: 200,
    icon: "🏎️",
    image: "/images/zones/highlights/jump-mats.jpg",
  },
  {
    id: "face-painting",
    name: "Themed Face Painting",
    subtitle: "Skin-safe butterflies, superheroes & glitter art",
    category: "Play Add-Ons",
    pricePKR: 600,
    icon: "🎨",
    image: "/images/cafe/face-painting.jpg",
  },
  {
    id: "fries",
    name: "Crispy Fries",
    subtitle: "Fresh golden fries served hot from the café counter",
    category: "Snacks",
    pricePKR: 350,
    icon: "🍟",
    image: "/images/cafe/kids-nuggets-meal.jpg",
  },
  {
    id: "nuggets-6pc",
    name: "Nuggets (6 pc)",
    subtitle: "Six crispy golden chicken nuggets",
    category: "Snacks",
    pricePKR: 550,
    icon: "🍗",
    image: "/images/cafe/kids-nuggets-meal.jpg",
  },
  {
    id: "popcorn",
    name: "Popcorn",
    subtitle: "Freshly popped snack cup",
    category: "Snacks",
    pricePKR: 250,
    icon: "🍿",
    image: "/images/zones/highlights/snack-boxes.jpg",
  },
  {
    id: "nachos",
    name: "Cheese Nachos",
    subtitle: "Crunchy tortilla chips with warm cheese dip",
    category: "Snacks",
    pricePKR: 450,
    icon: "🧀",
    image: "/images/zones/highlights/snack-boxes.jpg",
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    subtitle: "Triple-decker café club sandwich with fries",
    category: "Sandwiches",
    pricePKR: 750,
    icon: "🥪",
    image: "/images/cafe/panini-latte.jpg",
  },
  {
    id: "chicken-mayo-sandwich",
    name: "Chicken Mayo Sandwich",
    subtitle: "Freshly made shredded chicken & mayo sandwich",
    category: "Sandwiches",
    pricePKR: 600,
    icon: "🥖",
    image: "/images/cafe/panini-latte.jpg",
  },
  {
    id: "grilled-cheese",
    name: "Grilled Cheese",
    subtitle: "Melted cheddar toastie for kids & parents",
    category: "Sandwiches",
    pricePKR: 500,
    icon: "🧀",
    image: "/images/cafe/panini-latte.jpg",
  },
  {
    id: "kids-mini-burger",
    name: "Kids Mini Burger",
    subtitle: "Kid-sized grilled burger with soft bun",
    category: "Sandwiches",
    pricePKR: 650,
    icon: "🍔",
    image: "/images/cafe/kids-nuggets-meal.jpg",
  },
  {
    id: "fresh-orange-juice",
    name: "Fresh Orange Juice",
    subtitle: "Freshly squeezed orange juice",
    category: "Juices",
    pricePKR: 450,
    icon: "🍊",
    image: "/images/zones/highlights/teachers-free.jpg",
  },
  {
    id: "mint-lemonade",
    name: "Mint Lemonade",
    subtitle: "Chilled lemon & fresh mint cooler",
    category: "Juices",
    pricePKR: 400,
    icon: "🍋",
    image: "/images/zones/highlights/teachers-free.jpg",
  },
  {
    id: "mango-shake",
    name: "Mango Shake",
    subtitle: "Creamy chilled mango milkshake",
    category: "Juices",
    pricePKR: 500,
    icon: "🥭",
    image: "/images/cafe/cappuccino-brownie.jpg",
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    subtitle: "Chilled 500ml bottled water",
    category: "Juices",
    pricePKR: 100,
    icon: "💧",
    image: "/images/zones/highlights/teachers-free.jpg",
  },
  {
    id: "brownie",
    name: "Chocolate Brownie",
    subtitle: "Warm fudgy chocolate brownie treat",
    category: "Treats",
    pricePKR: 350,
    icon: "🍫",
    image: "/images/cafe/cappuccino-brownie.jpg",
  },
  {
    id: "cupcake",
    name: "Frosted Cupcake",
    subtitle: "Swirled pastel buttercream cupcake",
    category: "Treats",
    pricePKR: 300,
    icon: "🧁",
    image: "/images/cafe/party-balloon-pack.jpg",
  },
  {
    id: "ice-cream-cup",
    name: "Ice Cream Cup",
    subtitle: "Chilled scoop cup for kids",
    category: "Treats",
    pricePKR: 300,
    icon: "🍨",
    image: "/images/cafe/cappuccino-brownie.jpg",
  },
  {
    id: "cotton-candy",
    name: "Cotton Candy",
    subtitle: "Fresh spun sugar cloud",
    category: "Treats",
    pricePKR: 250,
    icon: "🍭",
    image: "/images/cafe/party-balloon-pack.jpg",
  },
];

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
    code: "TOPSY10",
    label: "Topsy 10% Off",
    description: "10% off Play Passes & Café pre-order",
    type: "PERCENT",
    percentOff: 10,
  },
];
