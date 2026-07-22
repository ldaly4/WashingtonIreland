import { useEffect, useState } from "react";

export default function useReducedMotionPreference(override) {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof override === "boolean") return override;
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof override === "boolean") {
      setPrefersReduced(override);
      return undefined;
    }
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [override]);

  return prefersReduced;
}
