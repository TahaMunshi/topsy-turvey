import React from "react";
import { BranchInfo } from "../constants/topsyData";

interface TopsyBrandMarkProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const TopsyBrandMark: React.FC<TopsyBrandMarkProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses: Record<string, string> = {
    xs: "w-6 h-6 rounded-lg",
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-[#1F2A5A]/15 shadow-sm transition-transform duration-200 ${sizeClasses[size]} ${className}`}
    >
      <img
        src="/images/brand/topsy-turvy-logo.png"
        alt="Topsy Turvy"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
};

interface TopsyHeaderLogoProps {
  branch: BranchInfo;
  onClick?: () => void;
}

export const TopsyHeaderLogo: React.FC<TopsyHeaderLogoProps> = ({
  branch,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none cursor-pointer bg-transparent border-0 p-0"
    >
      <TopsyBrandMark
        size="lg"
        className="group-hover:scale-105 flex-shrink-0"
      />

      <div className="min-w-0">
        <span className="font-heading font-extrabold text-xs sm:text-sm tracking-tight text-[#1F2A5A] truncate block">
          TOPSY TURVY
        </span>
        <p className="hidden lg:block text-xs lg:text-[13px] font-semibold text-[#1F2A5A]/80 leading-none truncate mt-0.5">
          {branch.city} • {branch.hoursSummary}
        </p>
      </div>
    </button>
  );
};
