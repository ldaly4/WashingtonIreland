import React from "react";
import { Disclaimer, PageHead } from "../components/Layout";

export default function PrivacyPage() {
  const reset = () => {
    ["homepath-profile","homepath-completed-modules","homepath-research-invite","homepath-confidence-start","homepath-buying-jurisdiction"].forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem("homepath-position");
    window.location.reload();
  };
  return <div className="page compact-page"><PageHead eyebrow="Privacy" title="How HomePath handles information">HomePath is designed so the main tools can run locally in your browser. Research participation is optional.</PageHead>
    <section className="plain-card"><h2>What stays on your device</h2><p>Position checks, savings plans, learning progress and confidence check-ins can be saved in localStorage on your device. They are not automatically submitted to a database.</p></section>
    <section className="plain-card"><h2>Research and surveys</h2><p>Anonymous research data should only be collected with clear consent. You can use the main tools without completing the survey.</p></section>
    <section className="plain-card"><h2>AI listing analysis</h2><p>HomePath must never put an OpenAI API key in the React app or GitHub Pages. If AI listing analysis is connected later, the listing content should go through a secure server-side endpoint. Do not include names, addresses or contact information unless genuinely necessary.</p></section>
    <section className="plain-card"><h2>Clear stored HomePath progress</h2><p>This removes saved results, learning progress and optional confidence answers from this browser only.</p><button className="primary" onClick={reset}>Clear local progress <span>×</span></button></section>
    <Disclaimer>HomePath provides general guidance only. It does not replace advice from a lender, mortgage adviser, solicitor, surveyor, tax authority or official scheme provider.</Disclaimer>
  </div>
}
