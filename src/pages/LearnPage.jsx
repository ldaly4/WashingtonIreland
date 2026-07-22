import React, { useState } from "react";
import { Disclaimer } from "../components/Layout";
import { readStore, writeStore } from "../lib/storage";
import { getSupportScheme, schemeWarning, sourceFromScheme } from "../data/supportSchemes";

const STORAGE_KEY = "homepath-towers-progress";

const categories = [
  { id: "foundations", label: "Foundations", name: "Money and savings", stage: "foundation" },
  { id: "ground-floor", label: "Ground floor", name: "Mortgages", stage: "groundFloor" },
  { id: "first-floor", label: "First floor", name: "Finding and viewing a home", stage: "firstFloor" },
  { id: "second-floor", label: "Second floor", name: "Surveys and older homes", stage: "secondFloor" },
  { id: "roof", label: "Roof", name: "Solicitors, contracts and closing", stage: "roof" },
  { id: "front-door", label: "Front door", name: "Public supports and next steps", stage: "door" },
];

const sourceLinks = {
  ccpc: { label: "CCPC mortgage and money guidance", url: "https://www.ccpc.ie/consumers/money/mortgages/" },
  citizens: { label: "Citizens Information buying a home guidance", url: "https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/" },
  scsi: { label: "SCSI surveyor guidance", url: "https://scsi.ie/" },
  nidirect: { label: "nidirect buying and owning a home", url: "https://www.nidirect.gov.uk/information-and-services/buying-selling-and-renting-home" },
  probate: { label: "Courts Service probate guidance", url: "https://www.courts.ie/probate" },
  lawSociety: { label: "Law Society conveyancing guidance", url: "https://www.lawsociety.ie/Public/Legal-guides/Buying-a-home/" },
  ccpcInsurance: { label: "CCPC insurance guidance", url: "https://www.ccpc.ie/consumers/money/insurance/" },
};

const schemeSource = id => sourceFromScheme(id) || sourceLinks.citizens;

function grantTeachText(id, extra = "") {
  const scheme = getSupportScheme(id);
  if (!scheme) return extra;
  const values = scheme.currentValues.map(item => `${item.label}: ${item.value}`).join(" · ");
  return `${scheme.summary} Illustrative current values: ${values}. Last reviewed: ${scheme.lastReviewed}. ${scheme.eligibilityWarning} ${schemeWarning} ${extra}`.trim();
}

const lessonModules = [
  {
    id: "cash-needed",
    title: "How much cash do I actually need?",
    category: "foundations",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Foundation slab added",
    rewardStage: "foundation",
    relatedRoutes: [{ label: "Try this in Savings plan", route: "/savings-plan" }],
    officialSources: [sourceLinks.ccpc, sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have found a home listed at €300,000. You have saved €30,000. Is that enough cash to complete the purchase?" },
      { type: "teach", title: "One clear idea", text: "The deposit is only one part of the cash required. You may also need stamp duty, solicitor fees, survey, valuation, insurance, moving costs and an emergency buffer." },
      {
        type: "mcq",
        prompt: "What is the safest answer?",
        options: [
          "Yes, because it covers a 10% deposit",
          "Possibly, but additional buying costs still need to be included",
          "No, because every buyer needs a 20% deposit",
        ],
        answer: "Possibly, but additional buying costs still need to be included",
        feedback: "Good — the key distinction is that a deposit and total cash needed are not the same thing.",
        misconception: "Not quite — this is a common point of confusion. A 10% deposit may be only one part of the money needed to complete.",
      },
      {
        type: "sort",
        prompt: "Place each item where it belongs.",
        groups: ["Deposit", "Additional buying cost", "Ongoing monthly cost"],
        items: [
          ["10% buyer deposit", "Deposit"],
          ["Stamp duty", "Additional buying cost"],
          ["Solicitor fees", "Additional buying cost"],
          ["Survey", "Additional buying cost"],
          ["Home insurance", "Ongoing monthly cost"],
          ["Mortgage repayment", "Ongoing monthly cost"],
        ],
        feedback: "Exactly. Keeping these separate makes the savings target clearer.",
      },
      { type: "summary", takeaway: "The deposit is only one part of the cash required.", reward: "Foundation added" },
    ],
  },
  {
    id: "broker",
    title: "What does a mortgage broker do?",
    category: "ground-floor",
    jurisdiction: "both",
    estimatedMinutes: 4,
    buildingReward: "First ground-floor wall added",
    rewardStage: "groundFloor",
    relatedRoutes: [{ label: "Check my position", route: "/check-position" }],
    officialSources: [sourceLinks.ccpc],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have not found a property yet. Is it too early to contact a mortgage broker or adviser?" },
      { type: "teach", title: "What they may help with", text: "A broker or adviser may help estimate borrowing, compare providers, explain documents and assist with an application. Ask how they are paid and whether they charge a fee." },
      {
        type: "mcq",
        prompt: "Is it too early to contact one?",
        options: ["Yes", "No", "Only if you already have the full deposit"],
        answer: "No",
        feedback: "That’s right. It can be useful before viewing homes, because it gives you a rough starting point.",
        misconception: "Not quite — you can speak to a broker or adviser before you have chosen a specific home.",
      },
      {
        type: "contact",
        prompt: "Who is the most useful first contact here?",
        options: [
          ["Mortgage broker or adviser", "Understand rough borrowing and documents"],
          ["Surveyor", "Check the condition of a specific home"],
          ["Solicitor", "Handle legal checks after you are further into a purchase"],
        ],
        answer: "Mortgage broker or adviser",
        feedback: "Exactly. The broker or adviser helps with borrowing and application questions.",
      },
      { type: "summary", takeaway: "A broker or adviser can be useful before you have found a property.", reward: "Ground-floor wall added" },
    ],
  },
  {
    id: "booking-deposit",
    title: "Booking deposit versus full buyer deposit",
    category: "foundations",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Front doorway added",
    rewardStage: "door",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "A €350,000 home needs a €35,000 buyer deposit. The estate agent asks for a €7,000 booking deposit after your offer is accepted." },
      { type: "teach", title: "The distinction", text: "A booking deposit is usually paid earlier and normally forms part of the full buyer deposit. The remaining deposit is paid later through the legal process." },
      {
        type: "matching",
        prompt: "Match each amount to the correct meaning.",
        pairs: [
          ["€35,000", "Total buyer deposit"],
          ["€7,000", "Booking deposit"],
          ["€28,000", "Remaining deposit"],
        ],
        feedback: "Good. The booking deposit is not an extra deposit on top of the full buyer deposit.",
      },
      {
        type: "ordering",
        prompt: "Put these payment stages in a sensible order.",
        items: ["Offer accepted", "Booking deposit paid", "Legal checks continue", "Remaining deposit paid before closing"],
        feedback: "That’s right. Always confirm timing and refund rules before paying.",
      },
      { type: "summary", takeaway: "The booking deposit and full buyer deposit are different stages of the same overall cash picture.", reward: "Front doorway added" },
    ],
  },
  {
    id: "survey-valuation",
    title: "Survey versus lender valuation",
    category: "second-floor",
    jurisdiction: "both",
    estimatedMinutes: 4,
    buildingReward: "Windows added",
    rewardStage: "windows",
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [sourceLinks.scsi, sourceLinks.nidirect],
    screens: [
      { type: "scenario", title: "Scenario", text: "The estate agent says the lender valuation found no issue. Does that replace your own survey?" },
      { type: "teach", title: "One clear distinction", text: "A lender valuation is mainly for the lender. An independent survey is for you and can look more closely at the condition and risks of the property." },
      {
        type: "truefalse",
        prompt: "A lender valuation is a replacement for an independent condition survey.",
        answer: false,
        feedback: "Exactly. They serve different purposes.",
        misconception: "Not quite — this is a common point of confusion. The lender valuation is not mainly designed to protect you from condition risks.",
      },
      {
        type: "sort",
        prompt: "Sort the statements.",
        groups: ["Independent survey", "Lender valuation"],
        items: [
          ["Primarily helps the buyer understand condition", "Independent survey"],
          ["Primarily helps the lender assess security", "Lender valuation"],
          ["May flag defects and repair concerns", "Independent survey"],
          ["May be brief and limited", "Lender valuation"],
        ],
        feedback: "Good — that is the practical difference to remember before relying on either.",
      },
      { type: "summary", takeaway: "A valuation is mainly for the lender. A survey is for your protection.", reward: "Windows added" },
    ],
  },
  {
    id: "older-house",
    title: "Should I be afraid of an older house?",
    category: "second-floor",
    jurisdiction: "both",
    estimatedMinutes: 6,
    buildingReward: "Roof outline added",
    rewardStage: "roof",
    relatedRoutes: [{ label: "Use the listing checker", route: "/check-listing" }],
    officialSources: [sourceLinks.scsi, sourceLinks.nidirect],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have seen an older home in a good location. It has space and character, but you are worried about hidden costs." },
      { type: "teach", title: "A balanced view", text: "An older house is not automatically a bad purchase. It may offer location, space or value, but its condition should be properly investigated before you commit." },
      {
        type: "house",
        prompt: "Select areas you would want checked before relying on the listing.",
        areas: [
          ["roof", "Roof", "Look for missing slates, leaks or sagging. A surveyor or roofer may need to inspect it."],
          ["chimney", "Chimney", "Check visible cracks, leaning or damp staining. A surveyor can advise if specialist checks are needed."],
          ["windows", "Windows", "Look at age, seals, ventilation and signs of condensation. This is often routine but can affect comfort and cost."],
          ["walls", "Walls", "Cracks, bulges or damp should be checked carefully. Ask a surveyor about cause and significance."],
          ["fuse", "Fuse board", "Old wiring may need inspection by an electrician. Do not diagnose from photos."],
          ["heating", "Heating", "Ask age, service history and fuel type. Replacement can be a meaningful cost."],
          ["plumbing", "Plumbing", "Ask about leaks, water pressure and drainage. A plumber may be needed if issues appear."],
        ],
        answer: ["roof", "chimney", "windows", "walls", "fuse", "heating", "plumbing"],
        feedback: "Good. Older homes can be very workable, but the right checks matter.",
      },
      {
        type: "decision",
        prompt: "The survey mentions possible structural movement. What should you do next?",
        options: [
          "Ignore it because old houses always have movement",
          "Ask the surveyor what further specialist advice may be needed",
          "Assume the house is impossible to buy",
        ],
        answer: "Ask the surveyor what further specialist advice may be needed",
        feedback: "Exactly. The next step is professional clarification, not panic or guesswork.",
        misconception: "Not quite — avoid both dismissing it and diagnosing it yourself.",
      },
      { type: "summary", takeaway: "Age alone is not the problem. Unchecked condition risk is the thing to manage.", reward: "Roof outline added" },
    ],
  },
  {
    id: "lenders-valuation",
    title: "The lender’s valuation: what are you paying for?",
    category: "roof",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Measuring marker added beside the house",
    rewardStage: "surveyFlag",
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [sourceLinks.ccpc, sourceLinks.nidirect],
    screens: [
      { type: "scenario", title: "Scenario", text: "Your lender asks you to pay €200 for a valuation. Does this mean you no longer need an independent survey?" },
      { type: "teach", title: "What the fee is for", text: "A lender will normally require a valuation and the buyer may be asked to pay the fee. An illustrative cost may be about €150–€250 in the Republic of Ireland, but charges vary by lender. The valuation is mainly for the lender: it helps them decide whether the property is suitable security for the mortgage. It is not the same as an independent condition survey, and a favourable valuation does not prove the roof, wiring, plumbing or structure are sound. Confirm the exact fee and process with your lender or broker." },
      { type: "mcq", prompt: "Does a lender valuation mean you no longer need an independent survey?", options: ["Yes, the valuation checks the entire house", "No, the valuation is primarily for the lender", "Only if the estate agent agrees"], answer: "No, the valuation is primarily for the lender", feedback: "Good — the valuation and survey protect different interests.", misconception: "Not quite — this is a common point of confusion. The lender valuation is mainly for the lender, not a full condition check for you." },
      { type: "sort", prompt: "Sort the statements under the right heading.", groups: ["Lender valuation", "Independent survey"], items: [["Usually required by the mortgage lender", "Lender valuation"], ["Checks the property’s condition for the buyer", "Independent survey"], ["May identify defects and recommend further investigation", "Independent survey"], ["Assesses whether the property is adequate security for the loan", "Lender valuation"]], feedback: "Exactly. They can both matter, but they do different jobs." },
      { type: "summary", takeaway: "A lender valuation and an independent survey serve different purposes.", reward: "Survey flag added" },
    ],
  },
  {
    id: "probate-sale",
    title: "Probate: why can it delay a house sale?",
    category: "roof",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Calendar added beside the house",
    rewardStage: "calendar",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.probate, sourceLinks.lawSociety],
    screens: [
      { type: "scenario", title: "Scenario", text: "You love a property, but the estate agent says probate has not yet been granted." },
      { type: "teach", title: "What probate means", text: "Probate is the legal process used to deal with the property and affairs of someone who has died. A house may be sold by an executor or personal representative, and offers may be accepted before the Grant of Probate or Grant of Administration has issued. That does not make the sale impossible, but completion may have to wait until legal authority to transfer the property is confirmed. Ask for updates, and do not make non-refundable moving arrangements around an uncertain closing date." },
      { type: "mcq", prompt: "What is the most realistic response?", options: ["The property cannot legally be advertised", "The purchase is impossible", "You can still consider it, but should expect possible delay and ask for an update", "You should transfer the full purchase price immediately"], answer: "You can still consider it, but should expect possible delay and ask for an update", feedback: "Good. Probate can affect timing without automatically making a property a bad option.", misconception: "Not quite — this is a common point of confusion. Probate sales may proceed, but timing can be less predictable." },
      { type: "ordering", prompt: "Put the broad probate-sale sequence in order.", items: ["Offer accepted", "Probate progresses", "Legal authority confirmed", "Contracts and closing proceed"], feedback: "That is the safer mental model. Your solicitor should confirm the legal position." },
      { type: "sort", prompt: "Which questions are useful to ask?", groups: ["Useful probate question", "Not enough on its own"], items: [["Is this a probate sale?", "Useful probate question"], ["Has the Grant of Probate or Grant of Administration issued?", "Useful probate question"], ["Are contracts ready to be issued?", "Useful probate question"], ["Is there an estimated timeline?", "Useful probate question"], ["The estate agent says it will be grand", "Not enough on its own"]], feedback: "Good. Estate-agent answers help, but your solicitor’s confirmation matters." },
      { type: "summary", takeaway: "A probate sale may still be a good purchase, but timing can be less predictable.", reward: "Calendar added" },
    ],
  },
  {
    id: "insurance-closing",
    title: "Which insurance do you actually need?",
    category: "roof",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Protective roof added",
    rewardStage: "shield",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.ccpcInsurance, sourceLinks.ccpc],
    screens: [
      { type: "scenario", title: "Scenario", text: "Your solicitor says the lender cannot draw down the mortgage until evidence of buildings insurance and mortgage protection is supplied." },
      { type: "teach", title: "The main types", text: "Mortgage protection is a type of life insurance intended to repay the outstanding mortgage if the insured borrower dies. It is commonly required by lenders in the Republic of Ireland, subject to limited exceptions. Life insurance is broader cover for named beneficiaries. Buildings insurance covers the property against insured events under the policy and is commonly required before drawdown. Contents insurance is separate. Income protection and critical illness cover may be worth considering, but they are not the same as mortgage protection and should not be described as universally required." },
      { type: "matching", prompt: "Match each need to the likely insurance type.", pairs: [["Repay the mortgage if the insured borrower dies", "Mortgage protection"], ["Cover the property structure against insured events", "Buildings insurance"], ["Cover belongings inside the home", "Contents insurance"], ["Help replace income if illness prevents work", "Income protection"], ["Provide a set payment to named beneficiaries", "Life insurance"]], feedback: "Exactly. Similar words, different jobs." },
      { type: "mcq", prompt: "What should you do if drawdown depends on insurance evidence?", options: ["Wait until moving day", "Contact the lender, broker and insurer promptly and confirm the policies and documents required", "Ask the estate agent to approve it", "Assume mortgage protection is automatic"], answer: "Contact the lender, broker and insurer promptly and confirm the policies and documents required", feedback: "Good. Insurance can take time, especially if medical information is needed.", misconception: "Not quite — this is a common point of confusion. Insurance is part of closing, not a moving-day admin job." },
      { type: "summary", takeaway: "Insurance is part of the closing process, not something to leave until moving day.", reward: "Protective roof added" },
    ],
  },
  {
    id: "unmarried-partners",
    title: "Buying together when you are not married",
    category: "roof",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Two nameplates added to the path",
    rewardStage: "twoPaths",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.citizens, sourceLinks.lawSociety],
    screens: [
      { type: "scenario", title: "Scenario", text: "One partner provides €45,000 of the deposit and the other provides €10,000." },
      { type: "teach", title: "Discuss it before signing", text: "Buying together creates major legal and financial commitments. Unmarried partners may not have all the same automatic legal protections as married couples or civil partners. Buyers should discuss ownership, deposit contributions, mortgage repayments, future costs, wills, insurance and what happens if they separate, one person wants to sell, one person stops paying or one person dies. A co-ownership agreement may be worth discussing with a solicitor. A private understanding should not replace proper legal advice." },
      { type: "mcq", prompt: "Should they simply assume ownership will reflect their deposit contributions?", options: ["Yes", "No. They should discuss ownership and legal documentation with their solicitor before signing", "Only if the estate agent knows", "Only if they buy furniture together"], answer: "No. They should discuss ownership and legal documentation with their solicitor before signing", feedback: "Good. Who pays what and who owns what should be properly recorded.", misconception: "Not quite — this is a common point of confusion. Unequal deposits need a proper legal conversation." },
      { type: "sort", prompt: "What should be discussed before buying?", groups: ["Discuss before buying", "Optional household choice"], items: [["Ownership shares", "Discuss before buying"], ["Deposit contributions", "Discuss before buying"], ["Monthly payments", "Discuss before buying"], ["What happens if one person wants to sell", "Discuss before buying"], ["Renovation costs", "Discuss before buying"], ["Wills and insurance", "Discuss before buying"], ["How to choose curtain colours", "Optional household choice"]], feedback: "Exactly. Curtain colours can wait; ownership and liability cannot." },
      { type: "summary", takeaway: "A clear agreement at the beginning can prevent major disputes later.", reward: "Two paths added" },
    ],
  },
  {
    id: "friend-sibling-purchase",
    title: "Could you buy with a friend or sibling?",
    category: "roof",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Adjoining room added",
    rewardStage: "adjoiningRoom",
    relatedRoutes: [{ label: "Check my position", route: "/check-position" }],
    officialSources: [sourceLinks.ccpc, sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "You and your brother buy together. Two years later, he wants to move abroad." },
      { type: "teach", title: "More planning, not less", text: "Friends and siblings can apply for a mortgage together, subject to lender criteria. Each borrower may be jointly responsible for the mortgage, not just their informal share. Missed payments can affect everyone, and future borrowing capacity may also be affected. Before buying, discuss ownership percentages, deposits, monthly payments, bills, repairs, renting a room, a possible sale, a buyout process, wills and insurance." },
      { type: "mcq", prompt: "Which issue should ideally already be covered?", options: ["The colour of the kitchen", "An agreed exit or buyout process", "Which estate agent advertised the original property", "The seller’s solicitor"], answer: "An agreed exit or buyout process", feedback: "Good. The exit plan matters before anyone needs it.", misconception: "Not quite — this is a common point of confusion. Buying together requires a plan for leaving together as well as moving in." },
      { type: "sort", prompt: "Choose the rules for a fictional sibling purchase.", groups: ["Agree before buying", "Nice but not essential"], items: [["Ownership split", "Agree before buying"], ["Deposit split", "Agree before buying"], ["Repair fund", "Agree before buying"], ["Buyout process", "Agree before buying"], ["Permission to rent a room", "Agree before buying"], ["What happens if one person misses payments", "Agree before buying"], ["Name for the group chat", "Nice but not essential"]], feedback: "Exactly. Buying together can expand options, but it needs written rules." },
      { type: "summary", takeaway: "Buying together can expand your options, but it requires more planning, not less.", reward: "Adjoining room added" },
    ],
  },
  {
    id: "ownership-structure",
    title: "How will the property be owned?",
    category: "roof",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Plot divided into ownership sections",
    rewardStage: "plotSections",
    relatedRoutes: [{ label: "Open glossary", route: "/glossary" }],
    officialSources: [sourceLinks.citizens, sourceLinks.lawSociety],
    screens: [
      { type: "scenario", title: "Scenario", text: "Two buyers agree to buy together, but one is contributing a larger deposit and both want to understand what happens if one dies." },
      { type: "teach", title: "Ask before contracts are signed", text: "In the Republic of Ireland, joint tenancy generally means the owners hold the property together and a right of survivorship usually applies. Tenancy in common generally means each owner has a defined or identifiable share, which may pass under their will or estate. The correct structure depends on your circumstances. Ask your solicitor before contracts are signed." },
      { type: "matching", prompt: "Match the statement to the ownership idea.", pairs: [["May suit unequal ownership shares", "Tenancy in common"], ["Commonly includes survivorship", "Joint tenancy"], ["Requires discussion of wills", "Tenancy in common"], ["Should be formally recorded", "Both structures"]], feedback: "Good. The legal structure and the payment arrangement need to be understood together." },
      { type: "mcq", prompt: "What is the safest next step?", options: ["Copy a template from the internet", "Ask your solicitor before contracts are signed", "Let the estate agent choose", "Ignore it because the mortgage is joint"], answer: "Ask your solicitor before contracts are signed", feedback: "Exactly. This is legal advice territory.", misconception: "Not quite — this is a common point of confusion. Who pays what and who legally owns what are related, but not always identical." },
      { type: "summary", takeaway: "Who pays what and who legally owns what are related, but not always identical.", reward: "Ownership sections marked" },
    ],
  },
  {
    id: "gifted-deposits",
    title: "When family helps with the deposit",
    category: "foundations",
    jurisdiction: "both",
    estimatedMinutes: 4,
    buildingReward: "Pallet of bricks delivered",
    rewardStage: "brickPallet",
    relatedRoutes: [{ label: "Try Savings plan", route: "/savings-plan" }],
    officialSources: [sourceLinks.ccpc, sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "Your parents transfer €20,000 into your account one week before closing." },
      { type: "teach", title: "Why early disclosure matters", text: "A lender may require a formal gifted-deposit letter. The person providing the money may need to confirm it is a gift rather than a repayable loan. The lender and solicitor may require evidence of the source of funds, and anti-money-laundering checks can apply. Tax implications may also need to be considered. A parent contributing money does not automatically gain ownership rights. Tell your broker, lender and solicitor early." },
      { type: "mcq", prompt: "Why could a late family transfer cause delay?", options: ["Because family money can never be used", "Because the lender and solicitor may need to verify the source of funds and whether it is a gift or loan", "Because the estate agent must approve the gift", "Because gifts always create ownership rights"], answer: "Because the lender and solicitor may need to verify the source of funds and whether it is a gift or loan", feedback: "Good. The issue is documentation and checks, not suspicion by default.", misconception: "Not quite — this is a common point of confusion. Gifted funds can be workable, but they need to be explained and evidenced." },
      { type: "ordering", prompt: "Put these steps in a safer order.", items: ["Tell broker or lender about expected gift", "Ask what letter and evidence are required", "Tell solicitor early", "Transfer and record funds clearly"], feedback: "Exactly. Early notice is much calmer than a surprise transfer before closing." },
      { type: "summary", takeaway: "Tell your professional advisers about gifted funds early.", reward: "Brick pallet added" },
    ],
  },
  {
    id: "closing-day",
    title: "What happens on closing day?",
    category: "roof",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Front door opened and key added",
    rewardStage: "key",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.lawSociety, sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "It is closing day. You are hoping to collect the keys first thing in the morning." },
      { type: "teach", title: "It is a chain of steps", text: "Closing day can include final searches, signing closing documents, mortgage drawdown, buyer funds moving to the solicitor, the solicitor transferring purchase money, the seller’s solicitor confirming receipt, closing completing and the estate agent being authorised to release keys. Insurance, meter readings, utilities, Local Property Tax or equivalent adjustments and registration of ownership can also be part of the wider process. Timing can vary." },
      { type: "ordering", prompt: "Arrange this simplified closing-day sequence.", items: ["Final legal checks and documents", "Mortgage drawdown and buyer funds ready", "Solicitor transfers purchase money", "Seller’s solicitor confirms receipt", "Estate agent is authorised to release keys"], feedback: "Good. Keys usually follow the legal and banking confirmations, not the other way around." },
      { type: "mcq", prompt: "Should you assume keys will always be released early in the morning?", options: ["Yes", "No. Timing can vary and keys may wait until funds and confirmations are received", "Only if the van is booked", "Only if the seller has moved out"], answer: "No. Timing can vary and keys may wait until funds and confirmations are received", feedback: "Exactly. Build flexibility into the day.", misconception: "Not quite — this is a common point of confusion. Closing day is not only collecting keys." },
      { type: "summary", takeaway: "Closing day is a chain of legal and banking steps, not only collecting the keys.", reward: "Door opened and key added" },
    ],
  },
  {
    id: "vacant-property-grant",
    title: "Could a vacant home grant help?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 6,
    buildingReward: "Empty house restored and lights switched on",
    rewardStage: "restoredHouse",
    supportSchemeIds: ["vacant-property-refurbishment-grant"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("vacant-property-refurbishment-grant")],
    screens: [
      { type: "scenario", title: "Scenario", text: "A listing says a property has been empty for several years and needs refurbishment." },
      { type: "teach", title: "What HomePath can and cannot tell you", text: grantTeachText("vacant-property-refurbishment-grant", "HomePath can suggest that a listing may be worth investigating and which questions to ask. It cannot confirm vacancy, dereliction, eligible works, approval or the maximum grant. Approval should be obtained before starting eligible work.") },
      { type: "mcq", prompt: "A house has an outdated kitchen and BER rating, but a family currently lives there. Is it likely to qualify simply because it needs modernisation?", options: ["Yes", "No. Needing renovation is not the same as being vacant", "Only if the asking price is low"], answer: "No. Needing renovation is not the same as being vacant", feedback: "Good. Vacancy and dereliction are specific things to verify.", misconception: "Not quite — this is a common point of confusion. Dated does not automatically mean vacant or derelict." },
      { type: "sort", prompt: "What should you ask before relying on the grant in a budget?", groups: ["Ask/check", "HomePath cannot confirm"], items: [["How long has the property been vacant?", "Ask/check"], ["What proof of vacancy is available?", "Ask/check"], ["Which works may be eligible?", "Ask/check"], ["When may works begin?", "Ask/check"], ["That approval will be issued", "HomePath cannot confirm"], ["That the property is derelict", "HomePath cannot confirm"]], feedback: "Exactly. Treat it as potential support, not guaranteed purchase money." },
      { type: "summary", takeaway: "Treat the grant as potential support, not guaranteed purchase money.", reward: "Vacant home restored" },
    ],
  },
  {
    id: "vacant-above-shop",
    title: "Advanced: converting vacant space above a shop",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Shopfront home module added",
    rewardStage: "shopHome",
    supportSchemeIds: ["vacant-above-shop-grant"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("vacant-above-shop-grant")],
    screens: [
      { type: "scenario", title: "Scenario", text: "A mixed-use town-centre building has vacant space above a shop and the ground-floor commercial use is expected to remain." },
      { type: "teach", title: "Separate scheme, specialist property", text: grantTeachText("vacant-above-shop-grant", "This is an advanced module for a particular property type. It should not be assumed relevant to an ordinary house purchase.") },
      { type: "mcq", prompt: "Should these limits be merged into the ordinary Vacant Property Refurbishment Grant?", options: ["Yes", "No, this is a separate above-shop scheme", "Only if the kitchen is old"], answer: "No, this is a separate above-shop scheme", feedback: "Good. Separate scheme, separate checks.", misconception: "Not quite — this is a common point of confusion. Above-shop vacancy has its own rules and limits." },
      { type: "summary", takeaway: "Only investigate this route when the property type is relevant.", reward: "Above-shop module added" },
    ],
  },
  {
    id: "seai-energy-grants",
    title: "Could SEAI grants help improve this home?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Insulation layers added",
    rewardStage: "insulation",
    supportSchemeIds: ["seai-home-energy-grants"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("seai-home-energy-grants")],
    screens: [
      { type: "scenario", title: "Scenario", text: "You are looking at an older home with a lower BER and wondering whether grants could help over time." },
      { type: "teach", title: "Three broad routes", text: grantTeachText("seai-home-energy-grants", "If you want one or two upgrades, individual grants may be worth checking. If you want a major coordinated renovation, a registered One Stop Shop may be relevant. If you receive a qualifying welfare payment and own your home, fully funded upgrades may be worth checking. Do not assume eligibility.") },
      { type: "mcq", prompt: "You replace windows first and apply for a grant afterwards. What is the main risk?", options: ["No risk at all", "SEAI generally requires grant approval before eligible works start", "The estate agent must approve it", "It automatically improves the BER to A"], answer: "SEAI generally requires grant approval before eligible works start", feedback: "Good. Check the scheme and secure approval before starting eligible work.", misconception: "Not quite — this is a common point of confusion. Grant timing matters." },
      { type: "matching", prompt: "Match the route to the intention.", pairs: [["One or two upgrades", "Individual grants"], ["Major coordinated energy renovation", "One Stop Shop"], ["Qualifying welfare payment and own home", "Check fully funded upgrades"]], feedback: "Exactly. Different routes suit different situations." },
      { type: "summary", takeaway: "Check the scheme and secure approval before starting eligible work.", reward: "Insulation layers added" },
    ],
  },
  {
    id: "windows-doors-grants",
    title: "Can windows and doors receive grant support?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Windows and doors upgraded",
    rewardStage: "windowUpgrade",
    supportSchemeIds: ["seai-windows-doors"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("seai-windows-doors")],
    screens: [
      { type: "scenario", title: "Scenario", text: "You are buying a Victorian house with original sash windows." },
      { type: "teach", title: "Grant support is not the same as the right decision", text: grantTeachText("seai-windows-doors", "Replacing windows should sit inside the wider ventilation, insulation and heating strategy. Traditional or historic windows may require a conservation approach, and repairing good-quality traditional windows may sometimes be preferable to replacement.") },
      { type: "mcq", prompt: "Should HomePath automatically tell you to replace all original sash windows?", options: ["Yes", "No. Their condition, historic value, ventilation and the overall energy plan should be assessed first", "Only if the paint is old"], answer: "No. Their condition, historic value, ventilation and the overall energy plan should be assessed first", feedback: "Good. This issue needs checking rather than assuming.", misconception: "Not quite — this is a common point of confusion. Grant availability does not automatically mean replacement is best." },
      { type: "summary", takeaway: "Grant availability does not automatically mean replacement is the best option.", reward: "Windows and doors upgraded" },
    ],
  },
  {
    id: "heat-pump-fabric-first",
    title: "Is a heat pump the first step?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Efficient heating system added",
    rewardStage: "heatPump",
    supportSchemeIds: ["seai-heat-pump"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("seai-heat-pump")],
    screens: [
      { type: "scenario", title: "Scenario", text: "A poorly insulated house has high heat loss, but you like the idea of replacing the boiler with a heat pump." },
      { type: "teach", title: "Fabric first", text: grantTeachText("seai-heat-pump", "Heat pumps can be highly efficient in suitable homes, but the house may need insulation, airtightness, ventilation or radiator improvements first. A technical assessment is important, and a whole-house approach may produce a better result.") },
      { type: "mcq", prompt: "What is the most sensible next step before assuming a heat pump is suitable?", options: ["Order the heat pump immediately", "Assess the home and understand the fabric and heating requirements", "Replace the kitchen", "Ask the estate agent"], answer: "Assess the home and understand the fabric and heating requirements", feedback: "Good. Improve the house as a system.", misconception: "Not quite — this is a common point of confusion. A heat pump is not a simple boiler swap for every property." },
      { type: "summary", takeaway: "Improve the house as a system, not as a list of unrelated products.", reward: "Heating system added" },
    ],
  },
  {
    id: "solar-controls",
    title: "Which smaller energy upgrades might help?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 4,
    buildingReward: "Solar panels and smart controls added",
    rewardStage: "solar",
    supportSchemeIds: ["seai-solar-controls"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("seai-solar-controls")],
    screens: [
      { type: "scenario", title: "Scenario", text: "You want to lower bills, but the house needs several possible upgrades." },
      { type: "teach", title: "Choose measures that work together", text: grantTeachText("seai-solar-controls", "Solar PV generates electricity. Heating controls help manage heating and hot water. Neither measure alone guarantees a high BER. Compare expected cost, grant support, savings and suitability.") },
      { type: "matching", prompt: "Match the upgrade to the job.", pairs: [["Solar PV", "Generates electricity"], ["Heating controls", "Helps schedule and manage heating"], ["Insulation", "Reduces heat loss"], ["Heat pump", "Provides renewable heating where suitable"]], feedback: "Exactly. The best plan is usually coordinated." },
      { type: "summary", takeaway: "Choose upgrades that work together and suit the property.", reward: "Solar panels and controls added" },
    ],
  },
  {
    id: "one-stop-shop-ber",
    title: "What is an SEAI One Stop Shop?",
    category: "front-door",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Energy-efficient house completed",
    rewardStage: "energyComplete",
    supportSchemeIds: ["seai-one-stop-shop"],
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [schemeSource("seai-one-stop-shop")],
    screens: [
      { type: "scenario", title: "Scenario", text: "You want to coordinate insulation, heating, windows, ventilation and solar for an older house." },
      { type: "teach", title: "A managed package", text: grantTeachText("seai-one-stop-shop", "A registered One Stop Shop can manage assessment, design, contractors, grant processing and project management. It may be relevant to a high-performance modernisation pathway, but it is not automatically the cheapest or most appropriate option. Reaching an A rating can require more work than reaching B2 and may not suit every property.") },
      { type: "mcq", prompt: "Which route may be worth investigating for a coordinated upgrade?", options: ["A registered SEAI One Stop Shop", "Only an estate agent", "A kitchen showroom", "A random online calculator"], answer: "A registered SEAI One Stop Shop", feedback: "Good. A whole-house plan can prevent one upgrade from undermining another.", misconception: "Not quite — this is a common point of confusion. A coordinated energy project may need a coordinated route." },
      { type: "summary", takeaway: "A whole-house plan can prevent one upgrade from undermining another.", reward: "Efficient version completed" },
    ],
  },
  {
    id: "energy-upgrade-loan",
    title: "Home Energy Upgrade Loan Scheme",
    category: "foundations",
    jurisdiction: "roi",
    estimatedMinutes: 4,
    buildingReward: "Finance-plan sheet added",
    rewardStage: "financeSheet",
    supportSchemeIds: ["home-energy-upgrade-loan"],
    relatedRoutes: [{ label: "Open Savings plan", route: "/savings-plan" }],
    officialSources: [schemeSource("home-energy-upgrade-loan")],
    screens: [
      { type: "scenario", title: "Scenario", text: "The energy work costs an illustrative €45,000 after grants and you are considering an upgrade loan." },
      { type: "teach", title: "Loan, not grant", text: grantTeachText("home-energy-upgrade-loan", "This is separate from the mortgage used to purchase the home. Interest and repayments still apply. Consider affordability and get financial advice where needed.") },
      { type: "mcq", prompt: "Does receiving an upgrade loan make the work free?", options: ["Yes", "No. It remains borrowing that must be repaid", "Only if the BER improves", "Only if the windows are included"], answer: "No. It remains borrowing that must be repaid", feedback: "Good. Grants reduce costs; loans spread costs.", misconception: "Not quite — this is a common point of confusion. A loan is still borrowing." },
      { type: "summary", takeaway: "Grants reduce costs; loans spread costs.", reward: "Finance-plan sheet added" },
    ],
  },
];

const roadmapTopics = [
  ["foundations", ["How much cash do I actually need?", "Deposit versus buying costs", "Booking deposit versus full buyer deposit", "Why lenders examine bank statements", "Rent, savings and repayment capacity", "Building an emergency buffer", "How interest affects repayments", "Creating a realistic savings plan"]],
  ["ground-floor", ["What does a mortgage broker or adviser do?", "Approval or agreement in principle", "Loan-to-income", "Loan-to-value", "Fixed and variable rates", "Mortgage term and monthly repayment", "Formal mortgage approval", "Mortgage protection and home insurance"]],
  ["first-floor", ["What does the estate agent do?", "Reading a property listing", "Asking-price versus sale price", "Questions to ask at a viewing", "Making an offer", "What sale agreed means", "Comparing location, size and condition", "Apartment management fees and sinking funds"]],
  ["second-floor", ["Survey versus lender valuation", "Should I be afraid of an older house?", "Roof problems", "Damp and ventilation", "Dry rot and wet rot", "Wiring and fuse boards", "Plumbing and drainage", "Heating systems", "Windows and insulation", "Extensions and planning", "Structural movement", "Renovation budgets and contingencies"]],
  ["roof", ["What does a solicitor or conveyancer do?", "What is conveyancing?", "Title and ownership", "Boundaries and rights of way", "Planning permission", "Contracts and legal commitment", "Common conveyancing delays", "Drawdown or release of mortgage funds", "Closing or completion", "Receiving the keys"]],
  ["front-door", ["Help to Buy", "First Home Scheme", "Local Authority Home Loan", "Affordable Purchase", "Cost Rental", "Co-Ownership", "Housing Executive pathways", "Housing associations", "Rental and social housing supports"]],
];

const emptyProgress = {
  completedModuleIds: [],
  correctAnswers: {},
  retryCount: {},
  lastModule: "",
  categoryProgress: {},
  buildingStage: 0,
  jurisdiction: "roi",
};

function getProgress() {
  const current = readStore(STORAGE_KEY, emptyProgress);
  const legacy = readStore("homepath-completed-modules", []);
  const completedModuleIds = Array.from(new Set([...(current.completedModuleIds || []), ...legacy.filter(id => lessonModules.some(m => m.id === id))]));
  return { ...emptyProgress, ...current, completedModuleIds, buildingStage: buildingStage(completedModuleIds.length) };
}

function saveProgress(next) {
  const completedModuleIds = next.completedModuleIds || [];
  const categoryProgress = categories.reduce((acc, cat) => {
    const total = lessonModules.filter(m => m.category === cat.id).length || 1;
    const done = lessonModules.filter(m => m.category === cat.id && completedModuleIds.includes(m.id)).length;
    acc[cat.id] = { done, total };
    return acc;
  }, {});
  const full = { ...next, completedModuleIds, categoryProgress, buildingStage: buildingStage(completedModuleIds.length) };
  writeStore(STORAGE_KEY, full);
  writeStore("homepath-completed-modules", completedModuleIds);
  return full;
}

function buildingStage(count) {
  if (count >= 18) return 7;
  if (count >= 14) return 6;
  if (count >= 10) return 5;
  if (count >= 7) return 4;
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

export default function LearnPage({ navigate }) {
  const [progress, setProgress] = useState(getProgress);
  const [activeModuleId, setActiveModuleId] = useState(() => {
    const suggested = readStore("homepath-open-lesson", "");
    return lessonModules.some(m => m.id === suggested) ? suggested : "";
  });
  const [jurisdiction, setJurisdiction] = useState(progress.jurisdiction || "roi");
  const activeModule = lessonModules.find(m => m.id === activeModuleId);
  const completed = progress.completedModuleIds;
  const nextModule = lessonModules.find(m => !completed.includes(m.id) && (m.jurisdiction === "both" || m.jurisdiction === jurisdiction)) || lessonModules[0];
  const completionPercent = Math.round((completed.length / lessonModules.length) * 100);
  const level = completed.length >= 5 ? "House frame started" : completed.length >= 2 ? "Foundations forming" : completed.length ? "Plot prepared" : "Empty plot";
  const profile = readStore("homepath-profile");

  const updateProgress = next => setProgress(saveProgress(next));
  const reset = () => updateProgress({ ...emptyProgress, jurisdiction });
  const startModule = id => {
    updateProgress({ ...progress, lastModule: id, jurisdiction });
    setActiveModuleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeModule) {
    return <LessonShell
      module={activeModule}
      progress={progress}
      navigate={navigate}
      completeModule={(module, answers, retryCount) => {
        const completedModuleIds = Array.from(new Set([...progress.completedModuleIds, module.id]));
        updateProgress({
          ...progress,
          completedModuleIds,
          correctAnswers: { ...progress.correctAnswers, ...answers },
          retryCount: { ...progress.retryCount, ...retryCount },
          lastModule: module.id,
          jurisdiction,
        });
      }}
      close={() => { writeStore("homepath-open-lesson", ""); setActiveModuleId(""); }}
    />;
  }

  return <div className="page learn-page towers-page">
    <section className="towers-hero">
      <div>
        <p className="eyebrow">HomePath Towers</p>
        <h1>Build your housing knowledge</h1>
        <p>Complete short, practical lessons and build your HomePath one step at a time.</p>
        {profile && <p className="towers-personal">Using your saved HomePath: {profile.targetHomeType || "a home"} near {profile.targetArea || "your area"}. You can still use every lesson without personal details.</p>}
        <div className="segmented-toggle" role="group" aria-label="Jurisdiction">
          <button className={jurisdiction === "roi" ? "active" : ""} onClick={() => { setJurisdiction("roi"); updateProgress({ ...progress, jurisdiction: "roi" }); }}>Republic of Ireland</button>
          <button className={jurisdiction === "ni" ? "active" : ""} onClick={() => { setJurisdiction("ni"); updateProgress({ ...progress, jurisdiction: "ni" }); }}>Northern Ireland</button>
        </div>
        <button className="primary towers-continue" onClick={() => startModule(nextModule.id)}>Continue building <span>→</span></button>
      </div>
      <TowerProgress completed={completed} activeCategory={nextModule.category} />
    </section>

    <section className="tower-stats" aria-label="Learning progress">
      <article><strong>{completed.length}/{lessonModules.length}</strong><span>interactive lessons completed</span></article>
      <article><strong>{completionPercent}%</strong><span>lesson progress</span></article>
      <article><strong>{level}</strong><span>current level</span></article>
      <article><strong>{nextModule.title}</strong><span>next recommended lesson · {nextModule.estimatedMinutes} min</span></article>
    </section>

    <section className="tower-overview">
      <div className="progress-track labelled" aria-label={`Pilot lesson progress ${completionPercent}%`}><span style={{ width: `${completionPercent}%` }} /><small>{completionPercent}% of the current interactive lessons completed. The roadmap below shows wider topics planned for HomePath Towers.</small></div>
      <button className="text-button" onClick={reset}>Reset local learning progress</button>
    </section>
    {jurisdiction === "ni" && <section className="plain-card jurisdiction-note"><h2>Republic of Ireland support lessons are hidden</h2><p>The grant lessons on SEAI and vacant-property supports apply to the Republic of Ireland. See the Northern Ireland supports section for relevant alternatives, and check official NI sources before relying on any support in your budget.</p></section>}

    <section className="tower-sections" aria-label="HomePath Towers learning categories">
      {categories.map(cat => {
        const playable = lessonModules.filter(m => m.category === cat.id && (m.jurisdiction === "both" || m.jurisdiction === jurisdiction));
        const done = playable.filter(m => completed.includes(m.id)).length;
        const topics = roadmapTopics.find(([id]) => id === cat.id)?.[1] || [];
        return <article className="tower-section-card" key={cat.id}>
          <div>
            <span>{cat.label}</span>
            <h2>{cat.name}</h2>
            <p>{done}/{Math.max(1, playable.length)} interactive lessons complete</p>
          </div>
          <div className="tower-module-list">
            {playable.map(m => <button key={m.id} onClick={() => startModule(m.id)} className={completed.includes(m.id) ? "done" : ""}>
              <strong>{m.title}</strong><small>{completed.includes(m.id) ? "Complete" : `${m.estimatedMinutes} min · Start`}</small>
            </button>)}
            {topics.filter(t => !playable.some(m => m.title === t)).slice(0, 5).map(topic => <p className="planned-topic" key={topic}>{topic}<small>Roadmap topic</small></p>)}
          </div>
        </article>;
      })}
    </section>

    <Disclaimer>Lessons are general guidance only. Supports may be relevant depending on current criteria. Always verify important decisions with a lender, broker, solicitor, surveyor, tax authority or official scheme provider.</Disclaimer>
  </div>;
}

function LessonShell({ module, progress, completeModule, close, navigate }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState({});
  const [retryCount, setRetryCount] = useState(progress.retryCount || {});
  const [done, setDone] = useState(progress.completedModuleIds.includes(module.id));
  const screen = module.screens[index];
  const screenKey = `${module.id}-${index}`;
  const isLast = index === module.screens.length - 1;
  const questionTypes = ["mcq", "truefalse", "ordering", "matching", "sort", "cost", "house", "contact", "decision", "listing"];
  const isQuestion = questionTypes.includes(screen.type);
  const canContinue = !isQuestion || Boolean(answers[screenKey]) || Boolean(skipped[screenKey]);
  const progressPercent = Math.round(((index + 1) / module.screens.length) * 100);

  const record = (key, value, correct) => {
    setAnswers(current => ({ ...current, [key]: { value, correct } }));
    if (!correct) setRetryCount(current => ({ ...current, [key]: (current[key] || 0) + 1 }));
  };
  const finish = () => {
    completeModule(module, answers, retryCount);
    setDone(true);
  };

  return <div className="page lesson-page">
    <button className="text-button" onClick={close}>← Return to Learning Centre</button>
    <LessonProgress title={module.title} current={index + 1} total={module.screens.length} percent={progressPercent} />
    <section className="lesson-grid">
      <article className="lesson-card">
        {screen.type === "scenario" && <ScenarioCard screen={screen} />}
        {screen.type === "teach" && <TeachingCard screen={screen} />}
        {screen.type === "mcq" && <MultipleChoiceQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "truefalse" && <TrueFalseQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "ordering" && <OrderingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "matching" && <MatchingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "sort" && <SortingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "cost" && <CostBuilderQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "house" && <HouseInspectionQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "contact" && <ChooseContactQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "decision" && <ScenarioDecisionQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "listing" && <ListingLanguageQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "summary" && <LessonSummary module={module} screen={screen} navigate={navigate} />}
        <div className="lesson-actions">
          <button className="guide-inline-button" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>Back</button>
          {isQuestion && !canContinue && <button className="guide-inline-button" onClick={() => setSkipped(current => ({ ...current, [screenKey]: true }))}>Skip for now</button>}
          {!isLast && <button className="primary" disabled={!canContinue} onClick={() => setIndex(index + 1)}>{canContinue ? "Next" : "Answer to continue"} <span>→</span></button>}
          {isLast && <button className="primary" onClick={finish} disabled={done}>{done ? "Lesson saved" : "Complete lesson"} <span>✓</span></button>}
        </div>
      </article>
      <aside className="lesson-side">
        <TowerProgress completed={done ? Array.from(new Set([...progress.completedModuleIds, module.id])) : progress.completedModuleIds} activeCategory={module.category} />
        {done && <BuildingReward module={module} close={close} navigate={navigate} />}
      </aside>
    </section>
  </div>;
}

function LessonProgress({ title, current, total, percent }) {
  return <header className="lesson-head">
    <p className="eyebrow">HomePath Towers lesson</p>
    <h1>{title}</h1>
    <div className="progress-track labelled" aria-label={`Lesson progress ${percent}%`}><span style={{ width: `${percent}%` }} /><small>Screen {current} of {total}</small></div>
  </header>;
}

function ScenarioCard({ screen }) {
  return <div className="scenario-card lesson-screen"><p className="eyebrow">{screen.title}</p><p>{screen.text}</p></div>;
}

function TeachingCard({ screen }) {
  return <div className="teaching-card lesson-screen"><p className="eyebrow">{screen.title}</p><p>{screen.text}</p></div>;
}

function FeedbackPanel({ result }) {
  if (!result) return null;
  return <div className={result.correct ? "feedback-panel correct" : "feedback-panel"} role="status">
    <strong>{result.correct ? "Exactly." : "Not quite — this is a common point of confusion."}</strong>
    <p>{result.message}</p>
  </div>;
}

function MultipleChoiceQuestion({ screen, id, onAnswer }) {
  const [result, setResult] = useState(null);
  return <QuestionFrame prompt={screen.prompt}>
    <div className="choice-grid">{screen.options.map(option => <button key={option} onClick={() => {
      const correct = option === screen.answer;
      setResult({ correct, message: correct ? screen.feedback : screen.misconception });
      onAnswer(id, option, correct);
    }}>{option}</button>)}</div>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function TrueFalseQuestion({ screen, id, onAnswer }) {
  return <MultipleChoiceQuestion screen={{ ...screen, options: ["True", "False"], answer: screen.answer ? "True" : "False" }} id={id} onAnswer={onAnswer} />;
}

function OrderingQuestion({ screen, id, onAnswer }) {
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null);
  const choose = item => !order.includes(item) && setOrder([...order, item]);
  const check = () => {
    const correct = screen.items.every((item, i) => order[i] === item);
    setResult({ correct, message: correct ? screen.feedback : "Try again. Think about what has to happen before the next person can act." });
    onAnswer(id, order, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    <div className="choice-grid">{screen.items.map(item => <button key={item} disabled={order.includes(item)} onClick={() => choose(item)}>{item}</button>)}</div>
    <ol className="ordered-answer">{order.map(item => <li key={item}>{item}</li>)}</ol>
    <button className="guide-inline-button" onClick={() => { setOrder([]); setResult(null); }}>Try again</button>
    <button className="primary" onClick={check} disabled={order.length !== screen.items.length}>Check order <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function MatchingQuestion({ screen, id, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const definitions = Array.from(new Set(screen.pairs.map(([, meaning]) => meaning)));
  const check = () => {
    const correct = screen.pairs.every(([term, meaning]) => answers[term] === meaning);
    setResult({ correct, message: correct ? screen.feedback : "Not quite — this is a common point of confusion. Check each item against what it is mainly for." });
    onAnswer(id, answers, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    {screen.pairs.map(([term]) => <label className="match-row" key={term}><span>{term}</span><select value={answers[term] || ""} onChange={e => setAnswers({ ...answers, [term]: e.target.value })}><option value="">Choose meaning</option>{definitions.map(d => <option key={d}>{d}</option>)}</select></label>)}
    <button className="primary" onClick={check} disabled={Object.keys(answers).length !== screen.pairs.length}>Check matches <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function SortingQuestion({ screen, id, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const check = () => {
    const correct = screen.items.every(([item, group]) => answers[item] === group);
    setResult({ correct, message: correct ? screen.feedback : "Not quite — this is a common point of confusion. Check which heading each statement is really describing." });
    onAnswer(id, answers, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    {screen.items.map(([item]) => <label className="match-row" key={item}><span>{item}</span><select value={answers[item] || ""} onChange={e => setAnswers({ ...answers, [item]: e.target.value })}><option value="">Choose category</option>{screen.groups.map(group => <option key={group}>{group}</option>)}</select></label>)}
    <button className="primary" onClick={check} disabled={Object.keys(answers).length !== screen.items.length}>Check sorting <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function CostBuilderQuestion(props) {
  return <SortingQuestion {...props} />;
}

function ChooseContactQuestion({ screen, id, onAnswer }) {
  return <MultipleChoiceQuestion screen={{ ...screen, options: screen.options.map(([label]) => label), misconception: "Not quite. Think about who handles the question being asked right now." }} id={id} onAnswer={onAnswer} />;
}

function ScenarioDecisionQuestion(props) {
  return <MultipleChoiceQuestion {...props} />;
}

function ListingLanguageQuestion(props) {
  return <MultipleChoiceQuestion {...props} />;
}

function HouseInspectionQuestion({ screen, id, onAnswer }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const toggle = key => setSelected(current => current.includes(key) ? current.filter(x => x !== key) : [...current, key]);
  const check = () => {
    const correct = selected.length >= 5;
    setResult({ correct, message: correct ? screen.feedback : "Not quite. With an older home, several areas may be routine but still worth checking." });
    onAnswer(id, selected, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    <div className="inspection-grid">
      <div className="mini-house" aria-hidden="true">
        <span className="roof" /><span className="chimney" /><span className="walls" /><span className="window left" /><span className="window right" /><span className="door" /><span className="path" />
      </div>
      <div className="inspection-choices">{screen.areas.map(([key, label, note]) => <button key={key} className={selected.includes(key) ? "selected" : ""} onClick={() => toggle(key)}><strong>{label}</strong><small>{note}</small></button>)}</div>
    </div>
    <button className="primary" onClick={check}>Check choices <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function QuestionFrame({ prompt, children }) {
  return <div className="question-frame lesson-screen"><h2>{prompt}</h2>{children}</div>;
}

function LessonSummary({ module, screen, navigate }) {
  return <div className="lesson-summary lesson-screen">
    <p className="eyebrow">Lesson completed</p>
    <h2>{screen.reward}</h2>
    <p>{screen.takeaway}</p>
    {module.supportSchemeIds?.length > 0 && <VerifiedSupportData ids={module.supportSchemeIds} />}
    <div className="source-list">
      <h3>Official source</h3>
      {module.officialSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}
    </div>
    {module.relatedRoutes.map(link => <button className="guide-inline-button" key={link.route} onClick={() => navigate(link.route)}>{link.label}</button>)}
  </div>;
}

function VerifiedSupportData({ ids }) {
  const schemes = ids.map(getSupportScheme).filter(Boolean);
  if (!schemes.length) return null;
  return <div className="verified-support-data">
    <h3>Verified scheme data used in this lesson</h3>
    {schemes.map(scheme => <article key={scheme.id}>
      <strong>{scheme.name}</strong>
      <small>Last reviewed: {scheme.lastReviewed}</small>
      <ul>{scheme.currentValues.map(item => <li key={item.label}><span>{item.label}</span><b>{item.value}</b></li>)}</ul>
      <p>{scheme.eligibilityWarning}</p>
      <a href={scheme.officialUrl} target="_blank" rel="noreferrer">Check official provider</a>
    </article>)}
    <p>{schemeWarning}</p>
  </div>;
}

function BuildingReward({ module, close, navigate }) {
  return <div className="building-reward">
    <p className="eyebrow">Building reward</p>
    <h2>{module.buildingReward}</h2>
    <p>You have added another practical piece to your HomePath.</p>
    <button className="primary" onClick={close}>Continue building <span>→</span></button>
    <button className="guide-inline-button" onClick={() => navigate(module.relatedRoutes[0]?.route || "/")}>{module.relatedRoutes[0]?.label || "Open related tool"}</button>
  </div>;
}

function TowerProgress({ completed, activeCategory }) {
  const count = completed.length;
  const stage = buildingStage(count);
  const completedSet = new Set(completed);
  const has = n => stage >= n;
  const parts = {
    foundation: has(1) || completedSet.has("cash-needed"),
    groundFloor: has(2) || completedSet.has("broker"),
    door: has(3) || completedSet.has("booking-deposit"),
    windows: has(3) || completedSet.has("survey-valuation"),
    firstFloor: has(4),
    secondFloor: has(5),
    roof: has(6) || completedSet.has("older-house"),
    path: has(7) || completedSet.has("supports"),
  };
  return <figure className={`tower-progress active-${activeCategory}`} aria-label={`HomePath Towers building stage ${stage}. ${count} modules completed.`}>
    <div className="tower-sky">
      <div className="tower-plot">
        <span className="tower-ground" />
        <span className={`tower-foundation ${parts.foundation ? "built" : ""}`} />
        <span className={`tower-ground-floor ${parts.groundFloor ? "built" : ""}`} />
        <span className={`tower-door ${parts.door ? "built" : ""}`} />
        <span className={`tower-window one ${parts.windows ? "built" : ""}`} />
        <span className={`tower-window two ${parts.windows ? "built" : ""}`} />
        <span className={`tower-first-floor ${parts.firstFloor ? "built" : ""}`} />
        <span className={`tower-second-floor ${parts.secondFloor ? "built" : ""}`} />
        <span className={`tower-roof ${parts.roof ? "built" : ""}`} />
        <span className={`tower-path ${parts.path ? "built" : ""}`} />
      </div>
    </div>
    <figcaption>{count ? `${count} module${count === 1 ? "" : "s"} complete` : "Empty plot and foundation outline"}</figcaption>
  </figure>;
}
