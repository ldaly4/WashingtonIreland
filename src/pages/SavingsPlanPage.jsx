import React, { useMemo, useState } from "react";
import { Disclaimer, PageHead } from "../components/Layout";
import { money } from "../lib/calculations";
import { readStore, researchInviteState, setResearchInvite } from "../lib/storage";
import CostsBeyondDeposit from "../components/CostsBeyondDeposit";

const monthName = months => {
  if (!Number.isFinite(months) || months <= 0) return "already there";
  const d = new Date();
  d.setMonth(d.getMonth() + Math.ceil(months));
  return d.toLocaleDateString("en-IE", { month:"long", year:"numeric" });
};

export default function SavingsPlanPage() {
  const profile = readStore("homepath-profile", {});
  const [data,setData]=useState({
    jurisdiction: profile.jurisdiction || "roi",
    savings: profile.currentSavings || "",
    price: profile.targetPrice || "",
    deposit: profile.jurisdiction === "ni" ? "5" : "10",
    costs: profile.estimatedUpfrontCash ? Math.max(0, profile.estimatedUpfrontCash - ((profile.targetPrice || 0) * .1)) : "",
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
  const set=k=>e=>setData({...data,[k]:e.target.value});
  const calc = useMemo(()=>{
    const price = Math.max(0,(Number(data.price)||0)-Number(lower||0));
    const targetDeposit = price * (Number(data.deposit)||0) / 100;
    const costs = Number(data.costs) || (data.jurisdiction==="ni" ? 4200 : price*.01+6300);
    const total = targetDeposit + costs + (Number(data.buffer)||0);
    const saved = (Number(data.savings)||0) + (Number(data.secondBuyer)||0) + (Number(data.onceOff)||0);
    const gap = Math.max(0,total-saved);
    const monthly = (Number(data.monthly)||0) + (Number(data.other)||0) + Number(extra||0);
    const months = monthly > 0 ? Math.ceil(gap/monthly) : Infinity;
    return { price,targetDeposit,costs,total,saved,gap,monthly,months };
  },[data,extra,lower]);
  const m=n=>money(n,data.jurisdiction);
  const invite=researchInviteState();
  return <div className="page savings-page"><PageHead eyebrow="Savings planner" title="Build a savings plan">Use your HomePath numbers to see the cash target, the gap and how different choices could change the timeline.</PageHead>
    <form className="form-card planner-grid">
      {[
        ["jurisdiction","Jurisdiction","select"],["savings","Current savings"],["price","Target property price"],["deposit","Target deposit percentage"],["costs","Estimated additional buying costs"],["rent","Current monthly rent"],["monthly","Regular monthly savings"],["pension","Regular pension contribution"],["other","Other housing-related savings"],["date","Optional target date","date"],["buffer","Emergency buffer target"],["secondBuyer","Second buyer’s savings"],["onceOff","Expected once-off contribution"]
      ].map(([key,label,type])=><label className="field" key={key}><span>{label}</span>{type==="select"?<select value={data[key]} onChange={set(key)}><option value="roi">Republic of Ireland</option><option value="ni">Northern Ireland</option></select>:<input type={type==="date"?"date":"number"} min="0" value={data[key]} onChange={set(key)}/>}</label>)}
    </form>
    <section className="homepath-dashboard">
      <NumberCard label="Target deposit" value={m(calc.targetDeposit)}/><NumberCard label="Estimated buying costs" value={m(calc.costs)}/><NumberCard label="Total cash target" value={m(calc.total)}/><NumberCard label="Current progress" value={m(calc.saved)}/><NumberCard label="Remaining gap" value={m(calc.gap)}/><NumberCard label="Estimated target" value={monthName(calc.months)}/>
    </section>
    <div className="progress-track"><span style={{width:`${Math.min(100, calc.total ? calc.saved/calc.total*100 : 0)}%`}} /></div>
    <section className="what-if"><div><h2>What if?</h2><p>Try a change and see the timeline update. This is a rough estimate, not financial advice.</p></div><label>Save more each month<select value={extra} onChange={e=>setExtra(Number(e.target.value))}><option value="0">No extra</option><option value="100">€ / £100 extra</option><option value="200">€ / £200 extra</option></select></label><label>Reduce target property price<input type="number" min="0" step="5000" value={lower} onChange={e=>setLower(e.target.value)} /></label><p><strong>Current plan:</strong> {Number.isFinite(calc.months)?`${calc.months} months`:"add monthly savings"} · <strong>Estimated target:</strong> {monthName(calc.months)}</p></section>
    <CostsBeyondDeposit jurisdiction={data.jurisdiction} initialPrice={Number(data.price)||300000} compact />
    <section className="next-steps"><p className="eyebrow">Your next three savings milestones</p><ol><li><span>1</span><p>Reach {m(Math.min(calc.total, calc.saved + 5000))}.</p></li><li><span>2</span><p>Build a separate buying-cost fund of about {m(calc.costs)}.</p></li><li><span>3</span><p>Keep an emergency buffer outside the deposit where possible.</p></li></ol></section>
    {!invite.dismissed && <section className="research-invite"><h2>Help us understand young people’s experience of housing.</h2><p>We are collecting anonymous views on housing knowledge, confidence and barriers. This is optional and does not affect your results.</p><button>Share my view</button><button onClick={()=>setResearchInvite({dismissed:true})}>Maybe later</button><button onClick={()=>setResearchInvite({dismissed:true})}>No thanks</button></section>}
    <Disclaimer>Rent, savings history and pension contributions may help demonstrate that you can manage regular commitments, but each lender assesses repayment capacity differently.</Disclaimer>
  </div>
}

function NumberCard({label,value}) { return <article className="number-card"><span>{label}</span><strong>{value}</strong></article> }
