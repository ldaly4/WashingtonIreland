import React, { useMemo, useState } from "react";
import { PageHead } from "../components/Layout";
import { glossaryTerms } from "../data/glossary";

export default function GlossaryPage({ navigate }) {
  const [query,setQuery]=useState("");
  const terms = useMemo(() => glossaryTerms.filter(([term,definition]) => `${term} ${definition}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="page glossary-page"><PageHead eyebrow="Glossary" title="Plain-English housing words">Short definitions for terms people often hear without anyone explaining them.</PageHead>
    <label className="field glossary-search"><span>Search the glossary</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. conveyancing, survey, booking deposit" /></label>
    <section className="glossary-grid">{terms.map(([term,definition,tag]) => <article key={term}><h2>{term}</h2><p>{definition}</p><button onClick={()=>navigate(tag === "costs" ? "/savings-plan" : tag === "survey" ? "/check-listing" : "/buying-guide")}>Open related lesson</button></article>)}</section>
  </div>
}
