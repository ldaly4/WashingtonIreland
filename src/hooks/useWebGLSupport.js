import { useEffect, useState } from "react";

function canCreateWebGLContext() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function useWebGLSupport(forceFallback = false) {
  const [supported, setSupported] = useState(() => !forceFallback && canCreateWebGLContext());

  useEffect(() => {
    setSupported(!forceFallback && canCreateWebGLContext());
  }, [forceFallback]);

  return supported;
}
