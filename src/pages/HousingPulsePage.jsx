import React from "react";
import { Disclaimer, PageHead } from "../components/Layout";
import { SURVEY_URL } from "../lib/storage";

const stats = [
  "Percentage who feel buying is unrealistic",
  "Average housing confidence score",
  "Percentage who do not know where to begin",
  "Awareness of mortgage brokers",
  "Awareness of public schemes",
  "Most common barriers",
  "Republic of Ireland versus Northern Ireland comparisons",
  "Desired policy changes",
];

export default function HousingPulsePage() {
  const openSurvey = () => {
    if (SURVEY_URL) window.open(SURVEY_URL, "_blank", "noopener,noreferrer");
  };
  return <div className="page pulse-page"><PageHead eyebrow="Housing Pulse" title="How do young people really feel about housing?">HomePath is building a clearer picture of young people’s housing knowledge, confidence and experience. Every response helps us understand where people are getting stuck.</PageHead>
    <section className="pulse-hero"><div><span>Survey currently open</span><h2>Share what housing feels like from where you are.</h2><p>Survey responses will be analysed in aggregate. You can use HomePath without taking part.</p></div><button onClick={openSurvey} disabled={!SURVEY_URL}>Share your experience</button>{!SURVEY_URL && <small>Survey link placeholder: SURVEY_URL has not been set yet.</small>}</section>
    <section className="pulse-section"><div className="section-heading"><span>—</span><div><h2>Current findings</h2><p>Responses are being collected. No live statistics have been published yet.</p></div></div><div className="stat-grid">{stats.map(x=><article key={x}><div className="skeleton-bar"/><h3>{x}</h3><p>Awaiting verified survey data.</p></article>)}</div></section>
    <section className="themes-grid">{["Housing literacy","Financial literacy","Housing confidence and hopelessness"].map(x=><article key={x}><h3>{x}</h3><p>We want to understand where people feel informed, where they feel blocked, and what would make the next step clearer.</p></article>)}</section>
    <section className="plain-card"><h2>Add your view</h2><p>Participation is optional. Personal form information from HomePath tools is not automatically submitted. Anonymous research data should only be collected with clear consent.</p><button className="primary" disabled={!SURVEY_URL} onClick={openSurvey}>Share your experience <span>↗</span></button></section>
    <section className="plain-card"><h2>Methodology</h2><p>Survey dates, response counts, recruitment method and representativeness will be published when real results are available. A small convenience survey should not be treated as representing all young people. Incomplete responses should be handled transparently and anonymous data should be used only in aggregate.</p></section>
    <Disclaimer>HomePath does not silently send income, savings or listing data to a research database. Survey participation is separate and optional.</Disclaimer>
  </div>
}
