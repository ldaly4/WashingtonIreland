import React from "react";
import { Disclaimer, HouseMark } from "../components/Layout";

const cards = [
  ["01", "Check your position", "Enter a few details and see what buying range, supports and savings gap may apply to you.", "Start check", "/check-position"],
  ["02", "Check a listing", "Paste in a property listing and get a clearer view of costs, risks and questions to ask.", "Check listing", "/check-listing"],
  ["03", "Advice centre", "Read plain-English notes on schemes, grants, loans and housing supports.", "Open advice centre", "/advice-centre"],
];

export default function HomePage({ navigate }) {
  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">Housing guidance across Ireland</p>
        <h1>Find out what housing options may be <em>open to you.</em></h1>
        <p className="hero-copy">HomePath helps you check your position, understand property listings and read up on housing supports in the Republic of Ireland and Northern Ireland.</p>
        <Disclaimer>General guidance only. Not mortgage, legal, financial, surveying or planning advice.</Disclaimer>
      </div>
      <div className="hero-art" aria-hidden="true"><HouseMark /><div className="path-line" /><span>Start here</span></div>
    </section>
    <section className="actions" aria-labelledby="choose-action">
      <div className="section-intro"><p className="eyebrow">Choose a starting point</p><h2 id="choose-action">What would you like to check?</h2></div>
      <div className="action-grid">{cards.map(([num,title,text,button,href]) =>
        <article className="action-card" key={href}><span className="card-number">{num}</span><h3>{title}</h3><p>{text}</p>
          <button onClick={() => navigate(href)}>{button}<span>→</span></button></article>)}</div>
    </section>
    <section className="why"><p className="eyebrow">Why HomePath exists</p><h2>A clearer place to begin.</h2><p>Housing advice should not depend on knowing a broker, solicitor or someone who has already bought. HomePath gives young people a clearer starting point, whether they are close to buying, need support, or simply want to understand what options exist.</p></section>
  </>;
}
