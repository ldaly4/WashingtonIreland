import React from "react";
import { readStore } from "../lib/storage";
import { HouseMark } from "../components/Layout";

const primaryChoices = [
  ["Understand my situation", "See which housing routes may be worth exploring.", "Find my housing path", "/check-position"],
  ["Learn how it works", "Build your housing knowledge through short, practical lessons.", "Start learning", "/learn"],
  ["Check a property", "Understand buying costs, questions and improvement possibilities.", "Check a property", "/check-listing"],
];

const terraceDoors = [
  ["My Position", "/check-position", "blue"],
  ["Learning Centre", "/learn", "green"],
  ["Check a House", "/check-listing", "coral"],
  ["Housing Options", "/advice-centre", "yellow"],
  ["Community & Support", "/glossary", "sage"],
  ["Housing Pulse", "/housing-pulse", "sky"],
  ["Ask HomePath", "ask", "brick"],
];

const pathways = [
  ["Private purchase", "A standard mortgage-and-deposit route."],
  ["Affordable purchase", "Reduced-price homes where schemes are active."],
  ["Cost Rental", "A renting route with rents linked to provision cost."],
  ["Social housing", "Support based on housing need and official assessment."],
  ["Supported renting", "Routes such as HAP or housing-cost support."],
  ["Co-Ownership", "A Northern Ireland shared-ownership route."],
  ["Renovation routes", "Vacant or older homes where the repair budget works."],
];

export default function HomePage({ navigate }) {
  const profile = readStore("homepath-profile");
  const go = href => href === "ask" ? window.dispatchEvent(new Event("homepath-open-ask")) : navigate(href);

  return <div className="home-redesign">
    <section className="home-hero-v2">
      <div className="home-hero-copy">
        <div className="home-full-logo" aria-label="HomePath logo">
          <HouseMark />
          <span><b>Home</b><i>Path</i><small>Making your path to housing easier.</small></span>
        </div>
        <h1>Making your path to housing easier.</h1>
        <p>Understand your options, learn how housing works and find the next realistic step for your situation.</p>
        <div className="home-hero-actions">
          <button className="primary" onClick={() => navigate("/check-position")}>Find my housing path <span>→</span></button>
          <button className="secondary-cta" onClick={() => navigate("/advice-centre")}>Explore housing options</button>
        </div>
        <small className="trust-line">Free guidance for the Republic of Ireland and Northern Ireland.</small>
        {profile && <aside className="home-saved-note"><strong>Your HomePath is saved on this device.</strong><span>Next useful step: compare real listings or keep building your deposit.</span></aside>}
      </div>
      <HomePathIllustration />
    </section>

    <section className="home-primary-choices" aria-labelledby="home-primary-title">
      <div className="home-section-head home-section-head-centred">
        <p className="eyebrow">Start here</p>
        <h2 id="home-primary-title">Choose your next step.</h2>
      </div>
      <div className="intent-panels">
        {primaryChoices.map(([title, text, cta, href], index) => <article key={title} className={`intent-panel intent-${index + 1}`}>
          <span aria-hidden="true">{["Path", "Learn", "Check"][index]}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <button onClick={() => navigate(href)}>{cta} <b>→</b></button>
        </article>)}
      </div>
    </section>

    <section className="terrace-section" aria-labelledby="terrace-title">
      <div className="home-section-head">
        <p className="eyebrow">Choose a door</p>
        <h2 id="terrace-title">Open the door that fits today.</h2>
      </div>
      <div className="terrace-scroll" role="list" aria-label="HomePath destinations">
        <div className="georgian-terrace">
          {terraceDoors.map(([label, href, colour]) => <button role="listitem" key={label} className={`terrace-house terrace-${colour}`} onClick={() => go(href)}>
            <span className="terrace-roof" aria-hidden="true" />
            <span className="terrace-windows" aria-hidden="true"><i/><i/></span>
            <span className="terrace-door" aria-hidden="true" />
            <strong>{label}</strong>
          </button>)}
        </div>
      </div>
    </section>

    <section className="home-pathways" aria-labelledby="pathways-title">
      <div className="home-section-head">
        <p className="eyebrow">Housing pathways</p>
        <h2 id="pathways-title">There is more than one path to a home.</h2>
      </div>
      <div className="pathway-ribbon">
        {pathways.map(([title, text]) => <article key={title}>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>
    </section>

    <section className="home-evidence" aria-labelledby="evidence-title">
      <article>
        <p className="eyebrow">Housing Pulse</p>
        <h2 id="evidence-title">People are not just asking “Can I afford it?”</h2>
        <p>They are also asking who to speak to, what happens next, and how much cash they actually need.</p>
        <button onClick={() => navigate("/housing-pulse")}>Open Housing Pulse <span>→</span></button>
      </article>
      <article>
        <p className="eyebrow">Trusted support</p>
        <h2>Official sources, plain explanations.</h2>
        <p>HomePath points you towards official sources and trusted organisations, without making eligibility promises.</p>
        <div className="evidence-actions">
          <button onClick={() => navigate("/glossary")}>Community & Support</button>
          <button onClick={() => navigate("/advice-centre")}>Housing options</button>
        </div>
      </article>
    </section>
  </div>;
}

function HomePathIllustration() {
  return <figure className="home-illustration" aria-label="A path leading to a colourful house with a rising sun">
    <svg viewBox="0 0 620 440" role="img">
      <title>A winding path, Irish terrace, small colourful house, trees and rising sun</title>
      <rect width="620" height="440" rx="38" fill="#FFF8EA"/>
      <circle cx="440" cy="108" r="58" fill="#F4C445"/>
      <path d="M54 260c96-72 185-80 281-34 75 36 143 28 226-26" fill="none" stroke="#7FA08A" strokeWidth="18" strokeLinecap="round"/>
      <path d="M54 315c116-42 216-31 313 24 62 35 123 47 197 27" fill="none" stroke="#2E5B3A" strokeWidth="5" strokeLinecap="round"/>
      <path d="M92 335c70-24 126-22 180 4 47 22 94 26 156 12 38-8 74-7 111 7" fill="none" stroke="#DCECCF" strokeWidth="36" strokeLinecap="round"/>
      {[
        [106,"#F4C445"],[160,"#7FA08A"],[214,"#FF6B6B"],[268,"#6EC6FF"],
      ].map(([x,colour]) => <g key={x}>
        <rect x={x} y="218" width="45" height="70" fill="#FFE6BF" stroke="#0F2D4D" strokeWidth="3"/>
        <path d={`M${x-6} 221h57`} stroke="#0F2D4D" strokeWidth="8" strokeLinecap="round"/>
        <rect x={x+15} y="248" width="16" height="40" rx="8" fill={colour} stroke="#0F2D4D" strokeWidth="2"/>
        <rect x={x+9} y="231" width="8" height="11" fill="#DDF5FF" stroke="#0F2D4D" strokeWidth="1.5"/>
        <rect x={x+29} y="231" width="8" height="11" fill="#DDF5FF" stroke="#0F2D4D" strokeWidth="1.5"/>
      </g>)}
      <path d="M386 211h126v99H386z" fill="#FFE6BF" stroke="#0F2D4D" strokeWidth="5"/>
      <path d="M365 216l84-62 84 62" fill="none" stroke="#0F2D4D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M431 310v-55c0-17 12-30 28-30s28 13 28 30v55" fill="#FF6B6B" stroke="#0F2D4D" strokeWidth="4"/>
      <circle cx="474" cy="282" r="4" fill="#fffaf0"/>
      <rect x="402" y="236" width="30" height="30" rx="4" fill="#6EC6FF" stroke="#0F2D4D" strokeWidth="4"/>
      <rect x="487" y="236" width="30" height="30" rx="4" fill="#6EC6FF" stroke="#0F2D4D" strokeWidth="4"/>
      <path d="M68 314v-48" stroke="#2E5B3A" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="68" cy="250" r="24" fill="#7FA08A"/>
      <path d="M554 326v-58" stroke="#2E5B3A" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="554" cy="249" r="31" fill="#7FA08A"/>
      <path d="M68 370h492" stroke="#0F2D4D" strokeWidth="4" strokeLinecap="round" opacity=".14"/>
    </svg>
  </figure>;
}
