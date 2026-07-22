import { useState } from "react";
import HomePathHouse3D from "../components/visual/HomePathHouse3D";
import HomePathHouseIllustration from "../components/visual/HomePathHouseIllustration";
import { buildingStages, housePartLabels } from "../data/buildingStages";

const partOptions = Object.keys(housePartLabels);

export default function VisualTestPage() {
  const [stage, setStage] = useState(5);
  const [interactive, setInteractive] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [forceReduced, setForceReduced] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [customParts, setCustomParts] = useState([]);
  const completedParts = customParts.length ? customParts : undefined;

  const togglePart = part => setCustomParts(current => current.includes(part) ? current.filter(x => x !== part) : [...current, part]);

  return <div className="page visual-test-page">
    <header className="page-head">
      <p className="eyebrow">Development only</p>
      <h1>HomePath house visual test</h1>
      <p>This route is only registered in development mode. It tests the reusable 3D house, fallback illustration, stages, controls and callbacks.</p>
    </header>

    <section className="visual-test-grid">
      <aside className="visual-test-controls">
        <label className="field"><span>Stage {stage}</span><input type="range" min="0" max="10" value={stage} onChange={e => setStage(Number(e.target.value))} /></label>
        <div className="visual-stage-list">{buildingStages.map(item => <button key={item.id} className={stage === item.stage ? "active" : ""} onClick={() => setStage(item.stage)}>{item.stage}. {item.label}</button>)}</div>
        <label className="check"><input type="checkbox" checked={interactive} onChange={e => setInteractive(e.target.checked)} /> Interactive 3D controls</label>
        <label className="check"><input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} /> Auto-rotate</label>
        <label className="check"><input type="checkbox" checked={forceReduced} onChange={e => setForceReduced(e.target.checked)} /> Simulate reduced motion</label>
        <label className="check"><input type="checkbox" checked={forceFallback} onChange={e => setForceFallback(e.target.checked)} /> Force fallback illustration</label>
        <label className="check"><input type="checkbox" checked={mobile} onChange={e => setMobile(e.target.checked)} /> Mobile-width container</label>
        <details>
          <summary>Optional completedParts mode</summary>
          <div className="part-picker">{partOptions.map(part => <label key={part}><input type="checkbox" checked={customParts.includes(part)} onChange={() => togglePart(part)} /> {housePartLabels[part]}</label>)}</div>
          <button className="guide-inline-button" onClick={() => setCustomParts([])}>Clear custom parts</button>
        </details>
        <p className="selected-part-output">Selected part: {selectedPart ? housePartLabels[selectedPart] : "none yet"}</p>
      </aside>

      <div className={mobile ? "visual-test-mobile" : "visual-test-canvas"}>
        <HomePathHouse3D
          stage={stage}
          completedParts={completedParts}
          interactive={interactive}
          autoRotate={autoRotate}
          showEnvironment
          height={420}
          forceFallback={forceFallback}
          reducedMotion={forceReduced}
          onPartSelect={setSelectedPart}
        />
      </div>
    </section>

    <section className="plain-card">
      <h2>Fallback-only preview</h2>
      <HomePathHouseIllustration stage={stage} completedParts={completedParts} height={300} reducedMotion={forceReduced} onPartSelect={setSelectedPart} />
    </section>
  </div>;
}
