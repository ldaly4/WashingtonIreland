import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CheckPositionPage from "./pages/CheckPositionPage";
import CheckListingPage from "./pages/CheckListingPage";
import AdviceCentrePage from "./pages/AdviceCentrePage";
import BuyingGuidePage from "./pages/BuyingGuidePage";
import SavingsPlanPage from "./pages/SavingsPlanPage";
import HousingPulsePage from "./pages/HousingPulsePage";
import LearnPage from "./pages/LearnPage";
import PrivacyPage from "./pages/PrivacyPage";
import GlossaryPage from "./pages/GlossaryPage";

const VisualTestPage = import.meta.env.DEV ? React.lazy(() => import("./pages/VisualTestPage")) : null;

const routes = {
  "/": HomePage,
  "/check-position": CheckPositionPage,
  "/check-listing": CheckListingPage,
  "/advice-centre": AdviceCentrePage,
  "/buying-guide": BuyingGuidePage,
  "/glossary": GlossaryPage,
  "/housing-pulse": HousingPulsePage,
  "/learn": LearnPage,
  "/privacy": PrivacyPage,
  "/savings-plan": SavingsPlanPage,
  ...(import.meta.env.DEV ? { "/visual-test": VisualTestPage } : {}),
};
const currentPath = () => window.location.hash.slice(1) || "/";

export default function App() {
  const [path,setPath]=useState(currentPath);
  useEffect(()=>{
    const change=()=>setPath(currentPath());
    window.addEventListener("hashchange",change);
    return()=>window.removeEventListener("hashchange",change);
  },[]);
  const navigate=to=>{
    if (currentPath() === to) setPath(to);
    else window.location.hash=to;
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const Page=routes[path]||HomePage;
  return <Layout path={path} navigate={navigate}><React.Suspense fallback={null}><Page navigate={navigate}/></React.Suspense></Layout>;
}
