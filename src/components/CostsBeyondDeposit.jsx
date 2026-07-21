import React, { useState } from "react";
import { money } from "../lib/calculations";

const items = {
  roi: [
    ["Buyer deposit", price => price * 0.1, "Part of the purchase price, not an extra fee."],
    ["Booking deposit", () => 7000, "Usually part of the buyer deposit, not a second deposit."],
    ["Stamp duty", price => price * 0.01, "Illustrative 1% estimate. Check Revenue."],
    ["Solicitor", () => 2750, "Legal work, VAT and outlays vary."],
    ["Survey", () => 700, "Your property-condition check."],
    ["Lender valuation", () => 185, "For the lender. Not a full survey."],
    ["Mortgage protection and home insurance", () => 900, "Quotes vary by person and property."],
    ["Registration and searches", () => 750, "Usually handled through the solicitor."],
    ["Moving and setup", () => 2000, "Moving, utilities and basic setup."],
    ["Renovation contingency", price => price * 0.03, "Optional buffer if work may be needed."],
  ],
  ni: [
    ["Buyer deposit", price => price * 0.05, "Illustrative 5% starting point."],
    ["SDLT where applicable", () => 0, "Depends on UK thresholds and reliefs."],
    ["Solicitor or conveyancer", () => 2000, "Legal quotes vary."],
    ["Searches", () => 350, "Legal property checks."],
    ["Survey", () => 650, "Your property-condition check."],
    ["Valuation", () => 250, "For the lender. Not a full survey."],
    ["Mortgage product or application fees", () => 500, "May be zero or higher depending on product."],
    ["Insurance", () => 650, "Home insurance and any cover required."],
    ["Moving costs", () => 1500, "Moving and setup."],
    ["Renovation contingency", price => price * 0.03, "Optional buffer if work may be needed."],
  ],
};

export default function CostsBeyondDeposit({ jurisdiction = "roi", initialPrice = 300000, compact = false }) {
  const [price,setPrice] = useState(initialPrice || 300000);
  const list = items[jurisdiction === "ni" ? "ni" : "roi"];
  const extraTotal = list.filter(([name]) => !name.includes("Buyer deposit") && !name.includes("Booking deposit")).reduce((sum, [,fn]) => sum + fn(Number(price)||0), 0);
  const deposit = list[0][1](Number(price)||0);
  return <section className={`costs-guide ${compact ? "compact" : ""}`}>
    <div className="costs-head"><div><p className="eyebrow">Costs beyond the deposit</p><h2>Do not use all your savings for the deposit.</h2><p>You will normally need separate money for legal, tax, property and moving costs. These figures are illustrative.</p></div><label>Property price<input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} /></label></div>
    <div className="cash-stack" aria-label="Illustrative cash breakdown">
      <span style={{width:"36%"}}>Buyer deposit</span>
      <span style={{width:"14%"}}>Legal/tax</span>
      <span style={{width:"18%"}}>Survey/valuation</span>
      <span style={{width:"20%"}}>Insurance/moving</span>
      <span style={{width:"12%"}}>Buffer</span>
    </div>
    <div className="cost-line"><strong>Illustrative buyer deposit</strong><span>{money(deposit, jurisdiction)}</span></div>
    <div className="cost-line"><strong>Estimated additional buying costs</strong><span>{money(extraTotal, jurisdiction)}</span></div>
    {!compact && <div className="cost-list">{list.map(([name,fn,note]) => <article key={name}><strong>{name}</strong><span>{money(fn(Number(price)||0), jurisdiction)}</span><small>{note}</small></article>)}</div>}
    <p className="cost-warning">Booking deposits, where used, should be treated as part of the overall buyer deposit. The full buyer deposit and additional buying costs are different.</p>
  </section>
}
