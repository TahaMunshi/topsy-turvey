import React, { useState } from "react";
import {
  KarachiVenue,
  MovieItem,
} from "../constants/cinemaData";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  Cube3DIcon,
  FilmIcon,
} from "./Icons";

interface NueplexQuickBookingBarProps {
  venues: KarachiVenue[];
  selectedVenue: KarachiVenue;
  onSelectVenue: (venue: KarachiVenue) => void;
  movies: MovieItem[];
  selectedMovie: MovieItem;
  onSelectMovie: (movie: MovieItem) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedShowtime: string;
  onSelectShowtime: (time: string) => void;
  onProceedToSeats: () => void;
}

const NUEPLEX_DATES = [
  { id: "Today • Nov 10", label: "Today", date: "10 Nov", tag: "70MM" },
  { id: "Tomorrow • Nov 11", label: "Tomorrow", date: "11 Nov", tag: "LASER" },
  { id: "Friday • Nov 13", label: "Fri", date: "13 Nov", tag: "VIP" },
  { id: "Sat • Nov 14", label: "Sat", date: "14 Nov", tag: "WEEKEND" },
];

const CINEMA_ROOMS = [
  { id: "Cinema 1", name: "Cinema 1 — Royal Maxima", spec: "Dolby Atmos 4K Laser" },
  { id: "Cinema 2", name: "Cinema 2 — IMAX 70mm", spec: "15-Perf Curved Silver" },
  { id: "Cinema 3", name: "Cinema 3 — Gold Lounge", spec: "Velvet VIP Recliners" },
  { id: "Cinema 4", name: "Cinema 4 — Executive", spec: "Barco Laser 3D" },
];

export const NueplexQuickBookingBar: React.FC<NueplexQuickBookingBarProps> = ({
  venues,
  selectedVenue,
  onSelectVenue,
  movies,
  selectedMovie,
  onSelectMovie,
  selectedDate,
  onSelectDate,
  selectedShowtime,
  onSelectShowtime,
  onProceedToSeats,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>("Cinema 2");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 z-30">
      {/* 30% Smoked Charcoal Glass Bar with 10% Laser Cyan Border Beam */}
      <div className="bg-[#131722]/90 backdrop-blur-2xl border border-[#232a3b] rounded-2xl p-3 sm:px-4 sm:py-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-visible border-beam-active">
        {/* Connected 5-Column Horizontal Stepper (4 Selectors + 1 Primary Action CTA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* STEP 1: CINEMA / BRANCH (3 cols) */}
          <div className="relative lg:col-span-3">
            <button
              type="button"
              onClick={() => toggleDropdown("venue")}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#08090c]/80 hover:bg-[#08090c] border border-[#232a3b] hover:border-[#00f0ff]/50 transition-all duration-150 flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[9px] font-mono-tag font-bold text-[#00f0ff] uppercase flex items-center gap-1">
                  <span>01 • Cinema Branch</span>
                </span>
                <span className="block font-heading font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                  {selectedVenue.name}
                </span>
              </div>
              <BuildingIcon className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] flex-shrink-0" />
            </button>

            {activeDropdown === "venue" && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#131722] border border-[#232a3b] rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in max-h-60 overflow-y-auto">
                {venues.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onSelectVenue(v);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-between ${
                      v.id === selectedVenue.id
                        ? "bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-white"
                        : "hover:bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <div>
                      <span className="font-heading font-bold block">{v.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{v.location.split(",")[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono-tag px-1.5 py-0.5 rounded bg-[#08090c] text-[#00f0ff]">
                      {v.badgeText}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: SHOW DATE (2 cols) */}
          <div className="relative lg:col-span-2">
            <button
              type="button"
              onClick={() => toggleDropdown("date")}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#08090c]/80 hover:bg-[#08090c] border border-[#232a3b] hover:border-[#00f0ff]/50 transition-all duration-150 flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[9px] font-mono-tag font-bold text-[#00f0ff] uppercase block">
                  02 • Show Date
                </span>
                <span className="block font-heading font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                  {selectedDate.split("•")[0].trim()}
                </span>
              </div>
              <CalendarIcon className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] flex-shrink-0" />
            </button>

            {activeDropdown === "date" && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#131722] border border-[#232a3b] rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in">
                {NUEPLEX_DATES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onSelectDate(d.id);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-between ${
                      d.id === selectedDate
                        ? "bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-white"
                        : "hover:bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <div>
                      <span className="font-heading font-bold block">{d.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{d.date}</span>
                    </div>
                    <span className="text-[10px] font-mono-tag px-1.5 py-0.5 rounded bg-[#08090c] text-[#00f0ff] font-bold">
                      {d.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: FEATURE MOVIE (3 cols) */}
          <div className="relative lg:col-span-3">
            <button
              type="button"
              onClick={() => toggleDropdown("movie")}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#08090c]/80 hover:bg-[#08090c] border border-[#232a3b] hover:border-[#00f0ff]/50 transition-all duration-150 flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[9px] font-mono-tag font-bold text-[#00f0ff] uppercase block">
                  03 • Feature Movie
                </span>
                <span className="block font-heading font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                  {selectedMovie.title}
                </span>
              </div>
              <FilmIcon className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] flex-shrink-0" />
            </button>

            {activeDropdown === "movie" && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#131722] border border-[#232a3b] rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in max-h-64 overflow-y-auto">
                {movies.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectMovie(m);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-between ${
                      m.id === selectedMovie.id
                        ? "bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-white"
                        : "hover:bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-heading font-bold block truncate">{m.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{m.genre} • {m.duration}</span>
                    </div>
                    <span className="text-[10px] font-mono-tag px-1.5 py-0.5 rounded bg-[#08090c] text-[#00f0ff] flex-shrink-0">
                      ★ {m.imdbScore}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 4: CINEMA ROOM & SHOWTIME (2 cols) */}
          <div className="relative lg:col-span-2">
            <button
              type="button"
              onClick={() => toggleDropdown("room")}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#08090c]/80 hover:bg-[#08090c] border border-[#232a3b] hover:border-[#00f0ff]/50 transition-all duration-150 flex items-center justify-between cursor-pointer group"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[9px] font-mono-tag font-bold text-[#00f0ff] uppercase block">
                  04 • Room & Time
                </span>
                <span className="block font-heading font-bold text-xs sm:text-sm text-white truncate mt-0.5">
                  {selectedRoom} • {selectedShowtime}
                </span>
              </div>
              <ClockIcon className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] flex-shrink-0" />
            </button>

            {activeDropdown === "room" && (
              <div className="absolute bottom-full right-0 w-72 mb-2 bg-[#131722] border border-[#232a3b] rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in">
                <span className="text-[10px] font-mono-tag text-slate-400 px-2 py-1 block">Auditorium Hall</span>
                {CINEMA_ROOMS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoom(r.id)}
                    className={`w-full text-left p-2 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-between ${
                      r.id === selectedRoom
                        ? "bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-white"
                        : "hover:bg-white/[0.05] text-slate-300"
                    }`}
                  >
                    <span className="font-heading font-bold">{r.name}</span>
                  </button>
                ))}

                <span className="text-[10px] font-mono-tag text-slate-400 px-2 py-1 block mt-2 pt-2 border-t border-[#232a3b]">
                  Showtimes
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1">
                  {selectedMovie.showtimes.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onSelectShowtime(st);
                        setActiveDropdown(null);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-center font-mono text-xs font-semibold cursor-pointer transition-colors ${
                        st === selectedShowtime
                          ? "bg-[#00f0ff] text-[#08090c] font-bold shadow-sm"
                          : "bg-[#08090c] hover:bg-white/[0.08] text-slate-300"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 5 CTA: PROCEED TO SEATS (2 cols) */}
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={onProceedToSeats}
              className="w-full h-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#33f3ff] text-[#08090c] font-heading font-extrabold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 group"
            >
              <Cube3DIcon className="w-4 h-4 text-[#08090c] flex-shrink-0" />
              <span>Book Seats</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
