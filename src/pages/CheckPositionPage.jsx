import React, { useState } from "react";
import { PageHead, Disclaimer } from "../components/Layout";
import { calculatePosition, money } from "../lib/calculations";

const initial = { jurisdiction:"roi", area:"", buying:"alone", income:"", monthlySavings:"", monthlyRent:"", monthlyPension:"", savings:"", firstTime:"yes", housing:"renting", home:"3-bed", renovation:"none", target:"", research:false };
const savedCheck = () => {
  try {
    const saved = sessionStorage.getItem("homepath-position");
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};
const Field = ({ label, hint, children }) => <label className="field"><span>{label}</span>{hint && <small>{hint}</small>}{children}</label>;
const Select = ({ value, onChange, options }) => <select value={value} onChange={onChange}>{options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>;

export default function CheckPositionPage() {
  const saved = savedCheck();
  const [data, setData] = useState(saved?.data || initial);
  const [result, setResult] = useState(saved?.showResult ? calculatePosition(saved.data) : null);
  const set = key => e => setData({...data, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value});
  const submit = e => {
    e.preventDefault();
    const next = calculatePosition(data);
    sessionStorage.setItem("homepath-position", JSON.stringify({data, showResult:true}));
    setResult(next);
    window.scrollTo({top:0, behavior:"smooth"});
  };
  const edit = () => {
    sessionStorage.setItem("homepath-position", JSON.stringify({data, showResult:false}));
    setResult(null);
  };
  if (result) return <PositionResults data={data} r={result} edit={edit} />;
  return <div className="page compact-page"><PageHead eyebrow="Position check" title="Check your position">Answer a few questions and get a rough starting point for what may be realistic.</PageHead>
    <form className="form-card" onSubmit={submit}>
      <div className="form-progress"><span>About you</span><span>A few practical figures</span></div>
      <div className="form-grid">
        <Field label="Where are you looking?"><Select value={data.jurisdiction} onChange={set("jurisdiction")} options={[["roi","Republic of Ireland"],["ni","Northern Ireland"],["unsure","Not sure"]]}/></Field>
        <Field label="What area are you hoping to live in?"><input required value={data.area} onChange={set("area")} placeholder="e.g. Swords, Galway, Belfast" /></Field>
        <Field label="Are you buying alone or with someone else?"><Select value={data.buying} onChange={set("buying")} options={[["alone","Alone"],["together","With someone else"],["unsure","Not sure"]]}/></Field>
        <Field label={data.buying === "together" ? "Approximate joint yearly income before tax" : "Approximate yearly income before tax"} hint={data.buying === "together" ? "Add both buyers’ gross yearly incomes together" : "Your gross yearly income"}><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input required min="0" type="number" value={data.income} onChange={set("income")} /></div></Field>
        <Field label="How much do you save each month?" hint="Your regular monthly savings"><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input required min="0" type="number" value={data.monthlySavings} onChange={set("monthlySavings")} /></div></Field>
        <Field label="How much rent do you pay each month?" hint="Enter 0 if you do not currently pay rent"><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input required min="0" type="number" value={data.monthlyRent} onChange={set("monthlyRent")} /></div></Field>
        <Field label="Monthly pension contributions" hint="Your regular personal and workplace contributions"><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input required min="0" type="number" value={data.monthlyPension} onChange={set("monthlyPension")} /></div></Field>
        <Field label="Approximately how much do you have saved in total?" hint="For your deposit and upfront buying costs"><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input required min="0" type="number" value={data.savings} onChange={set("savings")} /></div></Field>
        <Field label="Are you a first-time buyer?"><Select value={data.firstTime} onChange={set("firstTime")} options={[["yes","Yes"],["no","No"],["unsure","Not sure"]]}/></Field>
        <Field label="Current housing situation"><Select value={data.housing} onChange={set("housing")} options={[["renting","Renting privately"],["family","Living with family"],["social","Social housing"],["insecure","Temporary or insecure housing"],["other","Other"]]}/></Field>
        <Field label="What kind of home are you hoping for?"><Select value={data.home} onChange={set("home")} options={[["apartment","Apartment"],["2-bed","2-bed"],["3-bed","3-bed"],["4-bed","4-bed"],["flexible","Flexible"]]}/></Field>
        <Field label="Are you open to a home that needs work?"><Select value={data.renovation} onChange={set("renovation")} options={[["none","No"],["cosmetic","Cosmetic work only"],["some","Some renovation"],["yes","Yes, if it makes the numbers work"]]}/></Field>
        <Field label="Target property price" hint="Optional, if you have one in mind"><div className="money-input"><span>{data.jurisdiction === "ni" ? "£" : "€"}</span><input min="0" type="number" value={data.target} onChange={set("target")} /></div></Field>
      </div>
      <label className="check"><input type="checkbox" checked={data.research} onChange={set("research")} /> <span>I am happy for my anonymous answers to contribute to housing research.</span></label>
      <button className="primary wide" type="submit">Show my starting point <span>→</span></button>
      <p className="privacy-note">Your answers stay in this browser tab so the result does not disappear. Nothing is sent anywhere.</p>
    </form>
  </div>;
}

function Metric({label,value,accent}) { return <div className={`metric ${accent ? "accent":""}`}><span>{label}</span><strong>{value}</strong></div>; }
function Scenario({title,tag,children}) { return <article className="scenario"><div><span className="scenario-tag">{tag}</span><h3>{title}</h3></div>{children}</article>; }
const supportReasons = {
  roi: [
    ["Help to Buy", "worth checking for eligible new builds or self-builds."],
    ["First Home Scheme", "could matter if your mortgage and deposit do not meet the price of an eligible home."],
    ["Local Authority Home Loan", "may be relevant if a commercial mortgage does not cover what you need."],
    ["Affordable purchase", "worth checking where your local authority has active affordable homes."],
    ["Cost rental", "could be relevant if buying is not realistic yet and private rent is too high."],
    ["Social housing support", "may be relevant if your income or housing situation fits local rules."],
    ["Vacant Property Refurbishment Grant", "worth checking if you are considering a vacant or derelict home."],
    ["Purchase and renovation routes", "could matter if a cheaper home needs manageable work."],
  ],
  ni: [
    ["Co-Ownership", "may help if buying the whole property is not affordable."],
    ["Standard mortgage routes", "worth comparing because lender rules and rates vary."],
    ["Housing Executive / social housing", "could be relevant if your housing need fits current rules."],
    ["Housing association options", "may be worth checking where local availability exists."],
    ["Rental support routes", "could be relevant if buying is not realistic yet."],
  ],
};

function shortAnswer(data, r, m) {
  if (!data.target) return `Based on what you entered, your rough starting range is ${m(r.purchaseLow)}–${m(r.purchaseHigh)}. Compare that with real ${data.home} listings in ${data.area || "your preferred area"} and keep supports as something to check, not assume.`;
  if (r.target <= r.purchaseHigh) return `Your target price sits within this rough no-support range. It may still depend on the property, lender checks, upfront costs and survey findings, but it looks worth exploring with real mortgage advice.`;
  const gap = r.target - r.purchaseHigh;
  const routes = r.jurisdiction === "ni" ? "Co-Ownership, a smaller home nearby, or a property needing light work" : "affordable purchase, a smaller home nearby, or a property needing light work";
  return `A standard purchase at your target price looks difficult without support. It is about ${m(gap)} above the top of this rough range. Your strongest routes to check are ${routes}.`;
}

function PositionResults({ data, r, edit }) {
  const m = n => money(n, r.jurisdiction);
  const targetGap = Math.max(0, r.target - r.borrowingHigh - r.savings);
  return <div className="page results-page"><button className="text-button" onClick={edit}>← Edit my answers</button>
    <PageHead eyebrow="Your results" title="Your starting point">A numbers-led first look based on what you entered. These figures are rough, not a mortgage offer.</PageHead>
    <section className="short-answer">
      <p className="eyebrow">The short answer</p>
      <p>{shortAnswer(data, r, m)}</p>
    </section>
    <section className="range-panel">
      <div><p className="eyebrow">Your buying range</p><h2>{m(r.purchaseLow)}–{m(r.purchaseHigh)}</h2><p>Estimated purchase range without housing supports</p></div>
      <div className="metrics"><Metric label={data.buying === "together" ? "Joint income" : "Yearly income"} value={m(r.income)}/><Metric label="Total savings" value={m(r.savings)}/><Metric label="Rough borrowing" value={r.borrowingLow === r.borrowingHigh ? m(r.borrowingHigh) : `${m(r.borrowingLow)}–${m(r.borrowingHigh)}`} accent /></div>
    </section>
    <section className="repayment-panel">
      <div><p className="eyebrow">Money you are already managing each month</p><h2>{m(r.demonstratedMonthly)} <small>per month</small></h2><p>Your monthly rent, regular savings and pension contributions combined.</p></div>
      <div><span>Rent</span><strong>{m(r.monthlyRent)}</strong><span>Monthly savings</span><strong>{m(r.monthlySavings)}</strong><span>Pension</span><strong>{m(r.monthlyPension)}</strong></div>
      <aside><strong>Illustrative loan supported by that monthly amount: {m(r.repaymentSupportedLoan)}</strong><p>Lenders may look at rent and savings history, but they will assess affordability in their own way. This uses a 30-year term at an illustrative 6% rate and is not a mortgage offer.</p></aside>
    </section>
    <section className="result-section"><div className="section-heading"><span>01</span><div><h2>What this means for the home you want</h2><p>You said you want a {data.home} in {data.area}.</p></div></div>
      <div className="plain-card">{data.target ? <><h3>Target: {m(r.target)}</h3><p>Your target is {m(Math.abs(r.target-r.purchaseHigh))} {r.target > r.purchaseHigh ? "above" : "within"} the top of this rough no-support range. {r.target > r.purchaseHigh && "A larger deposit, another income, a support route, smaller home or nearby area may need to be considered."}</p></> : <p>Compare this range with real {data.home} listings in {data.area} and nearby areas.</p>}<small>HomePath does not yet use live market data, so this is a starting point rather than a valuation.</small></div>
    </section>
    <section className="result-section"><div className="section-heading"><span>02</span><div><h2>Compare the routes</h2><p>See what changes — and what does not.</p></div></div>
      <div className="scenario-list">{r.jurisdiction === "roi" ? <>
        <Scenario tag="Baseline" title="No support"><dl><div><dt>Target price</dt><dd>{m(r.target)}</dd></div><div><dt>10% deposit</dt><dd>{m(r.deposit)}</dd></div><div><dt>Buying costs</dt><dd>{m(r.costs)}</dd></div><div><dt>Your savings</dt><dd>{m(r.savings)}</dd></div><div className="gap"><dt>Upfront savings gap</dt><dd>{m(r.gap)}</dd></div></dl><p>Buying costs include estimated 1% stamp duty, legal work, survey, valuation and a basic moving buffer.</p></Scenario>
        <Scenario tag="New build only" title="Help to Buy"><p>May be worth checking for an eligible new build or self-build. It does not usually apply to second-hand homes.</p><dl><div><dt>Standard deposit</dt><dd>{m(r.deposit)}</dd></div><div><dt>Costs still needed</dt><dd>{m(r.costs)}</dd></div></dl><p>The impact depends on tax paid and current scheme rules; no relief amount is assumed here.</p></Scenario>
        <Scenario tag="Gap route" title="First Home / affordable purchase"><p>A shared-equity or affordable purchase route may be worth checking if the mortgage and deposit do not meet the price.</p><dl><div><dt>Mortgage capacity</dt><dd>{m(r.borrowingHigh)}</dd></div><div><dt>Gap to target</dt><dd>{m(targetGap)}</dd></div><div><dt>Buying costs remain</dt><dd>{m(r.costs)}</dd></div></dl></Scenario>
        <Scenario tag="Alternative lending" title="Local Authority Home Loan"><p>May be worth checking if commercial lenders cannot provide sufficient finance and you meet the criteria. This result does not assess eligibility.</p></Scenario>
        <Scenario tag="Rental routes" title="Cost rental or social housing"><p>Not buying routes, but they could be relevant if private purchase is unrealistic or your housing is insecure. Check local authority criteria.</p></Scenario>
      </> : <>
        <Scenario tag="Baseline" title="Standard purchase"><dl><div><dt>Borrowing estimate</dt><dd>{m(r.borrowingLow)}–{m(r.borrowingHigh)}</dd></div><div><dt>5% deposit</dt><dd>{m(r.fiveDeposit)}</dd></div><div><dt>5% savings gap</dt><dd>{m(r.fiveGap)}</dd></div><div><dt>10% deposit</dt><dd>{m(r.tenDeposit)}</dd></div><div><dt>10% savings gap</dt><dd>{m(r.tenGap)}</dd></div><div><dt>Other costs</dt><dd>{m(r.costs)}*</dd></div></dl><p>*Excludes stamp duty, which depends on UK thresholds, reliefs and current rules.</p></Scenario>
        <Scenario tag="Shared ownership" title="Co-Ownership"><p>May allow you to buy a share and pay rent on the rest. Illustrative figures below assume a 5% deposit on your share.</p><dl>{[.5,.6,.75].map(share=><div key={share}><dt>{share*100}% share</dt><dd>{m(r.target*share)} mortgage · {m(r.target*share*.05)} deposit</dd></div>)}</dl><p>Buying costs of roughly {m(r.costs)} still need consideration. Check current Co-Ownership rules.</p></Scenario>
        <Scenario tag="Housing need" title="Housing Executive / social housing"><p>May be worth checking if your income, household circumstances or housing need fit the criteria. This is not a buying route.</p></Scenario>
        <Scenario tag="Rental routes" title="Housing associations"><p>Housing associations and rental support routes could be relevant depending on your circumstances and local availability.</p></Scenario>
      </>}</div>
    </section>
    <section className="two-col">
      <div className="result-section"><div className="section-heading"><span>03</span><div><h2>Supports worth checking</h2></div></div><ul className="support-list">{supportReasons[r.jurisdiction].map(([name,reason])=><li key={name}><strong>{name}</strong><span>{reason}</span></li>)}</ul></div>
      <div className="result-section"><div className="section-heading"><span>04</span><div><h2>What to search for</h2></div></div><ul className="search-list"><li>{data.home} homes within {m(r.purchaseHigh)}</li><li>Nearby towns with lower asking prices</li><li>{r.jurisdiction==="roi" ? "Eligible new builds if support schemes may apply" : "Homes where a Co-Ownership share may work"}</li><li>Homes needing {data.renovation === "none" ? "little or no" : "manageable"} work, with a separate buffer</li></ul></div>
    </section>
    <section className="next-steps"><p className="eyebrow">Your next three steps</p><ol><li><span>1</span><p>Check the official scheme pages or local housing route for your area.</p></li><li><span>2</span><p>Speak to a broker, lender, local authority, Housing Executive route or housing adviser about your actual position.</p></li><li><span>3</span><p>Pick three real listings and use Check a listing to compare costs and questions.</p></li></ol></section>
    <Disclaimer>This is a starting point, not a decision. It is not a mortgage offer and does not replace advice from a broker, lender, solicitor, surveyor, local authority, Housing Executive route or housing adviser.</Disclaimer>
  </div>;
}
