export const housePartLabels = {
  foundation: "Foundation",
  "ground-floor": "Ground-floor structure",
  "front-door": "Front door",
  windows: "Ground-floor windows",
  "upper-floor": "Upper floor",
  "roof-frame": "Roof frame",
  roof: "Completed roof",
  chimney: "Chimney",
  exterior: "Exterior details",
  garden: "Garden",
  path: "Path",
  "solar-panels": "Solar panels",
  "energy-upgrades": "Energy upgrades",
  lights: "Warm interior lights",
};

export const buildingStages = [
  { stage: 0, id: "empty-plot", label: "Empty plot", unlockedParts: [] },
  { stage: 1, id: "foundation", label: "Foundation", unlockedParts: ["foundation"] },
  { stage: 2, id: "ground-floor", label: "Ground-floor structure", unlockedParts: ["foundation", "ground-floor"] },
  { stage: 3, id: "door-windows", label: "Door and ground-floor windows", unlockedParts: ["foundation", "ground-floor", "front-door", "windows"] },
  { stage: 4, id: "upper-floor", label: "Upper floor", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor"] },
  { stage: 5, id: "roof-frame", label: "Roof frame", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof-frame"] },
  { stage: 6, id: "completed-roof", label: "Completed roof", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof"] },
  { stage: 7, id: "exterior-details", label: "Chimney and exterior details", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof", "chimney", "exterior"] },
  { stage: 8, id: "garden-path", label: "Garden and path", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof", "chimney", "exterior", "garden", "path"] },
  { stage: 9, id: "energy-upgrades", label: "Solar panels and energy upgrades", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof", "chimney", "exterior", "garden", "path", "solar-panels", "energy-upgrades"] },
  { stage: 10, id: "completed-home", label: "Completed home", unlockedParts: ["foundation", "ground-floor", "front-door", "windows", "upper-floor", "roof", "chimney", "exterior", "garden", "path", "solar-panels", "energy-upgrades", "lights"] },
];

export function clampStage(stage = 0) {
  const numeric = Number(stage);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(10, Math.round(numeric)));
}

export function getBuildingStage(stage = 0) {
  return buildingStages.find(item => item.stage === clampStage(stage)) || buildingStages[0];
}

export function getUnlockedParts({ stage = 0, completedParts } = {}) {
  if (Array.isArray(completedParts)) {
    return Array.from(new Set(completedParts.filter(part => housePartLabels[part])));
  }
  return getBuildingStage(stage).unlockedParts;
}

export function getHouseProgressSummary({ stage = 0, completedParts } = {}) {
  const safeStage = clampStage(stage);
  const parts = getUnlockedParts({ stage: safeStage, completedParts });
  const labels = parts.map(part => housePartLabels[part]).filter(Boolean);
  const stageLabel = getBuildingStage(safeStage).label;
  const partText = labels.length ? labels.join(", ") : "no house parts completed yet";
  const priorityText = Array.isArray(completedParts) ? " Custom completed-parts mode is being used." : "";
  return `HomePath house progress: stage ${safeStage} of 10, ${stageLabel}. ${partText}.${priorityText}`;
}
