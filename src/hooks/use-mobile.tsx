// =============================================================
// useIsMobile — Custom Hook
// =============================================================
// A hook is just a special function that starts with "use".
// You call it inside a component to get some useful information.
//
// This hook tells you whether the user is on a small screen
// (mobile phone) or a big screen (desktop/tablet).
//
// HOW TO USE IT in any component:
//   const isMobile = useIsMobile();
//   if (isMobile) { show mobile menu }
//   else { show desktop menu }
//
// The number 768 means: screens smaller than 768px = mobile.
// This matches the "md:" breakpoint in Tailwind CSS.
// =============================================================

import * as React from "react";

// Any screen width below 768px is considered "mobile"
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // isMobile holds true (mobile) or false (desktop)
  // It starts as undefined because we don't know the screen size yet
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // window.matchMedia watches the screen width like a sensor
    // It fires the onChange function whenever the screen size crosses 768px
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // This function runs every time the screen width changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Start listening for screen size changes
    mql.addEventListener("change", onChange);

    // Also check immediately when the component first loads
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup — stop listening when the component is removed from the page
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty [] means this only runs once when the component mounts

  // !! converts undefined → false, so we always return true or false
  return !!isMobile;
}
