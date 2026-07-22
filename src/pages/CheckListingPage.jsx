import React, { useState } from "react";
import { PageHead, Disclaimer } from "../components/Layout";
import { analyseListing, money } from "../lib/calculations";
import { analyseListingWithAdapter } from "../services/listingAnalysis";
import CostsBeyondDeposit from "../components/CostsBeyondDeposit";

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
  const place = data.location || data.address || data.url || "Listing details not entered";
  let qs=[...questions];
  if(data.type==="apartment") qs.push("What are the annual management fees?","Is there a sinking fund?","Are there fire safety issues?","Is parking included?","Are there upcoming works?");
  if(r.level==="high"||r.level==="very high") qs.push("Has a survey been done?","Are services connected?","Is there evidence of damp, rot or structural movement?","Would a lender require works before drawdown?","Are grants potentially relevant?");
  return <div className="page results-page"><button className="text-button" onClick={edit}>← Edit listing</button><PageHead eyebrow="Listing results" title="Your listing check">This is an initial guide, not a survey, valuation or legal review.</PageHead>
    <section className="range-panel listing-summary"><div><p className="eyebrow">At a glance</p><h2>{hasPrice ? m(r.price) : "Price not entered"}</h2><p>{data.mode === "url" ? "Link check" : data.mode === "address" ? "Address/search check" : `${data.bedrooms}-bed ${data.type}`} · {place}</p></div><div className="metrics"><div className="metric"><span>Likely jurisdiction</span><strong>{r.ni?"Northern Ireland":"Republic of Ireland"}</strong></div><div className="metric accent"><span>Renovation buffer</span><strong>{hasPrice ? r.level : "Add price for estimate"}</strong></div></div></section>
    {hasPrice ? <section className="result-section"><div className="section-heading"><span>01</span><div><h2>Money to think about</h2><p>Cash that may be needed before move-in.</p></div></div>
      <div className="money-grid"><div><span>Deposit estimate</span><strong>{r.ni?`${m(r.depositLow)}–${m(r.depositHigh)}`:m(r.depositHigh)}</strong><small>{r.ni?"5–10% illustrated":"10% illustrated"}</small></div><div><span>Buying costs</span><strong>{m(r.costs)}</strong><small>{r.ni?"Before any applicable stamp duty":"Including estimated 1% stamp duty"}</small></div><div><span>Renovation buffer</span><strong>{m(r.renovationLow)}–{m(r.renovationHigh)}</strong><small>Rough allowance only</small></div><div className="total"><span>Total cash before move-in</span><strong>{m(r.depositLow+r.costs+r.renovationLow)}–{m(r.depositHigh+r.costs+r.renovationHigh)}</strong><small>Get actual quotes before bidding</small></div></div>
    </section> : <section className="plain-card"><h3>Add the asking price when you have it</h3><p>HomePath can still give you viewing questions and investigation prompts from a link or address. Deposit, buying-cost and renovation estimates need an asking price.</p></section>}
    {hasPrice && <CostsBeyondDeposit jurisdiction={j} initialPrice={r.price} compact />}
    <section className="result-section"><div className="section-heading"><span>02</span><div><h2>Can this fit my current HomePath?</h2><p>Compare it with your saved position if you have completed Check my position.</p></div></div><div className="plain-card"><p>Use this listing with your HomePath dashboard and savings plan. The property price, condition and lender view all matter.</p></div></section>
    <section className="result-section"><div className="section-heading"><span>03</span><div><h2>Listing wording to notice</h2><p>{r.flags.length?`${r.flags.length} phrase${r.flags.length>1?"s":""} found`:"No common warning phrases found"}</p></div></div>
      {r.flags.length?<div className="flag-list">{r.flags.map(([term,note])=><article key={term}><h3>“{term}”</h3><p>{note}</p></article>)}</div>:<div className="plain-card"><p>The description does not use any of the phrases HomePath currently checks. That does not mean the property has no issues — listings are marketing copy, not surveys.</p></div>}
    </section>
    {r.ai && !r.ai.needsManualInput && <section className="result-section"><div className="section-heading"><span>AI</span><div><h2>AI notes to investigate</h2><p>These are prompts for follow-up, not a diagnosis.</p></div></div><div className="flag-list">{(r.ai.conditionChecks || []).slice(0,6).map(x=><article key={`${x.category}-${x.reason}`}><h3>{x.category} · {x.priority}</h3><p>{x.reason} Confirm with: {x.professional}.</p></article>)}</div></section>}
    {r.ai?.needsManualInput && <section className="plain-card"><h3>Manual details needed</h3><p>{r.ai.message || "Paste the listing description or enter the main details instead."}</p></section>}
    <section className="result-section"><div className="section-heading"><span>04</span><div><h2>Questions to ask</h2><p>Save these in your phone before you go.</p></div></div><div className="question-list">{qs.map((q,i)=><label key={q}><input type="checkbox"/><span><small>{String(i+1).padStart(2,"0")}</small>{q}</span></label>)}</div></section>
    <section className="result-section"><div className="section-heading"><span>!</span><div><h2>What should worry me, and what should I simply investigate?</h2><p>An older house is not automatically a bad purchase. Understand the cause, cost and urgency before proceeding.</p></div></div><div className="worry-grid">{[["Usually routine","Decoration, worn finishes, older kitchens, small repairs and ordinary maintenance."],["Worth investigating","Damp signs, older wiring, plumbing, heating, windows, drainage or unclear management fees."],["Potentially significant","Roof issues, dry rot or wet rot, poor extensions, fire-safety concerns or possible structural movement."],["Needs urgent professional advice","Major cracks, serious damp or rot, suspected subsidence, unmortgageable wording, unsafe services or legal/planning uncertainty."]].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="two-col"><div className="plain-card"><h3>Professional checks required</h3><p>{r.ai?.professionalChecks?.slice(0,4).join(" ") || "Ask a surveyor about condition, a solicitor about title and planning, and a lender or broker about mortgageability."}</p></div><div className="plain-card"><h3>Related Buying Explained modules</h3><p>{r.ai?.relatedModules?.slice(0,4).join(" · ") || "Should I be afraid of an older house? · What does a solicitor check? · How much cash do I actually need?"}</p></div></section>
    <Disclaimer>This does not replace a survey. Always get professional advice before bidding or buying.</Disclaimer>
  </div>
}
