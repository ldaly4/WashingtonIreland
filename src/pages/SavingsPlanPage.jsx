import React, { useMemo, useState } from "react";
import { Disclaimer, PageHead } from "../components/Layout";
import { money } from "../lib/calculations";
import { readStore, writeStore } from "../lib/storage";
import CostsBeyondDeposit from "../components/CostsBeyondDeposit";
import { defaultDepositPercent, estimateBuyingCosts } from "../lib/buyingCosts";

const monthName = months => {
  if (!Number.isFinite(months) || months <= 0) return "already there";
  const d = new Date();
  d.setMonth(d.getMonth() + Math.ceil(months));
  return d.toLocaleDateString("en-IE", { month:"long", year:"numeric" });
};

export default function SavingsPlanPage({ navigate }) {
  const profile = readStore("homepath-profile", {});
  const [data,setData]=useState({
    jurisdiction: profile.jurisdiction || "roi",
    savings: profile.currentSavings || "",
    price: profile.targetPrice || "",
    deposit: String(defaultDepositPercent(profile.jurisdiction || "roi")),
    rent: "",
    monthly: profile.currentMonthlySaving || "",
    pension: "",
    other: "",
    date: "",
    buffer: "",
    secondBuyer: "",
    onceOff: "",
  });
  const [extra,setExtra]=useState(0), [lower,setLower]=useState(0);
  const set=k=>e=>{
    const value = e.target.value;
    setData(current => {
      if (k === "jurisdiction") return { ...current, jurisdiction: value, deposit: String(defaultDepositPercent(value)) };
      return { ...current, [k]: value };
    });
  };
  const calc = useMemo(()=>{
    const price = Math.max(0,(Number(data.price)||0)-Number(lower||0));
    const costs = estimateBuyingCosts({ price, jurisdiction: data.jurisdiction, depositPercent: Number(data.deposit) || defaultDepositPercent(data.jurisdiction) });
    const targetDeposit = costs.deposit;
    const emergencyBuffer = Number(data.buffer) || costs.emergencyBuffer;
    const total = targetDeposit + costs.nonDepositCosts + emergencyBuffer;
    const saved = (Number(data.savings)||0) + (Number(data.secondBuyer)||0) + (Number(data.onceOff)||0);
    const gap = Math.max(0,total-saved);
    const monthly = (Number(data.monthly)||0) + (Number(data.other)||0) + Number(extra||0);
    const months = monthly > 0 ? Math.ceil(gap/monthly) : Infinity;
    const targetDate = data.date ? new Date(data.date) : null;
    const now = new Date();
    const monthsUntilTarget = targetDate && targetDate > now ? Math.max(1, (targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth()) : null;
    const requiredMonthly = monthsUntilTarget ? Math.ceil(gap / monthsUntilTarget) : null;
    const monthlyDifference = requiredMonthly === null ? null : monthly - requiredMonthly;
    return { price,targetDeposit,costs: costs.nonDepositCosts,costItems: costs.items,total,saved,gap,monthly,months,targetDate,monthsUntilTarget,requiredMonthly,monthlyDifference, emergencyBuffer };
  },[data,extra,lower]);
  const m=n=>money(n,data.jurisdiction);
  return <div className="page savings-page"><PageHead eyebrow="Savings planner" title="Build a savings plan">Use your HomePath numbers to see the cash target, the gap and how different choices could change the timeline.</PageHead>
    <form className="form-card planner-grid">
      {[
        ["jurisdiction","Jurisdiction","select"],["savings","Current savings"],["price","Target property price"],["deposit","Target deposit percentage"],["rent","Current monthly rent"],["monthly","Regular monthly savings"],["pension","Regular pension contribution"],["other","Other monthly savings"],["date","Optional target date","date"],["buffer","Emergency or repair buffer target"],["secondBuyer","Second buyer’s savings"],["onceOff","Expected once-off contribution"]
      ].map(([key,label,type])=><label className="field" key={key}><span>{label}</span>{type==="select"?<select value={data[key]} onChange={set(key)}><option value="roi">Republic of Ireland</option><option value="ni">Northern Ireland</option></select>:<input type={type==="date"?"date":"number"} min="0" value={data[key]} onChange={set(key)}/>}</label>)}
    </form>
    <section className="homepath-dashboard">
      <NumberCard label="Buyer deposit" value={m(calc.targetDeposit)}/><NumberCard label="Legal, tax, survey and moving" value={m(calc.costs)}/><NumberCard label="Emergency or repair buffer" value={m(calc.emergencyBuffer)}/><NumberCard label="Total cash target" value={m(calc.total)}/><NumberCard label="Current progress" value={m(calc.saved)}/><NumberCard label="Remaining gap" value={m(calc.gap)}/><NumberCard label="Estimated target" value={monthName(calc.months)}/>
    </section>
    <div className="progress-track"><span style={{width:`${Math.min(100, calc.total ? calc.saved/calc.total*100 : 0)}%`}} /></div>
    {calc.requiredMonthly !== null && <section className="short-answer savings-answer"><p className="eyebrow">Target-date check</p><p>Based on your target date, you would need to save approximately <strong>{m(calc.requiredMonthly)} per month</strong>. Your current monthly saving is {m(calc.monthly)}, so you are {calc.monthlyDifference >= 0 ? `${m(calc.monthlyDifference)} ahead` : `${m(Math.abs(calc.monthlyDifference))} short`} each month.</p></section>}
    <section className="result-section"><div className="section-heading"><span>£€</span><div><h2>What makes up the goal</h2><p>These categories use the same shared assumptions as HomePath’s other tools.</p></div></div><div className="cost-table">{calc.costItems.map(item=><article key={item.id}><div><strong>{item.label}</strong><p>{item.note}</p></div><span>{m(item.id === "buffer" ? calc.emergencyBuffer : item.amount)}</span></article>)}</div></section>
    <section className="plain-card"><h2>Rent and pension contributions</h2><p>Rent is a monthly housing cost. It may also demonstrate a history of regular payments, but it is not part of your deposit. Pension contributions are regular financial commitments, but they are not liquid savings for buying costs.</p><dl className="mini-breakdown"><div><dt>Current rent</dt><dd>{m(Number(data.rent)||0)}</dd></div><div><dt>Pension contribution</dt><dd>{m(Number(data.pension)||0)}</dd></div></dl></section>
    <section className="what-if"><div><h2>What if?</h2><p>Try a change and see the timeline update. This is a rough estimate, not financial advice.</p></div><label>Save more each month<select value={extra} onChange={e=>setExtra(Number(e.target.value))}><option value="0">No extra</option><option value="100">€ / £100 extra</option><option value="200">€ / £200 extra</option></select></label><label>Reduce target property price<input type="number" min="0" step="5000" value={lower} onChange={e=>setLower(e.target.value)} /></label><p><strong>Current plan:</strong> {Number.isFinite(calc.months)?`${calc.months} months`:"add monthly savings"} · <strong>Estimated target:</strong> {monthName(calc.months)}</p></section>
    <CostsBeyondDeposit jurisdiction={data.jurisdiction} initialPrice={Number(data.price)||300000} compact />
    {data.jurisdiction === "roi" && <section className="plain-card finance-lesson-link"><h2>Planning energy work?</h2><p>The Home Energy Upgrade Loan Scheme may be relevant for some qualifying energy upgrades, but it is a loan rather than a grant. Interest and repayments still apply.</p><button className="guide-inline-button" type="button" onClick={()=>{writeStore("homepath-open-lesson","energy-upgrade-loan");navigate("/learn")}}>Open the energy-upgrade loan lesson <span>→</span></button></section>}
    <section className="next-steps"><p className="eyebrow">Your next three savings milestones</p><ol><li><span>1</span><p>Reach {m(Math.min(calc.total, calc.saved + 5000))}.</p></li><li><span>2</span><p>Build a separate buying-cost fund of about {m(calc.costs)}.</p></li><li><span>3</span><p>Keep an emergency buffer outside the deposit where possible.</p></li></ol></section>
    <Disclaimer>Rent, savings history and pension contributions may help demonstrate that you can manage regular commitments, but each lender assesses repayment capacity differently.</Disclaimer>
  </div>
}

function NumberCard({label,value}) { return <article className="number-card"><span>{label}</span><strong>{value}</strong></article> }
