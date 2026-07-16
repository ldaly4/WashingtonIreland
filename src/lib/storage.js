export const SURVEY_URL = "";

export function readStore(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be unavailable in private browsing.
  }
}

export function saveHomePath(data, result) {
  const upfront = result.jurisdiction === "roi"
    ? (result.deposit || 0) + (result.costs || 0)
    : Math.min((result.fiveDeposit || 0) + (result.costs || 0), (result.tenDeposit || 0) + (result.costs || 0));
  const gap = Math.max(0, upfront - (result.savings || 0));
  const profile = {
    jurisdiction: result.jurisdiction,
    targetArea: data.area,
    targetHomeType: data.home,
    roughIncome: Number(data.income) || 0,
    currentSavings: result.savings || 0,
    targetPrice: result.target || 0,
    estimatedBorrowing: result.borrowingHigh || 0,
    estimatedUpfrontCash: upfront,
    estimatedSavingsGap: gap,
    currentMonthlySaving: result.monthlySavings || 0,
    savedAt: new Date().toISOString(),
  };
  writeStore("homepath-profile", profile);
  return profile;
}

export function getCompletedModules() {
  return readStore("homepath-completed-modules", []);
}

export function toggleModuleComplete(id) {
  const current = getCompletedModules();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  writeStore("homepath-completed-modules", next);
  return next;
}

export function researchInviteState() {
  return readStore("homepath-research-invite", { dismissed: false });
}

export function setResearchInvite(value) {
  writeStore("homepath-research-invite", value);
}
