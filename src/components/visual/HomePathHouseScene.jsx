import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { getUnlockedParts } from "../../data/buildingStages";
import Foundation from "./houseParts/Foundation";
import GroundFloor from "./houseParts/GroundFloor";
import UpperFloor from "./houseParts/UpperFloor";
import Roof from "./houseParts/Roof";
import Windows from "./houseParts/Windows";
import FrontDoor from "./houseParts/FrontDoor";
import Chimney from "./houseParts/Chimney";
import Garden from "./houseParts/Garden";
import SolarPanels from "./houseParts/SolarPanels";

const revealDurations = {
  foundation: 900,
  "ground-floor": 1050,
  "front-door": 800,
  windows: 800,
  "upper-floor": 1050,
  "roof-frame": 850,
  roof: 950,
  chimney: 700,
  exterior: 700,
  garden: 1100,
  path: 900,
  "solar-panels": 800,
  "energy-upgrades": 700,
  lights: 700,
};

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function PartReveal({ partId, children, reducedMotion, onSelect }) {
  const group = useRef(null);
  const start = useRef(null);
  const { invalidate, gl } = useThree();
  const duration = revealDurations[partId] || 900;
  const selectable = typeof onSelect === "function";

  useEffect(() => {
    start.current = reducedMotion ? null : performance.now();
    if (group.current) {
      group.current.scale.setScalar(reducedMotion ? 1 : .04);
      group.current.position.y = reducedMotion ? 0 : -.16;
    }
    invalidate();
  }, [partId, reducedMotion, invalidate]);

  useFrame(() => {
    if (!group.current || reducedMotion || start.current === null) return;
    const progress = clamp01((performance.now() - start.current) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    group.current.scale.setScalar(.04 + eased * .96);
    group.current.position.y = (1 - eased) * -.16;
    if (progress >= 1) start.current = null;
    else invalidate();
  });

  return <group
    ref={group}
    onClick={event => { event.stopPropagation(); if (selectable) onSelect(partId); }}
    onPointerOver={event => { if (selectable) { event.stopPropagation(); gl.domElement.style.cursor = "pointer"; } }}
    onPointerOut={() => { if (selectable) gl.domElement.style.cursor = "auto"; }}
  >
    {children}
  </group>;
}

function HouseModel({ stage, completedParts, interactive, reducedMotion, onPartSelect }) {
  const parts = new Set(getUnlockedParts({ stage, completedParts }));
  const select = part => interactive && parts.has(part) && onPartSelect?.(part);
  return <group rotation={[0, -.62, 0]} position={[0, -.15, 0]}>
    {(parts.has("garden") || parts.has("path")) && <PartReveal partId="garden" reducedMotion={reducedMotion} onSelect={select}><Garden showPath={parts.has("path")} /></PartReveal>}
    {!parts.has("garden") && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.02, 0]}>
      <circleGeometry args={[3.25, 32]} />
      <meshStandardMaterial color="#dceccf" roughness={.9} />
    </mesh>}
    {parts.has("foundation") && <PartReveal partId="foundation" reducedMotion={reducedMotion} onSelect={select}><Foundation /></PartReveal>}
    {parts.has("ground-floor") && <PartReveal partId="ground-floor" reducedMotion={reducedMotion} onSelect={select}><GroundFloor /></PartReveal>}
    {parts.has("upper-floor") && <PartReveal partId="upper-floor" reducedMotion={reducedMotion} onSelect={select}><UpperFloor /></PartReveal>}
    {parts.has("roof-frame") && !parts.has("roof") && <PartReveal partId="roof-frame" reducedMotion={reducedMotion} onSelect={select}><Roof frameOnly /></PartReveal>}
    {parts.has("roof") && <PartReveal partId="roof" reducedMotion={reducedMotion} onSelect={select}><Roof /></PartReveal>}
    {parts.has("front-door") && <PartReveal partId="front-door" reducedMotion={reducedMotion} onSelect={select}><FrontDoor /></PartReveal>}
    {parts.has("windows") && <PartReveal partId="windows" reducedMotion={reducedMotion} onSelect={select}><Windows lit={parts.has("lights")} onSelect={() => select("windows")} /></PartReveal>}
    {parts.has("chimney") && <PartReveal partId="chimney" reducedMotion={reducedMotion} onSelect={select}><Chimney /></PartReveal>}
    {parts.has("solar-panels") && <PartReveal partId="solar-panels" reducedMotion={reducedMotion} onSelect={select}><SolarPanels /></PartReveal>}
    {parts.has("energy-upgrades") && <PartReveal partId="energy-upgrades" reducedMotion={reducedMotion} onSelect={select}>
      <mesh position={[1.82, .42, -1.15]}>
        <cylinderGeometry args={[.18, .18, .12, 18]} />
        <meshStandardMaterial color="#f4c84a" emissive="#f4c84a" emissiveIntensity={.25} />
      </mesh>
    </PartReveal>}
  </group>;
}

function SceneResetter({ resetKey }) {
  const { camera, controls, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(4.8, 3.2, 5.8);
    camera.lookAt(0, 1.15, 0);
    controls?.target?.set(0, 1.15, 0);
    controls?.update?.();
    invalidate();
  }, [resetKey, camera, controls, invalidate]);
  return null;
}

export default function HomePathHouseScene({
  stage = 0,
  completedParts,
  interactive = true,
  autoRotate = false,
  showEnvironment = true,
  height = 420,
  reducedMotion = false,
  resetKey = 0,
  onPartSelect,
}) {
  const safeAutoRotate = autoRotate && !reducedMotion;
  return <Canvas
    className="house-canvas"
    style={{ height }}
    camera={{ position: [4.8, 3.2, 5.8], fov: 42, near: .1, far: 100 }}
    dpr={[1, 1.5]}
    frameloop="demand"
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
  >
    {showEnvironment && <color attach="background" args={["#cfe4f7"]} />}
    <ambientLight intensity={1.1} />
    <directionalLight position={[4, 7, 5]} intensity={1.8} castShadow={false} />
    <HouseModel stage={stage} completedParts={completedParts} interactive={interactive} reducedMotion={reducedMotion} onPartSelect={onPartSelect} />
    <ContactShadows position={[0, -.04, 0]} opacity={.22} scale={7} blur={2.4} far={4} frames={1} />
    <SceneResetter resetKey={resetKey} />
    {interactive && <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom
      autoRotate={safeAutoRotate}
      autoRotateSpeed={.45}
      minDistance={4.8}
      maxDistance={8}
      minPolarAngle={Math.PI / 4.3}
      maxPolarAngle={Math.PI / 2.18}
      target={[0, 1.15, 0]}
    />}
  </Canvas>;
}
