import { useEffect, useState } from "react";

/*=============== HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ===============*/
/* `offset`: always visible above this scroll position.
   `tolerance`: ignore tiny movements so the header doesn't flicker. */
export const useHideOnScroll = ({ offset = 100, tolerance = 6 } = {}) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= offset) {
        setIsHidden(false);
      } else if (Math.abs(delta) >= tolerance) {
        setIsHidden(delta > 0);
      } else {
        return; // keep lastY so small movements add up
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset, tolerance]);

  return isHidden;
};
