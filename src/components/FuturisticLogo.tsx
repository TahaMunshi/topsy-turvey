import React from "react";
import { KarachiVenue } from "../constants/cinemaData";

interface CinemaVenueMarkProps {
  venue: KarachiVenue;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Bespoke vector brand emblem for each of the 6 Karachi cinema theaters,
 * rendered with each theater's signature brand palette and gradient.
 */
export const CinemaVenueMark: React.FC<CinemaVenueMarkProps> = ({
  venue,
  size = "md",
  className = "",
}) => {
  const sizeClasses: Record<string, string> = {
    xs: "w-5 h-5 rounded-md",
    sm: "w-7 h-7 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
    xl: "w-20 h-20 rounded-[24px]",
  };

  const iconSizes: Record<string, string> = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-11 h-11",
  };

  const gradId = `brand-grad-${venue.id}-${size}`;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-300 ${sizeClasses[size]} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${venue.brandPrimary}28 0%, ${venue.brandBgTint} 75%)`,
        border: `1px solid ${venue.brandPrimary}4d`,
        boxShadow: `0 0 18px -3px ${venue.brandGlow}, inset 0 1px 1px rgba(255,255,255,0.22)`,
      }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className={iconSizes[size]}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={venue.brandPrimary} />
            <stop offset="100%" stopColor={venue.brandSecondary} />
          </linearGradient>
        </defs>

        {venue.id === "aetheria-clifton" && (
          /* AETHERIA SEATVISION: Golden IMAX Aperture Prism & Celestial Star */
          <g>
            <circle
              cx="18"
              cy="18"
              r="13.5"
              stroke={`url(#${gradId})`}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.7"
            />
            <polygon
              points="18,5 29,26 7,26"
              stroke={`url(#${gradId})`}
              strokeWidth="2"
              fill={`${venue.brandPrimary}18`}
              strokeLinejoin="round"
            />
            <path
              d="M12.5 21H23.5"
              stroke={venue.brandPrimary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="18" cy="15.5" r="2.6" fill={`url(#${gradId})`} />
          </g>
        )}

        {venue.id === "nueplex-dha" && (
          /* NUEPLEX CINEMAS (Royal Maxima): Architectural Crimson Ribbon "N" & Curved Screen Arc */
          <g>
            <path
              d="M6 10.5C13.5 6.8 22.5 6.8 30 10.5"
              stroke={venue.brandSecondary}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M10.5 26.5V12.5L25.5 26.5V12.5"
              stroke={`url(#${gradId})`}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10.5" cy="12.5" r="1.6" fill="#ffffff" />
            <circle cx="25.5" cy="26.5" r="1.6" fill="#ffffff" />
          </g>
        )}

        {venue.id === "nueplex-askari" && (
          /* NUEPLEX ASKARI IV (Gold Lounge): Faceted Diamond Crest & Imperial Gold "N" */
          <g>
            <polygon
              points="18,4.5 31.5,18 18,31.5 4.5,18"
              stroke={`url(#${gradId})`}
              strokeWidth="1.7"
              fill={`${venue.brandPrimary}15`}
            />
            <path
              d="M13 23.5V12.5L23 23.5V12.5"
              stroke={`url(#${gradId})`}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="8.5" r="1.4" fill={venue.brandSecondary} />
          </g>
        )}

        {venue.id === "cinepax-ocean" && (
          /* CINEPAX OCEAN MALL (CMAX): Sweeping CMAX Orbital Lens & Shooting Cinema Star */
          <g>
            <path
              d="M26.5 9.5C24.2 7.3 21.1 6 17.5 6C10.6 6 5 11.4 5 18C5 24.6 10.6 30 17.5 30C21.3 30 24.6 28.4 26.8 25.9"
              stroke={venue.brandPrimary}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <polygon
              points="22,11 23.9,15.2 28.5,15.7 25,18.8 26,23.3 22,21 18,23.3 19,18.8 15.5,15.7 20.1,15.2"
              fill={venue.brandSecondary}
              stroke="#ffffff"
              strokeWidth="0.6"
            />
          </g>
        )}

        {venue.id === "atrium-saddar" && (
          /* ATRIUM CINEMAS: Triple-Arch Glass Vault & 3D Prism "A" */
          <g>
            <path
              d="M6.5 26.5C6.5 14 11.6 7 18 7C24.4 7 29.5 14 29.5 26.5"
              stroke={`url(#${gradId})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 9.5L25 26.5H11L18 9.5Z"
              stroke="#ffffff"
              strokeWidth="1.8"
              fill={`${venue.brandPrimary}26`}
              strokeLinejoin="round"
            />
            <path
              d="M13.5 21.5H22.5"
              stroke={venue.brandSecondary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {venue.id === "arena-karsaz" && (
          /* THE ARENA CINEMA: Geodesic Velvet Dome Crown & Amphitheater Arcs */
          <g>
            <path
              d="M6 23.5C6 14.5 11.4 8.5 18 8.5C24.6 8.5 30 14.5 30 23.5"
              stroke={`url(#${gradId})`}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M10.5 23.5C10.5 17.5 13.8 13.5 18 13.5C22.2 13.5 25.5 17.5 25.5 23.5"
              stroke={venue.brandSecondary}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M4.5 26.5H31.5"
              stroke={venue.brandPrimary}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="18" cy="19.5" r="2.4" fill={venue.brandSecondary} />
          </g>
        )}

        {venue.id === "tcl-hollywood" && (
          /* TCL CHINESE THEATRE (Hollywood): Imperial Pagoda Arches & Hollywood Star of Fame */
          <g>
            {/* Pagoda Curved Roof Arc */}
            <path
              d="M5 14C11 10.5 25 10.5 31 14"
              stroke={venue.brandSecondary}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 11L18 5L28 11"
              stroke={`url(#${gradId})`}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Hollywood Star Motif */}
            <polygon
              points="18,12 20.3,17.2 26,17.7 21.6,21.5 22.9,27 18,24.1 13.1,27 14.4,21.5 10,17.7 15.7,17.2"
              fill={venue.brandPrimary}
              stroke={venue.brandSecondary}
              strokeWidth="0.8"
            />
            <circle cx="18" cy="19.5" r="1.5" fill="#ffffff" />
          </g>
        )}

        {venue.id === "bfi-london" && (
          /* BFI IMAX WATERLOO: South Bank Rotunda Glass Drum & 70mm Dual Laser Lens */
          <g>
            {/* Waterloo Cylindrical Outer Drum */}
            <circle
              cx="18"
              cy="18"
              r="13"
              stroke={`url(#${gradId})`}
              strokeWidth="1.8"
              strokeDasharray="5 2.5"
            />
            {/* Inner Dual Laser Aperture */}
            <circle
              cx="18"
              cy="18"
              r="8"
              stroke={venue.brandSecondary}
              strokeWidth="1.6"
            />
            {/* 1.43:1 Giant Screen Frame */}
            <rect
              x="12"
              y="13"
              width="12"
              height="10"
              rx="1.5"
              stroke="#ffffff"
              strokeWidth="1.4"
              fill={`${venue.brandPrimary}26`}
            />
            <circle cx="18" cy="18" r="2" fill={venue.brandSecondary} />
          </g>
        )}

        {venue.id === "vox-dubai" && (
          /* VOX CINEMAS DUBAI: Luxury Winged Crown & VIP Recliner Diamond */
          <g>
            <polygon
              points="18,5 30,13 26,29 10,29 6,13"
              stroke={`url(#${gradId})`}
              strokeWidth="1.8"
              fill={`${venue.brandPrimary}16`}
            />
            {/* Faceted Crown Lines */}
            <path
              d="M18 5L22 17L26 29"
              stroke={venue.brandSecondary}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M18 5L14 17L10 29"
              stroke={venue.brandSecondary}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M6 13L18 20L30 13"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="18" cy="10" r="1.6" fill={venue.brandSecondary} />
          </g>
        )}

        {venue.id === "amc-lincoln" && (
          /* AMC LINCOLN SQUARE (NYC): Broadway Theatrical Arch & 70mm Tallest Screen */
          <g>
            {/* Monumental Tallest Screen Rect */}
            <rect
              x="7"
              y="6"
              width="22"
              height="24"
              rx="3"
              stroke={`url(#${gradId})`}
              strokeWidth="2"
              fill={`${venue.brandPrimary}18`}
            />
            {/* Inner Bold "A" Theatrical Monogram */}
            <path
              d="M11 25L18 10L25 25"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 20H22"
              stroke={venue.brandSecondary}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="18" cy="10" r="1.4" fill={venue.brandSecondary} />
          </g>
        )}
      </svg>
    </div>
  );
};

interface FuturisticLogoProps {
  venue: KarachiVenue;
  onClick?: () => void;
}

export const FuturisticLogo: React.FC<FuturisticLogoProps> = ({
  venue,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer bg-transparent border-0 p-0"
    >
      {/* Individual Cinema Brand Logo Mark */}
      <CinemaVenueMark
        venue={venue}
        size="sm"
        className="group-hover:scale-105 flex-shrink-0"
      />

      {/* Clean Theater Name & Brand-Tinted Hall Badge */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-extrabold text-[11px] sm:text-xs tracking-tight text-white group-hover:opacity-90 transition-opacity truncate max-w-[90px] xs:max-w-[120px] sm:max-w-none">
            {venue.name}
          </span>
          <span
            className="hidden xs:inline-block text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border transition-colors leading-none flex-shrink-0"
            style={{
              color: venue.brandPrimary,
              borderColor: `${venue.brandPrimary}45`,
              backgroundColor: `${venue.brandPrimary}14`,
            }}
          >
            {venue.badgeText}
          </span>
        </div>
        <p className="hidden sm:block text-[10px] text-zinc-400 mt-0.5 leading-none truncate">
          {venue.hallName}
        </p>
      </div>
    </button>
  );
};
