export const money = (value, jurisdiction = "roi") =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: jurisdiction === "ni" ? "GBP" : "EUR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)));

export function calculatePosition(data) {
  const income = Number(data.income) || 0;
  const savings = Number(data.savings) || 0;
  const monthlySavings = Number(data.monthlySavings) || 0;
  const monthlyRent = Number(data.monthlyRent) || 0;
  const monthlyPension = Number(data.monthlyPension) || 0;
  const demonstratedMonthly = monthlySavings + monthlyRent + monthlyPension;
  // Illustrative only: capital supported by the entered monthly commitments over
  // 30 years at 6%. Lenders assess affordability using their own stress tests.
  const monthlyRate = .06 / 12;
  const repaymentSupportedLoan = demonstratedMonthly > 0
    ? demonstratedMonthly * (1 - Math.pow(1 + monthlyRate, -360)) / monthlyRate
    : 0;
  const ni = data.jurisdiction === "ni";
  const fixedCosts = ni ? 4200 : 6300;

  if (ni) {
    const borrowingLow = income * 4;
    const borrowingHigh = income * 4.5;
    const maxAt5 = Math.min(borrowingHigh / 0.95, Math.max(0, (borrowingHigh + savings - fixedCosts) / 1.05));
    const maxAt10 = Math.min(borrowingHigh / 0.9, Math.max(0, (borrowingHigh + savings - fixedCosts) / 1.1));
    const target = Number(data.target) || Math.floor(Math.max(maxAt5, maxAt10) / 5000) * 5000;
    const costs = fixedCosts; // SDLT is not included: UK thresholds and reliefs can change.
    return {
      jurisdiction: "ni", income, savings, monthlySavings, monthlyRent,
      monthlyPension, demonstratedMonthly, repaymentSupportedLoan,
      borrowingLow, borrowingHigh,
      purchaseLow: Math.floor(Math.min(borrowingLow / .95, maxAt5) / 5000) * 5000,
      purchaseHigh: Math.floor(Math.max(maxAt5, maxAt10) / 5000) * 5000,
      target, costs,
      fiveDeposit: target * .05, tenDeposit: target * .1,
      fiveGap: Math.max(0, target * .05 + costs - savings),
      tenGap: Math.max(0, target * .1 + costs - savings),
    };
  }

  const multiplier = data.firstTime === "yes" ? 4 : data.firstTime === "no" ? 3.5 : 3.5;
  const borrowingLow = income * multiplier;
  const borrowingHigh = income * (data.firstTime === "unsure" ? 4 : multiplier);
  // A standard ROI purchase is modelled as mortgage + 10% deposit + 1% stamp duty + fixed costs.
  const maxByCash = (borrowingHigh + savings - fixedCosts) / 1.11;
  const maxByLoan = borrowingHigh / .9;
  const purchaseHigh = Math.floor(Math.max(0, Math.min(maxByCash, maxByLoan)) / 5000) * 5000;
  const purchaseLow = Math.max(0, purchaseHigh - 10000);
  const target = Number(data.target) || purchaseHigh;
  const costs = target * .01 + fixedCosts;
  return {
    jurisdiction: "roi", income, savings, monthlySavings, monthlyRent,
    monthlyPension, demonstratedMonthly, repaymentSupportedLoan,
    borrowingLow, borrowingHigh,
    purchaseLow, purchaseHigh, target, costs,
    deposit: target * .1,
    gap: Math.max(0, target * .1 + costs - savings),
    financeGap: Math.max(0, target - borrowingHigh - savings),
  };
}

export function analyseListing(data) {
  const text = (data.description || "").toLowerCase();
  const ni = /belfast|derry|londonderry|newry|lisburn|antrim|down|armagh|tyrone|fermanagh/.test((data.location || "").toLowerCase()) ||
    ["propertypal", "propertynews"].includes(data.site);
  const price = Number(data.price) || 0;
  const flags = [
    ["in need of modernisation", "Budget for more than decoration and ask when the wiring, heating and roof were last updated."],
    ["excellent potential", "Often signals work is needed. Ask exactly what the agent believes could be changed."],
    ["vacant", "Check how long it has been empty, whether services work and whether insurance or lending may be affected."],
    ["requires refurbishment", "Allow for a detailed survey and costed works before deciding what you can pay."],
    ["cash buyers", "This may mean lenders see a problem. Ask why mortgage buyers are not being invited."],
    ["ber exempt", "Ask why no energy rating is required and expect less certainty about running costs."],
    ["subject to planning", "The suggested use or extension is not guaranteed. Check the relevant planning authority."],
    ["turnkey", "It should be ready to occupy, but still inspect finishes, heating, windows and appliances."],
    ["newly renovated", "Ask who did the work, whether approvals were needed and if guarantees are available."],
    ["investment opportunity", "May be aimed at landlords; check tenancy status and whether it suits owner-occupation."],
    ["derelict", "Expect major unknowns around structure, services, planning, grants and mortgageability."],
    ["unmortgageable", "A standard mortgage may not be available in its current condition."],
    ["fire safety", "Ask for reports, remediation plans, costs and the lender’s position."],
    ["management fees", "Ask for the annual amount, accounts, sinking fund and planned works."],
  ].filter(([term]) => text.includes(term));
  let level = "low", bufferRate = .015;
  if (/cash buyers|derelict|unmortgageable|major renovation/.test(text) || data.work === "major") [level, bufferRate] = ["very high", .2];
  else if (/requires refurbishment|vacant/.test(text) || data.work === "some") [level, bufferRate] = ["high", .12];
  else if (/modernisation|excellent potential/.test(text) || data.work === "cosmetic") [level, bufferRate] = ["medium", .05];
  return {
    ni, price, flags, level,
    depositLow: price * (ni ? .05 : .1),
    depositHigh: price * .1,
    costs: ni ? 4200 : price * .01 + 6300,
    renovationLow: price * bufferRate,
    renovationHigh: price * bufferRate * 1.5,
  };
}
