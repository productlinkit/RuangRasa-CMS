import { useEffect, useState } from "react";

import type { Breakpoint } from "../types";

export function useBreakpoint(): Breakpoint {
  const getBreakpoint = (): Breakpoint => {
    if (typeof window === "undefined") return "desktop";
    if (window.innerWidth < 640) return "mobile";
    if (window.innerWidth < 1024) return "tablet";
    return "desktop";
  };
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint);
  useEffect(() => {
    const update = () => setBreakpoint(getBreakpoint());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return breakpoint;
}
