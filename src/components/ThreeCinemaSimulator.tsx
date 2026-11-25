import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  AUDIENCE_PROFILES,
  getSeatSpatialData,
  KarachiVenue,
  MovieItem,
  PRE_RESERVED_SEATS,
  ROW_METRICS,
  ROWS,
  SEATS_PER_ROW,
} from "../constants/cinemaData";

export interface ThreeCinemaSimulatorProps {
  venue: KarachiVenue;
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
  resetTrigger,
  showHelperTooltip = false,
  onSelectSeat,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    selectedSeats,
    activeSeat,
    cameraMode,
    lightingMode,
    audienceVisible,
    venue,
    selectedMovie,
  });

  useEffect(() => {
    stateRef.current = {
      selectedSeats,
      activeSeat,
      cameraMode,
      lightingMode,
      audienceVisible,
      venue,
      selectedMovie,
    };
  }, [
    selectedSeats,
    activeSeat,
    cameraMode,
    lightingMode,
    audienceVisible,
    venue,
    selectedMovie,
  ]);

  const onSelectSeatRef = useRef(onSelectSeat);
  useEffect(() => {
    onSelectSeatRef.current = onSelectSeat;
  }, [onSelectSeat]);

  const cameraStateRef = useRef({
    yawOffset: 0,
    pitchOffset: 0,
    orbitTheta: 0.42,
    orbitPhi: 0.92,
    orbitRadius: 21.5,
  });

  useEffect(() => {
    cameraStateRef.current.yawOffset = 0;
    cameraStateRef.current.pitchOffset = 0;
    cameraStateRef.current.orbitTheta = 0.42;
    cameraStateRef.current.orbitPhi = 0.92;
    cameraStateRef.current.orbitRadius = 21.5;
  }, [resetTrigger, activeSeat, cameraMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe);
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.008);

    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 160);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 1. BRIGHTLY LIT INDOOR MALL PLAYLAND LIGHTING
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfef3c7, 1.35);
    hemiLight.position.set(0, 18, 0);
    scene.add(hemiLight);

    const mainSunLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    mainSunLight.position.set(8, 18, 10);
    mainSunLight.castShadow = true;
    mainSunLight.shadow.mapSize.width = 1024;
    mainSunLight.shadow.mapSize.height = 1024;
    mainSunLight.shadow.camera.near = 1;
    mainSunLight.shadow.camera.far = 55;
    mainSunLight.shadow.camera.left = -18;
    mainSunLight.shadow.camera.right = 18;
    mainSunLight.shadow.camera.top = 18;
    mainSunLight.shadow.camera.bottom = -18;
    scene.add(mainSunLight);

    const mazeFillLight = new THREE.PointLight(0xfde68a, 22, 26, 1.5);
    mazeFillLight.position.set(0, 7.5, -4);
    scene.add(mazeFillLight);

    const toddlerFillLight = new THREE.PointLight(0xa7f3d0, 16, 20, 1.5);
    toddlerFillLight.position.set(-8, 6.5, -4);
    scene.add(toddlerFillLight);

    const trampolineFillLight = new THREE.PointLight(0xbae6fd, 16, 20, 1.5);
    trampolineFillLight.position.set(8, 6.5, -4);
    scene.add(trampolineFillLight);

    // =========================================================================
    // 2. FLOORING: FOAM PLAYLAND MAT + WARM WOOD PARENT CAFÉ DECK
    // =========================================================================
    const playlandFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 16),
      new THREE.MeshStandardMaterial({ color: 0xecfeff, roughness: 0.85 })
    );
    playlandFloor.rotation.x = -Math.PI / 2;
    playlandFloor.position.set(0, 0, -4.5);
    playlandFloor.receiveShadow = true;
    scene.add(playlandFloor);

    // Colored foam zone pads
    const toddlerPad = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 0.08, 8.2),
      new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.7 })
    );
    toddlerPad.position.set(-8.5, 0.04, -4.2);
    toddlerPad.receiveShadow = true;
    scene.add(toddlerPad);

    const mazePad = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.08, 8.2),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.7 })
    );
    mazePad.position.set(0, 0.04, -4.2);
    mazePad.receiveShadow = true;
    scene.add(mazePad);

    const trampPad = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 0.08, 8.2),
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.7 })
    );
    trampPad.position.set(8.5, 0.04, -4.2);
    trampPad.receiveShadow = true;
    scene.add(trampPad);

    // Parent Café Tiered Wood Deck
    const cafeFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 18),
      new THREE.MeshStandardMaterial({ color: 0xf5e6d3, roughness: 0.65 })
    );
    cafeFloor.rotation.x = -Math.PI / 2;
    cafeFloor.position.set(0, 0, 10.5);
    cafeFloor.receiveShadow = true;
    scene.add(cafeFloor);

    // Mall Walls & Bright Skylight Ceiling Ribs
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(32, 10, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
    );
    backWall.position.set(0, 5, -9.2);
    scene.add(backWall);

    // Colorful Topsy Turvy Playland Wall Banner
    const bannerCanvas = document.createElement("canvas");
    bannerCanvas.width = 1024;
    bannerCanvas.height = 256;
    const bCtx = bannerCanvas.getContext("2d")!;
    const grad = bCtx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, "#10b981");
    grad.addColorStop(0.5, "#f59e0b");
    grad.addColorStop(1, "#0ea5e9");
    bCtx.fillStyle = grad;
    bCtx.fillRect(0, 0, 1024, 256);
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "bold 72px sans-serif";
    bCtx.textAlign = "center";
    bCtx.fillText("TOPSY TURVY • PACKAGES MALL", 512, 125);
    bCtx.font = "bold 34px monospace";
    bCtx.fillStyle = "#fef3c7";
    bCtx.fillText("2ND FLOOR PLAYLAND & PARENT CAFÉ • 11 AM – 11 PM", 512, 185);
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    bannerTex.colorSpace = THREE.SRGBColorSpace;
    const bannerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 4.2),
      new THREE.MeshBasicMaterial({ map: bannerTex })
    );
    bannerMesh.position.set(0, 6.6, -8.95);
    scene.add(bannerMesh);

    // =========================================================================
    // 3. ZONE 1 (CENTER): MULTI-LEVEL SOFT-PLAY MAZE & SLIDES
    // =========================================================================
    const mazeGroup = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 });
    const deckMat1 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
    const deckMat2 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 });
    const deckMat3 = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });

    // 4 Corner & Center Foam Pillars
    const pillarCoords = [
      [-3.2, -6.8],
      [3.2, -6.8],
      [-3.2, -1.8],
      [3.2, -1.8],
      [0, -4.3],
    ];
    pillarCoords.forEach(([px, pz]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.6, 12), pillarMat);
      p.position.set(px, 2.3, pz);
      p.castShadow = true;
      mazeGroup.add(p);
    });

    // Tier 1, Tier 2, Tier 3 Padded Decks
    const deck1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.25, 5.2), deckMat1);
    deck1.position.set(0, 1.5, -4.3);
    deck1.castShadow = true;
    deck1.receiveShadow = true;
    mazeGroup.add(deck1);

    const deck2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.25, 4.0), deckMat2);
    deck2.position.set(0, 3.0, -4.8);
    deck2.castShadow = true;
    mazeGroup.add(deck2);

    const deck3 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 2.6), deckMat3);
    deck3.position.set(0, 4.3, -5.2);
    deck3.castShadow = true;
    mazeGroup.add(deck3);

    // Translucent Safety Mesh Walls
    const meshWallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 2.8), meshWallMat);
    frontMesh.position.set(0, 2.9, -1.8);
    mazeGroup.add(frontMesh);

    // Twin Bright Wave Slides
    const slideMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25 });
    [-1.4, 1.4].forEach((sx) => {
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.15, 3.4), slideMat);
      slide.position.set(sx, 1.55, -1.1);
      slide.rotation.x = 0.58;
      slide.castShadow = true;
      mazeGroup.add(slide);
    });

    // Overhead Crawl Tunnel
    const tunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 3.2, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.4, side: THREE.DoubleSide })
    );
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.set(0, 3.65, -3.5);
    mazeGroup.add(tunnel);

    scene.add(mazeGroup);

    // =========================================================================
    // 4. ZONE 2 (LEFT WING): TODDLER BALL PIT & MINI KITCHENS
    // =========================================================================
    const toddlerGroup = new THREE.Group();
    const pitWallMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.5 });

    // Ball Pit Frame
    [
      { w: 4.8, d: 0.3, x: -8.5, z: -2.0 },
      { w: 4.8, d: 0.3, x: -8.5, z: -5.6 },
      { w: 0.3, d: 3.6, x: -10.75, z: -3.8 },
      { w: 0.3, d: 3.6, x: -6.25, z: -3.8 },
    ].forEach((b) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.65, b.d), pitWallMat);
      wall.position.set(b.x, 0.35, b.z);
      wall.castShadow = true;
      toddlerGroup.add(wall);
    });

    // Colorful 3D Balls inside Ball Pit
    const ballColors = [0xf472b6, 0x38bdf8, 0xfacc15, 0x34d399, 0xfb923c];
    const ballGeo = new THREE.SphereGeometry(0.16, 10, 10);
    for (let i = 0; i < 65; i++) {
      const bx = -10.3 + ((i * 37) % 100) / 100 * 3.6;
      const bz = -5.2 + ((i * 53) % 100) / 100 * 2.8;
      const ball = new THREE.Mesh(
        ballGeo,
        new THREE.MeshStandardMaterial({
          color: ballColors[i % ballColors.length],
          roughness: 0.3,
        })
      );
      ball.position.set(bx, 0.24 + (i % 2) * 0.14, bz);
      toddlerGroup.add(ball);
    }

    // Mini Kitchen & Playhouse
    const houseBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.8, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    );
    houseBody.position.set(-8.5, 0.95, -7.2);
    houseBody.castShadow = true;
    toddlerGroup.add(houseBody);

    const houseRoof = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 1.1, 4),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 })
    );
    houseRoof.position.set(-8.5, 2.35, -7.2);
    houseRoof.rotation.y = Math.PI / 4;
    houseRoof.castShadow = true;
    toddlerGroup.add(houseRoof);

    scene.add(toddlerGroup);

    // =========================================================================
    // 5. ZONE 3 (RIGHT WING): TRAMPOLINE & CLIMBING WALL
    // =========================================================================
    const trampGroup = new THREE.Group();
    const trampFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const trampMatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    [
      [7.1, -2.8],
      [9.9, -2.8],
      [7.1, -5.2],
      [9.9, -5.2],
    ].forEach(([tx, tz]) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 2.1), trampFrameMat);
      frame.position.set(tx, 0.25, tz);
      frame.castShadow = true;
      trampGroup.add(frame);

      const mat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.48, 1.65), trampMatMat);
      mat.position.set(tx, 0.26, tz);
      trampGroup.add(mat);
    });

    // Colorful Climbing Wall at Back Right
    const climbWall = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 4.6, 0.45),
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.6 })
    );
    climbWall.position.set(8.5, 2.3, -7.6);
    climbWall.castShadow = true;
    trampGroup.add(climbWall);

    const holdColors = [0xef4444, 0xf59e0b, 0x10b981, 0x8b5cf6];
    for (let h = 0; h < 20; h++) {
      const hold = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshStandardMaterial({ color: holdColors[h % holdColors.length] })
      );
      hold.position.set(
        6.2 + ((h * 29) % 46) / 10,
        0.7 + ((h * 19) % 34) / 10,
        -7.32
      );
      trampGroup.add(hold);
    }

    scene.add(trampGroup);

    // =========================================================================
    // 6. GLASS SIGHTLINE PARTITION BETWEEN PLAYLAND & PARENT CAFÉ
    // =========================================================================
    const glassPanel = new THREE.Mesh(
      new THREE.BoxGeometry(28, 1.35, 0.08),
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.28,
        roughness: 0.08,
        metalness: 0.1,
      })
    );
    glassPanel.position.set(0, 0.72, 1.8);
    scene.add(glassPanel);

    const railTop = new THREE.Mesh(
      new THREE.BoxGeometry(28, 0.08, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 })
    );
    railTop.position.set(0, 1.4, 1.8);
    scene.add(railTop);

    // =========================================================================
    // 7. PARENT CAFÉ SUPERVISION TABLES (ROWS A–F, 48 TABLES)
    // =========================================================================
    const seatMeshes: THREE.Object3D[] = [];
    const seatVisualsMap: Record<
      string,
      {
        tableTop: THREE.Mesh;
        ring: THREE.Mesh;
        isVIP: boolean;
        isReserved: boolean;
      }
    > = {};

    const audienceGroup = new THREE.Group();
    scene.add(audienceGroup);

    // Elevated Café Terraces
    ROWS.forEach((row) => {
      const m = ROW_METRICS[row];
      const terrace = new THREE.Mesh(
        new THREE.BoxGeometry(24, m.y, 1.85),
        new THREE.MeshStandardMaterial({ color: 0xe7d5be, roughness: 0.7 })
      );
      terrace.position.set(0, m.y / 2, m.z);
      terrace.receiveShadow = true;
      scene.add(terrace);
    });

    ROWS.forEach((row) => {
      for (let col = 1; col <= SEATS_PER_ROW; col++) {
        const seatId = `${row}${col}`;
        const spatial = getSeatSpatialData(seatId, stateRef.current.venue);
        const isReserved = PRE_RESERVED_SEATS.includes(seatId);
        const isVIP = spatial.isVIP;

        const tableGroup = new THREE.Group();
        tableGroup.position.set(spatial.x, spatial.y - 0.45, spatial.z);

        // Table Pedestal
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.16, 0.65, 10),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.4 })
        );
        leg.position.y = 0.32;
        tableGroup.add(leg);

        // Table Top
        const tableTop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.42, 0.06, 20),
          new THREE.MeshStandardMaterial({
            color: isReserved ? 0xfca5a5 : isVIP ? 0xfef3c7 : 0xffffff,
            roughness: 0.35,
          })
        );
        tableTop.position.y = 0.68;
        tableTop.castShadow = true;
        tableTop.userData = { seatId };
        tableGroup.add(tableTop);
        seatMeshes.push(tableTop);

        // Selection / Active Highlight Ring
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.44, 0.52, 24),
          new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
          })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.72;
        tableGroup.add(ring);

        // Tiny Coffee Cup on Table
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.04, 0.09, 10),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
        );
        cup.position.set(0.12, 0.75, -0.08);
        tableGroup.add(cup);

        // Parent Chair behind table
        const chair = new THREE.Mesh(
          new THREE.BoxGeometry(0.46, 0.45, 0.42),
          new THREE.MeshStandardMaterial({
            color: isVIP ? 0xd97706 : 0x334155,
            roughness: 0.6,
          })
        );
        chair.position.set(0, 0.25, 0.42);
        chair.userData = { seatId };
        tableGroup.add(chair);
        seatMeshes.push(chair);

        scene.add(tableGroup);
        seatVisualsMap[seatId] = { tableTop, ring, isVIP, isReserved };

        if (isReserved) {
          const prof = AUDIENCE_PROFILES[(col + row.charCodeAt(0)) % AUDIENCE_PROFILES.length];
          const guest = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.14, 0.35, 6, 8),
            new THREE.MeshStandardMaterial({ color: prof.clothing, roughness: 0.7 })
          );
          guest.position.set(spatial.x, spatial.y + 0.25, spatial.z + 0.42);
          audienceGroup.add(guest);
        }
      }
    });

    // =========================================================================
    // 8. INTERACTION: DRAG TO LOOK / ORBIT & CLICK TABLE TO SWITCH SIGHTLINE
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let dragDist = 0;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDist = 0;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      dragDist += Math.hypot(dx, dy);
      prevX = e.clientX;
      prevY = e.clientY;

      if (stateRef.current.cameraMode === "pov") {
        cameraStateRef.current.yawOffset = THREE.MathUtils.clamp(
          cameraStateRef.current.yawOffset - dx * 0.004,
          -1.2,
          1.2
        );
        cameraStateRef.current.pitchOffset = THREE.MathUtils.clamp(
          cameraStateRef.current.pitchOffset - dy * 0.004,
          -0.65,
          0.65
        );
      } else {
        cameraStateRef.current.orbitTheta -= dx * 0.006;
        cameraStateRef.current.orbitPhi = THREE.MathUtils.clamp(
          cameraStateRef.current.orbitPhi - dy * 0.005,
          0.35,
          1.35
        );
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      if (dragDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(seatMeshes, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData?.seatId;
          if (hitId) onSelectSeatRef.current(hitId);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (stateRef.current.cameraMode === "overview") {
        cameraStateRef.current.orbitRadius = THREE.MathUtils.clamp(
          cameraStateRef.current.orbitRadius + e.deltaY * 0.015,
          11,
          34
        );
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // =========================================================================
    // 9. RENDER LOOP
    // =========================================================================
    const currentCamPos = new THREE.Vector3(0, 3, 10);
    const currentLookAt = new THREE.Vector3(0, 2, -4);
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const st = stateRef.current;

      // Update lighting mode (Daylight Mall vs Evening Party Glow)
      const isDaylight = st.lightingMode === "house";
      const targetBg = isDaylight ? 0xdbeafe : 0x1e1b4b;
      (scene.background as THREE.Color).lerp(new THREE.Color(targetBg), 0.08);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(scene.background as THREE.Color);
      }
      hemiLight.intensity = THREE.MathUtils.lerp(hemiLight.intensity, isDaylight ? 1.35 : 0.75, 0.08);
      mainSunLight.intensity = THREE.MathUtils.lerp(mainSunLight.intensity, isDaylight ? 1.45 : 0.55, 0.08);

      audienceGroup.visible = st.audienceVisible;

      // Update table highlight states
      Object.entries(seatVisualsMap).forEach(([id, vis]) => {
        const isSel = st.selectedSeats.includes(id);
        const isAct = st.activeSeat === id;
        const mat = vis.ring.material as THREE.MeshBasicMaterial;
        if (isAct) {
          mat.color.setHex(0xffffff);
          mat.opacity = 0.95;
        } else if (isSel) {
          mat.color.setHex(0xf59e0b);
          mat.opacity = 0.85;
        } else {
          mat.opacity = 0;
        }
      });

      // Update Camera
      if (st.cameraMode === "pov") {
        const sp = getSeatSpatialData(st.activeSeat, st.venue);
        targetCamPos.set(sp.x, sp.eyeHeight + 0.15, sp.z + 0.35);
        const yaw = cameraStateRef.current.yawOffset;
        const pitch = cameraStateRef.current.pitchOffset;
        targetLookAt.set(
          sp.x + Math.sin(yaw) * 10,
          2.2 + Math.sin(pitch) * 6,
          -4.5 + (1 - Math.cos(yaw)) * 4
        );
      } else {
        const { orbitTheta, orbitPhi, orbitRadius } = cameraStateRef.current;
        targetCamPos.set(
          Math.sin(orbitTheta) * Math.sin(orbitPhi) * orbitRadius,
          Math.cos(orbitPhi) * orbitRadius + 2.5,
          Math.cos(orbitTheta) * Math.sin(orbitPhi) * orbitRadius + 1.5
        );
        targetLookAt.set(0, 1.5, -1.0);
      }

      currentCamPos.lerp(targetCamPos, 0.09);
      currentLookAt.lerp(targetLookAt, 0.09);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      {showHelperTooltip && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-[11px] font-mono text-zinc-200">
          {cameraMode === "pov"
            ? "Drag to look around Playland • Click any Café Table to switch sightline"
            : "Drag to orbit 2nd-floor Playland • Scroll to zoom"}
        </div>
      )}
    </div>
  );
};
