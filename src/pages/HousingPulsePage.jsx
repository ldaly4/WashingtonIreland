import React from "react";
import { Disclaimer, PageHead } from "../components/Layout";
import { SURVEY_URL } from "../lib/storage";
import { surveyFindings } from "../data/surveyFindings";

export default function HousingPulsePage() {
  const openSurvey = () => {
    if (SURVEY_URL) window.open(SURVEY_URL, "_blank", "noopener,noreferrer");
  };
  return <div className="page pulse-page"><PageHead eyebrow="Housing Pulse" title="How do young people really feel about housing?">HomePath is building a clearer picture of young people’s housing knowledge, confidence and experience. Every response helps us understand where people are getting stuck.</PageHead>
    <section className="pulse-hero"><div><span>{surveyFindings.status} · {surveyFindings.sampleSize} responses so far</span><h2>Share what housing feels like from where you are.</h2><p>{surveyFindings.caveat}</p></div><button onClick={openSurvey} disabled={!SURVEY_URL}>Share your experience</button>{!SURVEY_URL && <small>Survey URL has not been added yet.</small>}</section>
    <section className="pulse-section"><div className="section-heading"><span>%</span><div><h2>Responses so far</h2><p>Last updated: {surveyFindings.lastUpdated}</p></div></div><div className="stat-grid">{surveyFindings.headlineStats.map(([label,percent,count])=><article key={label}><strong>{percent}</strong><h3>{label}</h3><p>{count}</p></article>)}</div></section>
    <section className="pulse-section two-col"><div><h2>Most confusing parts</h2><div className="rank-list">{surveyFindings.confusingParts.map(([label,count])=><p key={label}><span>{count} of 23</span>{label}</p>)}</div></div><div><h2>Most requested features</h2><div className="rank-list">{surveyFindings.requestedFeatures.map(([label,count])=><p key={label}><span>{count} of 23</span>{label}</p>)}</div></div></section>
    <section className="quote-grid">{surveyFindings.quotes.map(q=><blockquote key={q}>“{q}”</blockquote>)}</section>
    <section className="plain-card"><h2>Where people would ask first</h2>{surveyFindings.adviceSources.map(([label,count])=><p key={label}><strong>{count} of 23</strong> — {label}</p>)}</section>
    <section className="themes-grid">{["Housing literacy","Financial literacy","Housing confidence and hopelessness"].map(x=><article key={x}><h3>{x}</h3><p>We want to understand where people feel informed, where they feel blocked, and what would make the next step clearer.</p></article>)}</section>
    <section className="plain-card"><h2>Add your view</h2><p>Participation is optional. Personal form information from HomePath tools is not automatically submitted. Anonymous research data should only be collected with clear consent.</p><button className="primary" disabled={!SURVEY_URL} onClick={openSurvey}>Share your experience <span>↗</span></button></section>
    <section className="plain-card"><h2>Methodology</h2><p>Survey dates, response counts, recruitment method and representativeness will be published when real results are available. A small convenience survey should not be treated as representing all young people. Incomplete responses should be handled transparently and anonymous data should be used only in aggregate.</p></section>
    <Disclaimer>HomePath does not silently send income, savings or listing data to a research database. Survey participation is separate and optional.</Disclaimer>
  </div>
}
