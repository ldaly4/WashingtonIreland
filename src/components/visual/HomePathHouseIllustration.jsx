import { motion, useReducedMotion } from "motion/react";
import { getHouseProgressSummary, getUnlockedParts, housePartLabels } from "../../data/buildingStages";

const colours = {
  ink: "#10213f",
  cream: "#fbfaf2",
  blue: "#2767c6",
  yellow: "#f4c84a",
  green: "#1e6b45",
  coral: "#e66d4f",
  sky: "#cfe4f7",
  brick: "#a94f3d",
};

function Part({ show, children, delay = 0, reducedMotion }) {
  const shouldReduce = reducedMotion || useReducedMotion();
  if (!show) return null;
  return <motion.g
    initial={shouldReduce ? false : { opacity: 0, y: 12, scale: .96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: .55, delay, ease: "easeOut" }}
  >
    {children}
  </motion.g>;
}

export default function HomePathHouseIllustration({ stage = 0, completedParts, height = 420, reducedMotion = false, onPartSelect }) {
  const parts = new Set(getUnlockedParts({ stage, completedParts }));
  const summary = getHouseProgressSummary({ stage, completedParts });
  const selectable = typeof onPartSelect === "function";
  const choose = part => selectable && parts.has(part) && onPartSelect(part);
  return <figure className="house-illustration" style={{ minHeight: height }} aria-label={summary}>
    <svg viewBox="0 0 720 520" role="img" aria-label={summary}>
      <rect width="720" height="520" fill={colours.sky} />
      <path d="M0 390h720v130H0z" fill="#dceccf" stroke={colours.ink} strokeWidth="8" />
      <path d="M132 430c88-48 211-53 324-18 51 16 87 37 132 34" fill="none" stroke={colours.green} strokeWidth="16" strokeLinecap="round" strokeDasharray="26 18" />
      <Part show={parts.has("garden")} delay={.12} reducedMotion={reducedMotion}>
        <circle cx="112" cy="366" r="33" fill={colours.green} stroke={colours.ink} strokeWidth="7" onClick={() => choose("garden")} />
        <rect x="104" y="390" width="17" height="40" fill="#8a5a34" stroke={colours.ink} strokeWidth="5" />
        <circle cx="608" cy="374" r="26" fill={colours.green} stroke={colours.ink} strokeWidth="7" onClick={() => choose("garden")} />
        <rect x="601" y="398" width="15" height="34" fill="#8a5a34" stroke={colours.ink} strokeWidth="5" />
      </Part>
      <Part show={parts.has("path")} delay={.18} reducedMotion={reducedMotion}>
        <path d="M334 386c-27 39-76 72-142 96h254c-43-22-63-53-55-96z" fill={colours.yellow} stroke={colours.ink} strokeWidth="7" onClick={() => choose("path")} />
      </Part>
      <Part show={parts.has("foundation")} reducedMotion={reducedMotion}>
        <rect x="210" y="356" width="304" height="36" fill="#d9d1c2" stroke={colours.ink} strokeWidth="8" onClick={() => choose("foundation")} />
      </Part>
      <Part show={parts.has("ground-floor")} delay={.08} reducedMotion={reducedMotion}>
        <rect x="236" y="245" width="250" height="114" fill={colours.cream} stroke={colours.ink} strokeWidth="8" onClick={() => choose("ground-floor")} />
      </Part>
      <Part show={parts.has("upper-floor")} delay={.16} reducedMotion={reducedMotion}>
        <rect x="260" y="144" width="202" height="104" fill="#fff" stroke={colours.ink} strokeWidth="8" onClick={() => choose("upper-floor")} />
      </Part>
      <Part show={parts.has("roof-frame") && !parts.has("roof")} delay={.2} reducedMotion={reducedMotion}>
        <path d="M238 145 360 62l126 83" fill="none" stroke={colours.coral} strokeWidth="13" strokeLinejoin="round" onClick={() => choose("roof-frame")} />
      </Part>
      <Part show={parts.has("roof")} delay={.2} reducedMotion={reducedMotion}>
        <path d="M230 150 360 60l136 90z" fill={colours.coral} stroke={colours.ink} strokeWidth="8" strokeLinejoin="round" onClick={() => choose("roof")} />
        <path d="M256 150h210" stroke={colours.ink} strokeWidth="6" />
      </Part>
      <Part show={parts.has("chimney")} delay={.26} reducedMotion={reducedMotion}>
        <rect x="426" y="72" width="42" height="76" fill={colours.brick} stroke={colours.ink} strokeWidth="7" onClick={() => choose("chimney")} />
      </Part>
      <Part show={parts.has("windows")} delay={.22} reducedMotion={reducedMotion}>
        {[282, 410].map(x => <g key={x} onClick={() => choose("windows")}>
          <rect x={x} y="280" width="45" height="42" fill={parts.has("lights") ? colours.yellow : colours.sky} stroke={colours.ink} strokeWidth="6" />
          <path d={`M${x + 22.5} 280v42M${x} 301h45`} stroke={colours.ink} strokeWidth="4" />
        </g>)}
        <rect x="318" y="176" width="34" height="34" fill={parts.has("lights") ? colours.yellow : colours.sky} stroke={colours.ink} strokeWidth="6" onClick={() => choose("windows")} />
        <rect x="372" y="176" width="34" height="34" fill={parts.has("lights") ? colours.yellow : colours.sky} stroke={colours.ink} strokeWidth="6" onClick={() => choose("windows")} />
      </Part>
      <Part show={parts.has("front-door")} delay={.28} reducedMotion={reducedMotion}>
        <path d="M346 357v-58a28 28 0 0 1 56 0v58z" fill={colours.green} stroke={colours.ink} strokeWidth="7" onClick={() => choose("front-door")} />
        <circle cx="389" cy="324" r="5" fill={colours.yellow} stroke={colours.ink} strokeWidth="3" />
        <path d="M350 292c10-12 38-12 48 0" fill="none" stroke="#fff" strokeWidth="4" />
      </Part>
      <Part show={parts.has("exterior")} delay={.3} reducedMotion={reducedMotion}>
        <rect x="214" y="224" width="26" height="98" fill={colours.blue} stroke={colours.ink} strokeWidth="6" />
        <rect x="484" y="224" width="26" height="98" fill={colours.blue} stroke={colours.ink} strokeWidth="6" />
      </Part>
      <Part show={parts.has("solar-panels")} delay={.34} reducedMotion={reducedMotion}>
        <g onClick={() => choose("solar-panels")}>
          <rect x="373" y="104" width="62" height="30" fill={colours.blue} stroke={colours.ink} strokeWidth="5" transform="rotate(35 404 119)" />
          <path d="M381 104 429 138M389 98 437 132" stroke="#8fc3ff" strokeWidth="3" />
        </g>
      </Part>
      <Part show={parts.has("energy-upgrades")} delay={.36} reducedMotion={reducedMotion}>
        <circle cx="522" cy="332" r="20" fill={colours.yellow} stroke={colours.ink} strokeWidth="6" />
        <path d="M512 332h20M522 322v20" stroke={colours.ink} strokeWidth="5" />
      </Part>
    </svg>
    <figcaption>{summary}</figcaption>
    <ul className="sr-only">
      {Array.from(parts).map(part => <li key={part}>{housePartLabels[part]}</li>)}
    </ul>
  </figure>;
}
