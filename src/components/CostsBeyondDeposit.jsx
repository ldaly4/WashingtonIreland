import React, { useState } from "react";
import { money } from "../lib/calculations";
import { estimateBuyingCosts } from "../lib/buyingCosts";

export default function CostsBeyondDeposit({ jurisdiction = "roi", initialPrice = 300000, compact = false }) {
  const [price,setPrice] = useState(initialPrice || 300000);
  const costs = estimateBuyingCosts({ price: Number(price) || 0, jurisdiction });
  const list = costs.items;
  return <section className={`costs-guide ${compact ? "compact" : ""}`}>
    <div className="costs-head"><div><p className="eyebrow">Costs beyond the deposit</p><h2>Do not use all your savings for the deposit.</h2><p>You will normally need separate money for legal, tax, property and moving costs. These figures are illustrative.</p></div><label>Property price<input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} /></label></div>
    <div className="cash-stack" aria-label="Illustrative cash breakdown">
      <span style={{width:"36%"}}>Buyer deposit</span>
      <span style={{width:"14%"}}>Legal/tax</span>
      <span style={{width:"18%"}}>Survey/valuation</span>
      <span style={{width:"20%"}}>Insurance/moving</span>
      <span style={{width:"12%"}}>Buffer</span>
    </div>
    <div className="cost-line"><strong>Illustrative buyer deposit</strong><span>{money(costs.deposit, jurisdiction)}</span></div>
    <div className="cost-line"><strong>Estimated additional buying costs</strong><span>{money(costs.nonDepositCosts + costs.emergencyBuffer, jurisdiction)}</span></div>
    {!compact && <div className="cost-list">{list.map(item => <article key={item.id}><strong>{item.label}</strong><span>{money(item.amount, jurisdiction)}</span><small>{item.note}</small></article>)}</div>}
    <p className="cost-warning">Booking deposits, where used, should be treated as part of the overall buyer deposit. The full buyer deposit and additional buying costs are different.</p>
  </section>
}
