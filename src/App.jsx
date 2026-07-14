import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CheckPositionPage from "./pages/CheckPositionPage";
import CheckListingPage from "./pages/CheckListingPage";
import AdviceCentrePage from "./pages/AdviceCentrePage";
import BuyingGuidePage from "./pages/BuyingGuidePage";

const routes = {"/":HomePage,"/check-position":CheckPositionPage,"/check-listing":CheckListingPage,"/advice-centre":AdviceCentrePage,"/buying-guide":BuyingGuidePage};
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
  return <Layout path={path} navigate={navigate}><Page navigate={navigate}/></Layout>;
}
