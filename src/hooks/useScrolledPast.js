import { useEffect, useState } from "react";

/*=============== HAS THE PAGE SCROLLED PAST A POINT? ===============*/
/* Only re-renders when the answer flips, not on every scroll event */
export const useScrolledPast = (offset) => {
  const [isPast, setIsPast] = useState(() => window.scrollY >= offset);

  useEffect(() => {
    const onScroll = () => setIsPast(window.scrollY >= offset);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return isPast;
};
