import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  AUDIENCE_PROFILES,
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
  PRE_RESERVED_SEATS,
  ROW_METRICS,
  ROWS,
  SCREEN_ELEVATION,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SEATS_PER_ROW,
} from "../constants/cinemaData";

interface CinemaProceduralTextures {
  carpetColorTex: THREE.CanvasTexture;
  carpetBumpTex: THREE.CanvasTexture;
  wallBumpTex: THREE.CanvasTexture;
  leatherBumpTex: THREE.CanvasTexture;
  drlGlowTex: THREE.CanvasTexture;
  sconceMetalBumpTex: THREE.CanvasTexture;
  sconceMetalRoughTex: THREE.CanvasTexture;
  sconceGlassTex: THREE.CanvasTexture;
  sconceConeTex: THREE.CanvasTexture;
  sconceGoboTex: THREE.CanvasTexture;
}

let cachedProceduralTextures: CinemaProceduralTextures | null = null;

function getCinemaProceduralTextures(): CinemaProceduralTextures {
  if (cachedProceduralTextures) return cachedProceduralTextures;

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smoothstep = (e0: number, e1: number, x: number) => {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };

  // 1. Plush Crimson-Burgundy Velvet Carpet Color & Bump Textures (128x128)
  const carpetCanvas = document.createElement("canvas");
  carpetCanvas.width = 128;
  carpetCanvas.height = 128;
  const cCtx = carpetCanvas.getContext("2d")!;
  cCtx.fillStyle = "#660f19";
  cCtx.fillRect(0, 0, 128, 128);

  const carpetBumpCanvas = document.createElement("canvas");
  carpetBumpCanvas.width = 128;
  carpetBumpCanvas.height = 128;
  const cbCtx = carpetBumpCanvas.getContext("2d")!;
  cbCtx.fillStyle = "#808080";
  cbCtx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 1800; i++) {
    const cx = Math.random() * 128;
    const cy = Math.random() * 128;
    const isDark = Math.random() < 0.5;
    cCtx.fillStyle = isDark
      ? "rgba(74, 9, 17, 0.45)"
      : "rgba(126, 22, 34, 0.38)";
    cCtx.fillRect(cx, cy, 1.5, 1.5);

    const bv = isDark
      ? 96 + Math.floor(Math.random() * 28)
      : 132 + Math.floor(Math.random() * 32);
    cbCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
    cbCtx.fillRect(cx, cy, 1.5, 1.5);
  }
  for (let s = 0; s < 80; s++) {
    const sy = Math.random() * 128;
    cCtx.fillStyle =
      s % 2 === 0 ? "rgba(140, 26, 40, 0.08)" : "rgba(56, 6, 12, 0.09)";
    cCtx.fillRect(0, sy, 128, 1);
  }

  const carpetColorTex = new THREE.CanvasTexture(carpetCanvas);
  carpetColorTex.colorSpace = THREE.SRGBColorSpace;
  carpetColorTex.wrapS = THREE.RepeatWrapping;
  carpetColorTex.wrapT = THREE.RepeatWrapping;
  carpetColorTex.repeat.set(8, 8);

  const carpetBumpTex = new THREE.CanvasTexture(carpetBumpCanvas);
  carpetBumpTex.wrapS = THREE.RepeatWrapping;
  carpetBumpTex.wrapT = THREE.RepeatWrapping;
  carpetBumpTex.repeat.set(8, 8);

  // 2. Matte Burgundy Acoustic Plaster Wall Bump (128x128)
  const wallBumpCanvas = document.createElement("canvas");
  wallBumpCanvas.width = 128;
  wallBumpCanvas.height = 128;
  const wbCtx = wallBumpCanvas.getContext("2d")!;
  wbCtx.fillStyle = "#808080";
  wbCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 600; i++) {
    const wx = Math.random() * 128;
    const wy = Math.random() * 128;
    const v = 114 + Math.floor(Math.random() * 28);
    wbCtx.fillStyle = `rgb(${v},${v},${v})`;
    wbCtx.fillRect(wx, wy, 1.5, 1.5);
  }
  const wallBumpTex = new THREE.CanvasTexture(wallBumpCanvas);
  wallBumpTex.wrapS = THREE.RepeatWrapping;
  wallBumpTex.wrapT = THREE.RepeatWrapping;
  wallBumpTex.repeat.set(6, 4);

  // 3. Fine Nappa Leather Grain Bump with Vertical Quilted Seams (128x128)
  const leatherCanvas = document.createElement("canvas");
  leatherCanvas.width = 128;
  leatherCanvas.height = 128;
  const lCtx = leatherCanvas.getContext("2d")!;
  lCtx.fillStyle = "#808080";
  lCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 600; i++) {
    const gx = Math.random() * 128;
    const gy = Math.random() * 128;
    const v = 110 + Math.floor(Math.random() * 36);
    lCtx.fillStyle = `rgb(${v},${v},${v})`;
    lCtx.fillRect(gx, gy, 1.5, 1.5);
  }
  lCtx.strokeStyle = "rgba(60,60,60,0.45)";
  lCtx.lineWidth = 1.2;
  for (let sx = 24; sx < 128; sx += 26) {
    lCtx.beginPath();
    lCtx.moveTo(sx, 8);
    lCtx.lineTo(sx, 120);
    lCtx.stroke();
  }
  const leatherBumpTex = new THREE.CanvasTexture(leatherCanvas);
  leatherBumpTex.wrapS = THREE.RepeatWrapping;
  leatherBumpTex.wrapT = THREE.RepeatWrapping;
  leatherBumpTex.repeat.set(2, 2);

  // 4. Warm Golden Neon DRL Bloom Halo (32x128)
  const drlGlowCanvas = document.createElement("canvas");
  drlGlowCanvas.width = 32;
  drlGlowCanvas.height = 128;
  const drlCtx = drlGlowCanvas.getContext("2d")!;
  const drlGrad = drlCtx.createLinearGradient(0, 0, 0, 128);
  drlGrad.addColorStop(0.0, "rgba(212, 145, 42, 0.0)");
  drlGrad.addColorStop(0.18, "rgba(212, 145, 42, 0.08)");
  drlGrad.addColorStop(0.36, "rgba(235, 178, 72, 0.38)");
  drlGrad.addColorStop(0.5, "rgba(255, 224, 148, 0.92)");
  drlGrad.addColorStop(0.64, "rgba(235, 178, 72, 0.38)");
  drlGrad.addColorStop(0.82, "rgba(212, 145, 42, 0.08)");
  drlGrad.addColorStop(1.0, "rgba(212, 145, 42, 0.0)");
  drlCtx.fillStyle = drlGrad;
  drlCtx.fillRect(0, 0, 32, 128);
  const drlGlowTex = new THREE.CanvasTexture(drlGlowCanvas);
  drlGlowTex.colorSpace = THREE.SRGBColorSpace;

  // 5. Brushed/Fluted Bronze Metal Bump & Roughness Maps (128x128)
  const sconceBumpCanvas = document.createElement("canvas");
  sconceBumpCanvas.width = 128;
  sconceBumpCanvas.height = 128;
  const sbCtx = sconceBumpCanvas.getContext("2d")!;
  sbCtx.fillStyle = "#808080";
  sbCtx.fillRect(0, 0, 128, 128);

  const sconceRoughCanvas = document.createElement("canvas");
  sconceRoughCanvas.width = 128;
  sconceRoughCanvas.height = 128;
  const srCtx = sconceRoughCanvas.getContext("2d")!;
  srCtx.fillStyle = "#969696";
  srCtx.fillRect(0, 0, 128, 128);

  const fluteCount = 18;
  const fluteWidth = 128 / fluteCount;
  for (let f = 0; f < fluteCount; f++) {
    const fx = f * fluteWidth;
    const fluteGrad = sbCtx.createLinearGradient(fx, 0, fx + fluteWidth, 0);
    fluteGrad.addColorStop(0.0, "#4e4e4e");
    fluteGrad.addColorStop(0.45, "#cccccc");
    fluteGrad.addColorStop(0.55, "#cccccc");
    fluteGrad.addColorStop(1.0, "#4e4e4e");
    sbCtx.fillStyle = fluteGrad;
    sbCtx.fillRect(fx, 0, fluteWidth, 128);

    const roughGrad = srCtx.createLinearGradient(fx, 0, fx + fluteWidth, 0);
    roughGrad.addColorStop(0.0, "#bcbcbc");
    roughGrad.addColorStop(0.5, "#6c6c6c");
    roughGrad.addColorStop(1.0, "#bcbcbc");
    srCtx.fillStyle = roughGrad;
    srCtx.fillRect(fx, 0, fluteWidth, 128);
  }
  for (let y = 0; y < 128; y += 2) {
    const alpha = 0.05 + Math.random() * 0.08;
    sbCtx.fillStyle =
      Math.random() > 0.5
        ? `rgba(255,255,255,${alpha})`
        : `rgba(0,0,0,${alpha})`;
    sbCtx.fillRect(0, y, 128, 1);
    srCtx.fillStyle =
      Math.random() > 0.5
        ? `rgba(255,255,255,${alpha})`
        : `rgba(0,0,0,${alpha})`;
    srCtx.fillRect(0, y, 128, 1);
  }
  for (let i = 0; i < 220; i++) {
    const sx = Math.random() * 128;
    const sy = Math.random() * 128;
    srCtx.fillStyle =
      Math.random() > 0.5 ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.12)";
    srCtx.fillRect(sx, sy, 1.5, 1.5);
  }

  const sconceMetalBumpTex = new THREE.CanvasTexture(sconceBumpCanvas);
  sconceMetalBumpTex.wrapS = THREE.RepeatWrapping;
  sconceMetalBumpTex.wrapT = THREE.RepeatWrapping;

  const sconceMetalRoughTex = new THREE.CanvasTexture(sconceRoughCanvas);
  sconceMetalRoughTex.wrapS = THREE.RepeatWrapping;
  sconceMetalRoughTex.wrapT = THREE.RepeatWrapping;

  // 6. Ribbed Prismatic Frosted Diffuser Glass (64x64)
  const glassCanvas = document.createElement("canvas");
  glassCanvas.width = 64;
  glassCanvas.height = 64;
  const gCtx = glassCanvas.getContext("2d")!;
  gCtx.fillStyle = "#c8b8a4";
  gCtx.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 16; i++) {
    const gx = i * 4;
    const rib = gCtx.createLinearGradient(gx, 0, gx + 4, 0);
    rib.addColorStop(0.0, "#706558");
    rib.addColorStop(0.5, "#fff4df");
    rib.addColorStop(1.0, "#706558");
    gCtx.fillStyle = rib;
    gCtx.fillRect(gx, 0, 4, 64);
  }
  const sconceGlassTex = new THREE.CanvasTexture(glassCanvas);
  sconceGlassTex.colorSpace = THREE.SRGBColorSpace;
  sconceGlassTex.wrapS = THREE.RepeatWrapping;
  sconceGlassTex.wrapT = THREE.RepeatWrapping;

  // 7. Per-Pixel Photometric Double-Fan Sconce Light Wash Texture (256x256 — 4x faster, bilinear filtered)
  const coneCanvas = document.createElement("canvas");
  coneCanvas.width = 256;
  coneCanvas.height = 256;
  const coneCtx = coneCanvas.getContext("2d")!;
  const coneImageData = coneCtx.createImageData(256, 256);
  const cData = coneImageData.data;

  for (let py = 0; py < 256; py++) {
    const edgeY = smoothstep(0, 14, py) * smoothstep(0, 14, 255 - py);
    for (let px = 0; px < 256; px++) {
      const edgeX = smoothstep(0, 14, px) * smoothstep(0, 14, 255 - px);
      const edgeFade = edgeX * edgeY;

      let upEnergy = 0;
      let upU = 0;
      if (py < 108) {
        const dy = 108 - py;
        const absDx = Math.max(0, Math.abs(px - 128) - 9);
        const r = Math.hypot(absDx * 0.88, dy);
        upU = clamp01(r / 96);
        const distAtten = Math.pow(1 - upU, 2.25) / (1 + upU * upU * 3.4);
        const ang = Math.atan2(absDx, dy + 8);
        const coneMask = Math.pow(
          1 - smoothstep(0.14, 0.62 + upU * 0.24, ang),
          1.35
        );
        const rawCaustic =
          0.5 +
          0.5 * (0.65 * Math.cos(ang * 24) + 0.35 * Math.cos(ang * 40 + 0.9));
        const causticStrength =
          0.28 * Math.pow(1 - upU, 1.45) * smoothstep(0.01, 0.08, upU);
        const causticMod =
          1 - causticStrength * 0.5 + causticStrength * rawCaustic;
        upEnergy = distAtten * coneMask * causticMod * smoothstep(0, 3, dy);
      }

      let downEnergy = 0;
      let downU = 0;
      if (py > 112) {
        const dy = py - 112;
        const absDx = Math.max(0, Math.abs(px - 128) - 9);
        const r = Math.hypot(absDx * 0.8, dy);
        downU = clamp01(r / 129);
        const distAtten = Math.pow(1 - downU, 2.05) / (1 + downU * downU * 2.9);
        const ang = Math.atan2(absDx, dy + 9);
        const coneMask = Math.pow(
          1 - smoothstep(0.18, 0.72 + downU * 0.28, ang),
          1.35
        );
        const rawCaustic =
          0.5 +
          0.5 * (0.65 * Math.cos(ang * 26) + 0.35 * Math.cos(ang * 44 + 1.2));
        const causticStrength =
          0.28 * Math.pow(1 - downU, 1.45) * smoothstep(0.01, 0.08, downU);
        const causticMod =
          1 - causticStrength * 0.5 + causticStrength * rawCaustic;
        downEnergy =
          distAtten * coneMask * causticMod * smoothstep(0, 3, dy);
      }

      const rFix = Math.hypot((px - 128) * 0.75, py - 110);
      const localHalo = 0.22 * Math.exp(-(rFix * rFix) / (2 * 12 * 12));

      const hash = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
      const grain = hash - Math.floor(hash);
      const grainMod = 0.94 + grain * 0.12;

      const totalRaw = upEnergy + downEnergy + localHalo;
      const energy = clamp01(totalRaw * edgeFade * grainMod);
      const tempU =
        totalRaw > 1e-5
          ? clamp01((upEnergy * upU + downEnergy * downU) / totalRaw)
          : 0;

      const idx = (py * 256 + px) * 4;
      cData[idx] = Math.round(255 + (223 - 255) * tempU);
      cData[idx + 1] = Math.round(234 + (118 - 234) * tempU);
      cData[idx + 2] = Math.round(192 + (68 - 192) * tempU);
      cData[idx + 3] = Math.round(clamp01(energy * 0.96) * 255);
    }
  }
  coneCtx.putImageData(coneImageData, 0, 0);

  const sconceConeTex = new THREE.CanvasTexture(coneCanvas);
  sconceConeTex.colorSpace = THREE.SRGBColorSpace;

  // 8. Per-Pixel Photometric SpotLight Gobo Texture (128x128)
  const goboCanvas = document.createElement("canvas");
  goboCanvas.width = 128;
  goboCanvas.height = 128;
  const goboCtx = goboCanvas.getContext("2d")!;
  const goboImageData = goboCtx.createImageData(128, 128);
  const gbData = goboImageData.data;

  for (let py = 0; py < 128; py++) {
    const dy = py - 63.5;
    for (let px = 0; px < 128; px++) {
      const dx = px - 63.5;
      const u = clamp01(Math.hypot(dx, dy) / 61);
      const base = Math.pow(1 - u, 2.0) / (1 + u * u * 1.8);
      const theta = Math.atan2(dy, dx);
      const flute =
        1 -
        0.18 * (1 - u) +
        0.18 * (1 - u) * (0.5 + 0.5 * Math.cos(theta * 18));
      const rimEnv = 1 - smoothstep(0.78, 1.0, u);
      const val = clamp01(base * flute * rimEnv);

      const idx = (py * 128 + px) * 4;
      gbData[idx] = Math.round((255 + (225 - 255) * u) * val);
      gbData[idx + 1] = Math.round((234 + (140 - 234) * u) * val);
      gbData[idx + 2] = Math.round((192 + (78 - 192) * u) * val);
      gbData[idx + 3] = 255;
    }
  }
  goboCtx.putImageData(goboImageData, 0, 0);

  const sconceGoboTex = new THREE.CanvasTexture(goboCanvas);
  sconceGoboTex.colorSpace = THREE.SRGBColorSpace;

  cachedProceduralTextures = {
    carpetColorTex,
    carpetBumpTex,
    wallBumpTex,
    leatherBumpTex,
    drlGlowTex,
    sconceMetalBumpTex,
    sconceMetalRoughTex,
    sconceGlassTex,
    sconceConeTex,
    sconceGoboTex,
  };
  return cachedProceduralTextures;
}

interface ThreeCinemaSimulatorProps {
  venue?: KarachiVenue;
  selectedMovie: MovieItem;
  selectedSeats: string[];
  activeSeat: string;
  cameraMode: "pov" | "overview";
  lightingMode: "dimmed" | "house";
  audienceVisible: boolean;
  screenMode: "movie" | "pattern";
  reclineAngle: number;
  laserConeVisible: boolean;
  resetTrigger: number;
  takenSeatFlashTrigger?: number;
  trailerMuted?: boolean;
  showHelperTooltip?: boolean;
  onSelectSeat: (seatId: string) => void;
}

export const ThreeCinemaSimulator: React.FC<ThreeCinemaSimulatorProps> = ({
  venue,
  selectedMovie,
  selectedSeats,
  activeSeat,
  cameraMode,
  lightingMode,
  audienceVisible,
  screenMode,
  reclineAngle,
  laserConeVisible,
  resetTrigger,
  takenSeatFlashTrigger = 0,
  trailerMuted = true,
  showHelperTooltip = true,
  onSelectSeat,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep latest props in refs so the animation loop & event handlers always read current state
  const stateRef = useRef({
    venue,
    selectedMovie,
    selectedSeats,
    activeSeat,
    cameraMode,
    lightingMode,
    audienceVisible,
    screenMode,
    reclineAngle,
    laserConeVisible,
    trailerMuted,
    lookPitch: 0,
    lookYaw: 0,
    overviewYaw: 0,
    overviewPitch: 0,
  });

  const onSelectSeatRef = useRef(onSelectSeat);
  useEffect(() => {
    onSelectSeatRef.current = onSelectSeat;
  }, [onSelectSeat]);

  // Update refs and trigger 3D scene updates when props change
  const updateSceneRef = useRef<(() => void) | null>(null);
  const triggerTakenFlashRef = useRef<(() => void) | null>(null);
  const syncTrailerAudioRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (takenSeatFlashTrigger && takenSeatFlashTrigger > 0) {
      triggerTakenFlashRef.current?.();
    }
  }, [takenSeatFlashTrigger]);

  useEffect(() => {
    stateRef.current.trailerMuted = trailerMuted;
    syncTrailerAudioRef.current?.();
  }, [trailerMuted]);

  useEffect(() => {
    stateRef.current.venue = venue;
    stateRef.current.selectedMovie = selectedMovie;
    stateRef.current.selectedSeats = selectedSeats;
    stateRef.current.activeSeat = activeSeat;
    stateRef.current.cameraMode = cameraMode;
    stateRef.current.lightingMode = lightingMode;
    stateRef.current.audienceVisible = audienceVisible;
    stateRef.current.screenMode = screenMode;
    stateRef.current.reclineAngle = reclineAngle;
    stateRef.current.laserConeVisible = laserConeVisible;
    stateRef.current.trailerMuted = trailerMuted;

    if (updateSceneRef.current) {
      updateSceneRef.current();
    }
  }, [
    venue,
    selectedMovie,
    selectedSeats,
    activeSeat,
    cameraMode,
    lightingMode,
    audienceVisible,
    screenMode,
    reclineAngle,
    laserConeVisible,
    trailerMuted,
  ]);

  useEffect(() => {
    stateRef.current.lookPitch = 0;
    stateRef.current.lookYaw = 0;
    stateRef.current.overviewYaw = 0;
    stateRef.current.overviewPitch = 0;
    if (updateSceneRef.current) {
      updateSceneRef.current();
    }
  }, [resetTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      carpetColorTex,
      carpetBumpTex,
      wallBumpTex,
      leatherBumpTex,
      drlGlowTex,
      sconceMetalBumpTex,
      sconceMetalRoughTex,
      sconceGlassTex,
      sconceConeTex,
      sconceGoboTex,
    } = getCinemaProceduralTextures();

    // --- Dynamic Screen Physical Dimensions ---
    const currentVenue = venue;
    const scrW = Math.min(currentVenue?.screenWidthMeters || SCREEN_WIDTH, 23.6);
    const scrH = currentVenue?.screenHeightMeters || SCREEN_HEIGHT;
    const scrElev = Math.max(
      1.9,
      currentVenue?.screenElevationMeters ?? SCREEN_ELEVATION
    );
    const isVenueIMAX = currentVenue ? currentVenue.isIMAX : true;

    // --- On-Demand Static Sightline Calibration Pattern Texture (drawn ONLY if screenMode === "pattern") ---
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 1024;
    patternCanvas.height = 512;
    const patternCtx = patternCanvas.getContext("2d")!;
    const patternTexture = new THREE.CanvasTexture(patternCanvas);
    patternTexture.colorSpace = THREE.SRGBColorSpace;
    patternTexture.generateMipmaps = true;
    patternTexture.minFilter = THREE.LinearMipmapLinearFilter;
    let lastPatternKey = "";

    function renderCalibrationPattern() {
      const st = stateRef.current;
      const key = `${st.selectedMovie.id}:${currentVenue?.id ?? ""}`;
      if (lastPatternKey === key) return;
      lastPatternKey = key;

      patternCtx.fillStyle = "#050b14";
      patternCtx.fillRect(0, 0, 1024, 512);

      patternCtx.strokeStyle = isVenueIMAX ? "#0ea5e9" : "#10b981";
      patternCtx.lineWidth = 1;
      for (let gx = 64; gx < 1024; gx += 64) {
        patternCtx.beginPath();
        patternCtx.moveTo(gx, 0);
        patternCtx.lineTo(gx, 512);
        patternCtx.stroke();
      }
      for (let gy = 64; gy < 512; gy += 64) {
        patternCtx.beginPath();
        patternCtx.moveTo(0, gy);
        patternCtx.lineTo(1024, gy);
        patternCtx.stroke();
      }

      patternCtx.strokeStyle = isVenueIMAX ? "#0284c7" : "#059669";
      patternCtx.lineWidth = 4;
      patternCtx.strokeRect(40, 40, 944, 432);

      patternCtx.beginPath();
      patternCtx.arc(512, 256, 95, 0, Math.PI * 2);
      patternCtx.stroke();

      patternCtx.font = "bold 26px sans-serif";
      patternCtx.fillStyle = isVenueIMAX ? "#38bdf8" : "#34d399";
      patternCtx.textAlign = "center";
      patternCtx.fillText(
        isVenueIMAX
          ? "IMAX LASER ALIGNMENT & SIGHTLINE PATTERN"
          : "DCI 4K DIGITAL CINEMA SIGHTLINE PATTERN",
        512,
        235
      );
      patternCtx.font = "16px monospace";
      patternCtx.fillStyle = "#94a3b8";
      patternCtx.fillText(
        `${currentVenue ? currentVenue.name.toUpperCase() : "CINEMA"} • ${currentVenue ? currentVenue.screenSpecs.toUpperCase() : "STANDARD AUDITORIUM"}`,
        512,
        265
      );
      patternCtx.fillText(
        `CALIBRATED FOR: ${st.selectedMovie.title.toUpperCase()}`,
        512,
        292
      );

      patternTexture.needsUpdate = true;
    }

    // --- Static Pre-Show & Interval Presentation Slate (1024x512, rendered on-demand only) ---
    const slateCanvas = document.createElement("canvas");
    slateCanvas.width = 1024;
    slateCanvas.height = 512;
    const slateCtx = slateCanvas.getContext("2d")!;
    const slateTexture = new THREE.CanvasTexture(slateCanvas);
    slateTexture.colorSpace = THREE.SRGBColorSpace;
    slateTexture.generateMipmaps = true;
    slateTexture.minFilter = THREE.LinearMipmapLinearFilter;
    let lastSlateKey = "";

    function renderTheaterSlate(mode: "preshow" | "interval") {
      const st = stateRef.current;
      const key = `${mode}:${st.selectedMovie.id}:${currentVenue?.id ?? ""}`;
      if (lastSlateKey === key) return;
      lastSlateKey = key;

      slateCtx.fillStyle = "#080605";
      slateCtx.fillRect(0, 0, 1024, 512);

      const radialBg = slateCtx.createRadialGradient(
        512,
        256,
        35,
        512,
        256,
        560
      );
      radialBg.addColorStop(0.0, "#1d1711");
      radialBg.addColorStop(0.55, "#0d0a08");
      radialBg.addColorStop(1.0, "#050404");
      slateCtx.fillStyle = radialBg;
      slateCtx.fillRect(0, 0, 1024, 512);

      // Art-Deco Champagne & Gold Double Borders
      slateCtx.strokeStyle = "rgba(234, 224, 200, 0.24)";
      slateCtx.lineWidth = 1.5;
      slateCtx.strokeRect(46, 38, 932, 436);

      slateCtx.strokeStyle = "rgba(212, 175, 55, 0.45)";
      slateCtx.lineWidth = 1;
      slateCtx.strokeRect(56, 48, 912, 416);

      const venueTitle = currentVenue
        ? currentVenue.name.toUpperCase()
        : "AETHERIA CINEDOME";
      const hallTitle = currentVenue
        ? currentVenue.hallName.toUpperCase()
        : "FLAGSHIP AUDITORIUM";

      slateCtx.textAlign = "center";
      slateCtx.textBaseline = "alphabetic";
      slateCtx.font = '600 13px "JetBrains Mono", monospace';
      slateCtx.fillStyle = "rgba(234, 224, 200, 0.78)";
      slateCtx.fillText(`${venueTitle}   •   ${hallTitle}`, 512, 128);

      // Upper Gold Divider + Center Diamond Ornament
      slateCtx.strokeStyle = "rgba(212, 175, 55, 0.48)";
      slateCtx.lineWidth = 1;
      slateCtx.beginPath();
      slateCtx.moveTo(310, 158);
      slateCtx.lineTo(494, 158);
      slateCtx.moveTo(530, 158);
      slateCtx.lineTo(714, 158);
      slateCtx.stroke();

      slateCtx.fillStyle = "#d4af37";
      slateCtx.beginPath();
      slateCtx.moveTo(512, 152);
      slateCtx.lineTo(518, 158);
      slateCtx.lineTo(512, 164);
      slateCtx.lineTo(506, 158);
      slateCtx.closePath();
      slateCtx.fill();

      // Monumental Display Headline
      slateCtx.save();
      slateCtx.shadowColor = "rgba(212, 175, 55, 0.34)";
      slateCtx.shadowBlur = 20;
      slateCtx.fillStyle = "#f4efe6";

      if (mode === "preshow") {
        const headline = st.selectedMovie.title.toUpperCase();
        let fontSize = 48;
        while (fontSize > 29) {
          slateCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
          if (slateCtx.measureText(headline).width <= 820) break;
          fontSize -= 2;
        }
        slateCtx.fillText(headline, 512, 248);
      } else {
        slateCtx.font =
          '800 64px "Plus Jakarta Sans", -apple-system, sans-serif';
        slateCtx.fillText("I N T E R V A L", 512, 254);
      }
      slateCtx.restore();

      // Lower Gold Divider
      slateCtx.strokeStyle = "rgba(212, 175, 55, 0.36)";
      slateCtx.lineWidth = 1;
      slateCtx.beginPath();
      slateCtx.moveTo(345, 294);
      slateCtx.lineTo(679, 294);
      slateCtx.stroke();

      // Subtitle
      slateCtx.font =
        '600 14px "Plus Jakarta Sans", -apple-system, sans-serif';
      slateCtx.fillStyle = "#eae0c8";
      if (mode === "preshow") {
        const specsLeft = currentVenue
          ? currentVenue.screenSpecs.toUpperCase()
          : "4K LASER PROJECTION";
        const specsRight = currentVenue
          ? currentVenue.soundSpecs.toUpperCase()
          : "DOLBY ATMOS";
        slateCtx.fillText(`${specsLeft}   •   ${specsRight}`, 512, 336);
      } else {
        slateCtx.fillText(
          `FEATURE PRESENTATION:  ${st.selectedMovie.title.toUpperCase()}`,
          512,
          336
        );
      }

      // Bottom Status Cue
      slateCtx.font = '500 11px "JetBrains Mono", monospace';
      slateCtx.fillStyle = "rgba(180, 180, 190, 0.85)";
      slateCtx.fillText(
        mode === "preshow"
          ? 'AUDITORIUM LIGHTS ILLUMINATED   •   CLICK "CLOSE LIGHTS" TO BEGIN SCREENING'
          : 'HOUSE LIGHTS ILLUMINATED   •   CLICK "CLOSE LIGHTS" TO RESUME',
        512,
        386
      );

      // Crisp Black Theatrical Letterbox Bars
      slateCtx.fillStyle = "#000000";
      slateCtx.fillRect(0, 0, 1024, 16);
      slateCtx.fillRect(0, 496, 1024, 16);

      slateTexture.needsUpdate = true;
    }

    // --- Three.js Dual-Layer Engine Setup (CSS3DRenderer 1080p Trailer + WebGL Alpha-Cutout Auditorium) ---
    const CSS_WORLD_SCALE = 85;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030407);
    scene.fog = new THREE.FogExp2(0x030407, 0.018);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 150);

    const cssScene = new THREE.Scene();
    const cssCamera = new THREE.PerspectiveCamera(
      54,
      width / height,
      8.5,
      12750
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.dataset.cinemaCss3d = "true";
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.inset = "0";
    cssRenderer.domElement.style.width = "100%";
    cssRenderer.domElement.style.height = "100%";
    cssRenderer.domElement.style.zIndex = "0";
    cssRenderer.domElement.style.pointerEvents = "none";
    cssRenderer.domElement.style.overflow = "hidden";
    cssRenderer.domElement.style.backgroundColor = "#030407";

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "1";
    renderer.domElement.style.display = "block";

    // Clear any previous canvas / CSS3D layer inside container (StrictMode-safe)
    const existingCssLayer = container.querySelector(
      '[data-cinema-css3d="true"]'
    );
    if (existingCssLayer) {
      container.removeChild(existingCssLayer);
    }
    const existingCanvas = container.querySelector("canvas");
    if (existingCanvas) {
      container.removeChild(existingCanvas);
    }
    container.appendChild(cssRenderer.domElement);
    container.appendChild(renderer.domElement);

    // Consolidated Cinema Auditorium Lighting (13 dynamic lights for high FPS + baked static shadows)
    const ambientLight = new THREE.AmbientLight(0x1e222e, 0.1);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffe6be, 0x181b24, 0.08);
    hemiLight.position.set(0, 18, 10);
    scene.add(hemiLight);

    // Overhead warm architectural directional fill with soft baked shadows for seats, armrests & stadium tiers
    const houseFillDirLight = new THREE.DirectionalLight(0xffe0b2, 0.0);
    houseFillDirLight.position.set(0, 14.2, 12.5);
    houseFillDirLight.target.position.set(0, 1.4, 10.5);
    houseFillDirLight.castShadow = true;
    houseFillDirLight.shadow.mapSize.set(1024, 1024);
    houseFillDirLight.shadow.camera.left = -14;
    houseFillDirLight.shadow.camera.right = 14;
    houseFillDirLight.shadow.camera.top = 15;
    houseFillDirLight.shadow.camera.bottom = -15;
    houseFillDirLight.shadow.camera.near = 1;
    houseFillDirLight.shadow.camera.far = 30;
    houseFillDirLight.shadow.bias = -0.0012;
    houseFillDirLight.shadow.normalBias = 0.03;
    houseFillDirLight.shadow.radius = 3;
    houseFillDirLight.visible = stateRef.current.lightingMode === "house";
    scene.add(houseFillDirLight);
    scene.add(houseFillDirLight.target);

    const screenProjectorGlow = new THREE.SpotLight(
      stateRef.current.selectedMovie.accentColor,
      1.35,
      42,
      Math.PI / 2.3,
      0.95,
      0.9
    );
    screenProjectorGlow.position.set(0, scrElev + scrH / 2, 0.8);
    screenProjectorGlow.target.position.set(0, 1.4, 10.5);
    scene.add(screenProjectorGlow);
    scene.add(screenProjectorGlow.target);

    // Soft forward screen bounce light for realistic top-rim highlights on dark leather headrests
    const screenRimLight = new THREE.DirectionalLight(0xd6d3cd, 0.38);
    screenRimLight.position.set(0, scrElev + scrH * 0.6, -1.5);
    screenRimLight.target.position.set(0, 1.0, 12.0);
    scene.add(screenRimLight);
    scene.add(screenRimLight.target);

    // Very subtle warm reflection near stage floor
    const screenRedGlow = new THREE.PointLight(0xd4af37, 0.25, 26, 0.9);
    screenRedGlow.position.set(0, scrElev + scrH * 0.45, 2.2);
    scene.add(screenRedGlow);

    // Consolidated warm house & wall sconce lights (strictly 0 when house lights are off)
    const houseLight = new THREE.PointLight(0xffedd5, 0.0, 58, 0.72);
    houseLight.position.set(0, 14.5, 11.0);
    scene.add(houseLight);

    const leftWallSconceLight = new THREE.PointLight(0xffca82, 0.0, 28, 1.15);
    leftWallSconceLight.position.set(-11.2, 5.15, 12.5);
    scene.add(leftWallSconceLight);

    const rightWallSconceLight = new THREE.PointLight(0xffca82, 0.0, 28, 1.15);
    rightWallSconceLight.position.set(11.2, 5.15, 12.5);
    scene.add(rightWallSconceLight);

    const rearWallSconceLight = new THREE.PointLight(0xffca82, 0.0, 24, 1.2);
    rearWallSconceLight.position.set(0, 5.05, 21.8);
    scene.add(rearWallSconceLight);

    // Always-on Golden Neon DRL grazing lights illuminating side carpet borders & lower walls throughout the screening
    const drlLeftLight = new THREE.PointLight(0xf2b749, 0.32, 24, 0.9);
    drlLeftLight.position.set(-11.4, 2.6, 10.5);
    drlLeftLight.castShadow = false;
    scene.add(drlLeftLight);

    const drlRightLight = new THREE.PointLight(0xf2b749, 0.32, 24, 0.9);
    drlRightLight.position.set(11.4, 2.6, 10.5);
    drlRightLight.castShadow = false;
    scene.add(drlRightLight);

    // --- DYNAMIC CINEMA SCREEN (FLAT PLANAR ALPHA-CUTOUT + LIVE CSS3D YOUTUBE TRAILER) ---
    const SCREEN_Z = 0.25;
    const screenCenterY = scrElev + scrH / 2;

    const screenGeom = new THREE.PlaneGeometry(scrW, scrH);

    // WebGL alpha-punchout material writes RGBA(0,0,0,0) in opaque depth pass so closer seats/silhouettes occlude cleanly
    const screenCutoutMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0,
      transparent: false,
      blending: THREE.NoBlending,
      fog: false,
      toneMapped: false,
      side: THREE.FrontSide,
    });

    const patternMat = new THREE.MeshBasicMaterial({
      map: patternTexture,
      fog: false,
      toneMapped: false,
      side: THREE.FrontSide,
    });

    const slateMat = new THREE.MeshBasicMaterial({
      map: slateTexture,
      color: new THREE.Color(1, 1, 1),
      fog: false,
      toneMapped: false,
      side: THREE.FrontSide,
    });

    const screenMesh = new THREE.Mesh(
      screenGeom,
      stateRef.current.screenMode === "pattern"
        ? patternMat
        : stateRef.current.lightingMode === "house"
        ? slateMat
        : screenCutoutMat
    );
    screenMesh.position.set(0, screenCenterY, SCREEN_Z);
    scene.add(screenMesh);

    // 4-Bar Velvet-Black Cinema Masking Frame overlapping screen edges cleanly by 0.02m
    const maskMat = new THREE.MeshBasicMaterial({
      color: 0x030407,
      fog: false,
      toneMapped: false,
    });
    const borderThickX = 0.55;
    const borderThickY = 0.36;
    const frameDepth = 0.14;
    const frameZ = SCREEN_Z + 0.02;

    const topMask = new THREE.Mesh(
      new THREE.BoxGeometry(scrW + borderThickX * 2, borderThickY, frameDepth),
      maskMat
    );
    topMask.position.set(0, scrElev + scrH + borderThickY / 2 - 0.02, frameZ);
    scene.add(topMask);

    const bottomMask = new THREE.Mesh(
      new THREE.BoxGeometry(scrW + borderThickX * 2, borderThickY, frameDepth),
      maskMat
    );
    bottomMask.position.set(0, scrElev - borderThickY / 2 + 0.02, frameZ);
    scene.add(bottomMask);

    const leftMask = new THREE.Mesh(
      new THREE.BoxGeometry(borderThickX, scrH + 0.04, frameDepth),
      maskMat
    );
    leftMask.position.set(
      -scrW / 2 - borderThickX / 2 + 0.02,
      screenCenterY,
      frameZ
    );
    scene.add(leftMask);

    const rightMask = new THREE.Mesh(
      new THREE.BoxGeometry(borderThickX, scrH + 0.04, frameDepth),
      maskMat
    );
    rightMask.position.set(
      scrW / 2 + borderThickX / 2 - 0.02,
      screenCenterY,
      frameZ
    );
    scene.add(rightMask);

    // Full HD (1920x1080) CSS3D YouTube Official Trailer Screen Object (zero lag + Pause-free startup curtain)
    const ytAspect = 16 / 9;
    const overscan = 1.16; // crops YouTube top title strip & bottom progress chrome cleanly behind the masking frame
    const iframeW = 1920;
    const iframeH = 1080;
    const screenAspect = scrW / scrH;
    let cssDivW: number;
    let cssDivH: number;
    if (screenAspect >= ytAspect) {
      cssDivW = Math.round(iframeW / overscan);
      cssDivH = Math.round(cssDivW / screenAspect);
    } else {
      cssDivH = Math.round(iframeH / overscan);
      cssDivW = Math.round(cssDivH * screenAspect);
    }

    const screenCssWrapper = document.createElement("div");
    screenCssWrapper.style.width = `${cssDivW}px`;
    screenCssWrapper.style.height = `${cssDivH}px`;
    screenCssWrapper.style.position = "relative";
    screenCssWrapper.style.overflow = "hidden";
    screenCssWrapper.style.background = "#050507";
    screenCssWrapper.style.pointerEvents = "none";
    screenCssWrapper.style.backfaceVisibility = "hidden";

    // Omit playlist= so YouTube never renders Next/Prev buttons on the startup HUD
    const getTrailerEmbedUrl = (videoId: string) => {
      const originParam =
        typeof window !== "undefined" && window.location.origin
          ? `&origin=${encodeURIComponent(window.location.origin)}`
          : "";
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none&hl=en&disablekb=1&fs=0&vq=hd1080&enablejsapi=1${originParam}`;
    };

    const cssScreenObj = new CSS3DObject(screenCssWrapper);
    cssScreenObj.position.set(
      0,
      screenCenterY * CSS_WORLD_SCALE,
      SCREEN_Z * CSS_WORLD_SCALE
    );
    const cssScale = (scrW * CSS_WORLD_SCALE) / cssDivW;
    cssScreenObj.scale.set(cssScale, cssScale, 1);
    cssScreenObj.visible =
      stateRef.current.screenMode !== "pattern" &&
      stateRef.current.lightingMode === "dimmed";
    cssScene.add(cssScreenObj);

    let hasStartedScreening = stateRef.current.lightingMode === "dimmed";
    let prevLightingMode = stateRef.current.lightingMode;
    let trailerIframe: HTMLIFrameElement | null = null;
    let loadedVideoId = "";
    let curtainRevealTimer: number | null = null;
    let curtainFallbackTimer: number | null = null;
    let curtainPollInterval: number | null = null;
    let handshakeTimers: number[] = [];
    let isAwaitingPlaybackReveal = false;
    let lastPlayerTime = 0;
    let revealTargetTime = 3.5;
    let playingSinceMs: number | null = null;

    const sendYoutubeCommand = (func: string, args: unknown = "") => {
      if (!trailerIframe?.contentWindow) return;
      trailerIframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    };

    const requestMaxYoutubeQuality = () => {
      sendYoutubeCommand("setPlaybackQuality", ["hd1080"]);
      sendYoutubeCommand("setPlaybackQualityRange", ["hd1080", "hd1440"]);
    };

    const disableYoutubeCaptions = () => {
      sendYoutubeCommand("unloadModule", ["captions"]);
      sendYoutubeCommand("unloadModule", ["cc"]);
      sendYoutubeCommand("setOption", ["captions", "track", {}]);
      sendYoutubeCommand("setOption", ["cc", "track", {}]);
    };

    const postTrailerAudioState = () => {
      sendYoutubeCommand(stateRef.current.trailerMuted ? "mute" : "unMute");
    };
    syncTrailerAudioRef.current = postTrailerAudioState;

    const clearHandshakeTimers = () => {
      for (let i = 0; i < handshakeTimers.length; i++) {
        window.clearTimeout(handshakeTimers[i]);
      }
      handshakeTimers = [];
    };

    const clearCurtainTimers = () => {
      if (curtainRevealTimer !== null) {
        window.clearTimeout(curtainRevealTimer);
        curtainRevealTimer = null;
      }
      if (curtainFallbackTimer !== null) {
        window.clearTimeout(curtainFallbackTimer);
        curtainFallbackTimer = null;
      }
      if (curtainPollInterval !== null) {
        window.clearInterval(curtainPollInterval);
        curtainPollInterval = null;
      }
    };

    const hideTrailerCurtainImmediate = () => {
      clearCurtainTimers();
      isAwaitingPlaybackReveal = false;
      playingSinceMs = null;
      if (trailerIframe) {
        trailerIframe.style.transition = "opacity 220ms ease-out";
        trailerIframe.style.opacity = "0";
      }
    };

    const revealTrailerCurtain = () => {
      clearCurtainTimers();
      isAwaitingPlaybackReveal = false;
      if (
        !trailerIframe ||
        stateRef.current.lightingMode !== "dimmed" ||
        stateRef.current.screenMode !== "movie"
      ) {
        return;
      }
      trailerIframe.style.transition =
        "opacity 850ms cubic-bezier(0.22, 1, 0.36, 1)";
      trailerIframe.style.opacity = "1";
    };

    const maybeRevealCurtain = () => {
      if (
        !isAwaitingPlaybackReveal ||
        stateRef.current.lightingMode !== "dimmed" ||
        stateRef.current.screenMode !== "movie"
      ) {
        return;
      }
      const elapsedPlayingMs =
        playingSinceMs !== null ? performance.now() - playingSinceMs : 0;
      if (lastPlayerTime >= revealTargetTime || elapsedPlayingMs >= 3600) {
        revealTrailerCurtain();
      }
    };

    const armCurtainReveal = (targetTime: number, fallbackMs: number) => {
      clearCurtainTimers();
      revealTargetTime = targetTime;
      playingSinceMs = null;
      isAwaitingPlaybackReveal = true;
      if (trailerIframe) {
        trailerIframe.style.transition = "opacity 220ms ease-out";
        trailerIframe.style.opacity = "0";
      }
      curtainPollInterval = window.setInterval(maybeRevealCurtain, 200);
      curtainFallbackTimer = window.setTimeout(
        revealTrailerCurtain,
        fallbackMs
      );
    };

    const scheduleHandshakes = () => {
      clearHandshakeTimers();
      const sendHandshake = () => {
        if (!trailerIframe?.contentWindow) return;
        trailerIframe.contentWindow.postMessage(
          JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
          "*"
        );
        sendYoutubeCommand("addEventListener", ["onStateChange"]);
        requestMaxYoutubeQuality();
        disableYoutubeCaptions();
        postTrailerAudioState();
      };
      sendHandshake();
      handshakeTimers.push(window.setTimeout(sendHandshake, 400));
      handshakeTimers.push(window.setTimeout(sendHandshake, 950));
    };

    const ensureTrailerPlaying = (videoId: string) => {
      if (!trailerIframe) {
        lastPlayerTime = 0;
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.top = "50%";
        iframe.style.left = "50%";
        iframe.style.transform = "translate(-50%, -50%)";
        iframe.style.width = `${iframeW}px`;
        iframe.style.height = `${iframeH}px`;
        iframe.style.border = "0";
        iframe.style.pointerEvents = "none";
        iframe.style.opacity = "0";
        iframe.loading = "eager";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.title = "Official Movie Trailer";
        iframe.addEventListener("load", scheduleHandshakes);
        loadedVideoId = videoId;
        iframe.src = getTrailerEmbedUrl(videoId);
        screenCssWrapper.appendChild(iframe);
        trailerIframe = iframe;
        armCurtainReveal(3.5, 6500);
      } else if (loadedVideoId !== videoId) {
        hideTrailerCurtainImmediate();
        lastPlayerTime = 0;
        loadedVideoId = videoId;
        trailerIframe.src = getTrailerEmbedUrl(videoId);
        armCurtainReveal(3.5, 6500);
      } else {
        hideTrailerCurtainImmediate();
        requestMaxYoutubeQuality();
        disableYoutubeCaptions();
        postTrailerAudioState();
        sendYoutubeCommand("playVideo");
        armCurtainReveal(lastPlayerTime + 3.5, 5500);
      }
    };

    const onYoutubeMessage = (e: MessageEvent) => {
      if (typeof e.origin !== "string" || !e.origin.includes("youtube.com")) {
        return;
      }
      let payload: Record<string, unknown> | null = null;
      try {
        payload =
          typeof e.data === "string"
            ? (JSON.parse(e.data) as Record<string, unknown>)
            : (e.data as Record<string, unknown>);
      } catch {
        return;
      }
      if (!payload || typeof payload !== "object") return;

      let playerState: number | undefined;
      if (payload.event === "onStateChange" && typeof payload.info === "number") {
        playerState = payload.info;
      } else if (
        payload.event === "infoDelivery" &&
        payload.info &&
        typeof payload.info === "object"
      ) {
        const infoObj = payload.info as Record<string, unknown>;
        if (typeof infoObj.currentTime === "number") {
          lastPlayerTime = infoObj.currentTime;
        }
        if (typeof infoObj.playerState === "number") {
          playerState = infoObj.playerState;
        }
      }

      if (playerState === 1) {
        if (playingSinceMs === null) {
          playingSinceMs = performance.now();
        }
        requestMaxYoutubeQuality();
        disableYoutubeCaptions();
        maybeRevealCurtain();
      } else if (isAwaitingPlaybackReveal) {
        maybeRevealCurtain();
      }

      if (
        playerState === 0 &&
        stateRef.current.lightingMode === "dimmed" &&
        stateRef.current.screenMode === "movie"
      ) {
        hideTrailerCurtainImmediate();
        lastPlayerTime = 0;
        sendYoutubeCommand("seekTo", [0, true]);
        sendYoutubeCommand("playVideo");
        armCurtainReveal(3.5, 5500);
      }
    };
    window.addEventListener("message", onYoutubeMessage);

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: carpetColorTex,
      bumpMap: carpetBumpTex,
      bumpScale: 0.015,
      roughness: 0.94,
      metalness: 0.02,
    });

    // --- Sculpted Two-Tier Raised Proscenium Stage Platform & Under-Screen Acoustic Plinth ---
    const stageFasciaMat = new THREE.MeshStandardMaterial({
      color: 0x1a0c0f,
      roughness: 0.58,
      metalness: 0.18,
    });
    const stagePlinthMat = new THREE.MeshStandardMaterial({
      color: 0x12090c,
      roughness: 0.72,
      metalness: 0.12,
    });
    const stageSubGrilleMat = new THREE.MeshStandardMaterial({
      color: 0x080709,
      roughness: 0.92,
      metalness: 0.08,
    });
    const stageBrassMat = new THREE.MeshStandardMaterial({
      color: 0x8f6f3e,
      roughness: 0.32,
      metalness: 0.82,
    });

    // Tier 1: Lower Stepped Stage Apron (y = 0 -> 0.42, z = 3.05 -> 3.85)
    const stageStepDeck = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.42, 0.8),
      floorMat
    );
    stageStepDeck.position.set(0, 0.21, 3.45);
    stageStepDeck.receiveShadow = true;
    scene.add(stageStepDeck);

    const stageStepFascia = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.38, 0.04),
      stageFasciaMat
    );
    stageStepFascia.position.set(0, 0.19, 3.855);
    stageStepFascia.receiveShadow = true;
    scene.add(stageStepFascia);

    const stageStepLip = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.036, 0.06),
      stageBrassMat
    );
    stageStepLip.position.set(0, 0.415, 3.86);
    scene.add(stageStepLip);

    // Tier 2: Main Raised Proscenium Stage Platform (y = 0 -> 0.98, z = -0.80 -> 3.05)
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.98, 3.85),
      floorMat
    );
    stage.position.set(0, 0.49, 1.125);
    stage.receiveShadow = true;
    scene.add(stage);

    const stageFascia = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.54, 0.06),
      stageFasciaMat
    );
    stageFascia.position.set(0, 0.7, 3.06);
    stageFascia.receiveShadow = true;
    scene.add(stageFascia);

    const pilasterGeom = new THREE.BoxGeometry(0.14, 0.54, 0.08);
    [-10.5, -7.0, -3.5, 0, 3.5, 7.0, 10.5].forEach((px) => {
      const pilaster = new THREE.Mesh(pilasterGeom, stageBrassMat);
      pilaster.position.set(px, 0.7, 3.07);
      scene.add(pilaster);
    });

    const stageTrim = new THREE.Mesh(
      new THREE.BoxGeometry(25.0, 0.05, 0.09),
      stageBrassMat
    );
    stageTrim.position.set(0, 0.965, 3.07);
    stageTrim.receiveShadow = true;
    scene.add(stageTrim);

    // Tier 3: Under-Screen Acoustic Sub-Stage Plinth connecting main stage deck directly to bottom masking bar
    const plinthTopY = scrElev - borderThickY + 0.02;
    const plinthH = Math.max(0.28, plinthTopY - 0.98);
    const plinthW = scrW + borderThickX * 2;
    const screenPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(plinthW, plinthH, 0.56),
      stagePlinthMat
    );
    screenPlinth.position.set(0, 0.98 + plinthH / 2, SCREEN_Z + 0.24);
    screenPlinth.receiveShadow = true;
    scene.add(screenPlinth);

    const plinthCornice = new THREE.Mesh(
      new THREE.BoxGeometry(plinthW + 0.06, 0.04, 0.6),
      stageBrassMat
    );
    plinthCornice.position.set(0, plinthTopY - 0.01, SCREEN_Z + 0.25);
    scene.add(plinthCornice);

    const subGrilleGeom = new THREE.BoxGeometry(
      Math.min(3.4, scrW * 0.2),
      Math.max(0.16, plinthH - 0.14),
      0.03
    );
    [-scrW * 0.28, 0, scrW * 0.28].forEach((gx) => {
      const subGrille = new THREE.Mesh(subGrilleGeom, stageSubGrilleMat);
      subGrille.position.set(gx, 0.98 + plinthH / 2, SCREEN_Z + 0.53);
      subGrille.receiveShadow = true;
      scene.add(subGrille);
    });

    // Continuous full-width front velvet carpet floor plane
    const mainCarpetFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      floorMat
    );
    mainCarpetFloor.rotation.x = -Math.PI / 2;
    mainCarpetFloor.position.set(0, 0.01, 11);
    mainCarpetFloor.receiveShadow = true;
    scene.add(mainCarpetFloor);

    // --- Tiered Stadium Risers & Always-On Pinpoint Golden Aisle LEDs ---
    const riserTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1b0b0e,
      roughness: 0.6,
      metalness: 0.25,
    });

    const stepLightMat = new THREE.MeshBasicMaterial({
      color: 0xfad782,
      transparent: true,
      opacity: 0.78,
    });

    ROWS.forEach((row) => {
      const rowInfo = ROW_METRICS[row];
      const tierWidth = 24;
      const tierDepth = 2.0;
      const tierHeight = rowInfo.y;

      const riserMesh = new THREE.Mesh(
        new THREE.BoxGeometry(tierWidth, tierHeight, tierDepth),
        floorMat
      );
      riserMesh.position.set(0, tierHeight / 2, rowInfo.z);
      riserMesh.receiveShadow = true;
      scene.add(riserMesh);

      // Subtle dark mahogany-charcoal riser nosing strip across each stadium tier
      const riserEdge = new THREE.Mesh(
        new THREE.BoxGeometry(tierWidth, 0.04, 0.05),
        riserTrimMat
      );
      riserEdge.position.set(0, tierHeight - 0.01, rowInfo.z - tierDepth / 2 + 0.02);
      riserEdge.receiveShadow = true;
      scene.add(riserEdge);

      // Pinpoint golden-amber aisle DRL LED pairs flanking left & right seat aisles
      [-2.95, 2.95].forEach((aisleX) => {
        const stepLight = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.022, 0.024),
          stepLightMat
        );
        stepLight.position.set(
          aisleX,
          tierHeight + 0.014,
          rowInfo.z - tierDepth / 2 + 0.08
        );
        scene.add(stepLight);
      });
    });

    const ceilingY = Math.max(15.2, scrElev + scrH + 1.2);
    const hallHeight = Math.max(18, ceilingY + 0.5);
    houseFillDirLight.position.y = ceilingY - 0.8;

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x3a141b, // deep matte burgundy-plum acoustic walls matching reference photo
      roughness: 0.93,
      metalness: 0.02,
      bumpMap: wallBumpTex,
      bumpScale: 0.008,
    });
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, hallHeight, 30),
      wallMat
    );
    leftWall.position.set(-13, hallHeight / 2, 10);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, hallHeight, 30),
      wallMat
    );
    rightWall.position.set(13, hallHeight / 2, 10);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // --- Always-On Golden Neon DRL Strips (Run Continuously Throughout Movie & Open Lights Mode) ---
    const drlChannelMat = new THREE.MeshStandardMaterial({
      color: 0x16110e,
      metalness: 0.72,
      roughness: 0.42,
    });
    const goldDrlCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfad782,
    });
    const goldDrlHaloMat = new THREE.MeshBasicMaterial({
      map: drlGlowTex,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const addWallDrlSegment = (
      side: -1 | 1,
      zStart: number,
      yStart: number,
      zEnd: number,
      yEnd: number,
      coreThickness = 0.045,
      haloHeight = 0.56
    ) => {
      const dz = zEnd - zStart;
      const dy = yEnd - yStart;
      const segLen = Math.hypot(dz, dy);
      const group = new THREE.Group();
      group.position.set(side * 12.45, (yStart + yEnd) / 2, (zStart + zEnd) / 2);
      group.rotation.x = -Math.atan2(dy, dz);

      const channelMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, coreThickness * 1.8, segLen),
        drlChannelMat
      );
      channelMesh.position.x = side * 0.02;
      group.add(channelMesh);

      const coreMesh = new THREE.Mesh(
        new THREE.BoxGeometry(coreThickness, coreThickness, segLen),
        goldDrlCoreMat
      );
      group.add(coreMesh);

      const haloPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(segLen, haloHeight),
        goldDrlHaloMat
      );
      haloPlane.position.x = side * 0.025;
      haloPlane.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
      group.add(haloPlane);

      scene.add(group);
    };

    ([-1, 1] as const).forEach((side) => {
      // Lower stadium-following continuous golden DRL rail (clears 0.98m raised stage deck)
      addWallDrlSegment(side, -3.8, 1.06, 4.4, 1.06);
      addWallDrlSegment(side, 4.4, 1.06, 15.9, 3.88);
      addWallDrlSegment(side, 15.9, 3.88, 23.4, 3.88);
      // Upper architectural golden DRL accent rail
      addWallDrlSegment(side, -4.2, 8.85, 23.4, 8.85, 0.04, 0.48);
    });

    // Rear Upper Golden DRL Bridge across back wall
    const rearDrlChannel = new THREE.Mesh(
      new THREE.BoxGeometry(24.9, 0.072, 0.04),
      drlChannelMat
    );
    rearDrlChannel.position.set(0, 8.85, 23.47);
    scene.add(rearDrlChannel);

    const rearDrlCore = new THREE.Mesh(
      new THREE.BoxGeometry(24.9, 0.04, 0.04),
      goldDrlCoreMat
    );
    rearDrlCore.position.set(0, 8.85, 23.45);
    scene.add(rearDrlCore);

    const rearDrlHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(24.9, 0.48),
      goldDrlHaloMat
    );
    rearDrlHalo.position.set(0, 8.85, 23.475);
    rearDrlHalo.rotation.y = Math.PI;
    scene.add(rearDrlHalo);

    // Stage Apron Upper & Lower Toe-Kick Golden DRL Blades + soft carpet grazing bloom
    const stageDrlCore = new THREE.Mesh(
      new THREE.BoxGeometry(24.9, 0.032, 0.036),
      goldDrlCoreMat
    );
    stageDrlCore.position.set(0, 0.94, 3.11);
    scene.add(stageDrlCore);

    const stageToeDrlCore = new THREE.Mesh(
      new THREE.BoxGeometry(24.9, 0.024, 0.028),
      goldDrlCoreMat
    );
    stageToeDrlCore.position.set(0, 0.06, 3.88);
    scene.add(stageToeDrlCore);

    const stageDrlFloorHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(24.9, 0.34),
      goldDrlHaloMat
    );
    stageDrlFloorHalo.position.set(0, 0.025, 4.02);
    stageDrlFloorHalo.rotation.x = -Math.PI / 2;
    scene.add(stageDrlFloorHalo);

    // --- Architectural Textured Sconces, Photometric Wall Cones & Consolidated Wall Lighting ---
    const sconceConeMat = new THREE.MeshBasicMaterial({
      map: sconceConeTex,
      transparent: true,
      opacity: 0.0,
      visible: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const sconceHousingMat = new THREE.MeshStandardMaterial({
      color: 0x261e1a,
      metalness: 0.78,
      roughness: 0.36,
      bumpMap: sconceMetalBumpTex,
      bumpScale: 0.022,
      roughnessMap: sconceMetalRoughTex,
    });
    const sconceBrassTrimMat = new THREE.MeshStandardMaterial({
      color: 0x9e7c47,
      metalness: 0.88,
      roughness: 0.28,
      bumpMap: sconceMetalBumpTex,
      bumpScale: 0.008,
    });
    const sconceLensMat = new THREE.MeshStandardMaterial({
      color: 0x1a1715,
      map: sconceGlassTex,
      roughness: 0.26,
      metalness: 0.08,
      emissive: new THREE.Color(0xffc773),
      emissiveMap: sconceGlassTex,
      emissiveIntensity: 0.0,
    });

    const sconceConeGeom = new THREE.PlaneGeometry(5.2, 7.2);
    const rearSconceConeGeom = new THREE.PlaneGeometry(4.6, 6.2);

    const sconceBackplateGeom = new THREE.BoxGeometry(0.46, 0.44, 0.05);
    const sconceBodyGeom = new THREE.BoxGeometry(0.36, 0.3, 0.2);
    const sconceFrontCylGeom = new THREE.CylinderGeometry(
      0.18,
      0.18,
      0.3,
      14,
      1,
      false,
      -Math.PI / 2,
      Math.PI
    );
    const sconceRibGeom = new THREE.BoxGeometry(0.018, 0.31, 0.04);
    const sconceBezelBoxGeom = new THREE.BoxGeometry(0.4, 0.032, 0.24);
    const sconceBezelCylGeom = new THREE.CylinderGeometry(
      0.195,
      0.195,
      0.032,
      14,
      1,
      false,
      -Math.PI / 2,
      Math.PI
    );
    const sconceLensBoxGeom = new THREE.BoxGeometry(0.32, 0.018, 0.17);
    const sconceLensCylGeom = new THREE.CylinderGeometry(
      0.16,
      0.16,
      0.018,
      12,
      1,
      false,
      -Math.PI / 2,
      Math.PI
    );

    const createArchitecturalSconce = (mount: "left" | "right" | "rear") => {
      const fixture = new THREE.Group();

      const backplate = new THREE.Mesh(sconceBackplateGeom, sconceHousingMat);
      backplate.position.set(0, 0, 0.025);
      backplate.castShadow = true;
      backplate.receiveShadow = true;
      fixture.add(backplate);

      const centralBody = new THREE.Mesh(sconceBodyGeom, sconceHousingMat);
      centralBody.position.set(0, 0, 0.14);
      centralBody.castShadow = true;
      centralBody.receiveShadow = true;
      fixture.add(centralBody);

      const frontHalfCyl = new THREE.Mesh(sconceFrontCylGeom, sconceHousingMat);
      frontHalfCyl.position.set(0, 0, 0.18);
      frontHalfCyl.castShadow = true;
      frontHalfCyl.receiveShadow = true;
      fixture.add(frontHalfCyl);

      for (let i = -2; i <= 2; i++) {
        const angle = i * 0.28;
        const rib = new THREE.Mesh(sconceRibGeom, sconceHousingMat);
        rib.position.set(Math.sin(angle) * 0.182, 0, 0.18 + Math.cos(angle) * 0.182);
        rib.rotation.y = angle;
        fixture.add(rib);
      }

      [0.162, -0.162].forEach((by) => {
        const bezelBox = new THREE.Mesh(sconceBezelBoxGeom, sconceBrassTrimMat);
        bezelBox.position.set(0, by, 0.15);
        fixture.add(bezelBox);

        const bezelCyl = new THREE.Mesh(sconceBezelCylGeom, sconceBrassTrimMat);
        bezelCyl.position.set(0, by, 0.18);
        fixture.add(bezelCyl);
      });

      [0.18, -0.18].forEach((ly) => {
        const lensBox = new THREE.Mesh(sconceLensBoxGeom, sconceLensMat);
        lensBox.position.set(0, ly, 0.15);
        fixture.add(lensBox);

        const lensCyl = new THREE.Mesh(sconceLensCylGeom, sconceLensMat);
        lensCyl.position.set(0, ly, 0.18);
        fixture.add(lensCyl);
      });

      if (mount === "left") fixture.rotation.y = Math.PI / 2;
      else if (mount === "right") fixture.rotation.y = -Math.PI / 2;
      else fixture.rotation.y = Math.PI;

      return fixture;
    };

    const sconceZPositions = [3.5, 8.5, 13.5, 18.5, 22.5];
    const sideConeCenterY = 5.15 - (0.5 - 220 / 512) * 7.2;
    const rearConeCenterY = 5.05 - (0.5 - 220 / 512) * 6.2;

    sconceZPositions.forEach((sz) => {
      // Left fluted bronze wall sconce + prismatic photometric double-fan cone wash
      const leftSconce = createArchitecturalSconce("left");
      leftSconce.position.set(-12.5, 5.15, sz);
      scene.add(leftSconce);

      const leftCone = new THREE.Mesh(sconceConeGeom, sconceConeMat);
      leftCone.position.set(-12.46, sideConeCenterY, sz);
      leftCone.rotation.y = Math.PI / 2;
      scene.add(leftCone);

      // Right fluted bronze wall sconce + prismatic photometric double-fan cone wash
      const rightSconce = createArchitecturalSconce("right");
      rightSconce.position.set(12.5, 5.15, sz);
      scene.add(rightSconce);

      const rightCone = new THREE.Mesh(sconceConeGeom, sconceConeMat);
      rightCone.position.set(12.46, sideConeCenterY, sz);
      rightCone.rotation.y = -Math.PI / 2;
      scene.add(rightCone);
    });

    // Two baked-shadow textured SpotLights projecting fluted caustic patterns & speaker/seat shadows
    const wallLampSpotLights: THREE.SpotLight[] = [];
    const spotConfigs: Array<{ pos: [number, number, number]; target: [number, number, number] }> = [
      { pos: [-11.7, 5.45, 11.0], target: [-12.35, 1.2, 13.8] },
      { pos: [11.7, 5.45, 11.0], target: [12.35, 1.2, 13.8] },
    ];
    spotConfigs.forEach(({ pos, target }) => {
      const spot = new THREE.SpotLight(0xffcf8b, 0.0, 28, Math.PI / 2.1, 0.92, 1.3);
      spot.position.set(...pos);
      spot.target.position.set(...target);
      spot.map = sconceGoboTex;
      spot.castShadow = true;
      spot.visible = false;
      spot.shadow.mapSize.set(512, 512);
      spot.shadow.bias = -0.0015;
      spot.shadow.normalBias = 0.025;
      spot.shadow.radius = 2.8;
      scene.add(spot);
      scene.add(spot.target);
      wallLampSpotLights.push(spot);
    });

    // Alternating Angled Black Surround-Sound Speaker Cabinets along Side Walls
    const speakerBodyMat = new THREE.MeshStandardMaterial({
      color: 0x101014,
      roughness: 0.7,
      metalness: 0.15,
    });
    const speakerGrilleMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.9,
    });
    const sideSpeakerBodyGeom = new THREE.BoxGeometry(0.36, 0.68, 0.44);
    const sideSpeakerGrilleGeom = new THREE.BoxGeometry(0.03, 0.6, 0.38);

    const speakerZPositions = [6.0, 11.0, 16.0, 20.5];
    speakerZPositions.forEach((pz) => {
      const leftSpkGroup = new THREE.Group();
      leftSpkGroup.position.set(-12.26, 5.4, pz);
      leftSpkGroup.rotation.z = -0.26;
      const leftSpkBody = new THREE.Mesh(sideSpeakerBodyGeom, speakerBodyMat);
      leftSpkBody.castShadow = true;
      leftSpkBody.receiveShadow = true;
      leftSpkGroup.add(leftSpkBody);
      const leftGrille = new THREE.Mesh(sideSpeakerGrilleGeom, speakerGrilleMat);
      leftGrille.position.set(0.18, 0, 0);
      leftGrille.receiveShadow = true;
      leftSpkGroup.add(leftGrille);
      scene.add(leftSpkGroup);

      const rightSpkGroup = new THREE.Group();
      rightSpkGroup.position.set(12.26, 5.4, pz);
      rightSpkGroup.rotation.z = 0.26;
      const rightSpkBody = new THREE.Mesh(sideSpeakerBodyGeom, speakerBodyMat);
      rightSpkBody.castShadow = true;
      rightSpkBody.receiveShadow = true;
      rightSpkGroup.add(rightSpkBody);
      const rightGrille = new THREE.Mesh(sideSpeakerGrilleGeom, speakerGrilleMat);
      rightGrille.position.set(-0.18, 0, 0);
      rightGrille.receiveShadow = true;
      rightSpkGroup.add(rightGrille);
      scene.add(rightSpkGroup);
    });

    // Back Wall + Walkway Sconces + Recessed Projection Booth Window + Exit Light
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(28, hallHeight, 1),
      wallMat
    );
    backWall.position.set(0, hallHeight / 2, 24);
    backWall.receiveShadow = true;
    scene.add(backWall);

    [-4.6, 0, 4.6].forEach((rx) => {
      const rearSconce = createArchitecturalSconce("rear");
      rearSconce.position.set(rx, 5.05, 23.5);
      scene.add(rearSconce);

      const rearCone = new THREE.Mesh(rearSconceConeGeom, sconceConeMat);
      rearCone.position.set(rx, rearConeCenterY, 23.46);
      rearCone.rotation.y = Math.PI;
      scene.add(rearCone);
    });

    // Recessed Projection Booth Window on Back Wall
    const boothFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 0.88, 0.08),
      sconceHousingMat
    );
    boothFrame.position.set(0, 7.8, 23.46);
    boothFrame.castShadow = true;
    boothFrame.receiveShadow = true;
    scene.add(boothFrame);

    const boothPort = new THREE.Mesh(
      new THREE.PlaneGeometry(1.16, 0.68),
      new THREE.MeshBasicMaterial({ color: 0x05060a })
    );
    boothPort.position.set(0, 7.8, 23.41);
    boothPort.rotation.y = Math.PI;
    scene.add(boothPort);

    const projectorLensGlow = new THREE.Mesh(
      new THREE.CircleGeometry(0.14, 18),
      new THREE.MeshBasicMaterial({
        color: 0xdbeafe,
        transparent: true,
        opacity: 0.65,
      })
    );
    projectorLensGlow.position.set(0, 7.8, 23.4);
    projectorLensGlow.rotation.y = Math.PI;
    scene.add(projectorLensGlow);

    // Compact rear surround speakers flanking the projection booth window
    const rearSpeakerBodyGeom = new THREE.BoxGeometry(0.4, 0.56, 0.34);
    const rearSpeakerGrilleGeom = new THREE.BoxGeometry(0.34, 0.5, 0.03);
    [-2.8, 2.8].forEach((sx) => {
      const rSpk = new THREE.Group();
      rSpk.position.set(sx, 7.7, 23.34);
      rSpk.rotation.x = 0.24;
      const rSpkBody = new THREE.Mesh(rearSpeakerBodyGeom, speakerBodyMat);
      rSpkBody.castShadow = true;
      rSpkBody.receiveShadow = true;
      rSpk.add(rSpkBody);
      const rGrille = new THREE.Mesh(rearSpeakerGrilleGeom, speakerGrilleMat);
      rGrille.position.set(0, 0, -0.17);
      rGrille.castShadow = true;
      rGrille.receiveShadow = true;
      rSpk.add(rGrille);
      scene.add(rSpk);
    });

    // Subtle emerald EXIT indicator on rear-left corner
    const exitSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.13),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    exitSignMesh.position.set(-9.6, 4.6, 23.45);
    exitSignMesh.rotation.y = Math.PI;
    scene.add(exitSignMesh);

    // Dark matte burgundy-charcoal ceiling (dynamically clears colossal 70mm IMAX screens) + 8 recessed warm pin-spot downlights
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(28, 1, 30),
      new THREE.MeshStandardMaterial({ color: 0x160a0d, roughness: 0.94 })
    );
    ceiling.position.set(0, ceilingY, 10);
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    const ceilingSpotMat = new THREE.MeshBasicMaterial({
      color: 0xffe0ad,
      transparent: true,
      opacity: 0.0,
      visible: false,
    });
    const ceilingSpotGeom = new THREE.CircleGeometry(0.18, 16);
    [-4.5, 4.5].forEach((cx) => {
      [5.5, 10.5, 15.5, 20.5].forEach((cz) => {
        const spotDisc = new THREE.Mesh(ceilingSpotGeom, ceilingSpotMat);
        spotDisc.rotation.x = Math.PI / 2;
        spotDisc.position.set(cx, ceilingY - 0.52, cz);
        scene.add(spotDisc);
      });
    });

    // --- Holographic Sightline Laser Cone & Acoustic Sweet-Spot Visualizer ---
    const sightlineGroup = new THREE.Group();
    scene.add(sightlineGroup);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.55,
    });
    const sightlineGeometry = new THREE.BufferGeometry();
    const sightlinePositions = new Float32Array(5 * 2 * 3); // 5 rays from active seat to screen corners & center
    sightlineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(sightlinePositions, 3)
    );
    const sightlineSegments = new THREE.LineSegments(
      sightlineGeometry,
      lineMaterial
    );
    sightlineGroup.add(sightlineSegments);

    // Glowing Seat Beacon Ring under active seat
    const beaconRingGeom = new THREE.RingGeometry(0.45, 0.58, 32);
    beaconRingGeom.rotateX(-Math.PI / 2);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const beaconRing = new THREE.Mesh(beaconRingGeom, beaconRingMat);
    sightlineGroup.add(beaconRing);

    function updateSightlineCone(seatId: string, visible: boolean) {
      sightlineGroup.visible = visible;
      if (!visible) return;

      const d = getSeatSpatialData(seatId);
      beaconRing.position.set(d.x, d.y + 0.02, d.z);

      const scY = scrElev + scrH / 2;
      const halfW = scrW * 0.45;
      const halfH = scrH * 0.42;
      const edgeZ = SCREEN_Z;

      const targets = [
        [0, scY, SCREEN_Z], // Center
        [-halfW, scY + halfH, edgeZ], // Top-Left
        [halfW, scY + halfH, edgeZ], // Top-Right
        [-halfW, scY - halfH, edgeZ], // Bottom-Left
        [halfW, scY - halfH, edgeZ], // Bottom-Right
      ];

      const arr = sightlineGeometry.attributes.position
        .array as Float32Array;
      targets.forEach((t, idx) => {
        const base = idx * 6;
        arr[base] = d.x;
        arr[base + 1] = d.eyeHeight - 0.1;
        arr[base + 2] = d.z;
        arr[base + 3] = t[0];
        arr[base + 4] = t[1];
        arr[base + 5] = t[2];
      });
      sightlineGeometry.attributes.position.needsUpdate = true;
    }

    // --- 3D Seats Construction & Raycasting Support ---
    const seatMeshes: Record<
      string,
      {
        group: THREE.Group;
        cushion: THREE.Mesh;
        back: THREE.Mesh;
        headrest: THREE.Mesh;
        bolsters: THREE.Mesh[];
        haloRing: THREE.Mesh;
        isVIP: boolean;
        isReserved: boolean;
      }
    > = {};
    const audienceGroups: { id: string; group: THREE.Group }[] = [];
    const clickableSeatMeshes: THREE.Mesh[] = [];

    // Helper: Bevelled / Contoured Cushion Geometry (lighter segments for fast mount & high FPS)
    function createRoundedCushionGeom(
      w: number,
      h: number,
      d: number,
      radius = 0.04,
      bevel = 0.032
    ) {
      const shape = new THREE.Shape();
      const hw = Math.max(0.02, w / 2 - bevel);
      const hh = Math.max(0.02, h / 2 - bevel);
      const r = Math.min(radius, hw * 0.8, hh * 0.8);
      shape.moveTo(-hw + r, -hh);
      shape.lineTo(hw - r, -hh);
      shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
      shape.lineTo(hw, hh - r);
      shape.quadraticCurveTo(hw, hh, hw - r, hh);
      shape.lineTo(-hw + r, hh);
      shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
      shape.lineTo(-hw, -hh + r);
      shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

      const depthVal = Math.max(0.01, d - bevel * 2);
      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: depthVal,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: bevel,
        bevelThickness: bevel,
        curveSegments: 4,
      });
      geom.center();
      return geom;
    }

    // Authentic Dark Matte Nappa Leather Seating Materials (Dark in movie mode, richly sculpted when House Lights open)
    const standardSeatMat = new THREE.MeshStandardMaterial({
      color: 0x232632, // charcoal-obsidian Nappa leather
      roughness: 0.48,
      metalness: 0.08,
      bumpMap: leatherBumpTex,
      bumpScale: 0.009,
    });
    const vipSeatMat = new THREE.MeshStandardMaterial({
      color: 0x30251d, // rich dark espresso-bronze leather
      roughness: 0.42,
      metalness: 0.12,
      bumpMap: leatherBumpTex,
      bumpScale: 0.011,
    });
    const selectedSeatMat = new THREE.MeshStandardMaterial({
      color: 0x52422e, // warm champagne-lit cognac leather
      roughness: 0.36,
      metalness: 0.14,
      emissive: 0x3d301c,
      emissiveIntensity: 0.3,
      bumpMap: leatherBumpTex,
      bumpScale: 0.011,
    });
    const reservedSeatMat = new THREE.MeshStandardMaterial({
      color: 0x161820, // deep shadow occupied leather
      roughness: 0.68,
      metalness: 0.04,
      emissive: new THREE.Color(0x8c0f1d),
      emissiveIntensity: 0.0,
      bumpMap: leatherBumpTex,
      bumpScale: 0.006,
    });
    const shellFrameMat = new THREE.MeshStandardMaterial({
      color: 0x14161e, // matte carbon outer recliner shell
      roughness: 0.6,
      metalness: 0.25,
    });
    const reservedBackShellMat = new THREE.MeshStandardMaterial({
      color: 0x14161e,
      roughness: 0.6,
      metalness: 0.25,
      emissive: new THREE.Color(0x700b16),
      emissiveIntensity: 0.0,
    });
    const reservedBaseColor = new THREE.Color(0x161820);
    const reservedFlashColor = new THREE.Color(0x630d18);
    const reservedShellBaseColor = new THREE.Color(0x14161e);
    const reservedShellFlashColor = new THREE.Color(0x450912);
    const reservedHaloMaterials: THREE.MeshBasicMaterial[] = [];
    const armrestPadMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c25,
      roughness: 0.46,
      metalness: 0.1,
    });
    const cupHolderMat = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      metalness: 0.82,
      roughness: 0.28,
    });

    // Shared contoured recliner geometries
    const seatCushionGeom = createRoundedCushionGeom(0.64, 0.14, 0.62, 0.05, 0.035);
    const waterfallFrontGeom = createRoundedCushionGeom(0.62, 0.11, 0.16, 0.04, 0.03);
    const seatBackGeom = createRoundedCushionGeom(0.62, 0.64, 0.14, 0.07, 0.035);
    const lumbarPillowGeom = createRoundedCushionGeom(0.54, 0.22, 0.09, 0.04, 0.025);
    const headrestGeom = createRoundedCushionGeom(0.48, 0.22, 0.14, 0.06, 0.032);
    const sideWingGeom = createRoundedCushionGeom(0.09, 0.56, 0.15, 0.03, 0.022);
    const armrestPadGeom = createRoundedCushionGeom(0.11, 0.07, 0.56, 0.03, 0.02);
    const sidePanelShellGeom = createRoundedCushionGeom(0.07, 0.36, 0.58, 0.03, 0.018);
    const backShellGeom = createRoundedCushionGeom(0.66, 0.78, 0.05, 0.07, 0.018);
    const cupHolderRimGeom = new THREE.CylinderGeometry(0.046, 0.042, 0.05, 16);
    const pedestalGeom = new THREE.CylinderGeometry(0.09, 0.14, 0.22, 16);
    const seatHaloRingGeom = new THREE.RingGeometry(0.32, 0.42, 28);
    seatHaloRingGeom.rotateX(-Math.PI / 2);

    // Dark-Silhouetted, Organically Proportioned Seated Cinema Viewer
    function createSeatedHumanFigure(
      profileIndex: number,
      seatX: number,
      seatY: number,
      seatZ: number
    ) {
      const profile =
        AUDIENCE_PROFILES[profileIndex % AUDIENCE_PROFILES.length];
      const humanGroup = new THREE.Group();
      humanGroup.position.set(seatX, seatY + profile.heightOffset * 0.7, seatZ);

      // Subdued, dark shadow fabric tones so audience silhouettes blend naturally into the dark auditorium
      const silhouetteFabricColors = [0x090a0e, 0x0c0e13, 0x101116, 0x0b0c10, 0x0e0d11];
      const fabricColor =
        silhouetteFabricColors[profileIndex % silhouetteFabricColors.length];

      const torsoMat = new THREE.MeshStandardMaterial({
        color: fabricColor,
        roughness: 0.9,
        metalness: 0.02,
      });
      const silhouetteSkinMat = new THREE.MeshStandardMaterial({
        color: 0x1c1715, // deep low-key shadow skin tone
        roughness: 0.84,
        metalness: 0.02,
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x070709,
        roughness: 0.92,
      });

      // Organic contoured upper torso (reclined back against cushion)
      const chestGeom = new THREE.SphereGeometry(0.22, 18, 16);
      chestGeom.scale(1.12, 1.32, 0.72);
      const torso = new THREE.Mesh(chestGeom, torsoMat);
      torso.position.set(0, 0.38, 0.13);
      torso.rotation.x = -0.14;
      humanGroup.add(torso);

      // Natural sloped shoulders
      const shoulderGeom = new THREE.SphereGeometry(0.24, 18, 14);
      shoulderGeom.scale(1.15, 0.52, 0.65);
      const shoulders = new THREE.Mesh(shoulderGeom, torsoMat);
      shoulders.position.set(0, 0.56, 0.16);
      shoulders.rotation.x = -0.1;
      humanGroup.add(shoulders);

      // Soft jacket / hoodie collar roll
      const collarGeom = new THREE.TorusGeometry(0.105, 0.036, 10, 18);
      collarGeom.rotateX(Math.PI / 2 + 0.15);
      const collar = new THREE.Mesh(collarGeom, torsoMat);
      collar.position.set(0, 0.64, 0.17);
      humanGroup.add(collar);

      // Neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.072, 0.12, 14),
        silhouetteSkinMat
      );
      neck.position.set(0, 0.69, 0.17);
      humanGroup.add(neck);

      // Subtle natural gaze angle toward center of screen
      const gazeYaw = -seatX * 0.035 + ((profileIndex % 5) - 2) * 0.025;
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.81, 0.17);
      headGroup.rotation.y = gazeYaw;
      headGroup.rotation.x = 0.04;

      // Sculpted cranium & jaw silhouette
      const headGeom = new THREE.SphereGeometry(0.118, 20, 18);
      headGeom.scale(0.94, 1.16, 1.04);
      const head = new THREE.Mesh(headGeom, silhouetteSkinMat);
      headGroup.add(head);

      // Hair volume catching subtle top screen rim-light
      const hairGeom = new THREE.SphereGeometry(0.124, 20, 16);
      hairGeom.scale(0.98, 1.08, 1.08);
      const hair = new THREE.Mesh(hairGeom, hairMat);
      hair.position.set(0, 0.022, 0.012);
      headGroup.add(hair);

      humanGroup.add(headGroup);

      // Upper arms resting naturally down toward the padded armrests
      const upperArmGeom = new THREE.CylinderGeometry(0.058, 0.05, 0.3, 12);
      const leftArm = new THREE.Mesh(upperArmGeom, torsoMat);
      leftArm.position.set(-0.27, 0.42, 0.14);
      leftArm.rotation.x = 0.22;
      leftArm.rotation.z = -0.12;
      humanGroup.add(leftArm);

      const rightArm = new THREE.Mesh(upperArmGeom, torsoMat);
      rightArm.position.set(0.27, 0.42, 0.14);
      rightArm.rotation.x = 0.22;
      rightArm.rotation.z = 0.12;
      humanGroup.add(rightArm);

      // Seated thighs on cushion
      const thighGeom = new THREE.CylinderGeometry(0.072, 0.062, 0.38, 12);
      thighGeom.rotateX(Math.PI / 2 - 0.08);
      const leftThigh = new THREE.Mesh(thighGeom, torsoMat);
      leftThigh.position.set(-0.12, 0.17, -0.04);
      humanGroup.add(leftThigh);

      const rightThigh = new THREE.Mesh(thighGeom, torsoMat);
      rightThigh.position.set(0.12, 0.17, -0.04);
      humanGroup.add(rightThigh);

      return humanGroup;
    }

    ROWS.forEach((row, rIdx) => {
      for (let col = 1; col <= SEATS_PER_ROW; col++) {
        const seatId = `${row}${col}`;
        const data = getSeatSpatialData(seatId);
        const isReserved = PRE_RESERVED_SEATS.includes(seatId);

        const seatGroup = new THREE.Group();
        seatGroup.position.set(data.x, data.y, data.z);
        // Subtle inward toe-in angle toward screen center for outer seats
        seatGroup.rotation.y = -data.x * 0.018;

        let mat = standardSeatMat;
        if (isReserved) mat = reservedSeatMat;
        else if (data.isVIP) mat = vipSeatMat;

        // 1. Contoured Main Seat Pan Cushion
        const cushion = new THREE.Mesh(seatCushionGeom, mat);
        cushion.position.set(0, 0.11, 0.02);
        cushion.rotation.x = -0.05;
        cushion.castShadow = true;
        cushion.receiveShadow = true;
        cushion.userData = { seatId };
        seatGroup.add(cushion);
        clickableSeatMeshes.push(cushion);

        // Waterfall Front Knee Bolster
        const frontRoll = new THREE.Mesh(waterfallFrontGeom, mat);
        frontRoll.position.set(0, 0.1, -0.26);
        frontRoll.rotation.x = 0.25;
        frontRoll.receiveShadow = true;
        frontRoll.userData = { seatId };
        seatGroup.add(frontRoll);
        clickableSeatMeshes.push(frontRoll);

        // 2. Reclined Fluted Upper Backrest
        const back = new THREE.Mesh(seatBackGeom, mat);
        back.position.set(0, 0.48, 0.27);
        back.rotation.x = -0.16;
        back.castShadow = true;
        back.receiveShadow = true;
        back.userData = { seatId };
        seatGroup.add(back);
        clickableSeatMeshes.push(back);

        // 3. Ergonomic Lower Lumbar Bolster
        const lumbar = new THREE.Mesh(lumbarPillowGeom, mat);
        lumbar.position.set(0, 0.28, 0.21);
        lumbar.rotation.x = -0.12;
        lumbar.receiveShadow = true;
        lumbar.userData = { seatId };
        seatGroup.add(lumbar);
        clickableSeatMeshes.push(lumbar);

        // 4. Sculpted Lateral Wing Bolsters
        const leftWing = new THREE.Mesh(sideWingGeom, mat);
        leftWing.position.set(-0.29, 0.49, 0.24);
        leftWing.rotation.x = -0.16;
        leftWing.rotation.y = 0.22;
        leftWing.userData = { seatId };
        seatGroup.add(leftWing);
        clickableSeatMeshes.push(leftWing);

        const rightWing = new THREE.Mesh(sideWingGeom, mat);
        rightWing.position.set(0.29, 0.49, 0.24);
        rightWing.rotation.x = -0.16;
        rightWing.rotation.y = -0.22;
        rightWing.userData = { seatId };
        seatGroup.add(rightWing);
        clickableSeatMeshes.push(rightWing);

        // 5. Plush Articulated Headrest Pillow
        const headrest = new THREE.Mesh(headrestGeom, mat);
        headrest.position.set(0, 0.84, 0.32);
        headrest.rotation.x = -0.06;
        headrest.castShadow = true;
        headrest.receiveShadow = true;
        headrest.userData = { seatId };
        seatGroup.add(headrest);
        clickableSeatMeshes.push(headrest);

        // 6. Outer Carbon Shell Back & Side Enclosures
        const seatShellMat = isReserved ? reservedBackShellMat : shellFrameMat;
        const backShell = new THREE.Mesh(backShellGeom, seatShellMat);
        backShell.position.set(0, 0.52, 0.35);
        backShell.rotation.x = -0.16;
        backShell.castShadow = true;
        backShell.userData = { seatId };
        seatGroup.add(backShell);
        clickableSeatMeshes.push(backShell);

        const leftShell = new THREE.Mesh(sidePanelShellGeom, seatShellMat);
        leftShell.position.set(-0.37, 0.18, 0.04);
        seatGroup.add(leftShell);

        const rightShell = new THREE.Mesh(sidePanelShellGeom, seatShellMat);
        rightShell.position.set(0.37, 0.18, 0.04);
        seatGroup.add(rightShell);

        // 7. Wide Upholstered Armrests + Recessed Gunmetal Cupholders
        const leftArm = new THREE.Mesh(armrestPadGeom, armrestPadMat);
        leftArm.position.set(-0.37, 0.37, 0.02);
        leftArm.receiveShadow = true;
        leftArm.userData = { seatId };
        seatGroup.add(leftArm);
        clickableSeatMeshes.push(leftArm);

        const rightArm = new THREE.Mesh(armrestPadGeom, armrestPadMat);
        rightArm.position.set(0.37, 0.37, 0.02);
        rightArm.receiveShadow = true;
        rightArm.userData = { seatId };
        seatGroup.add(rightArm);
        clickableSeatMeshes.push(rightArm);

        const leftCup = new THREE.Mesh(cupHolderRimGeom, cupHolderMat);
        leftCup.position.set(-0.37, 0.39, -0.18);
        seatGroup.add(leftCup);

        const rightCup = new THREE.Mesh(cupHolderRimGeom, cupHolderMat);
        rightCup.position.set(0.37, 0.39, -0.18);
        seatGroup.add(rightCup);

        // 8. Heavy Pedestal Floor Base & Subtle Warm Floor Halo (visible only when seat is selected or flashing reserved)
        const stand = new THREE.Mesh(pedestalGeom, shellFrameMat);
        stand.position.set(0, -0.02, 0.06);
        seatGroup.add(stand);

        const haloMat = new THREE.MeshBasicMaterial({
          color: isReserved ? 0x991122 : 0xd4af37,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
        });
        if (isReserved) {
          reservedHaloMaterials.push(haloMat);
        }
        const haloRing = new THREE.Mesh(seatHaloRingGeom, haloMat);
        haloRing.position.set(0, 0.012, 0.02);
        seatGroup.add(haloRing);

        scene.add(seatGroup);
        seatMeshes[seatId] = {
          group: seatGroup,
          cushion,
          back,
          headrest,
          bolsters: [frontRoll, lumbar, leftWing, rightWing],
          haloRing,
          isVIP: data.isVIP,
          isReserved,
        };

        if (isReserved) {
          const audienceHuman = createSeatedHumanFigure(
            rIdx * SEATS_PER_ROW + col,
            data.x,
            data.y,
            data.z
          );
          audienceHuman.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.userData = { seatId };
              child.castShadow = true;
              child.receiveShadow = true;
              clickableSeatMeshes.push(child);
            }
          });
          scene.add(audienceHuman);
          audienceGroups.push({ id: seatId, group: audienceHuman });
        }
      }
    });

    // --- Camera Positioning & POV / Overview Flight Logic ---
    const targetCamPos = new THREE.Vector3();
    const targetCamLook = new THREE.Vector3();
    const currentCamLook = new THREE.Vector3(0, 6.5, 0);

    function syncSceneWithState() {
      const st = stateRef.current;
      const data = getSeatSpatialData(st.activeSeat);
      const isPattern = st.screenMode === "pattern";

      if (isPattern) {
        renderCalibrationPattern();
        screenMesh.material = patternMat;
        cssScreenObj.visible = false;
        if (trailerIframe) {
          hideTrailerCurtainImmediate();
          sendYoutubeCommand("pauseVideo");
        }
      } else if (st.lightingMode === "dimmed") {
        hasStartedScreening = true;
        if (
          prevLightingMode === "house" ||
          !trailerIframe ||
          loadedVideoId !== st.selectedMovie.trailerYoutubeId
        ) {
          ensureTrailerPlaying(st.selectedMovie.trailerYoutubeId);
        }
      } else {
        renderTheaterSlate(hasStartedScreening ? "interval" : "preshow");
        if (trailerIframe && prevLightingMode === "dimmed") {
          hideTrailerCurtainImmediate();
          sendYoutubeCommand("pauseVideo");
        }
      }
      prevLightingMode = st.lightingMode;

      // Update projector accent color (lighting transitions smoothly in animate())
      screenProjectorGlow.color.setHex(st.selectedMovie.accentColor);

      // Update seat materials & subtle floor halo for selected seats
      Object.keys(seatMeshes).forEach((id) => {
        const item = seatMeshes[id];
        const isSel = st.selectedSeats.includes(id);
        const targetMat = isSel
          ? selectedSeatMat
          : item.isReserved
          ? reservedSeatMat
          : item.isVIP
          ? vipSeatMat
          : standardSeatMat;

        item.cushion.material = targetMat;
        item.back.material = targetMat;
        item.headrest.material = targetMat;
        item.bolsters.forEach((b) => {
          b.material = targetMat;
        });
        if (!item.isReserved) {
          (item.haloRing.material as THREE.MeshBasicMaterial).opacity = isSel
            ? 0.42
            : 0.0;
        }
      });

      // Update Sightline Laser Cone
      updateSightlineCone(st.activeSeat, st.laserConeVisible);

      // Camera target
      if (st.cameraMode === "pov") {
        const reclineRad = (st.reclineAngle * Math.PI) / 180;
        const eyeY = data.eyeHeight - Math.sin(reclineRad) * 0.12;
        const eyeZ = data.z + Math.cos(reclineRad) * 0.16;

        targetCamPos.set(data.x, eyeY, eyeZ);

        const screenCenterY = scrElev + scrH / 2;
        targetCamLook.set(
          Math.sin(st.lookYaw) * 12,
          screenCenterY + Math.sin(st.lookPitch + reclineRad * 0.5) * 8,
          0
        );

        audienceGroups.forEach((ag) => {
          ag.group.visible = st.audienceVisible && ag.id !== st.activeSeat;
        });
      } else {
        const camX = Math.sin(st.overviewYaw) * 8.0;
        const camZ = 16.5 - (1 - Math.cos(st.overviewYaw)) * 3.0;
        const camY = 9.8 + st.overviewPitch * 5.0;

        targetCamPos.set(camX, camY, camZ);
        targetCamLook.set(0, 4.5, 2.5);

        audienceGroups.forEach((ag) => {
          ag.group.visible = st.audienceVisible;
        });
      }
    }

    updateSceneRef.current = syncSceneWithState;

    // Initial position
    camera.position.set(0, 9.8, 16.5);
    currentCamLook.set(0, 4.5, 2.5);
    syncSceneWithState();

    // --- Taken Seats Dark-Red Flash Animation State (slow fade in / slow fade out) ---
    const TAKEN_FLASH_FADE_IN_MS = 950;
    const TAKEN_FLASH_HOLD_MS = 200;
    const TAKEN_FLASH_FADE_OUT_MS = 1250;
    const TAKEN_FLASH_TOTAL_MS =
      TAKEN_FLASH_FADE_IN_MS + TAKEN_FLASH_HOLD_MS + TAKEN_FLASH_FADE_OUT_MS;
    let takenFlashStartMs: number | null = null;
    let takenFlashIntensity = 0;
    let lastTakenFlashTriggerMs = 0;

    const triggerTakenSeatsFlash = () => {
      const now = performance.now();
      if (now - lastTakenFlashTriggerMs < 120) return;
      lastTakenFlashTriggerMs = now;

      if (takenFlashIntensity > 0.01 && takenFlashIntensity < 0.99) {
        const clamped = Math.max(0, Math.min(1, takenFlashIntensity));
        const resumeProgress = Math.acos(1 - 2 * clamped) / Math.PI;
        takenFlashStartMs = now - resumeProgress * TAKEN_FLASH_FADE_IN_MS;
      } else {
        takenFlashStartMs = now;
      }
    };
    triggerTakenFlashRef.current = triggerTakenSeatsFlash;

    // --- Pointer & Raycast Handlers ---
    let isPointerDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const dist = Math.hypot(
        e.clientX - pointerStartX,
        e.clientY - pointerStartY
      );
      if (dist < 5 && container) {
        const rect = container.getBoundingClientRect();
        mouseCoord.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseCoord.y =
          -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouseCoord, camera);
        const intersects = raycaster.intersectObjects(clickableSeatMeshes);
        const visibleHit = intersects.find((hit) => {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (!obj.visible) return false;
            obj = obj.parent;
          }
          return true;
        });

        if (visibleHit) {
          const hitSeatId = visibleHit.object.userData.seatId;
          if (hitSeatId) {
            if (PRE_RESERVED_SEATS.includes(hitSeatId)) {
              triggerTakenSeatsFlash();
            }
            onSelectSeatRef.current(hitSeatId);
          }
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      const st = stateRef.current;
      if (st.cameraMode === "pov") {
        st.lookYaw -= deltaX * 0.0035;
        st.lookPitch += deltaY * 0.0035;
        st.lookPitch = Math.max(-0.45, Math.min(0.65, st.lookPitch));
        st.lookYaw = Math.max(-1.1, Math.min(1.1, st.lookYaw));
      } else {
        st.overviewYaw -= deltaX * 0.004;
        st.overviewPitch -= deltaY * 0.003;
        st.overviewYaw = Math.max(-0.8, Math.min(0.8, st.overviewYaw));
        st.overviewPitch = Math.max(-0.4, Math.min(0.4, st.overviewPitch));
      }

      syncSceneWithState();
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      const st = stateRef.current;
      let handled = false;
      const step = 0.05;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (st.cameraMode === "pov") {
          st.lookYaw = Math.min(1.1, st.lookYaw + step);
        } else {
          st.overviewYaw = Math.min(0.8, st.overviewYaw + step);
        }
        handled = true;
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (st.cameraMode === "pov") {
          st.lookYaw = Math.max(-1.1, st.lookYaw - step);
        } else {
          st.overviewYaw = Math.max(-0.8, st.overviewYaw - step);
        }
        handled = true;
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        if (st.cameraMode === "pov") {
          st.lookPitch = Math.min(0.65, st.lookPitch + step);
        } else {
          st.overviewPitch = Math.min(0.4, st.overviewPitch + step);
        }
        handled = true;
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        if (st.cameraMode === "pov") {
          st.lookPitch = Math.max(-0.45, st.lookPitch - step);
        } else {
          st.overviewPitch = Math.max(-0.4, st.overviewPitch - step);
        }
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        syncSceneWithState();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const lastCssCamPos = new THREE.Vector3(Infinity, Infinity, Infinity);
    const lastCssCamQuat = new THREE.Quaternion();
    let cssNeedsRender = true;
    let prevCssVisible = cssScreenObj.visible;
    let shadowsBaked = false;
    let lastShadowKey = "";

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      cssCamera.aspect = w / h;
      cssCamera.updateProjectionMatrix();
      renderer.setSize(w, h);
      cssRenderer.setSize(w, h);
      cssNeedsRender = true;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animFrameId: number;
    let frameTicker = 0;
    let houseDimmer = stateRef.current.lightingMode === "house" ? 1 : 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      frameTicker += 0.025;

      // Smooth theatrical house-light dimmer transition (0 = Screening Dark, 1 = Lights On)
      const targetDimmer = stateRef.current.lightingMode === "house" ? 1 : 0;
      houseDimmer += (targetDimmer - houseDimmer) * 0.06;
      if (targetDimmer === 0 && houseDimmer < 0.004) houseDimmer = 0;
      const d = houseDimmer;
      const lampsOn = d > 0.004;

      camera.position.lerp(targetCamPos, 0.08);
      currentCamLook.lerp(targetCamLook, 0.08);
      camera.lookAt(currentCamLook);

      // Keep CSS3D camera locked pixel-for-pixel with the WebGL camera
      cssCamera.position.copy(camera.position).multiplyScalar(CSS_WORLD_SCALE);
      cssCamera.quaternion.copy(camera.quaternion);
      cssCamera.updateMatrixWorld();

      // Consolidated room & wall sconce lamps go strictly 100% dark when lights are off
      ambientLight.intensity = 0.1 + d * 0.64;
      hemiLight.intensity = 0.08 + d * 1.2;
      houseFillDirLight.intensity = d * 1.25;
      houseFillDirLight.visible = lampsOn;
      houseLight.intensity = d * 2.6;
      leftWallSconceLight.intensity = d * 3.4;
      rightWallSconceLight.intensity = d * 3.4;
      rearWallSconceLight.intensity = d * 2.6;
      sconceConeMat.opacity = d * 0.92;
      sconceConeMat.visible = lampsOn;
      sconceLensMat.emissiveIntensity = d * 2.6;
      ceilingSpotMat.opacity = d * 0.92;
      ceilingSpotMat.visible = lampsOn;
      wallLampSpotLights.forEach((sp) => {
        sp.intensity = d * 5.6;
        sp.visible = lampsOn;
      });

      // Bake static shadows once per camera-mode/visibility state (zero per-frame shadow re-renders)
      if (lampsOn) {
        const shadowKey = `${stateRef.current.cameraMode}:${stateRef.current.audienceVisible}:${stateRef.current.activeSeat}`;
        if (!shadowsBaked || shadowKey !== lastShadowKey) {
          renderer.shadowMap.needsUpdate = true;
          shadowsBaked = true;
          lastShadowKey = shadowKey;
        }
      }

      // Always-On Golden Neon DRL strips & pinpoint aisle LEDs running continuously throughout the screening
      goldDrlHaloMat.opacity = 0.68 + d * 0.16;
      stepLightMat.opacity = 0.78 + d * 0.2;
      drlLeftLight.intensity = 0.32 + d * 0.14;
      drlRightLight.intensity = 0.32 + d * 0.14;

      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.017 - d * 0.012;
      }

      // Smooth theatrical screen handoff between illuminated Pre-Show/Interval slate and dark 1080p cinema cutout
      if (stateRef.current.screenMode === "pattern") {
        screenMesh.material = patternMat;
        cssScreenObj.visible = false;
      } else if (d > 0.18) {
        screenMesh.material = slateMat;
        cssScreenObj.visible = false;
        const slateGain = Math.max(0, Math.min(1, (d - 0.18) / 0.82));
        const slateLevel = 0.04 + slateGain * 0.96;
        slateMat.color.setRGB(slateLevel, slateLevel, slateLevel);
      } else {
        screenMesh.material = screenCutoutMat;
        cssScreenObj.visible = true;
      }

      if (d < 0.5) {
        screenProjectorGlow.intensity = 1.25 + Math.sin(frameTicker * 1.6) * 0.14;
        screenRedGlow.intensity = 0.2 + Math.cos(frameTicker * 1.2) * 0.04;
      } else {
        screenProjectorGlow.intensity = 0.95;
        screenRedGlow.intensity = 0.45;
      }

      if (takenFlashStartMs !== null) {
        const elapsed = performance.now() - takenFlashStartMs;
        if (elapsed < TAKEN_FLASH_FADE_IN_MS) {
          const t = elapsed / TAKEN_FLASH_FADE_IN_MS;
          takenFlashIntensity = 0.5 - 0.5 * Math.cos(Math.PI * t);
        } else if (elapsed < TAKEN_FLASH_FADE_IN_MS + TAKEN_FLASH_HOLD_MS) {
          takenFlashIntensity = 1.0;
        } else if (elapsed < TAKEN_FLASH_TOTAL_MS) {
          const t =
            (elapsed - TAKEN_FLASH_FADE_IN_MS - TAKEN_FLASH_HOLD_MS) /
            TAKEN_FLASH_FADE_OUT_MS;
          takenFlashIntensity = 0.5 + 0.5 * Math.cos(Math.PI * t);
        } else {
          takenFlashIntensity = 0;
          takenFlashStartMs = null;
        }

        const f = takenFlashIntensity;
        reservedSeatMat.color.lerpColors(reservedBaseColor, reservedFlashColor, f);
        reservedSeatMat.emissiveIntensity = f * 1.15;
        reservedBackShellMat.color.lerpColors(
          reservedShellBaseColor,
          reservedShellFlashColor,
          f
        );
        reservedBackShellMat.emissiveIntensity = f * 0.78;
        for (let i = 0; i < reservedHaloMaterials.length; i++) {
          reservedHaloMaterials[i].opacity = f * 0.65;
        }
      }

      const cssNowVisible = cssScreenObj.visible;
      if (cssNowVisible) {
        const posDeltaSq = cssCamera.position.distanceToSquared(lastCssCamPos);
        const rotDelta =
          1 - Math.abs(cssCamera.quaternion.dot(lastCssCamQuat));
        if (
          !prevCssVisible ||
          cssNeedsRender ||
          posDeltaSq > 1e-4 ||
          rotDelta > 1e-6
        ) {
          cssRenderer.render(cssScene, cssCamera);
          lastCssCamPos.copy(cssCamera.position);
          lastCssCamQuat.copy(cssCamera.quaternion);
          cssNeedsRender = false;
        }
      }
      prevCssVisible = cssNowVisible;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      clearCurtainTimers();
      clearHandshakeTimers();
      window.removeEventListener("message", onYoutubeMessage);
      syncTrailerAudioRef.current = null;
      triggerTakenFlashRef.current = null;
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      if (trailerIframe) {
        trailerIframe.src = "about:blank";
        trailerIframe.remove();
        trailerIframe = null;
      }
      if (cssRenderer.domElement.parentNode === container) {
        container.removeChild(cssRenderer.domElement);
      }
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [resetTrigger, venue?.id]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#030407] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Look Around Helper Tooltip */}
      {showHelperTooltip && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 font-mono flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>
            {cameraMode === "pov"
              ? "Drag to look around • Click any seat in 3D or 2D to switch perspective"
              : "Drag to orbit auditorium • Click any seat to zoom into eye-level POV"}
          </span>
        </div>
      )}
    </div>
  );
};

