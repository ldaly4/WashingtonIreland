import React, { useEffect, useState } from "react";
import { askHomePath } from "../services/askHomePath";

const nav = [
  ["/", "Home"],
  ["/learn", "Learning Centre"],
  ["/check-position", "My position"],
  ["/check-listing", "Check a house"],
  ["/ask", "Ask HomePath"],
  ["/buying-guide", "Buying explained"],
  ["/housing-pulse", "Housing Pulse"],
];
const mobileLabel = {
  "/": "Home",
  "/learn": "Learn",
  "/check-position": "Position",
  "/check-listing": "Listing",
  "/ask": "Ask",
  "/buying-guide": "Explained",
};

export function HouseMark() {
  return <span className="mark" aria-hidden="true">
    <svg viewBox="0 0 180 116">
      <circle className="logo-sun" cx="86" cy="35" r="28"/>
      <path className="logo-hill logo-hill-back" d="M18 70c26-16 55-20 86-7 24 10 42 6 58-5"/>
      <path className="logo-hill" d="M13 76c31-10 61-14 94-3 24 8 43 8 61 1"/>
      <path className="logo-house" d="M93 65V38l27-17 22 15V22h20v30"/>
      <path className="logo-door" d="M124 65V48a8 8 0 0 1 16 0v17"/>
      <circle className="logo-knob" cx="135" cy="56" r="1.7"/>
      <path className="logo-path" d="M95 78c-16 6-27 13-31 22h80c-19-6-32-13-49-22Z"/>
    </svg>
  </span>;
}

export default function Layout({ path, navigate, children }) {
  const [more,setMore]=useState(false), [ask,setAsk]=useState(false);
  useEffect(()=>{
    const open=event=>{setAsk(event.detail || true)};
    window.addEventListener("homepath-open-ask",open);
    return()=>window.removeEventListener("homepath-open-ask",open);
  },[]);
  const go = (event, href) => { event.preventDefault(); navigate(href); };
  return <div className="app-shell">
    <header className="header">
      <a className="brand" href="#/" onClick={e => go(e, "/")}><HouseMark /><span><b>Home</b><i>Path</i><small>making your path to housing easier</small></span></a>
      <a className={`header-learn ${path === "/learn" ? "active" : ""}`} href="#/learn" onClick={e => go(e, "/learn")}>Learning Centre</a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([href, label]) => <a key={href} className={path === href ? "active" : ""} href={`#${href}`} onClick={e => go(e, href)}>{label}</a>)}
      </nav>
    </header>
    <main>{children}</main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {nav.slice(0,4).map(([href, label]) => <a key={href} className={path === href ? "active" : ""} href={`#${href}`} onClick={e => go(e, href)}>
        {mobileLabel[href] || label}
      </a>)}
      <button className={more ? "active" : ""} onClick={()=>setMore(!more)}>More</button>
    </nav>
    {more && <div className="more-menu">
      {[["/buying-guide","Buying guide"],["/savings-plan","Savings plan"],["/glossary","Glossary"],["/housing-pulse","Housing Pulse"],["/advice-centre","Advice centre"],["/ask","Ask HomePath"],["/privacy","Privacy"]].map(([href,label])=><a key={href} href={`#${href}`} onClick={e=>{setMore(false);go(e,href)}}>{label}</a>)}
    </div>}
    <button className="ask-fab" onClick={()=>setAsk(true)}>Ask HomePath</button>
    {ask && <AskDrawer route={path} initialPayload={typeof ask === "object" ? ask : {}} close={()=>setAsk(false)} navigate={navigate}/>}
  </div>;
}

function AskDrawer({ close, navigate, initialPayload = {}, route }) {
  const answers = {
    "Who should I contact first?":"If you are unsure where you stand, a mortgage broker, adviser or lender is often a useful first conversation. You can speak to them before finding a house. If your question is legal, speak to a solicitor or conveyancer. If it is about condition, speak to a surveyor.",
    "What does approval in principle mean?":"It is an early indication of what a lender may offer. It is not final approval and it is not tied to every property.",
    "Can I speak to a broker before finding a house?":"Yes. Speaking to a broker is an information-gathering step. It does not commit you to a mortgage.",
    "What housing routes may be worth checking?":"Start with your rough buying range, savings gap and current housing situation. Then compare private purchase with any relevant public or shared-ownership routes. HomePath can explain routes, but the official provider decides whether a scheme applies.",
    "What should I check before relying on a support scheme?":"Check the official source, property rules, location, income or household rules, costs that remain, and whether the route affects future sale or buy-out choices.",
    "What is a booking deposit?":"In the Republic of Ireland, it is often paid to the estate agent after an offer is accepted. It normally forms part of the overall buyer deposit and is usually refundable before contracts are signed.",
    "What does a solicitor do?":"A solicitor checks the legal title, contracts, planning, boundaries and mortgage legal documents. They also handle the transfer of ownership.",
    "What is conveyancing?":"Conveyancing is the legal work needed to transfer ownership of a property. Your solicitor or conveyancer checks title, contracts, searches and mortgage legal documents.",
    "How much cash do I need beyond the deposit?":"You normally need money for legal work, tax, survey, valuation, insurance, moving and a buffer. The deposit is only one part of the cash target.",
    "What is the difference between a survey and valuation?":"A valuation is mainly for the lender. A survey is for you and checks the property condition in more detail.",
    "What happens after my offer is accepted?":"You may go sale agreed or have an offer accepted, then legal checks, survey, mortgage approval and contract steps happen. You do not normally own the home at offer stage.",
    "What should I ask at a viewing?":"Ask about heating, roof, wiring, windows, damp, planning, management fees, services and what is included in the sale.",
    "Is an older house a bad idea?":"Age alone does not make a home a bad purchase. It may need more investigation, especially around roof, damp, wiring, plumbing and extensions.",
    "What is a sinking fund?":"For apartments, a sinking fund is money set aside by the management company for larger future repairs or works.",
  };
  const suggestions = Object.keys(answers);
  const [q,setQ]=useState(initialPayload.question || "");
  const [history,setHistory]=useState([]);
  const [answer,setAnswer]=useState("");
  const [structured,setStructured]=useState(null);
  const [error,setError]=useState("");
  const [feedback,setFeedback]=useState("");
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    const onKey=e=>{ if(e.key==="Escape") close(); };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[close]);
  const ask = async () => {
    const question = q.trim();
    if (!question) {
      setError("Type a question or choose one of the suggested questions below.");
      return;
    }
    setLoading(true); setError("");
    try {
      const context = { route, ...(initialPayload.context || {}) };
      const result = await askHomePath(question, context, history);
      setStructured(result);
      setAnswer(result.answer || answers[question] || "I could not generate a full answer just now. Try one of the suggested questions below or check the related HomePath pages.");
      setHistory(prev => [...prev.slice(-6), { role: "user", content: question }, { role: "assistant", content: result.answer || "" }]);
    } catch {
      setError("HomePath’s live explanation service is temporarily unavailable. The local guidance library is being used.");
      setAnswer(answers[question] || "I can still help with common topics such as brokers, deposits, surveys, valuations, solicitors and viewing questions. Choose a suggested question below.");
    } finally {
      setLoading(false);
    }
  };
  const clear=()=>{setQ("");setAnswer("");setStructured(null);setError("");setFeedback("");};
  return <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label="Ask HomePath">
    <aside className="ask-drawer"><button className="drawer-close" onClick={close}>Close</button><p className="eyebrow">Not sure who to ask? Ask HomePath.</p><h2>Quick housing answers</h2><p>Ask a question about buying, housing supports, mortgages, legal steps or property condition. I’ll explain it in plain language and point you towards the right next step.</p>
      <p className="privacy-note">Your question may be processed by an external AI service to generate an answer. Do not include bank details, account numbers, PPS numbers, National Insurance numbers or other sensitive personal information.</p>
      <label className="ask-input"><span>Your question</span><textarea value={q} onChange={e=>setQ(e.target.value)} rows="4" placeholder="For example: Can I speak to a broker before finding a house?" /></label>
      <button className="guide-inline-button" onClick={ask} disabled={loading}>{loading ? "Asking…" : "Ask"}</button>
      {loading && <p role="status" aria-live="polite">Loading HomePath answer…</p>}
      {error && <p className="form-error">{error}</p>}
      {answer && <div className="ask-answer" aria-live="polite">{answer} <small>{structured?.disclaimer || "Confirm anything important with a broker, lender, solicitor, surveyor or official provider."}</small></div>}
      <div className="ask-suggestions"><h3>Suggested questions</h3>{suggestions.slice(0,6).map(x=><button key={x} onClick={()=>{setQ(x);setAnswer("");setStructured(null);setError("");}}>{x}</button>)}</div>
      {structured?.officialSources?.length > 0 && <div className="source-list"><h3>Sources</h3>{structured.officialSources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>)}</div>}
      {structured?.suggestedActions?.length > 0 && <div className="source-list"><h3>Related HomePath actions</h3>{structured.suggestedActions.map(a=><button key={a.label} onClick={()=>{close();navigate(a.route)}}>{a.label}</button>)}</div>}
      <div className="ask-tools"><button onClick={ask} disabled={loading}>Retry</button><button onClick={clear}>Clear conversation</button></div>
      <div className="ask-feedback"><span>Was this helpful?</span><button className={feedback==="yes"?"active":""} onClick={()=>setFeedback("yes")}>Yes</button><button className={feedback==="no"?"active":""} onClick={()=>setFeedback("no")}>Not quite</button></div>
      <button className="guide-inline-button" onClick={()=>{close();navigate("/learn")}}>Open related lessons</button>
    </aside>
  </div>
}

export function Disclaimer({ children }) {
  return <aside className="disclaimer"><strong>Good to know</strong><p>{children}</p></aside>;
}

export function PageHead({ eyebrow, title, children }) {
  return <header className="page-head">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{children}</p></header>;
}
