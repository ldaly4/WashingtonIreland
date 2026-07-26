import React from "react";
import { Disclaimer, PageHead } from "../components/Layout";

export default function PrivacyPage() {
  const reset = () => {
    ["homepath-profile","homepath-completed-modules","homepath-research-invite","homepath-confidence-start","homepath-buying-jurisdiction","homepath-towers-progress","homepath-open-lesson"].forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem("homepath-position");
    window.location.reload();
  };
  return <div className="page compact-page"><PageHead eyebrow="Privacy" title="How HomePath handles information">HomePath is designed so the main tools can run locally in your browser. Research participation is optional.</PageHead>
    <section className="plain-card"><h2>1. Information stored only on your device</h2><p>Check My Position answers, saved HomePath results, savings-plan inputs, confidence check-ins and learning progress can be stored in this browser using localStorage or sessionStorage. They are not automatically sent to a research database.</p></section>
    <section className="plain-card"><h2>2. Information sent to the Cloudflare Worker</h2><p>If you use Ask HomePath, Explain my result or AI-assisted listing analysis, the question or pasted listing description is sent to HomePath’s Cloudflare Worker. The Worker is used so API keys stay off the public website.</p></section>
    <section className="plain-card"><h2>3. Information sent to OpenAI</h2><p>Chatbot questions and pasted listing descriptions may be processed by OpenAI through the Cloudflare Worker. HomePath strips obvious contact details before forwarding where possible, but you should not include account numbers, PPS numbers, National Insurance numbers, bank details, exact addresses or other sensitive personal information.</p></section>
    <section className="plain-card"><h2>4. Optional survey responses</h2><p>Formal survey participation is separate from the app. Calculator details, chatbot content and listing descriptions are not automatically merged into research.</p></section>
    <section className="plain-card"><h2>5. Optional contact details</h2><p>HomePath does not need your name, email or phone number to use the tools. If a future survey or contact form asks for contact details, it should show a separate consent notice before you submit.</p></section>
    <section className="plain-card"><h2>Pasted listing descriptions</h2><p>Check a House can analyse pasted estate-agent wording or manual details. It cannot inspect a property from a link. Avoid including seller names, tenant names, exact addresses or private contact details.</p></section>
    <section className="plain-card"><h2>Clear stored HomePath progress</h2><p>This removes saved results, learning progress and optional confidence answers from this browser only.</p><button className="primary" onClick={reset}>Clear local progress <span>×</span></button></section>
    <Disclaimer>HomePath provides general guidance only. It does not replace advice from a lender, mortgage adviser, solicitor, surveyor, tax authority or official scheme provider.</Disclaimer>
  </div>
}
