import React from "react";
import { Disclaimer, HouseMark } from "../components/Layout";
import { readStore, writeStore } from "../lib/storage";

const cards = [
  ["Check My Position", "See what you may be able to borrow, how much cash you may need and which routes are worth checking.", "Start", "/check-position", "blue"],
  ["Learning Centre", "Build your housing knowledge through short lessons and practical examples.", "Open", "/learn", "green"],
  ["Check a House", "Paste a listing description or enter the details to understand likely costs, potential and questions.", "Check", "/check-listing", "coral"],
  ["Housing Options", "Explore buying, renting, social housing and shared-ownership routes respectfully.", "Explore", "/advice-centre", "yellow"],
  ["Community & Support", "Find official sources and who to ask next.", "Find support", "/glossary", "sage"],
  ["Housing Pulse", "See what people are finding confusing and what HomePath is learning.", "Open", "/housing-pulse", "sky"],
  ["Ask HomePath", "Type a housing question and get a practical starting point with sources.", "Ask", "ask", "brick"],
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
        <p className="eyebrow">HomePath</p>
        <h1>Making your path to housing easier.</h1>
        <p className="hero-copy">Understand your options, learn how housing works and take the next realistic step.</p>
        {profile && <div className="home-personal"><strong>Your HomePath is saved on this device.</strong><span>Based on your target of a {profile.targetHomeType} near {profile.targetArea || "your area"}, your next useful step may be checking real listings or building the deposit further.</span></div>}
        {!confidence && <div className="confidence-card"><label><span>How confident do you currently feel about understanding your housing options?</span><select defaultValue="" onChange={e=>writeStore("homepath-confidence-start",{score:Number(e.target.value),date:new Date().toISOString()})}><option value="" disabled>Optional: choose 1–10</option>{[1,2,3,4,5,6,7,8,9,10].map(x=><option key={x} value={x}>{x} — {x===1?"Not at all confident":x===10?"Very confident":""}</option>)}</select></label><small>This stays on your device.</small></div>}
        <Disclaimer>General guidance only. Not mortgage, legal, financial, surveying or planning advice.</Disclaimer>
      </div>
      <div className="hero-art hub-panel city-board" aria-hidden="true">
        <div className="city-board-map">
          <span className="city-route city-route-a" />
          <span className="city-route city-route-b" />
          <span className="city-station station-start" />
          <span className="city-station station-money" />
          <span className="city-station station-house" />
          <span className="city-block city-block-home"><HouseMark /></span>
          <span className="city-block city-block-flat" />
          <span className="city-block city-block-shop" />
          <span className="city-crane" />
        </div>
        <span>Build your route home</span>
      </div>
    </section>
    <section className="actions" aria-labelledby="choose-action">
      <div className="section-intro"><p className="eyebrow">Choose a door</p><h2 id="choose-action">Find the route that fits today.</h2></div>
      <div className="door-nav">{cards.map(([title,text,button,href,colour]) =>
        <article className={`door-card door-${colour}`} key={href}><button onClick={() => href === "ask" ? window.dispatchEvent(new Event("homepath-open-ask")) : navigate(href)}><span className="door-shape" aria-hidden="true"/><strong>{title}</strong><small>{text}</small><em>{button} →</em></button></article>)}</div>
      <div className="home-quick-links" aria-label="More HomePath tools">
        {quickLinks.map(([label,href]) => <button key={label} onClick={() => href === "ask" ? window.dispatchEvent(new Event("homepath-open-ask")) : navigate(href)}>{label}<span>→</span></button>)}
      </div>
      <p className="research-line">The questions people often ask are not only ‘Can I afford it?’ but also ‘Who do I speak to?’, ‘What happens next?’ and ‘How much cash do I actually need?’</p>
    </section>
  </>;
}
