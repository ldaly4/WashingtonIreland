import React, { useEffect, useState } from "react";

const nav = [
  ["/", "Home"],
  ["/check-position", "My position"],
  ["/check-listing", "Check a house"],
  ["/learn", "Learn"],
  ["/buying-guide", "Buying a home"],
  ["/housing-pulse", "Housing Pulse"],
];
const mobileLabel = {
  "/": "Home",
  "/check-position": "Position",
  "/check-listing": "House",
  "/learn": "Learn",
};

export function HouseMark() {
  return <span className="mark" aria-hidden="true">
    <svg viewBox="0 0 64 64">
      <path className="logo-house" d="M10 34V22.5c0-2.1.9-4 2.5-5.3L30.1 3.4c1.1-.9 2.7-.9 3.8 0l17.6 13.8c1.6 1.3 2.5 3.2 2.5 5.3V34M47 13V7h5v10"/>
      <path className="logo-door" d="M27.3 29.5V20a4.7 4.7 0 0 1 9.4 0v8.4"/>
      <circle className="logo-knob" cx="34.2" cy="24.5" r="1.2"/>
      <path className="logo-path" d="M38.5 28.2c-11.5 2.2-21.1 5.4-25.7 9-4.8 3.8-1.8 7.8 5 9.7 5.8 1.7 15 1.9 25.5 1-9.4-2.4-15.3-5.2-15.5-8.6-.2-3.7 4.4-7.4 10.7-11.1Z"/>
    </svg>
  </span>;
}

export default function Layout({ path, navigate, children }) {
  const [more,setMore]=useState(false), [ask,setAsk]=useState(false);
  useEffect(()=>{
    const open=()=>setAsk(true);
    window.addEventListener("homepath-open-ask",open);
    return()=>window.removeEventListener("homepath-open-ask",open);
  },[]);
  const go = (event, href) => { event.preventDefault(); navigate(href); };
  return <div className="app-shell">
    <header className="header">
      <a className="brand" href="#/" onClick={e => go(e, "/")}><HouseMark /><span><b>Home</b><i>Path</i></span></a>
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
      {[["/buying-guide","Buying guide"],["/housing-pulse","Housing Pulse"],["/advice-centre","Advice centre"],["/privacy","Privacy"]].map(([href,label])=><a key={href} href={`#${href}`} onClick={e=>{setMore(false);go(e,href)}}>{label}</a>)}
      <button onClick={()=>{setMore(false);setAsk(true)}}>Ask HomePath</button>
    </div>}
    <button className="ask-fab" onClick={()=>setAsk(true)}>Ask HomePath</button>
    {ask && <AskDrawer close={()=>setAsk(false)} navigate={navigate}/>}
  </div>;
}

function AskDrawer({ close, navigate }) {
  const answers = {
    "What does approval in principle mean?":"It is an early indication of what a lender may offer. It is not final approval and it is not tied to every property.",
    "Can I speak to a broker before finding a house?":"Yes. Speaking to a broker is an information-gathering step. It does not commit you to a mortgage.",
    "What is a booking deposit?":"In the Republic of Ireland, it is often paid to the estate agent after an offer is accepted. It normally forms part of the overall buyer deposit and is usually refundable before contracts are signed.",
    "What does a solicitor do?":"A solicitor checks the legal title, contracts, planning, boundaries and mortgage legal documents. They also handle the transfer of ownership.",
    "What should I ask at a viewing?":"Ask about heating, roof, wiring, windows, damp, planning, management fees, services and what is included in the sale.",
    "Is an older house a bad idea?":"Age alone does not make a home a bad purchase. It may need more investigation, especially around roof, damp, wiring, plumbing and extensions.",
    "What is a sinking fund?":"For apartments, a sinking fund is money set aside by the management company for larger future repairs or works.",
  };
  const [q,setQ]=useState(Object.keys(answers)[0]);
  return <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label="Ask HomePath">
    <aside className="ask-drawer"><button className="drawer-close" onClick={close}>Close</button><p className="eyebrow">Ask HomePath</p><h2>Quick housing answers</h2><p>General guidance only. HomePath will not invent current scheme rules or make eligibility decisions.</p>
      <select value={q} onChange={e=>setQ(e.target.value)}>{Object.keys(answers).map(x=><option key={x}>{x}</option>)}</select>
      <div className="ask-answer">{answers[q]} <small>Confirm anything important with a broker, lender, solicitor, surveyor or official provider.</small></div>
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
