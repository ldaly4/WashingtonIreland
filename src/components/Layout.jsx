import React from "react";

const nav = [
  ["/", "Home"],
  ["/check-position", "Check position"],
  ["/check-listing", "Check listing"],
  ["/advice-centre", "Advice centre"],
];
const mobileLabel = {
  "/": "Home",
  "/check-position": "Position",
  "/check-listing": "Listing",
  "/advice-centre": "Advice",
};

export function HouseMark() {
  return <span className="mark" aria-hidden="true">
    <svg viewBox="0 0 64 64">
      <path className="logo-house" d="M10 34V22.5c0-2.1.9-4 2.5-5.3L30.1 3.4c1.1-.9 2.7-.9 3.8 0l17.6 13.8c1.6 1.3 2.5 3.2 2.5 5.3V34M47 13V7h5v10"/>
      <path className="logo-door" d="M27.3 29.5V20a4.7 4.7 0 0 1 9.4 0v8.4"/>
      <circle className="logo-knob" cx="34.2" cy="24.5" r="1.2"/>
      <path className="logo-path" d="M38.5 28.2c-11.5 2.2-21.1 5.4-25.7 9-4.8 3.8-1.8 7.8 5 9.7 5.8 1.7 15 1.9 25.5 1-9.4-2.4-15.3-5.2-15.5-8.6-.2-3.7 4.4-7.4 10.7-11.1Z"/>
    </svg>
  </span>;
}

export default function Layout({ path, navigate, children }) {
  const go = (event, href) => { event.preventDefault(); navigate(href); };
  return <div className="app-shell">
    <header className="header">
      <a className="brand" href="#/" onClick={e => go(e, "/")}><HouseMark /><span><b>Home</b><i>Path</i></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(([href, label]) => <a key={href} className={path === href ? "active" : ""} href={`#${href}`} onClick={e => go(e, href)}>{label}</a>)}
      </nav>
    </header>
    <main>{children}</main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {nav.map(([href, label]) => <a key={href} className={path === href ? "active" : ""} href={`#${href}`} onClick={e => go(e, href)}>
        {mobileLabel[href] || label}
      </a>)}
    </nav>
  </div>;
}

export function Disclaimer({ children }) {
  return <aside className="disclaimer"><strong>Good to know</strong><p>{children}</p></aside>;
}

export function PageHead({ eyebrow, title, children }) {
  return <header className="page-head">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{children}</p></header>;
}
