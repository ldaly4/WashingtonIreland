import React, { useState } from "react";
import { PageHead } from "../components/Layout";
import { askHomePath } from "../services/askHomePath";

const starters = [
  "Where should I start?",
  "Could social housing be relevant to me?",
  "What is the difference between social housing and HAP?",
  "What is Cost Rental?",
  "Can I speak to a broker before finding a house?",
  "What does a mortgage broker do?",
  "What should I check before relying on a support scheme?",
  "What is the difference between a survey and a valuation?",
  "Explain my HomePath results.",
  "What should I do next?",
  "What should I ask at a viewing?",
];

export default function AskHomePathPage({ navigate }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async event => {
    event?.preventDefault();
    const q = question.trim();
    if (!q) {
      setError("Type a question or choose one below.");
      return;
    }
    setLoading(true);
    setError("");
    const nextMessages = [...messages, { role: "user", content: q }];
    setMessages(nextMessages);
    setQuestion("");
    try {
      const result = await askHomePath(q, { route: "/ask", jurisdiction: "unclear" }, messages);
      setMessages([...nextMessages, { role: "assistant", content: result.answer, structured: result }]);
    } catch {
      setMessages([...nextMessages, {
        role: "assistant",
        content: "HomePath’s live explanation service is temporarily unavailable. You can still use the guides, Check My Position and Check a House while it is restored.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return <div className="page compact-page ask-page">
    <PageHead eyebrow="Ask HomePath" title="Ask a housing question">Plain-English guidance about buying, renting, supports, mortgage steps and checking a home. This is general information, not advice or an eligibility decision.</PageHead>
    <section className="ask-page-panel">
      <div className="ask-page-intro">
        <h2>What can I help with?</h2>
        <p>Ask one focused question at a time. Do not include bank details, account numbers, PPS numbers, National Insurance numbers or anything you would not want shared with an external AI service.</p>
        <div className="ask-suggestions">{starters.map(item => <button key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
      </div>
      <div className="ask-thread" aria-live="polite">
        {messages.length === 0 && <p className="empty-thread">Your answers will appear here.</p>}
        {messages.map((message, index) => <article key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
          <p>{message.content}</p>
          {message.structured?.officialSources?.length > 0 && <div className="source-list">{message.structured.officialSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div>}
          {message.structured?.suggestedActions?.length > 0 && <div className="source-list">{message.structured.suggestedActions.map(action => <button key={action.label} onClick={() => navigate(action.route)}>{action.label}</button>)}</div>}
          {message.structured?.disclaimer && <small>{message.structured.disclaimer}</small>}
        </article>)}
        {loading && <p role="status">Asking HomePath…</p>}
      </div>
      <form onSubmit={submit} className="ask-page-form">
        <label className="ask-input"><span>Your question</span><textarea rows="4" value={question} onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder="For example: Is Co-Ownership the same as a mortgage?" /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary" type="submit" disabled={loading}>{loading ? "Asking…" : "Ask HomePath"} <span>→</span></button>
      </form>
    </section>
  </div>;
}
