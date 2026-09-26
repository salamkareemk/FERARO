import { useEffect } from "react";
import { useLocation } from "react-router";

/*=============== SCROLL POSITION ON PAGE CHANGE ===============*/
/* New page -> start at the top. Arriving at "/#section" from another page
   -> jump to that section once it has rendered. */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (target) window.scrollTo(0, target.offsetTop);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
