import React, { useMemo, useState } from "react";
import { Disclaimer, PageHead } from "../components/Layout";
import { money } from "../lib/calculations";

const links = {
  roi: [
    ["CCPC home buyer’s guides", "https://www.ccpc.ie/consumers/money/mortgages/buying-a-home/"],
    ["Citizens Information: buying a home", "https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-in-buying-a-home/"],
    ["CCPC mortgage comparison and calculator", "https://www.ccpc.ie/consumers/money-tools/mortgage-comparisons/"],
    ["Revenue stamp duty information", "https://www.revenue.ie/en/property/stamp-duty/index.aspx"],
  ],
  ni: [
    ["NI Direct buying a home guide", "https://www.nidirect.gov.uk/articles/buying-home-step-step"],
    ["MoneyHelper mortgage and home-buying guidance", "https://www.moneyhelper.org.uk/en/homes/buying-a-home"],
    ["GOV.UK Stamp Duty Land Tax calculator", "https://www.gov.uk/stamp-duty-land-tax"],
    ["Co-Ownership", "https://www.co-ownership.org/"],
  ],
};

const people = [
  ["Mortgage broker or adviser", "Helps assess borrowing options and submit the mortgage application. May be lender-paid or may charge a fee."],
  ["Lender", "Decides whether to provide the mortgage and on what terms."],
  ["Estate agent", "Represents the seller, arranges viewings and communicates offers."],
  ["Solicitor or conveyancer", "Carries out the legal work and transfer of ownership."],
  ["Surveyor", "Independently checks the physical condition of the property."],
  ["Valuer", "Provides a valuation for the lender. This is not a replacement for the buyer’s survey."],
  ["Insurer", "Provides home insurance and, where required, mortgage protection or life cover."],
];

const roiSteps = [
  ["Work out your full budget", "You need more than the deposit. Build a budget for the likely mortgage amount, buyer deposit, stamp duty, solicitor, survey, lender valuation, insurance, moving and an initial repair buffer. First-time buyers will generally need a deposit of at least 10%, but this is not the only cash required.", "You can start yourself, then speak to a mortgage broker, adviser or lender.", "Deposit savings plus money for tax, legal, survey, insurance and moving costs.", "Use the calculator below and keep the overall buyer deposit separate from additional buying costs."],
  ["Speak to a mortgage broker or lender", "A mortgage broker can assess your position, compare lenders and help organise an application. You can speak to one before you have found a property.", "Mortgage broker, banks directly, or an accountant if self-employed.", "Often €0 for an initial conversation, but confirm this with the broker.", "Ask how the broker is paid and whether any fee applies before proceeding."],
  ["Get approval in principle", "Approval in principle gives an initial estimate of what the lender may offer. It is not final approval for a particular property.", "Broker, adviser or lender.", "Usually no property payment yet. You may need time to gather documents.", "Prepare photo identification, proof of address, payslips, employment details, bank and savings statements, rent history, loans, cards and tax or business records if self-employed."],
  ["Choose a solicitor", "Your solicitor reviews contracts, checks legal title, planning and boundaries, deals with the seller’s solicitor, handles mortgage legal documents, calculates stamp duty and transfers ownership.", "Two or three solicitors for written quotations.", "Allow roughly €2,000–€3,500+, depending on the property and legal work. This is illustrative only.", "Ask whether VAT and outlays are included before choosing."],
  ["Search for and view homes", "The estate agent represents the seller, not you. Compare the asking price with nearby sold prices, check the BER, transport, services, roof, heating, wiring, windows, damp, planning and management fees where relevant.", "Estate agents, your solicitor for legal concerns, and HomePath’s listing checker.", "Usually no buyer deposit yet, unless you go sale agreed.", "Do not rely on listing photographs alone. Make a viewing checklist."],
  ["Make an offer and go sale agreed", "An accepted offer does not mean you legally own the property. You may be asked to pay a booking deposit to the estate agent. This often varies and may be around €5,000–€10,000. It is normally refundable until contracts are signed. It forms part of your overall buyer deposit; it is not an additional deposit.", "Estate agent, solicitor and broker or lender.", "Illustrative booking deposit plus ongoing legal or mortgage costs.", "Make sure the booking deposit, overall buyer deposit, additional buying costs and mortgage loan are all clearly separated in your budget."],
  ["Arrange an independent survey", "A lender valuation is not a full survey. A surveyor works for you and may identify roof problems, damp, rot, structural movement, defective extensions, old wiring or plumbing and drainage problems.", "Independent surveyor.", "Approximately €400–€1,000+, depending on the property and survey. This is illustrative.", "If serious issues appear, renegotiate, investigate further or decide not to proceed before signing contracts."],
  ["Get formal mortgage approval", "The lender now assesses the actual property and issues the formal loan offer. You may need a lender valuation, final documents, mortgage protection, home insurance and confirmation of deposit funds.", "Broker, lender, insurer and solicitor.", "Valuation, insurance or policy costs may arise.", "Do not sign a binding contract without the required mortgage approval and legal advice."],
  ["Sign contracts and pay the remaining deposit", "Once contracts are signed and exchanged, the sale normally becomes legally binding. Withdrawing afterwards can mean losing the deposit and facing further consequences.", "Solicitor.", "The balance of the overall buyer deposit, after any booking deposit already paid.", "Check the contract, mortgage conditions, survey findings and completion timing with your solicitor."],
  ["Close the sale and receive the keys", "Your solicitor completes final searches, requests mortgage funds, transfers the purchase money, pays stamp duty, completes the legal transfer and arranges release of the keys.", "Solicitor, lender, insurer and estate agent.", "Stamp duty, remaining solicitor fees, registration and search costs, insurance, moving costs and immediate repairs or furnishing buffer.", "Keep documents, insurance and utility arrangements ready for moving day."],
];

const niSteps = [
  ["Work out your full budget", "You need a deposit, but also separate allowances for solicitor or conveyancer, searches, survey, mortgage fees, valuation, Stamp Duty Land Tax where applicable, insurance and moving costs.", "Mortgage adviser, lender, solicitor or conveyancer.", "Deposit savings plus buying-cost savings.", "Use the figures below as a rough starting point, not a quote."],
  ["Speak to a mortgage adviser or lender", "Some mortgage advisers are free to the buyer because they receive commission from the lender. Others charge a fixed fee, hourly fee or percentage. Ask about all fees before agreeing to use them.", "Mortgage adviser, banks, building societies or other lenders.", "Possible adviser or mortgage application fees.", "Ask what lenders they can access and how they are paid."],
  ["Get an agreement in principle", "An agreement in principle gives an initial view of what a lender may offer. It is not a final mortgage offer for a specific property.", "Mortgage adviser or lender.", "Usually no property payment yet.", "Gather ID, address, income, statements, credit commitments and deposit evidence."],
  ["Find and view a property", "Look beyond the listing. Check condition, location, heating, damp, roof, windows, extensions, services and likely running costs.", "Estate agent and, later, surveyor and solicitor or conveyancer.", "Usually no contract deposit yet.", "Remember the estate agent represents the seller."],
  ["Make an offer", "If the offer is accepted, the sale can move forward, but you are not legally committed until exchange of contracts.", "Estate agent, adviser or lender, and legal representative.", "Survey, legal searches, valuation and mortgage costs may start after this point.", "Do not treat an accepted offer as ownership."],
  ["Appoint a solicitor or conveyancer", "A solicitor or conveyancer carries out the legal work, checks the property title, arranges searches, deals with the seller’s legal representative and transfers the money.", "Solicitor or conveyancer.", "Legal fees are often around £2,000, but quotations vary. This is illustrative.", "Request written quotes and ask what searches, VAT and outlays are included."],
  ["Arrange a survey and lender valuation", "The valuation protects the lender. Your own survey protects you by checking the property condition in more detail.", "Independent surveyor and lender-appointed valuer.", "Survey and valuation fees may be payable.", "Use survey findings before committing at exchange."],
  ["Complete the mortgage application", "The lender checks your documents, the property and valuation before issuing a formal mortgage offer.", "Mortgage adviser or lender, solicitor or conveyancer and insurer.", "Mortgage fees, valuation, insurance and any adviser fees may apply.", "Check conditions before moving to exchange."],
  ["Exchange contracts", "The purchase becomes legally binding. A deposit of at least 5% is commonly payable at this point, although the exact amount and arrangements can vary.", "Solicitor or conveyancer.", "Contract deposit. For a £180,000 home, 5% is £9,000 and 10% is £18,000.", "Do not exchange until finance, legal checks, survey issues and completion date are clear."],
  ["Complete and receive the keys", "The lender releases funds, your legal representative transfers money, completion happens and the keys are released.", "Solicitor or conveyancer, lender, insurer and estate agent.", "Legal balance, SDLT where applicable, lender fees and remaining purchase funds.", "Keep insurance, moving plans and utility arrangements ready."],
];

const moneyTimeline = {
  roi: [
    ["Before searching", "Possibly no professional fees, but begin building deposit and cost savings."],
    ["Sale agreed", "Booking deposit, often approximately €5,000–€10,000 and generally refundable before contracts."],
    ["Survey and mortgage stage", "Survey, lender valuation and possibly insurance costs."],
    ["Contracts", "Remaining buyer deposit."],
    ["Closing", "Stamp duty, legal balance, registration costs and remaining purchase funds."],
  ],
  ni: [
    ["Before searching", "Possible adviser or mortgage application fees."],
    ["Offer accepted", "Survey, legal searches, valuation and mortgage costs."],
    ["Exchange", "Contract deposit, commonly at least 5%."],
    ["Completion", "Legal balance, SDLT where applicable, lender fees and remaining purchase funds."],
  ],
};

function CostCalculator({ jurisdiction }) {
  const [price, setPrice] = useState(jurisdiction === "ni" ? "180000" : "350000");
  const [deposit, setDeposit] = useState(jurisdiction === "ni" ? "5" : "10");
  const [savings, setSavings] = useState("");
  const p = Number(price) || 0, d = Number(deposit) || 0, s = Number(savings) || 0;
  const depositRequired = p * d / 100;
  const additional = jurisdiction === "ni" ? 4200 : p * .01 + 6300;
  const total = depositRequired + additional;
  const m = n => money(n, jurisdiction);
  return <div className="guide-calculator">
    <h3>Mini budget check</h3>
    <div className="guide-calc-fields">
      <label>Property price<input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} /></label>
      <label>Deposit percentage<input type="number" min="0" value={deposit} onChange={e=>setDeposit(e.target.value)} /></label>
      <label>Current savings<input type="number" min="0" value={savings} onChange={e=>setSavings(e.target.value)} /></label>
    </div>
    <dl>
      <div><dt>Total deposit required</dt><dd>{m(depositRequired)}</dd></div>
      <div><dt>Estimated additional buying costs</dt><dd>{m(additional)}</dd></div>
      <div><dt>Total approximate cash needed</dt><dd>{m(total)}</dd></div>
      <div><dt>Current savings</dt><dd>{m(s)}</dd></div>
      <div className="gap"><dt>Remaining gap</dt><dd>{m(Math.max(0,total-s))}</dd></div>
    </dl>
  </div>
}

function StepCard({ step, index, open, toggle, jurisdiction, navigate }) {
  const [title, what, who, moneyNow, before] = step;
  return <article className={`guide-step ${open ? "open" : ""}`}>
    <button onClick={toggle} aria-expanded={open}><span>{String(index+1).padStart(2,"0")}</span><strong>{title}</strong><b>{open ? "−" : "+"}</b></button>
    {open && <div className="guide-step-body">
      <section><h3>What happens</h3><p>{what}</p>{jurisdiction==="roi" && index===0 && <CostCalculator jurisdiction={jurisdiction}/>} {jurisdiction==="roi" && index===5 && <DepositExample/>} {jurisdiction==="ni" && index===8 && <DepositExamplesNI/>}</section>
      <section><h3>Who to contact</h3><p>{who}</p>{jurisdiction==="roi" && index===4 && <button className="guide-inline-button" onClick={()=>navigate("/check-listing")}>Check a property listing</button>}</section>
      <section><h3>Money needed now</h3><p>{moneyNow}</p></section>
      <section><h3>Before you move on</h3><p>{before}</p></section>
      <section><h3>Documents and delays</h3><p>Delays often come from missing documents, survey issues, legal title questions, lender conditions, planning queries or slow replies between parties.</p></section>
      <section><h3>Related lesson</h3><p>Want the short version first? Take a 5-minute lesson in Learn.</p><button className="guide-inline-button" onClick={()=>navigate("/learn")}>Open Learn</button></section>
    </div>}
  </article>
}

function DepositExample() {
  return <dl className="deposit-example"><div><dt>Purchase price</dt><dd>€350,000</dd></div><div><dt>10% total buyer deposit</dt><dd>€35,000</dd></div><div><dt>Illustrative booking deposit</dt><dd>€7,000</dd></div><div><dt>Remaining deposit later</dt><dd>€28,000</dd></div><div><dt>Additional buying costs</dt><dd>Separate</dd></div></dl>
}

function DepositExamplesNI() {
  return <dl className="deposit-example"><div><dt>£180,000 house at 5%</dt><dd>£9,000</dd></div><div><dt>£180,000 house at 10%</dt><dd>£18,000</dd></div></dl>
}

export default function BuyingGuidePage({ navigate }) {
  const saved = localStorage.getItem("homepath-buying-jurisdiction") || "roi";
  const [jurisdiction, setJurisdiction] = useState(saved);
  const [open, setOpen] = useState([0,1]);
  const steps = jurisdiction === "roi" ? roiSteps : niSteps;
  const m = useMemo(() => jurisdiction === "roi" ? "€" : "£", [jurisdiction]);
  const choose = next => { localStorage.setItem("homepath-buying-jurisdiction", next); setJurisdiction(next); setOpen([0,1]); };
  const toggle = i => setOpen(current => current.includes(i) ? current.filter(x=>x!==i) : [i, ...current].slice(0,2));
  return <div className="page buying-guide-page">
    <PageHead eyebrow="Step-by-step guide" title="Buying a home">Buying your first home can feel like everyone knows the process except you. Here is what happens, who you need to speak to and when you need money.</PageHead>
    <div className="segmented-toggle" role="tablist" aria-label="Choose location"><button className={jurisdiction==="roi"?"active":""} onClick={()=>choose("roi")}>Republic of Ireland</button><button className={jurisdiction==="ni"?"active":""} onClick={()=>choose("ni")}>Northern Ireland</button></div>
    <section className="guide-summary"><div><p className="eyebrow">You will normally need</p><ul><li>a mortgage broker, adviser or lender</li><li>a solicitor{jurisdiction==="ni" ? " or conveyancer" : ""}</li><li>an independent surveyor</li><li>an estate agent, who represents the seller</li><li>deposit savings</li><li>money for legal, tax, survey, insurance and moving costs</li></ul></div><aside>You do not need to have found a house before speaking to a mortgage broker or adviser.</aside></section>
    <div className="journey-strip" aria-label="Buying journey">{["Budget","Mortgage","Search","Offer","Survey","Contracts","Keys"].map((x,i)=><span key={x} className={i<2?"active":""}>{x}</span>)}</div>
    <section className="guide-steps">{steps.map((step,i)=><StepCard key={step[0]} step={step} index={i} open={open.includes(i)} toggle={()=>toggle(i)} jurisdiction={jurisdiction} navigate={navigate}/>)}</section>
    <section className="people-section"><div className="section-heading"><span>{m}</span><div><h2>Who does what?</h2><p>The people and organisations you may deal with.</p></div></div><div className="people-grid">{people.map(([name,text])=><article key={name}><h3>{name}</h3><p>{text}</p></article>)}</div></section>
    <section className="money-timeline"><div className="section-heading"><span>{m}</span><div><h2>Money timeline</h2><p>When different payments may appear.</p></div></div><div>{moneyTimeline[jurisdiction].map(([stage,text])=><article key={stage}><h3>{stage}</h3><p>{text}</p></article>)}</div></section>
    <section className="official-sources"><div className="section-heading"><span>↗</span><div><h2>Check the official guidance</h2><p>Open these in a new tab before relying on any rule or cost.</p></div></div><div>{links[jurisdiction].map(([label,href])=><a key={href} href={href} target="_blank" rel="noreferrer">{label}</a>)}</div></section>
    <Disclaimer>HomePath provides general guidance only. Costs, legal processes and lender requirements vary. Always confirm your position with the relevant lender, mortgage adviser, solicitor, surveyor, tax authority or scheme provider.</Disclaimer>
  </div>
}
