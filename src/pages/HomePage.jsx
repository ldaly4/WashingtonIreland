import React from "react";
import { Disclaimer, HouseMark } from "../components/Layout";

const cards = [
  ["I want to know what I can afford", "Enter a few details and see a rough buying range, savings gap and supports worth checking.", "Start check", "/check-position"],
  ["I’m looking at a listing", "Paste in a property listing and get clearer costs, risks and questions to ask before viewing.", "Check listing", "/check-listing"],
  ["I want to understand supports", "Read short notes on schemes, grants, loans and housing routes in Ireland and Northern Ireland.", "Open advice", "/advice-centre"],
];

export default function HomePage({ navigate }) {
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">Housing guidance across Ireland</p>
        <h1>Not sure where you stand with housing? <em>Start here.</em></h1>
        <p className="hero-copy">Check what you could roughly afford, what supports may be worth looking at, and what to ask before viewing a home.</p>
        <Disclaimer>General guidance only. Not mortgage, legal, financial, surveying or planning advice.</Disclaimer>
      </div>
      <div className="hero-art hub-panel" aria-hidden="true"><HouseMark /><div className="path-line" /><span>HomePath</span></div>
    </section>
    <section className="actions" aria-labelledby="choose-action">
      <div className="section-intro"><p className="eyebrow">Choose a starting point</p><h2 id="choose-action">What do you need today?</h2></div>
      <div className="action-grid">{cards.map(([title,text,button,href]) =>
        <article className="action-card" key={href}><h3>{title}</h3><p>{text}</p>
          <button onClick={() => navigate(href)}>{button}<span>→</span></button></article>)}</div>
    </section>
  </>;
}
