const fitRank = {
  strong: 0,
  worth: 1,
  maybe: 2,
  longer: 3,
  unlikely: 4,
  unknown: 5,
};

export const fitLabels = {
  strong: "Strong route to explore",
  worth: "Worth checking",
  maybe: "May be relevant",
  longer: "Longer-term possibility",
  unlikely: "Less likely based on current information",
  unknown: "Not enough information",
};

export const pathwayGroups = {
  strong: "Strongest routes",
  worth: "Also worth checking",
  maybe: "Also worth checking",
  longer: "Longer-term possibilities",
  unlikely: "Longer-term possibilities",
  unknown: "Longer-term possibilities",
};

const roiSources = {
  privatePurchase: ["CCPC mortgage guidance", "https://www.ccpc.ie/consumers/money/mortgages/"],
  affordablePurchase: ["Affordable Homes", "https://affordablehomes.ie/"],
  firstHome: ["First Home Scheme", "https://www.firsthomescheme.ie/"],
  lahl: ["Local Authority Home Loan", "https://localauthorityhomeloan.ie/"],
  costRental: ["Cost Rental", "https://www.gov.ie/en/service/81d5c-cost-rental-housing/"],
  socialHousing: ["Citizens Information — social housing", "https://www.citizensinformation.ie/en/housing/local-authority-and-social-housing/applying-for-local-authority-housing/"],
  hap: ["Citizens Information — HAP", "https://www.citizensinformation.ie/en/housing/renting-a-home/help-with-renting/housing-assistance-payment/"],
  ahb: ["Approved Housing Bodies", "https://www.gov.ie/en/publication/18c27-approved-housing-bodies/"],
  vacantGrant: ["Vacant Property Refurbishment Grant", "https://www.gov.ie/en/service/f8f1b-vacant-property-refurbishment-grant/"],
};

const niSources = {
  privatePurchase: ["MoneyHelper mortgage guidance", "https://www.moneyhelper.org.uk/en/homes/buying-a-home"],
  coOwnership: ["Co-Ownership", "https://www.co-ownership.org/"],
  socialHousing: ["NI Housing Executive", "https://www.nihe.gov.uk/Housing-Help/Apply-for-a-home"],
  housingAssociation: ["nidirect — housing associations", "https://www.nidirect.gov.uk/articles/housing-associations"],
  privateRenting: ["nidirect — private renting", "https://www.nidirect.gov.uk/information-and-services/private-renting"],
  rentalSupport: ["nidirect — help with housing costs", "https://www.nidirect.gov.uk/articles/help-housing-costs"],
  renovation: ["nidirect — home improvement grants", "https://www.nidirect.gov.uk/articles/home-improvement-grants"],
};

function toNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function labelHousing(value) {
  return {
    renting: "renting privately",
    family: "living with family",
    social: "already in social housing",
    insecure: "temporary or insecure housing",
    other: "another housing situation",
  }[value] || "not specified";
}

function profileFlags(profile = {}) {
  const purchaseHigh = toNum(profile.purchaseHigh);
  const target = toNum(profile.target);
  const savingsGap = toNum(profile.savingsGap);
  const savings = toNum(profile.savings);
  const income = toNum(profile.income);
  const rent = toNum(profile.monthlyRent);
  const householdSize = toNum(profile.householdSize) || 1;
  const hasTarget = target > 0;
  const aboveRange = hasTarget && target > purchaseHigh;
  const withinRange = hasTarget ? target <= purchaseHigh : purchaseHigh > 0;
  const insecure = profile.housing === "insecure" || profile.housingUrgency === "urgent" || profile.housingUrgency === "unsuitable";
  const renting = profile.housing === "renting";
  const wantsBuy = profile.housingGoal === "buy" || profile.housingGoal === "either" || !profile.housingGoal;
  const wantsRent = profile.housingGoal === "rent" || profile.housingGoal === "either";
  const openRenovation = ["cosmetic", "some", "yes"].includes(profile.renovation) || profile.openRenovation === "yes";
  const lowSavings = savings < Math.max(8000, target * 0.04 || 8000);
  const pressure = aboveRange || savingsGap > 0 || lowSavings;
  const householdNeed = householdSize >= 3 || toNum(profile.dependentChildren) > 0 || profile.accessibilityNeed === "yes";
  const firstTime = profile.firstTime === "yes";
  const notFirstTime = profile.firstTime === "no" || profile.previouslyOwned === "yes";
  return { purchaseHigh, target, savingsGap, savings, income, rent, householdSize, hasTarget, aboveRange, withinRange, insecure, renting, wantsBuy, wantsRent, openRenovation, lowSavings, pressure, householdNeed, firstTime, notFirstTime };
}

function pathway(id, name, jurisdiction, source, fields) {
  return { id, name, jurisdiction, source: { label: source[0], url: source[1] }, ...fields };
}

export const housingPathways = [
  pathway("roi-private-purchase", "Private purchase", "roi", roiSources.privatePurchase, {
    offer: "A standard mortgage-and-deposit route where you buy the whole home yourself.",
    limitations: "A lender will assess income, deposit, credit history, spending and the specific property.",
    relatedRoute: "/buying-guide",
    lesson: "Buying explained",
  }),
  pathway("roi-affordable-purchase", "Affordable Purchase", "roi", roiSources.affordablePurchase, {
    offer: "A local authority affordable home may reduce the price you pay compared with the open market.",
    limitations: "Availability is local, property-specific and subject to scheme rules.",
    relatedRoute: "/advice-centre",
    lesson: "Housing options",
  }),
  pathway("roi-first-home", "First Home Scheme", "roi", roiSources.firstHome, {
    offer: "A shared-equity route that could help bridge a gap on an eligible home.",
    limitations: "It only applies in certain situations and can affect future sale or buy-out choices.",
    relatedRoute: "/advice-centre",
    lesson: "Supports to check",
  }),
  pathway("roi-local-authority-home-loan", "Local Authority Home Loan", "roi", roiSources.lahl, {
    offer: "A local authority mortgage route for some buyers who cannot get enough finance from commercial lenders.",
    limitations: "It has detailed lending and property rules and HomePath cannot assess eligibility.",
    relatedRoute: "/advice-centre",
    lesson: "Mortgage routes",
  }),
  pathway("roi-cost-rental", "Cost Rental", "roi", roiSources.costRental, {
    offer: "A rental route where rent is linked to the cost of providing the home, not market rent.",
    limitations: "It is not a route to ownership and supply can be limited.",
    relatedRoute: "/advice-centre",
    lesson: "Rental routes",
  }),
  pathway("roi-social-housing", "Social housing support", "roi", roiSources.socialHousing, {
    offer: "Local authority housing support may help if your housing need and circumstances fit local rules.",
    limitations: "Assessment is made by the local authority and waiting times can be long.",
    relatedRoute: "/advice-centre",
    lesson: "Housing need",
  }),
  pathway("roi-hap", "HAP or supported renting", "roi", roiSources.hap, {
    offer: "Supported renting may help with private rent where a household is assessed for housing support.",
    limitations: "Rules, rent limits and local decisions matter.",
    relatedRoute: "/advice-centre",
    lesson: "Rental supports",
  }),
  pathway("roi-ahb", "Approved Housing Body", "roi", roiSources.ahb, {
    offer: "Approved Housing Bodies provide social and affordable housing in some areas.",
    limitations: "Access usually links to local authority processes or specific schemes.",
    relatedRoute: "/advice-centre",
    lesson: "Community housing",
  }),
  pathway("roi-vacant-renovation", "Vacant-home renovation", "roi", roiSources.vacantGrant, {
    offer: "A cheaper vacant or derelict home may work if the repair budget is realistic and grants are relevant.",
    limitations: "Condition, grant rules, cashflow, time and survey findings are critical.",
    relatedRoute: "/check-listing",
    lesson: "Checking a property",
  }),
  pathway("roi-renting-saving", "Renting while saving", "roi", roiSources.privatePurchase, {
    offer: "A practical holding route while you build the upfront cash target or compare areas.",
    limitations: "Rent can make saving harder, so a monthly plan matters.",
    relatedRoute: "/savings-plan",
    lesson: "Savings plan",
  }),
  pathway("ni-private-purchase", "Private purchase", "ni", niSources.privatePurchase, {
    offer: "A standard mortgage-and-deposit route where you buy the whole home yourself.",
    limitations: "A lender will assess income, deposit, credit history, spending and the specific property.",
    relatedRoute: "/buying-guide",
    lesson: "Buying explained",
  }),
  pathway("ni-co-ownership", "Co-Ownership", "ni", niSources.coOwnership, {
    offer: "A shared ownership route where you buy a share and pay rent on the rest.",
    limitations: "It has property, affordability and scheme rules that must be checked with Co-Ownership.",
    relatedRoute: "/advice-centre",
    lesson: "Shared ownership",
  }),
  pathway("ni-social-housing", "NI social housing", "ni", niSources.socialHousing, {
    offer: "The Housing Executive may assess housing need and access to social housing.",
    limitations: "Points, local supply and household circumstances matter.",
    relatedRoute: "/advice-centre",
    lesson: "Housing need",
  }),
  pathway("ni-housing-association", "Housing association", "ni", niSources.housingAssociation, {
    offer: "Housing associations provide some social and affordable homes in Northern Ireland.",
    limitations: "Routes often link to housing applications and local availability.",
    relatedRoute: "/advice-centre",
    lesson: "Community housing",
  }),
  pathway("ni-private-renting", "Private renting", "ni", niSources.privateRenting, {
    offer: "A rental route that may give time to build savings or keep location options open.",
    limitations: "Rent levels, tenancy terms and deposit rules need checking.",
    relatedRoute: "/savings-plan",
    lesson: "Renting while planning",
  }),
  pathway("ni-rental-support", "Rental support", "ni", niSources.rentalSupport, {
    offer: "Help with housing costs may be worth checking if rent is unaffordable.",
    limitations: "Entitlement depends on personal circumstances and official assessment.",
    relatedRoute: "/advice-centre",
    lesson: "Rental supports",
  }),
  pathway("ni-renovation", "Renovation route", "ni", niSources.renovation, {
    offer: "A lower-priced home needing work may be a route if the survey, budget and timing are realistic.",
    limitations: "Repair costs can grow quickly and grant support is not guaranteed.",
    relatedRoute: "/check-listing",
    lesson: "Checking a property",
  }),
  pathway("ni-renting-saving", "Renting while saving", "ni", niSources.privateRenting, {
    offer: "A practical holding route while you build deposit, costs and confidence.",
    limitations: "Rent can make saving harder, so a monthly plan matters.",
    relatedRoute: "/savings-plan",
    lesson: "Savings plan",
  }),
];

function scorePathway(item, profile, flags) {
  let fit = "maybe";
  const why = [];
  const next = [];

  if (item.id.includes("private-purchase")) {
    if (flags.wantsBuy && flags.withinRange && !flags.lowSavings) fit = "strong";
    else if (flags.wantsBuy && (flags.withinRange || !flags.hasTarget)) fit = "worth";
    else if (flags.wantsBuy && flags.aboveRange) fit = "longer";
    else fit = "maybe";
    why.push(flags.withinRange ? "Your rough buying range is close to the price information entered." : "It gives you a clear baseline before comparing support routes.");
    next.push("Speak to a broker, adviser or lender about a real affordability check.");
  }

  if (item.id.includes("affordable-purchase")) {
    fit = flags.wantsBuy && flags.pressure ? "strong" : flags.wantsBuy ? "worth" : "maybe";
    why.push("Your target or upfront cash position suggests a reduced-price route may be worth checking.");
    next.push("Search your local authority or Affordable Homes listings for your area.");
  }

  if (item.id.includes("first-home")) {
    fit = flags.wantsBuy && flags.firstTime && flags.aboveRange ? "strong" : flags.wantsBuy && flags.firstTime ? "worth" : flags.notFirstTime ? "unlikely" : "maybe";
    why.push("It could matter where mortgage plus deposit does not meet the price of an eligible home.");
    next.push("Check the official scheme rules before assuming it applies.");
  }

  if (item.id.includes("local-authority-home-loan")) {
    fit = flags.wantsBuy && flags.pressure ? "worth" : "maybe";
    why.push("It may be relevant if a commercial mortgage route does not cover what you need.");
    next.push("Check the official Local Authority Home Loan criteria and calculator.");
  }

  if (item.id.includes("cost-rental")) {
    fit = flags.wantsRent || flags.pressure ? "worth" : "maybe";
    why.push("It may help if buying is not realistic yet and private rent is high.");
    next.push("Look for active cost rental schemes in or near your preferred area.");
  }

  if (item.id.includes("social-housing") || item.id.includes("ni-social-housing")) {
    fit = flags.insecure || flags.householdNeed || profile.receivesHousingSupport === "yes" ? "strong" : flags.wantsRent || flags.pressure ? "worth" : "maybe";
    why.push(flags.insecure ? "You indicated your housing situation may be urgent or unsuitable." : "Household circumstances and housing need can matter for this route.");
    next.push(item.jurisdiction === "ni" ? "Read the Housing Executive application guidance." : "Check your local authority’s social housing application guidance.");
  }

  if (item.id.includes("hap") || item.id.includes("rental-support")) {
    fit = flags.renting || flags.wantsRent || flags.insecure ? "worth" : "maybe";
    why.push("You entered information that makes rental support worth understanding, especially if rent is difficult to manage.");
    next.push("Check the official support route and avoid assuming entitlement.");
  }

  if (item.id.includes("ahb") || item.id.includes("housing-association")) {
    fit = flags.insecure || profile.receivesHousingSupport === "yes" ? "worth" : "maybe";
    why.push("Community and social housing providers may be part of the local housing picture.");
    next.push("Check how applications work in your area.");
  }

  if (item.id.includes("vacant-renovation") || item.id.includes("renovation")) {
    fit = flags.openRenovation && flags.pressure ? "worth" : flags.openRenovation ? "maybe" : "unlikely";
    why.push(flags.openRenovation ? "You said you may be open to a home needing work." : "You said you are not looking for a home needing work.");
    next.push("Use Check a house and speak to a surveyor before relying on a renovation route.");
  }

  if (item.id.includes("co-ownership")) {
    fit = flags.wantsBuy && flags.pressure ? "strong" : flags.wantsBuy ? "worth" : "maybe";
    why.push("It may help where buying the whole property is not affordable at the moment.");
    next.push("Check Co-Ownership’s current rules and property criteria.");
  }

  if (item.id.includes("private-renting") || item.id.includes("renting-saving")) {
    fit = flags.pressure || flags.wantsRent ? "worth" : "longer";
    why.push("It can be a sensible holding route while you build savings or compare locations.");
    next.push("Build a savings plan using your rent, savings and upfront-cash target.");
  }

  return {
    ...item,
    fit,
    fitLabel: fitLabels[fit],
    group: pathwayGroups[fit],
    why: why[0] || "It matches some of the broad information you entered.",
    nextStep: next[0] || "Check the official source and compare it with your own situation.",
    rank: fitRank[fit],
  };
}

export function getRelevantHousingPathways(profile = {}, jurisdiction = "roi") {
  const activeJurisdiction = jurisdiction === "ni" ? "ni" : "roi";
  const flags = profileFlags(profile);
  return housingPathways
    .filter(item => item.jurisdiction === activeJurisdiction)
    .map(item => scorePathway(item, profile, flags))
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}

export function broadPathwayInputs(profile = {}, result = {}) {
  const flags = profileFlags({ ...profile, ...result });
  const targetText = flags.hasTarget
    ? flags.aboveRange ? "target appears above rough range" : "target appears close to rough range"
    : "no target price entered";
  return [
    ["Jurisdiction", profile.jurisdiction === "ni" ? "Northern Ireland" : "Republic of Ireland"],
    ["Preferred area", profile.area || profile.localAuthority || "not specified"],
    ["Broad property position", targetText],
    ["Current housing situation", labelHousing(profile.housing)],
    ["Preferred route", profile.housingGoal === "rent" ? "renting" : profile.housingGoal === "buy" ? "buying" : "open to renting or buying"],
    ["Renovation", flags.openRenovation ? "open to some work" : "not seeking work"],
  ];
}
