import React from "react";
import { Disclaimer, HouseMark } from "../components/Layout";
import { readStore, writeStore } from "../lib/storage";

const cards = [
  ["Check my position", "See what you may be able to borrow, how much cash you may need and which routes are worth checking.", "Start", "/check-position"],
  ["Learn the basics", "Build your housing knowledge through short lessons and practical examples.", "Open Learning Centre", "/learn"],
  ["Check a house", "Paste a property listing or enter the details to understand the likely costs, risks and questions.", "Check", "/check-listing"],
];

const quickLinks = [
  ["Buying guide", "/buying-guide"],
  ["Savings plan", "/savings-plan"],
  ["Ask HomePath", "ask"],
  ["Housing Pulse", "/housing-pulse"],
];

export default function HomePage({ navigate }) {
  const profile = readStore("homepath-profile");
  const confidence = readStore("homepath-confidence-start");
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">Clear housing guidance for the Republic of Ireland and Northern Ireland</p>
        <h1>Not sure where you stand? Start here.</h1>
        <p className="hero-copy">Check what you could roughly afford, learn the buying basics, and know what to ask before viewing a home.</p>
        {profile && <div className="home-personal"><strong>Your HomePath is saved on this device.</strong><span>Based on your target of a {profile.targetHomeType} near {profile.targetArea || "your area"}, your next useful step may be checking real listings or building the deposit further.</span></div>}
        {!confidence && <div className="confidence-card"><label><span>How confident do you currently feel about understanding your housing options?</span><select defaultValue="" onChange={e=>writeStore("homepath-confidence-start",{score:Number(e.target.value),date:new Date().toISOString()})}><option value="" disabled>Optional: choose 1–10</option>{[1,2,3,4,5,6,7,8,9,10].map(x=><option key={x} value={x}>{x} — {x===1?"Not at all confident":x===10?"Very confident":""}</option>)}</select></label><small>This stays on your device unless you later choose to share research data.</small></div>}
        <Disclaimer>General guidance only. Not mortgage, legal, financial, surveying or planning advice.</Disclaimer>
      </div>
      <div className="hero-art hub-panel" aria-hidden="true"><HouseMark /><div className="path-line" /><span>HomePath</span></div>
    </section>
    <section className="actions" aria-labelledby="choose-action">
      <div className="section-intro"><p className="eyebrow">Choose a starting point</p><h2 id="choose-action">What do you need today?</h2></div>
      <div className="action-grid">{cards.map(([title,text,button,href]) =>
        <article className="action-card" key={href}><h3>{title}</h3><p>{text}</p>
          <button onClick={() => href === "ask" ? window.dispatchEvent(new Event("homepath-open-ask")) : navigate(href)}>{button}<span>→</span></button></article>)}</div>
      <div className="home-quick-links" aria-label="More HomePath tools">
        {quickLinks.map(([label,href]) => <button key={label} onClick={() => href === "ask" ? window.dispatchEvent(new Event("homepath-open-ask")) : navigate(href)}>{label}<span>→</span></button>)}
      </div>
      <p className="research-line">Based on our early research, the questions young people ask most are not only ‘Can I afford it?’ but also ‘Who do I speak to?’, ‘What happens next?’ and ‘How much cash do I actually need?’</p>
    </section>
  </>;
}
