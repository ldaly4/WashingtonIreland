export const defaultDepositPercent = jurisdiction => jurisdiction === "ni" ? 5 : 10;

export function normaliseJurisdiction(value) {
  return value === "ni" ? "ni" : "roi";
}

export function estimateBuyingCosts({ price = 0, jurisdiction = "roi", depositPercent } = {}) {
  const j = normaliseJurisdiction(jurisdiction);
  const safePrice = Math.max(0, Number(price) || 0);
  const percent = Number(depositPercent ?? defaultDepositPercent(j)) || defaultDepositPercent(j);
  const deposit = safePrice * percent / 100;
  const stampOrTax = j === "ni" ? 0 : safePrice * 0.01;
  const legal = j === "ni" ? 2200 : 2500;
  const survey = 650;
  const valuation = 200;
  const insurance = 450;
  const mortgageProtection = j === "ni" ? 0 : 350;
  const moving = 1000;
  const emergencyBuffer = Math.max(2500, safePrice * 0.01);
  const nonDepositCosts = stampOrTax + legal + survey + valuation + insurance + mortgageProtection + moving;
  const totalBeforeBuffer = deposit + nonDepositCosts;
  const total = totalBeforeBuffer + emergencyBuffer;
  return {
    jurisdiction: j,
    price: safePrice,
    depositPercent: percent,
    deposit,
    stampOrTax,
    legal,
    survey,
    valuation,
    insurance,
    mortgageProtection,
    moving,
    emergencyBuffer,
    nonDepositCosts,
    totalBeforeBuffer,
    total,
    items: [
      { id: "deposit", label: "Buyer deposit", amount: deposit, note: `${percent}% of the target property price.` },
      { id: "tax", label: j === "ni" ? "Stamp duty / SDLT check" : "Stamp duty", amount: stampOrTax, note: j === "ni" ? "UK thresholds and reliefs can change, so check the official calculator." : "Illustrated at 1% for a standard purchase." },
      { id: "legal", label: "Legal and tax costs", amount: legal, note: "Solicitor or conveyancer work, contracts and closing/completion." },
      { id: "survey", label: "Survey and valuation", amount: survey + valuation, note: "Independent survey plus lender valuation estimate." },
      { id: "insurance", label: "Insurance and moving", amount: insurance + mortgageProtection + moving, note: "Buildings insurance, moving costs and mortgage protection where relevant." },
      { id: "buffer", label: "Emergency or repair buffer", amount: emergencyBuffer, note: "Kept separate from the deposit where possible." },
    ],
  };
}
