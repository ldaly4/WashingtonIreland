import React from "react";
import { readStore } from "../lib/storage";

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
        <p className="eyebrow">HOMEPATH</p>
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
      <div className="home-section-head">
        <p className="eyebrow">Start here</p>
        <h2 id="home-primary-title">What do you need today?</h2>
      </div>
      <div className="intent-panels">
        {primaryChoices.map(([title, text, cta, href], index) => <article key={title} className={`intent-panel intent-${index + 1}`}>
          <span aria-hidden="true">{index + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          <button onClick={() => navigate(href)}>{cta} <b>→</b></button>
        </article>)}
      </div>
    </section>

    <section className="terrace-section" aria-labelledby="terrace-title">
      <div className="home-section-head">
        <p className="eyebrow">Choose a door</p>
        <h2 id="terrace-title">Every route has a place to start.</h2>
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
        {pathways.map(([title, text], index) => <article key={title}>
          <span aria-hidden="true">{["⌂","◒","▤","♢","◌","◧","✦"][index]}</span>
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
    <svg viewBox="0 0 560 420" role="img">
      <title>A winding path, small colourful house, trees and rising sun</title>
      <rect width="560" height="420" rx="34" fill="#fffaf0"/>
      <circle cx="390" cy="94" r="54" fill="#F4C445"/>
      <path d="M42 244c90-70 172-78 258-35 70 35 133 28 207-22" fill="none" stroke="#7FA08A" strokeWidth="20" strokeLinecap="round"/>
      <path d="M40 292c108-42 205-32 294 23 56 34 113 47 182 28" fill="none" stroke="#2E5B3A" strokeWidth="5" strokeLinecap="round"/>
      <path d="M255 312c-54 16-96 43-126 82h247c-63-22-104-49-121-82Z" fill="#DCECCF"/>
      <path d="M306 185h124v104H306z" fill="#FFE6BF" stroke="#0F2D4D" strokeWidth="5"/>
      <path d="M286 191l82-62 82 62" fill="none" stroke="#0F2D4D" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M350 289v-55c0-17 12-30 28-30s28 13 28 30v55" fill="#FF6B6B" stroke="#0F2D4D" strokeWidth="4"/>
      <circle cx="393" cy="262" r="4" fill="#fffaf0"/>
      <rect x="322" y="211" width="32" height="31" rx="4" fill="#6EC6FF" stroke="#0F2D4D" strokeWidth="4"/>
      <rect x="407" y="211" width="32" height="31" rx="4" fill="#6EC6FF" stroke="#0F2D4D" strokeWidth="4"/>
      <path d="M93 295v-52" stroke="#2E5B3A" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="93" cy="225" r="28" fill="#7FA08A"/>
      <path d="M476 313v-58" stroke="#2E5B3A" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="476" cy="236" r="34" fill="#7FA08A"/>
      <path d="M70 334h434" stroke="#0F2D4D" strokeWidth="4" strokeLinecap="round" opacity=".16"/>
    </svg>
  </figure>;
}
