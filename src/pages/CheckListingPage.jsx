import React, { useState } from "react";
import { PageHead, Disclaimer } from "../components/Layout";
import { analyseListing, money } from "../lib/calculations";
import { analyseListingWithAdapter } from "../services/listingAnalysis";
import { readStore } from "../lib/storage";

const initial = {mode:"url",url:"",address:"",site:"daft",price:"",location:"",bedrooms:"2",type:"house",energy:"",description:"",work:"none"};
const questions = ["When was it last rewired?","What type of heating system is there?","Has there been damp, leaks or roof work?","Are there planning or boundary issues?","Are there management fees?","Is it mortgageable in its current condition?","What is included in the sale?","Have there been offers already?"];

export default function CheckListingPage() {
  const [data,setData]=useState(initial), [result,setResult]=useState(null), [loading,setLoading]=useState(false), [error,setError]=useState("");
  const set=k=>e=>setData({...data,[k]:e.target.value});
  const canSubmit = data.mode === "url" ? data.url.trim()
    : data.mode === "address" ? data.address.trim()
    : data.mode === "text" ? data.description.trim()
    : Number(data.price) > 0 && data.location.trim();
  if(result) return <ListingResults data={data} r={result} edit={()=>setResult(null)}/>;
  return <div className="page compact-page"><PageHead eyebrow="Listing check" title="Check a listing">Paste a property link, write the address, paste listing text or enter the details yourself. You only need to fill in the fields for the option you choose.</PageHead>
    <form className="form-card" onSubmit={async e=>{e.preventDefault();setLoading(true);setError("");const out=await analyseListingWithAdapter(data, analyseListing);setLoading(false);setError(out.error||"");setResult(out.result);window.scrollTo(0,0)}}>
      <div className="form-progress"><span>Listing details</span><span>About 2 minutes</span></div>
      <div className="mode-tabs"><button type="button" className={data.mode==="url"?"active":""} onClick={()=>setData({...data,mode:"url"})}>Paste Daft/link</button><button type="button" className={data.mode==="address"?"active":""} onClick={()=>setData({...data,mode:"address"})}>Address or search</button><button type="button" className={data.mode==="text"?"active":""} onClick={()=>setData({...data,mode:"text"})}>Paste listing text</button><button type="button" className={data.mode==="manual"?"active":""} onClick={()=>setData({...data,mode:"manual"})}>Enter info</button></div>
      {data.mode==="url" && <div className="plain-card url-warning"><label className="field"><span>Property link</span><input required value={data.url} onChange={set("url")} placeholder="Paste a Daft, MyHome, PropertyPal or PropertyNews link" /></label><p>Paste the link and HomePath will try the secure analysis service. If the page blocks reading, you will still get a viewing checklist and can add details later.</p></div>}
      {data.mode==="address" && <div className="plain-card url-warning"><label className="field"><span>Address, Eircode, postcode or rough search</span><input required value={data.address} onChange={set("address")} placeholder="e.g. 3-bed near Swords, Dublin or BT9 Belfast" /></label><p>You do not need the full listing details for this. HomePath will give you a practical checklist based on what you entered.</p></div>}
      {(data.mode==="text" || data.mode==="manual") && <div className="form-grid">
        <label className="field"><span>Listing site</span><select value={data.site} onChange={set("site")}><option value="daft">Daft</option><option value="myhome">MyHome</option><option value="propertypal">PropertyPal</option><option value="propertynews">PropertyNews</option><option value="other">Other</option></select></label>
        <label className="field"><span>Asking price</span><div className="money-input"><span>€ / £</span><input required={data.mode==="manual"} type="number" min="0" value={data.price} onChange={set("price")}/></div></label>
        <label className="field"><span>Location</span><input required={data.mode==="manual"} placeholder="Town, city or area" value={data.location} onChange={set("location")}/></label>
        <label className="field"><span>Number of bedrooms</span><select value={data.bedrooms} onChange={set("bedrooms")}>{[1,2,3,4,5].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="field"><span>Property type</span><select value={data.type} onChange={set("type")}><option value="house">House</option><option value="apartment">Apartment</option><option value="bungalow">Bungalow</option><option value="site">Site / self-build</option><option value="other">Other</option></select></label>
        <label className="field"><span>Energy rating / BER</span><input placeholder="e.g. C2, if known" value={data.energy} onChange={set("energy")}/></label>
        {data.mode==="text" && <label className="field full"><span>Paste listing description</span><textarea required rows="7" placeholder="Paste the main description here. We will look for wording worth a closer look." value={data.description} onChange={set("description")}/></label>}
        <label className="field full"><span>How much work are you willing to take on?</span><select value={data.work} onChange={set("work")}><option value="none">None</option><option value="cosmetic">Painting and cosmetic work</option><option value="some">Some renovation</option><option value="major">Major renovation if the numbers work</option><option value="support">I have family or trade support</option></select></label>
      </div>}
      {error && <p className="form-error">{error}</p>}
      <button className="primary wide" type="submit" disabled={loading || !canSubmit}>{loading?"Checking…":"Check this listing"} <span>→</span></button><p className="privacy-note">Do not include private contact, bank or account details. Link and address checks may be approximate if the listing page cannot be read.</p>
    </form>
  </div>
}

function ListingResults({data,r,edit}) {
  const j=r.ni?"ni":"roi", m=n=>money(n,j);
  const hasPrice = Number(r.price) > 0;
  const profile = readStore("homepath-profile");
  const place = data.location || data.address || data.url || "Location not entered";
  const text = `${data.description || ""} ${data.address || ""}`.toLowerCase();
  const energy = data.energy || r.ai?.extracted?.energyRating || "Unknown";
  const deposit = hasPrice ? (r.ni ? r.depositHigh : r.depositHigh) : 0;
  const mortgage = Math.max(0, (r.price || 0) - deposit);
  const repayments = hasPrice ? [30,35,40].map(years=>[years, monthlyRepayment(mortgage, .045, years)]) : [];
  const costs = hasPrice ? buyingCostBreakdown(r, j, deposit) : [];
  const totalCash = costs.reduce((sum,item)=>sum+item.amount,0);
  const status = moveStatus(r, text);
  const why = whyReasons(data, r, energy, text);
  const qs = personalisedQuestions(data, r, energy, text);
  const pathways = renovationPathways(r, hasPrice);
  const fit = profile && hasPrice ? fitMessage(profile, totalCash, r.price, m) : "Complete Check my position to compare this property with your saved HomePath range.";
  const go = route => { window.location.hash = route; };

  return <div className="page results-page listing-redesign"><button className="text-button" onClick={edit}>← Edit listing</button><PageHead eyebrow="Check a house" title="Your house check">A practical view of cost, comfort, potential and what to investigate next. This is not a survey, valuation or legal review.</PageHead>
    <section className="house-glance">
      <div><p className="eyebrow">House at a glance</p><h2>{hasPrice ? m(r.price) : "Price not entered"}</h2><p>{status.label}</p><small>{status.copy}</small></div>
      <div className="glance-grid">
        {[["Bedrooms",data.bedrooms || "Unknown"],["BER / EPC",energy],["Type",data.type || "Unknown"],["Location",place],["Potential","★★★★☆"],["Jurisdiction",r.ni?"Northern Ireland":"Republic of Ireland"]].map(([label,value])=><article key={label}><span>{label}</span><strong>{value}</strong></article>)}
      </div>
    </section>

    <section className="plain-card fit-card"><h2>Fit with your HomePath</h2><p>{fit}</p></section>

    <section className="result-section"><div className="section-heading"><span>01</span><div><h2>Buying costs</h2><p>A full cash-before-moving-in breakdown, shown separately so the deposit is not confused with other costs.</p></div></div>
      {hasPrice ? <div className="cost-table">{costs.map(item=><article key={item.label}><div><strong>{item.label}</strong><p>{item.note}</p></div><span>{m(item.amount)}</span></article>)}<article className="cost-total"><div><strong>Estimated total cash before moving in</strong><p>Deposit plus once-off buying costs and an initial contingency.</p></div><span>{m(totalCash)}</span></article></div> : <MissingPrice />}
    </section>

    <section className="result-section"><div className="section-heading"><span>02</span><div><h2>Mortgage repayments</h2><p>Illustrative only. Actual repayments depend on lender, rate and circumstances.</p></div></div>
      {hasPrice ? <div className="repayment-cards"><article><span>Purchase price</span><strong>{m(r.price)}</strong></article><article><span>Illustrative deposit</span><strong>{m(deposit)}</strong></article><article><span>Mortgage required</span><strong>{m(mortgage)}</strong></article>{repayments.map(([years,monthly])=><article key={years} className="accent"><span>{years} years at 4.5%</span><strong>{m(monthly)}/mo</strong></article>)}</div> : <MissingPrice />}
    </section>

    <section className="result-section"><div className="section-heading"><span>03</span><div><h2>Renovation pathways</h2><p>Examples of common improvement approaches. These are not a list of work this property definitely requires.</p></div></div>
      <div className="pathway-grid">{pathways.map(p=><article key={p.title}><h3>{p.title}</h3><p>{p.copy}</p><strong>{hasPrice ? `${m(p.low)}–${m(p.high)}` : "Add price for range"}</strong><ul>{p.items.map(x=><li key={x}>{x}</li>)}</ul><small>{p.timescale}</small></article>)}</div>
    </section>

    <section className="result-section"><div className="section-heading"><span>04</span><div><h2>Energy improvement opportunities</h2><p>{energy === "Unknown" ? "BER/EPC was not entered, so these are general opportunities to ask about." : `Based on the entered BER/EPC of ${energy}, these may be worth exploring.`}</p></div></div>
      <div className="energy-card"><ul>{["Attic insulation","Wall insulation","Heating controls","Heat pump suitability","Solar PV","Window upgrades"].map(x=><li key={x}>{x}</li>)}</ul><p>Some energy upgrades may qualify for grants or support. Eligibility depends on the property and the work being carried out.</p><div><a href="https://www.seai.ie/grants/home-energy-grants/" target="_blank" rel="noreferrer">Check SEAI schemes</a><a href="https://www.nidirect.gov.uk/articles/energy-efficiency-grants" target="_blank" rel="noreferrer">Check NI energy-efficiency programmes</a></div></div>
    </section>

    <section className="result-section"><div className="section-heading"><span>05</span><div><h2>Why we suggested these costs</h2><p>This explains the assumptions. Unknowns stay unknown until a professional checks them.</p></div></div>
      <div className="why-costs">{why.map(x=><article key={x}><p>{x}</p></article>)}</div>
    </section>

    <section className="result-section"><div className="section-heading"><span>06</span><div><h2>Questions for your viewing</h2><p>Personalised prompts to save before you go.</p></div></div><div className="question-list">{qs.map((q,i)=><label key={q}><input type="checkbox"/><span><small>{String(i+1).padStart(2,"0")}</small>{q}</span></label>)}</div></section>

    <section className="result-section"><div className="section-heading"><span>07</span><div><h2>Professionals to speak to</h2><p>Who becomes relevant, and when.</p></div></div>
      <div className="professional-grid">{professionals().map(([title,when,why])=><article key={title}><h3>{title}</h3><strong>{when}</strong><p>{why}</p></article>)}</div>
    </section>

    <section className="result-section"><div className="section-heading"><span>08</span><div><h2>Related HomePath guidance</h2><p>Useful next steps inside HomePath.</p></div></div>
      <div className="related-grid">{[["Check my position","/check-position"],["Savings plan","/savings-plan"],["Buying guide","/buying-guide"],["Learning Centre","/learn"]].map(([label,route])=><button key={route} onClick={()=>go(route)}>{label}<span>→</span></button>)}</div>
    </section>

    <section className="result-section"><div className="section-heading"><span>09</span><div><h2>What could this become?</h2><p>Inspiration only: three realistic improvement directions.</p></div></div>
      <div className="pathway-grid inspiration-grid">{[
        ["Budget-conscious improvement","Decoration, small repairs and making the home comfortable.",pathways[0]],
        ["Modern family home","Kitchen, bathroom, heating and insulation improvements over time.",pathways[1]],
        ["Long-term efficient home","Deeper energy upgrades if the property and budget support it.",pathways[2]],
      ].map(([title,copy,p])=><article key={title}><h3>{title}</h3><p>{copy}</p><strong>{hasPrice ? `${m(p.low)}–${m(p.high)}` : "Price needed"}</strong><small>{p.timescale}</small></article>)}</div>
    </section>

    <Disclaimer>This does not replace a survey. The listing alone cannot confirm the condition of the roof, wiring, plumbing, structure, damp, rot, planning or title. Check official sources and get professional advice before bidding or buying.</Disclaimer>
  </div>
}

function MissingPrice() {
  return <div className="plain-card"><h3>Add the asking price when you have it</h3><p>HomePath can give viewing questions from a link or address, but cash estimates and repayment illustrations need an asking price.</p></div>;
}

function monthlyRepayment(principal, annualRate, years) {
  const monthly = annualRate / 12;
  const months = years * 12;
  return principal * monthly / (1 - Math.pow(1 + monthly, -months));
}

function buyingCostBreakdown(r, jurisdiction, deposit) {
  const price = r.price || 0;
  const stamp = jurisdiction === "ni" ? 0 : price * .01;
  return [
    ["Deposit", deposit, jurisdiction === "ni" ? "Illustrated at 10%. Some routes may use a different deposit." : "Illustrated at 10% of the purchase price."],
    [jurisdiction === "ni" ? "SDLT" : "Stamp Duty", stamp, jurisdiction === "ni" ? "May be nil or payable depending on price, buyer status and current rules." : "Illustrated at 1% for a standard purchase."],
    ["Solicitor", 2500, "Legal work, contracts, title and completion or closing."],
    ["Survey", 650, "Independent inspection of the property's condition."],
    ["Mortgage valuation", 200, "Valuation primarily for the lender."],
    ["Home insurance", 450, "Buildings insurance or initial home cover."],
    ["Mortgage protection", jurisdiction === "ni" ? 0 : 350, "Often required in the Republic of Ireland; confirm with your lender or broker."],
    ["Moving costs", 1000, "Van, movers, utility setup and practical move-in costs."],
    ["Initial contingency", Math.max(2500, price * .01), "A starting buffer for early repairs, setup and unknowns."],
  ].map(([label,amount,note])=>({label,amount,note}));
}

function moveStatus(r, text) {
  if (/cash buyers|derelict|unmortgageable|requires refurbishment|major renovation/.test(text) || r.level === "very high") return {label:"🟠 Appears to require significant modernisation", copy:"This could still have potential, but the scope and cost should be checked before bidding."};
  if (/modernisation|excellent potential|vacant|dated|updating/.test(text) || r.level === "high" || r.level === "medium") return {label:"🟡 Appears habitable but could benefit from updating", copy:"This property may suit gradual improvement over time if the numbers work."};
  return {label:"🟢 Appears move-in ready", copy:"This property appears suitable for normal checks and gradual improvement over time."};
}

function renovationPathways(r, hasPrice) {
  const price = r.price || 250000;
  return [
    {title:"Make it comfortable", copy:"A light-touch route focused on living comfortably first.", low:hasPrice?Math.max(7000,price*.025):0, high:hasPrice?Math.max(18000,price*.06):0, timescale:"Often staged over 0–18 months", items:["Decoration","Flooring","Lighting","Minor repairs","Bathroom refresh"]},
    {title:"Modern family home", copy:"A broader update if the property is sound but dated.", low:hasPrice?Math.max(25000,price*.08):0, high:hasPrice?Math.max(65000,price*.18):0, timescale:"Often staged over 1–4 years", items:["Kitchen","Bathroom","Heating","Decoration","Electrical updates where required","Insulation improvements"]},
    {title:"High-performance / A-rated renovation", copy:"A deeper route focused on comfort, energy and long-term running costs.", low:hasPrice?Math.max(65000,price*.18):0, high:hasPrice?Math.max(140000,price*.35):0, timescale:"Often planned as a major project", items:["Heat pump","Solar PV","External insulation where appropriate","Attic insulation","Heating upgrade","Window upgrades","Complete modernisation"]},
  ];
}

function whyReasons(data, r, energy, text) {
  const reasons = [];
  if (r.flags.length) reasons.push(`The listing uses phrases worth clarifying: ${r.flags.map(([x])=>`“${x}”`).join(", ")}.`);
  if (/modernisation|dated|excellent potential|requires refurbishment/.test(text)) reasons.push("The wording suggests the home may benefit from updating, but the exact condition cannot be confirmed from the listing.");
  if (energy && energy !== "Unknown") reasons.push("The BER/EPC suggests energy improvements may be worth checking against comfort, running costs and grant criteria.");
  if (!/renovated|turnkey|newly renovated/.test(text)) reasons.push("The listing does not clearly state that recent major refurbishment has been completed.");
  if (data.mode === "url" || data.mode === "address") reasons.push("Only limited information was entered, so the result focuses on what to check next rather than assuming defects.");
  reasons.push("The listing alone cannot confirm the condition of the roof, wiring, plumbing, damp, rot or structure.");
  return reasons;
}

function personalisedQuestions(data, r, energy, text) {
  const qs = ["What work has been completed in the last five years?","Are there receipts, guarantees or certificates for any major work?","What is included in the sale?","Have there been offers already?"];
  if (energy && energy !== "Unknown") qs.push("What improvements have been made to improve energy efficiency?");
  if (/windows|single glazed|double glazed/.test(text) || energy && !/^a/i.test(energy)) qs.push("When were the windows last replaced or upgraded?");
  if (/modernisation|dated|kitchen/.test(text)) qs.push("Approximately how old are the kitchen and bathroom?");
  if (/extension|extended|attic conversion|converted/.test(text)) qs.push("Do you have planning documentation, certificates or exemption evidence for the extension or conversion?");
  if (data.type === "apartment") qs.push("What are the annual management fees and is there a sinking fund?");
  if (r.flags.some(([term])=>["cash buyers","unmortgageable"].includes(term))) qs.push("Why is the listing referring to cash buyers or mortgageability?");
  qs.push("Can a surveyor access the roof space, services and any outbuildings?");
  return qs;
}

function professionals() {
  return [
    ["Mortgage broker","Before serious house hunting","Helps sense-check borrowing, repayments and lender requirements."],
    ["Solicitor","Once your offer has been accepted","Checks legal title, contracts, planning documents and closing/completion steps."],
    ["Surveyor","Before contracts","Inspects condition and explains what needs further investigation."],
    ["Engineer","If structural concerns arise","May be relevant if a survey flags movement, cracking or structural questions."],
    ["Builder","Before budgeting renovation works","Helps turn improvement ideas into realistic costs and sequencing."],
  ];
}

function fitMessage(profile, cashNeeded, price, m) {
  if (profile.targetPrice && price <= profile.targetPrice) return "This property appears to fit within or below the target price saved in your HomePath profile. Still check monthly repayments, condition and lender requirements.";
  if (profile.estimatedBorrowing && price <= profile.estimatedBorrowing + (profile.currentSavings || 0)) return "This property may sit within your rough mortgage plus savings position, before buying costs, condition and lender checks.";
  if (profile.currentSavings || profile.estimatedUpfrontCash) {
    const gap = Math.max(0, cashNeeded - (profile.currentSavings || 0));
    return gap ? `Buying this property may require approximately ${m(gap)} more cash than your saved current savings.` : "Your saved current savings appear to cover the illustrated upfront cash estimate, before any lender or professional checks.";
  }
  return "Your saved HomePath profile can help compare this property against your rough range once more details are entered.";
}
