export const knowledge = [
  {
    id: "mortgage-broker",
    title: "Mortgage broker or adviser",
    jurisdiction: "ROI/NI",
    summary: "A broker or adviser can help compare mortgage options and organise an application.",
    keyPoints: ["You can speak to one before finding a house.", "Many are paid by lenders, but some charge fees.", "Ask how they are paid before proceeding."],
    caution: "A broker is not a final lender decision.",
    officialUrl: "https://www.ccpc.ie/consumers/money/mortgages/",
    sourceLabel: "CCPC mortgage guidance",
    lastReviewed: "2026-07-21",
    relatedRoute: "/buying-guide",
    keywords: ["broker", "adviser", "mortgage", "contact first", "who should i contact"],
  },
  {
    id: "solicitor-conveyancing",
    title: "Solicitor or conveyancer",
    jurisdiction: "ROI/NI",
    summary: "The solicitor or conveyancer handles legal checks and the transfer of ownership.",
    keyPoints: ["They check title, contracts, planning and searches.", "They deal with the seller's legal representative.", "They help you understand when the contract becomes binding."],
    caution: "Ask for a written quote and what is included.",
    officialUrl: "https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-in-buying-a-home/",
    sourceLabel: "Citizens Information",
    lastReviewed: "2026-07-21",
    relatedRoute: "/buying-guide",
    keywords: ["solicitor", "conveyancing", "legal", "contract", "title", "searches"],
  },
  {
    id: "survey-valuation",
    title: "Survey versus valuation",
    jurisdiction: "ROI/NI",
    summary: "A lender valuation is mainly for the lender. An independent survey is for the buyer.",
    keyPoints: ["A valuation does not replace a survey.", "A survey can flag condition issues to investigate.", "A surveyor cannot make legal or lending decisions."],
    caution: "Do not treat listing text or photos as proof of condition.",
    officialUrl: "https://www.scsi.ie/",
    sourceLabel: "SCSI",
    lastReviewed: "2026-07-21",
    relatedRoute: "/check-listing",
    keywords: ["survey", "valuation", "surveyor", "condition", "older", "damp", "roof"],
  },
  {
    id: "booking-deposit",
    title: "Booking deposit",
    jurisdiction: "ROI",
    summary: "A booking deposit is often paid after an offer is accepted in the Republic of Ireland.",
    keyPoints: ["It normally forms part of the overall buyer deposit.", "It is usually refundable before contracts are signed.", "The amount varies."],
    caution: "Confirm refund terms before paying.",
    officialUrl: "https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-in-buying-a-home/",
    sourceLabel: "Citizens Information",
    lastReviewed: "2026-07-21",
    relatedRoute: "/buying-guide",
    keywords: ["booking deposit", "deposit", "refundable", "sale agreed", "offer accepted"],
  },
  {
    id: "cash-beyond-deposit",
    title: "Costs beyond the deposit",
    jurisdiction: "ROI/NI",
    summary: "Buying usually needs separate money for legal, tax, survey, valuation, insurance, moving and a buffer.",
    keyPoints: ["Do not use all savings for the deposit.", "Exact costs vary.", "Keep emergency savings where possible."],
    caution: "Illustrative estimates are not quotes.",
    officialUrl: "https://www.ccpc.ie/consumers/money/mortgages/buying-a-home/",
    sourceLabel: "CCPC buying a home",
    lastReviewed: "2026-07-21",
    relatedRoute: "/savings-plan",
    keywords: ["cash", "costs", "hidden costs", "beyond deposit", "stamp duty", "sdlt", "moving"],
  },
  {
    id: "co-ownership-ni",
    title: "Co-Ownership",
    jurisdiction: "NI",
    summary: "Co-Ownership is a Northern Ireland shared ownership route.",
    keyPoints: ["You buy a share and pay rent on the rest.", "Rules and property limits must be checked with the official provider.", "It is not the same as a standard purchase."],
    caution: "HomePath cannot decide eligibility.",
    officialUrl: "https://www.co-ownership.org/",
    sourceLabel: "Co-Ownership",
    lastReviewed: "2026-07-21",
    relatedRoute: "/advice-centre",
    keywords: ["co-ownership", "northern ireland", "ni", "shared ownership"],
  },
  {
    id: "older-homes",
    title: "Older homes",
    jurisdiction: "ROI/NI",
    summary: "An older home is not automatically a bad purchase, but it may need more investigation.",
    keyPoints: ["Ask about roof, damp, wiring, plumbing, heating, windows, drainage and extensions.", "Use a surveyor for condition.", "Use a solicitor or conveyancer for legal and planning documents."],
    caution: "Do not diagnose defects from a listing alone.",
    officialUrl: "https://www.scsi.ie/",
    sourceLabel: "SCSI",
    lastReviewed: "2026-07-21",
    relatedRoute: "/check-listing",
    keywords: ["older", "renovation", "damp", "rot", "wiring", "plumbing", "roof", "structural"],
  },
];

export function retrieveKnowledge(question = "", route = "") {
  const text = `${question} ${route}`.toLowerCase();
  const scored = knowledge.map(item => ({
    item,
    score: item.keywords.reduce((sum, key) => sum + (text.includes(key) ? 1 : 0), 0),
  }));
  return scored
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.item);
}

export function fallbackKnowledge() {
  return knowledge.slice(0, 4);
}
