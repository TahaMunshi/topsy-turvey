import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const FilmIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
    <path strokeLinecap="round" strokeWidth="2" d="M7 3v18M17 3v18M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
  </svg>
);

export const Cube3DIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
  </svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M6 18V4a1 1 0 011-1h10a1 1 0 011 1v14M9 8h2m-2 4h2m-2 4h2m4-8h2m-4 4h2m-4 4h2" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CurrencyIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M15 9.5a3 3 0 00-3-2.5H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H9a3 3 0 01-3-2.5" />
  </svg>
);

export const TheaterIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M9 4v6M15 4v6M9 14h6" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="4" rx="2" strokeWidth="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m12.728 0l-2.121-2.121M7.757 7.757L5.636 5.636" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" strokeWidth="2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const LaserIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PopcornIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8a3 3 0 00-3-3 3 3 0 00-4.24 0A3 3 0 006 8a3 3 0 000 6h12a3 3 0 000-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 14l1 7h8l1-7" />
  </svg>
);

export const MonitorIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="20" height="14" x="2" y="3" rx="2" strokeWidth="2" />
    <line x1="8" x2="16" y1="21" y2="21" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" x2="12" y1="17" y2="21" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18h6M10 22h4M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />
  </svg>
);

export const ArmchairIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 19v2M18 19v2M4 11V7a3 3 0 013-3h10a3 3 0 013 3v4M4 11h16M4 11v6a2 2 0 002 2h12a2 2 0 002-2v-6" />
  </svg>
);

export const CrosshairIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <line x1="22" x2="18" y1="12" y2="12" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" x2="2" y1="12" y2="12" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" x2="12" y1="6" y2="2" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" x2="12" y1="22" y2="18" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
    <line x1="13" x2="13" y1="5" y2="19" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

