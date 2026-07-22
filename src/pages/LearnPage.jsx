import React, { useState } from "react";
import { Disclaimer } from "../components/Layout";
import { readStore, writeStore } from "../lib/storage";

const STORAGE_KEY = "homepath-towers-progress";

const categories = [
  { id: "foundations", label: "Foundations", name: "Money and savings", stage: "foundation" },
  { id: "ground-floor", label: "Ground floor", name: "Mortgages", stage: "groundFloor" },
  { id: "first-floor", label: "First floor", name: "Finding and viewing a home", stage: "firstFloor" },
  { id: "second-floor", label: "Second floor", name: "Surveys and older homes", stage: "secondFloor" },
  { id: "roof", label: "Roof", name: "Solicitors, contracts and closing", stage: "roof" },
  { id: "front-door", label: "Front door", name: "Public supports and next steps", stage: "door" },
];

const sourceLinks = {
  ccpc: { label: "CCPC mortgage and money guidance", url: "https://www.ccpc.ie/consumers/money/mortgages/" },
  citizens: { label: "Citizens Information buying a home guidance", url: "https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/" },
  scsi: { label: "SCSI surveyor guidance", url: "https://scsi.ie/" },
  nidirect: { label: "nidirect buying and owning a home", url: "https://www.nidirect.gov.uk/information-and-services/buying-selling-and-renting-home" },
};

const lessonModules = [
  {
    id: "cash-needed",
    title: "How much cash do I actually need?",
    category: "foundations",
    jurisdiction: "both",
    estimatedMinutes: 5,
    buildingReward: "Foundation slab added",
    rewardStage: "foundation",
    relatedRoutes: [{ label: "Try this in Savings plan", route: "/savings-plan" }],
    officialSources: [sourceLinks.ccpc, sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have found a home listed at €300,000. You have saved €30,000. Is that enough cash to complete the purchase?" },
      { type: "teach", title: "One clear idea", text: "The deposit is only one part of the cash required. You may also need stamp duty, solicitor fees, survey, valuation, insurance, moving costs and an emergency buffer." },
      {
        type: "mcq",
        prompt: "What is the safest answer?",
        options: [
          "Yes, because it covers a 10% deposit",
          "Possibly, but additional buying costs still need to be included",
          "No, because every buyer needs a 20% deposit",
        ],
        answer: "Possibly, but additional buying costs still need to be included",
        feedback: "Good — the key distinction is that a deposit and total cash needed are not the same thing.",
        misconception: "Not quite — this is a common point of confusion. A 10% deposit may be only one part of the money needed to complete.",
      },
      {
        type: "sort",
        prompt: "Place each item where it belongs.",
        groups: ["Deposit", "Additional buying cost", "Ongoing monthly cost"],
        items: [
          ["10% buyer deposit", "Deposit"],
          ["Stamp duty", "Additional buying cost"],
          ["Solicitor fees", "Additional buying cost"],
          ["Survey", "Additional buying cost"],
          ["Home insurance", "Ongoing monthly cost"],
          ["Mortgage repayment", "Ongoing monthly cost"],
        ],
        feedback: "Exactly. Keeping these separate makes the savings target clearer.",
      },
      { type: "summary", takeaway: "The deposit is only one part of the cash required.", reward: "Foundation added" },
    ],
  },
  {
    id: "broker",
    title: "What does a mortgage broker do?",
    category: "ground-floor",
    jurisdiction: "both",
    estimatedMinutes: 4,
    buildingReward: "First ground-floor wall added",
    rewardStage: "groundFloor",
    relatedRoutes: [{ label: "Check my position", route: "/check-position" }],
    officialSources: [sourceLinks.ccpc],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have not found a property yet. Is it too early to contact a mortgage broker or adviser?" },
      { type: "teach", title: "What they may help with", text: "A broker or adviser may help estimate borrowing, compare providers, explain documents and assist with an application. Ask how they are paid and whether they charge a fee." },
      {
        type: "mcq",
        prompt: "Is it too early to contact one?",
        options: ["Yes", "No", "Only if you already have the full deposit"],
        answer: "No",
        feedback: "That’s right. It can be useful before viewing homes, because it gives you a rough starting point.",
        misconception: "Not quite — you can speak to a broker or adviser before you have chosen a specific home.",
      },
      {
        type: "contact",
        prompt: "Who is the most useful first contact here?",
        options: [
          ["Mortgage broker or adviser", "Understand rough borrowing and documents"],
          ["Surveyor", "Check the condition of a specific home"],
          ["Solicitor", "Handle legal checks after you are further into a purchase"],
        ],
        answer: "Mortgage broker or adviser",
        feedback: "Exactly. The broker or adviser helps with borrowing and application questions.",
      },
      { type: "summary", takeaway: "A broker or adviser can be useful before you have found a property.", reward: "Ground-floor wall added" },
    ],
  },
  {
    id: "booking-deposit",
    title: "Booking deposit versus full buyer deposit",
    category: "foundations",
    jurisdiction: "roi",
    estimatedMinutes: 5,
    buildingReward: "Front doorway added",
    rewardStage: "door",
    relatedRoutes: [{ label: "Open buying guide", route: "/buying-guide" }],
    officialSources: [sourceLinks.citizens],
    screens: [
      { type: "scenario", title: "Scenario", text: "A €350,000 home needs a €35,000 buyer deposit. The estate agent asks for a €7,000 booking deposit after your offer is accepted." },
      { type: "teach", title: "The distinction", text: "A booking deposit is usually paid earlier and normally forms part of the full buyer deposit. The remaining deposit is paid later through the legal process." },
      {
        type: "matching",
        prompt: "Match each amount to the correct meaning.",
        pairs: [
          ["€35,000", "Total buyer deposit"],
          ["€7,000", "Booking deposit"],
          ["€28,000", "Remaining deposit"],
        ],
        feedback: "Good. The booking deposit is not an extra deposit on top of the full buyer deposit.",
      },
      {
        type: "ordering",
        prompt: "Put these payment stages in a sensible order.",
        items: ["Offer accepted", "Booking deposit paid", "Legal checks continue", "Remaining deposit paid before closing"],
        feedback: "That’s right. Always confirm timing and refund rules before paying.",
      },
      { type: "summary", takeaway: "The booking deposit and full buyer deposit are different stages of the same overall cash picture.", reward: "Front doorway added" },
    ],
  },
  {
    id: "survey-valuation",
    title: "Survey versus lender valuation",
    category: "second-floor",
    jurisdiction: "both",
    estimatedMinutes: 4,
    buildingReward: "Windows added",
    rewardStage: "windows",
    relatedRoutes: [{ label: "Check a house", route: "/check-listing" }],
    officialSources: [sourceLinks.scsi, sourceLinks.nidirect],
    screens: [
      { type: "scenario", title: "Scenario", text: "The estate agent says the lender valuation found no issue. Does that replace your own survey?" },
      { type: "teach", title: "One clear distinction", text: "A lender valuation is mainly for the lender. An independent survey is for you and can look more closely at the condition and risks of the property." },
      {
        type: "truefalse",
        prompt: "A lender valuation is a replacement for an independent condition survey.",
        answer: false,
        feedback: "Exactly. They serve different purposes.",
        misconception: "Not quite — this is a common point of confusion. The lender valuation is not mainly designed to protect you from condition risks.",
      },
      {
        type: "sort",
        prompt: "Sort the statements.",
        groups: ["Independent survey", "Lender valuation"],
        items: [
          ["Primarily helps the buyer understand condition", "Independent survey"],
          ["Primarily helps the lender assess security", "Lender valuation"],
          ["May flag defects and repair concerns", "Independent survey"],
          ["May be brief and limited", "Lender valuation"],
        ],
        feedback: "Good — that is the practical difference to remember before relying on either.",
      },
      { type: "summary", takeaway: "A valuation is mainly for the lender. A survey is for your protection.", reward: "Windows added" },
    ],
  },
  {
    id: "older-house",
    title: "Should I be afraid of an older house?",
    category: "second-floor",
    jurisdiction: "both",
    estimatedMinutes: 6,
    buildingReward: "Roof outline added",
    rewardStage: "roof",
    relatedRoutes: [{ label: "Use the listing checker", route: "/check-listing" }],
    officialSources: [sourceLinks.scsi, sourceLinks.nidirect],
    screens: [
      { type: "scenario", title: "Scenario", text: "You have seen an older home in a good location. It has space and character, but you are worried about hidden costs." },
      { type: "teach", title: "A balanced view", text: "An older house is not automatically a bad purchase. It may offer location, space or value, but its condition should be properly investigated before you commit." },
      {
        type: "house",
        prompt: "Select areas you would want checked before relying on the listing.",
        areas: [
          ["roof", "Roof", "Look for missing slates, leaks or sagging. A surveyor or roofer may need to inspect it."],
          ["chimney", "Chimney", "Check visible cracks, leaning or damp staining. A surveyor can advise if specialist checks are needed."],
          ["windows", "Windows", "Look at age, seals, ventilation and signs of condensation. This is often routine but can affect comfort and cost."],
          ["walls", "Walls", "Cracks, bulges or damp should be checked carefully. Ask a surveyor about cause and significance."],
          ["fuse", "Fuse board", "Old wiring may need inspection by an electrician. Do not diagnose from photos."],
          ["heating", "Heating", "Ask age, service history and fuel type. Replacement can be a meaningful cost."],
          ["plumbing", "Plumbing", "Ask about leaks, water pressure and drainage. A plumber may be needed if issues appear."],
        ],
        answer: ["roof", "chimney", "windows", "walls", "fuse", "heating", "plumbing"],
        feedback: "Good. Older homes can be very workable, but the right checks matter.",
      },
      {
        type: "decision",
        prompt: "The survey mentions possible structural movement. What should you do next?",
        options: [
          "Ignore it because old houses always have movement",
          "Ask the surveyor what further specialist advice may be needed",
          "Assume the house is impossible to buy",
        ],
        answer: "Ask the surveyor what further specialist advice may be needed",
        feedback: "Exactly. The next step is professional clarification, not panic or guesswork.",
        misconception: "Not quite — avoid both dismissing it and diagnosing it yourself.",
      },
      { type: "summary", takeaway: "Age alone is not the problem. Unchecked condition risk is the thing to manage.", reward: "Roof outline added" },
    ],
  },
];

const roadmapTopics = [
  ["foundations", ["How much cash do I actually need?", "Deposit versus buying costs", "Booking deposit versus full buyer deposit", "Why lenders examine bank statements", "Rent, savings and repayment capacity", "Building an emergency buffer", "How interest affects repayments", "Creating a realistic savings plan"]],
  ["ground-floor", ["What does a mortgage broker or adviser do?", "Approval or agreement in principle", "Loan-to-income", "Loan-to-value", "Fixed and variable rates", "Mortgage term and monthly repayment", "Formal mortgage approval", "Mortgage protection and home insurance"]],
  ["first-floor", ["What does the estate agent do?", "Reading a property listing", "Asking-price versus sale price", "Questions to ask at a viewing", "Making an offer", "What sale agreed means", "Comparing location, size and condition", "Apartment management fees and sinking funds"]],
  ["second-floor", ["Survey versus lender valuation", "Should I be afraid of an older house?", "Roof problems", "Damp and ventilation", "Dry rot and wet rot", "Wiring and fuse boards", "Plumbing and drainage", "Heating systems", "Windows and insulation", "Extensions and planning", "Structural movement", "Renovation budgets and contingencies"]],
  ["roof", ["What does a solicitor or conveyancer do?", "What is conveyancing?", "Title and ownership", "Boundaries and rights of way", "Planning permission", "Contracts and legal commitment", "Common conveyancing delays", "Drawdown or release of mortgage funds", "Closing or completion", "Receiving the keys"]],
  ["front-door", ["Help to Buy", "First Home Scheme", "Local Authority Home Loan", "Affordable Purchase", "Cost Rental", "Co-Ownership", "Housing Executive pathways", "Housing associations", "Rental and social housing supports"]],
];

const emptyProgress = {
  completedModuleIds: [],
  correctAnswers: {},
  retryCount: {},
  lastModule: "",
  categoryProgress: {},
  buildingStage: 0,
  jurisdiction: "roi",
};

function getProgress() {
  const current = readStore(STORAGE_KEY, emptyProgress);
  const legacy = readStore("homepath-completed-modules", []);
  const completedModuleIds = Array.from(new Set([...(current.completedModuleIds || []), ...legacy.filter(id => lessonModules.some(m => m.id === id))]));
  return { ...emptyProgress, ...current, completedModuleIds, buildingStage: buildingStage(completedModuleIds.length) };
}

function saveProgress(next) {
  const completedModuleIds = next.completedModuleIds || [];
  const categoryProgress = categories.reduce((acc, cat) => {
    const total = lessonModules.filter(m => m.category === cat.id).length || 1;
    const done = lessonModules.filter(m => m.category === cat.id && completedModuleIds.includes(m.id)).length;
    acc[cat.id] = { done, total };
    return acc;
  }, {});
  const full = { ...next, completedModuleIds, categoryProgress, buildingStage: buildingStage(completedModuleIds.length) };
  writeStore(STORAGE_KEY, full);
  writeStore("homepath-completed-modules", completedModuleIds);
  return full;
}

function buildingStage(count) {
  if (count >= 21) return 7;
  if (count >= 17) return 6;
  if (count >= 13) return 5;
  if (count >= 9) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

export default function LearnPage({ navigate }) {
  const [progress, setProgress] = useState(getProgress);
  const [activeModuleId, setActiveModuleId] = useState("");
  const [jurisdiction, setJurisdiction] = useState(progress.jurisdiction || "roi");
  const activeModule = lessonModules.find(m => m.id === activeModuleId);
  const completed = progress.completedModuleIds;
  const nextModule = lessonModules.find(m => !completed.includes(m.id) && (m.jurisdiction === "both" || m.jurisdiction === jurisdiction)) || lessonModules[0];
  const completionPercent = Math.round((completed.length / lessonModules.length) * 100);
  const level = completed.length >= 5 ? "House frame started" : completed.length >= 2 ? "Foundations forming" : completed.length ? "Plot prepared" : "Empty plot";
  const profile = readStore("homepath-profile");

  const updateProgress = next => setProgress(saveProgress(next));
  const reset = () => updateProgress({ ...emptyProgress, jurisdiction });
  const startModule = id => {
    updateProgress({ ...progress, lastModule: id, jurisdiction });
    setActiveModuleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeModule) {
    return <LessonShell
      module={activeModule}
      progress={progress}
      navigate={navigate}
      completeModule={(module, answers, retryCount) => {
        const completedModuleIds = Array.from(new Set([...progress.completedModuleIds, module.id]));
        updateProgress({
          ...progress,
          completedModuleIds,
          correctAnswers: { ...progress.correctAnswers, ...answers },
          retryCount: { ...progress.retryCount, ...retryCount },
          lastModule: module.id,
          jurisdiction,
        });
      }}
      close={() => setActiveModuleId("")}
    />;
  }

  return <div className="page learn-page towers-page">
    <section className="towers-hero">
      <div>
        <p className="eyebrow">HomePath Towers</p>
        <h1>Build your housing knowledge</h1>
        <p>Complete short, practical lessons and build your HomePath one step at a time.</p>
        {profile && <p className="towers-personal">Using your saved HomePath: {profile.targetHomeType || "a home"} near {profile.targetArea || "your area"}. You can still use every lesson without personal details.</p>}
        <div className="segmented-toggle" role="group" aria-label="Jurisdiction">
          <button className={jurisdiction === "roi" ? "active" : ""} onClick={() => { setJurisdiction("roi"); updateProgress({ ...progress, jurisdiction: "roi" }); }}>Republic of Ireland</button>
          <button className={jurisdiction === "ni" ? "active" : ""} onClick={() => { setJurisdiction("ni"); updateProgress({ ...progress, jurisdiction: "ni" }); }}>Northern Ireland</button>
        </div>
        <button className="primary towers-continue" onClick={() => startModule(nextModule.id)}>Continue building <span>→</span></button>
      </div>
      <TowerProgress completed={completed} activeCategory={nextModule.category} />
    </section>

    <section className="tower-stats" aria-label="Learning progress">
      <article><strong>{completed.length}/{lessonModules.length}</strong><span>interactive pilot lessons completed</span></article>
      <article><strong>{completionPercent}%</strong><span>pilot lesson progress</span></article>
      <article><strong>{level}</strong><span>current level</span></article>
      <article><strong>{nextModule.title}</strong><span>next recommended lesson · {nextModule.estimatedMinutes} min</span></article>
    </section>

    <section className="tower-overview">
      <div className="progress-track labelled" aria-label={`Pilot lesson progress ${completionPercent}%`}><span style={{ width: `${completionPercent}%` }} /><small>{completionPercent}% of the five interactive pilot lessons completed. The roadmap below shows the wider topics planned for HomePath Towers.</small></div>
      <button className="text-button" onClick={reset}>Reset local learning progress</button>
    </section>

    <section className="tower-sections" aria-label="HomePath Towers learning categories">
      {categories.map(cat => {
        const playable = lessonModules.filter(m => m.category === cat.id && (m.jurisdiction === "both" || m.jurisdiction === jurisdiction));
        const done = playable.filter(m => completed.includes(m.id)).length;
        const topics = roadmapTopics.find(([id]) => id === cat.id)?.[1] || [];
        return <article className="tower-section-card" key={cat.id}>
          <div>
            <span>{cat.label}</span>
            <h2>{cat.name}</h2>
            <p>{done}/{Math.max(1, playable.length)} interactive pilot lessons complete</p>
          </div>
          <div className="tower-module-list">
            {playable.map(m => <button key={m.id} onClick={() => startModule(m.id)} className={completed.includes(m.id) ? "done" : ""}>
              <strong>{m.title}</strong><small>{completed.includes(m.id) ? "Complete" : `${m.estimatedMinutes} min · Start`}</small>
            </button>)}
            {topics.filter(t => !playable.some(m => m.title === t)).slice(0, 5).map(topic => <p className="planned-topic" key={topic}>{topic}<small>Roadmap topic</small></p>)}
          </div>
        </article>;
      })}
    </section>

    <Disclaimer>Lessons are general guidance only. Supports may be relevant depending on current criteria. Always verify important decisions with a lender, broker, solicitor, surveyor, tax authority or official scheme provider.</Disclaimer>
  </div>;
}

function LessonShell({ module, progress, completeModule, close, navigate }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState({});
  const [retryCount, setRetryCount] = useState(progress.retryCount || {});
  const [done, setDone] = useState(progress.completedModuleIds.includes(module.id));
  const screen = module.screens[index];
  const screenKey = `${module.id}-${index}`;
  const isLast = index === module.screens.length - 1;
  const questionTypes = ["mcq", "truefalse", "ordering", "matching", "sort", "cost", "house", "contact", "decision", "listing"];
  const isQuestion = questionTypes.includes(screen.type);
  const canContinue = !isQuestion || Boolean(answers[screenKey]) || Boolean(skipped[screenKey]);
  const progressPercent = Math.round(((index + 1) / module.screens.length) * 100);

  const record = (key, value, correct) => {
    setAnswers(current => ({ ...current, [key]: { value, correct } }));
    if (!correct) setRetryCount(current => ({ ...current, [key]: (current[key] || 0) + 1 }));
  };
  const finish = () => {
    completeModule(module, answers, retryCount);
    setDone(true);
  };

  return <div className="page lesson-page">
    <button className="text-button" onClick={close}>← Return to Learning Centre</button>
    <LessonProgress title={module.title} current={index + 1} total={module.screens.length} percent={progressPercent} />
    <section className="lesson-grid">
      <article className="lesson-card">
        {screen.type === "scenario" && <ScenarioCard screen={screen} />}
        {screen.type === "teach" && <TeachingCard screen={screen} />}
        {screen.type === "mcq" && <MultipleChoiceQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "truefalse" && <TrueFalseQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "ordering" && <OrderingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "matching" && <MatchingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "sort" && <SortingQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "cost" && <CostBuilderQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "house" && <HouseInspectionQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "contact" && <ChooseContactQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "decision" && <ScenarioDecisionQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "listing" && <ListingLanguageQuestion screen={screen} id={screenKey} onAnswer={record} />}
        {screen.type === "summary" && <LessonSummary module={module} screen={screen} navigate={navigate} />}
        <div className="lesson-actions">
          <button className="guide-inline-button" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>Back</button>
          {isQuestion && !canContinue && <button className="guide-inline-button" onClick={() => setSkipped(current => ({ ...current, [screenKey]: true }))}>Skip for now</button>}
          {!isLast && <button className="primary" disabled={!canContinue} onClick={() => setIndex(index + 1)}>{canContinue ? "Next" : "Answer to continue"} <span>→</span></button>}
          {isLast && <button className="primary" onClick={finish} disabled={done}>{done ? "Lesson saved" : "Complete lesson"} <span>✓</span></button>}
        </div>
      </article>
      <aside className="lesson-side">
        <TowerProgress completed={done ? Array.from(new Set([...progress.completedModuleIds, module.id])) : progress.completedModuleIds} activeCategory={module.category} />
        {done && <BuildingReward module={module} close={close} navigate={navigate} />}
      </aside>
    </section>
  </div>;
}

function LessonProgress({ title, current, total, percent }) {
  return <header className="lesson-head">
    <p className="eyebrow">HomePath Towers lesson</p>
    <h1>{title}</h1>
    <div className="progress-track labelled" aria-label={`Lesson progress ${percent}%`}><span style={{ width: `${percent}%` }} /><small>Screen {current} of {total}</small></div>
  </header>;
}

function ScenarioCard({ screen }) {
  return <div className="scenario-card lesson-screen"><p className="eyebrow">{screen.title}</p><p>{screen.text}</p></div>;
}

function TeachingCard({ screen }) {
  return <div className="teaching-card lesson-screen"><p className="eyebrow">{screen.title}</p><p>{screen.text}</p></div>;
}

function FeedbackPanel({ result }) {
  if (!result) return null;
  return <div className={result.correct ? "feedback-panel correct" : "feedback-panel"} role="status">
    <strong>{result.correct ? "Exactly." : "Not quite — this is a common point of confusion."}</strong>
    <p>{result.message}</p>
  </div>;
}

function MultipleChoiceQuestion({ screen, id, onAnswer }) {
  const [result, setResult] = useState(null);
  return <QuestionFrame prompt={screen.prompt}>
    <div className="choice-grid">{screen.options.map(option => <button key={option} onClick={() => {
      const correct = option === screen.answer;
      setResult({ correct, message: correct ? screen.feedback : screen.misconception });
      onAnswer(id, option, correct);
    }}>{option}</button>)}</div>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function TrueFalseQuestion({ screen, id, onAnswer }) {
  return <MultipleChoiceQuestion screen={{ ...screen, options: ["True", "False"], answer: screen.answer ? "True" : "False" }} id={id} onAnswer={onAnswer} />;
}

function OrderingQuestion({ screen, id, onAnswer }) {
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null);
  const choose = item => !order.includes(item) && setOrder([...order, item]);
  const check = () => {
    const correct = screen.items.every((item, i) => order[i] === item);
    setResult({ correct, message: correct ? screen.feedback : "Try again. Think about what has to happen before the next person can act." });
    onAnswer(id, order, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    <div className="choice-grid">{screen.items.map(item => <button key={item} disabled={order.includes(item)} onClick={() => choose(item)}>{item}</button>)}</div>
    <ol className="ordered-answer">{order.map(item => <li key={item}>{item}</li>)}</ol>
    <button className="guide-inline-button" onClick={() => { setOrder([]); setResult(null); }}>Try again</button>
    <button className="primary" onClick={check} disabled={order.length !== screen.items.length}>Check order <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function MatchingQuestion({ screen, id, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const definitions = screen.pairs.map(([, meaning]) => meaning);
  const check = () => {
    const correct = screen.pairs.every(([term, meaning]) => answers[term] === meaning);
    setResult({ correct, message: correct ? screen.feedback : "Not quite. Check each amount against when it is paid and what it forms part of." });
    onAnswer(id, answers, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    {screen.pairs.map(([term]) => <label className="match-row" key={term}><span>{term}</span><select value={answers[term] || ""} onChange={e => setAnswers({ ...answers, [term]: e.target.value })}><option value="">Choose meaning</option>{definitions.map(d => <option key={d}>{d}</option>)}</select></label>)}
    <button className="primary" onClick={check} disabled={Object.keys(answers).length !== screen.pairs.length}>Check matches <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function SortingQuestion({ screen, id, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const check = () => {
    const correct = screen.items.every(([item, group]) => answers[item] === group);
    setResult({ correct, message: correct ? screen.feedback : "Not quite. A useful rule is: deposit, once-off buying cost, or regular cost after purchase." });
    onAnswer(id, answers, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    {screen.items.map(([item]) => <label className="match-row" key={item}><span>{item}</span><select value={answers[item] || ""} onChange={e => setAnswers({ ...answers, [item]: e.target.value })}><option value="">Choose category</option>{screen.groups.map(group => <option key={group}>{group}</option>)}</select></label>)}
    <button className="primary" onClick={check} disabled={Object.keys(answers).length !== screen.items.length}>Check sorting <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function CostBuilderQuestion(props) {
  return <SortingQuestion {...props} />;
}

function ChooseContactQuestion({ screen, id, onAnswer }) {
  return <MultipleChoiceQuestion screen={{ ...screen, options: screen.options.map(([label]) => label), misconception: "Not quite. Think about who handles the question being asked right now." }} id={id} onAnswer={onAnswer} />;
}

function ScenarioDecisionQuestion(props) {
  return <MultipleChoiceQuestion {...props} />;
}

function ListingLanguageQuestion(props) {
  return <MultipleChoiceQuestion {...props} />;
}

function HouseInspectionQuestion({ screen, id, onAnswer }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const toggle = key => setSelected(current => current.includes(key) ? current.filter(x => x !== key) : [...current, key]);
  const check = () => {
    const correct = selected.length >= 5;
    setResult({ correct, message: correct ? screen.feedback : "Not quite. With an older home, several areas may be routine but still worth checking." });
    onAnswer(id, selected, correct);
  };
  return <QuestionFrame prompt={screen.prompt}>
    <div className="inspection-grid">
      <div className="mini-house" aria-hidden="true">
        <span className="roof" /><span className="chimney" /><span className="walls" /><span className="window left" /><span className="window right" /><span className="door" /><span className="path" />
      </div>
      <div className="inspection-choices">{screen.areas.map(([key, label, note]) => <button key={key} className={selected.includes(key) ? "selected" : ""} onClick={() => toggle(key)}><strong>{label}</strong><small>{note}</small></button>)}</div>
    </div>
    <button className="primary" onClick={check}>Check choices <span>→</span></button>
    <FeedbackPanel result={result} />
  </QuestionFrame>;
}

function QuestionFrame({ prompt, children }) {
  return <div className="question-frame lesson-screen"><h2>{prompt}</h2>{children}</div>;
}

function LessonSummary({ module, screen, navigate }) {
  return <div className="lesson-summary lesson-screen">
    <p className="eyebrow">Lesson completed</p>
    <h2>{screen.reward}</h2>
    <p>{screen.takeaway}</p>
    <div className="source-list">
      <h3>Official source</h3>
      {module.officialSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}
    </div>
    {module.relatedRoutes.map(link => <button className="guide-inline-button" key={link.route} onClick={() => navigate(link.route)}>{link.label}</button>)}
  </div>;
}

function BuildingReward({ module, close, navigate }) {
  return <div className="building-reward">
    <p className="eyebrow">Building reward</p>
    <h2>{module.buildingReward}</h2>
    <p>You have added another practical piece to your HomePath.</p>
    <button className="primary" onClick={close}>Continue building <span>→</span></button>
    <button className="guide-inline-button" onClick={() => navigate(module.relatedRoutes[0]?.route || "/")}>{module.relatedRoutes[0]?.label || "Open related tool"}</button>
  </div>;
}

function TowerProgress({ completed, activeCategory }) {
  const count = completed.length;
  const stage = buildingStage(count);
  const completedSet = new Set(completed);
  const has = n => stage >= n;
  const parts = {
    foundation: has(1) || completedSet.has("cash-needed"),
    groundFloor: has(2) || completedSet.has("broker"),
    door: has(3) || completedSet.has("booking-deposit"),
    windows: has(3) || completedSet.has("survey-valuation"),
    firstFloor: has(4),
    secondFloor: has(5),
    roof: has(6) || completedSet.has("older-house"),
    path: has(7) || completedSet.has("supports"),
  };
  return <figure className={`tower-progress active-${activeCategory}`} aria-label={`HomePath Towers building stage ${stage}. ${count} modules completed.`}>
    <div className="tower-sky">
      <div className="tower-plot">
        <span className="tower-ground" />
        <span className={`tower-foundation ${parts.foundation ? "built" : ""}`} />
        <span className={`tower-ground-floor ${parts.groundFloor ? "built" : ""}`} />
        <span className={`tower-door ${parts.door ? "built" : ""}`} />
        <span className={`tower-window one ${parts.windows ? "built" : ""}`} />
        <span className={`tower-window two ${parts.windows ? "built" : ""}`} />
        <span className={`tower-first-floor ${parts.firstFloor ? "built" : ""}`} />
        <span className={`tower-second-floor ${parts.secondFloor ? "built" : ""}`} />
        <span className={`tower-roof ${parts.roof ? "built" : ""}`} />
        <span className={`tower-path ${parts.path ? "built" : ""}`} />
      </div>
    </div>
    <figcaption>{count ? `${count} module${count === 1 ? "" : "s"} complete` : "Empty plot and foundation outline"}</figcaption>
  </figure>;
}
