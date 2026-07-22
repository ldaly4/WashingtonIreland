import React, { Suspense, lazy, useMemo, useState } from "react";
import HomePathHouseErrorBoundary from "./HomePathHouseErrorBoundary";
import HomePathHouseIllustration from "./HomePathHouseIllustration";
import HomePathHouseLoader from "./HomePathHouseLoader";
import useReducedMotionPreference from "../../hooks/useReducedMotionPreference";
import useWebGLSupport from "../../hooks/useWebGLSupport";
import { clampStage, getBuildingStage, getHouseProgressSummary, getUnlockedParts, housePartLabels } from "../../data/buildingStages";

const LazyHouseScene = lazy(() => import("./HomePathHouseScene"));

export default function HomePathHouse3D({
  stage = 0,
  completedParts,
  interactive = true,
  autoRotate = false,
  showEnvironment = true,
  height = 420,
  onPartSelect,
  forceFallback = false,
  reducedMotion: reducedMotionOverride,
}) {
  const reducedMotion = useReducedMotionPreference(reducedMotionOverride);
  const webglSupported = useWebGLSupport(forceFallback);
  const [resetKey, setResetKey] = useState(0);
  const [selectedPart, setSelectedPart] = useState("");
  const safeStage = clampStage(stage);
  const parts = useMemo(() => getUnlockedParts({ stage: safeStage, completedParts }), [safeStage, completedParts]);
  const summary = getHouseProgressSummary({ stage: safeStage, completedParts });
  const stageLabel = getBuildingStage(safeStage).label;
  const selectPart = part => {
    setSelectedPart(part);
    onPartSelect?.(part);
  };
  const fallbackProps = { stage: safeStage, completedParts, height, reducedMotion, onPartSelect: interactive ? selectPart : undefined };

  return <section className="house-3d-shell" style={{ "--house-height": `${height}px` }} aria-label={summary}>
    <div className="house-3d-stage" style={{ minHeight: height }}>
      {webglSupported ? <HomePathHouseErrorBoundary resetKey={resetKey} fallbackProps={fallbackProps}>
        <Suspense fallback={<HomePathHouseLoader stage={safeStage} height={height} />}>
          <LazyHouseScene
            stage={safeStage}
            completedParts={completedParts}
            interactive={interactive}
            autoRotate={autoRotate && !reducedMotion}
            showEnvironment={showEnvironment}
            height={height}
            reducedMotion={reducedMotion}
            resetKey={resetKey}
            onPartSelect={interactive ? selectPart : undefined}
          />
        </Suspense>
      </HomePathHouseErrorBoundary> : <div className="house-fallback-note">
        <p>Interactive view unavailable. Showing the illustrated version.</p>
        <HomePathHouseIllustration {...fallbackProps} />
      </div>}
    </div>

    <div className="house-access-panel">
      <p role="status" aria-live="polite">{summary}</p>
      {interactive && <button type="button" className="house-reset-button" onClick={() => setResetKey(key => key + 1)}>Reset view</button>}
      <details open>
        <summary>Unlocked parts</summary>
        {parts.length ? <ul>{parts.map(part => <li key={part}>
          <button type="button" onClick={() => selectPart(part)} disabled={!interactive}>{housePartLabels[part]}</button>
        </li>)}</ul> : <p>Stage {safeStage}: {stageLabel}. The plot is ready for the first piece.</p>}
      </details>
      {selectedPart && <p className="selected-part-output">Selected: {housePartLabels[selectedPart] || selectedPart}</p>}
      {Array.isArray(completedParts) && <small>completedParts mode takes priority over stage when both are supplied.</small>}
    </div>
  </section>;
}
