import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/* The running Lenis instance, so other components can pause scrolling */
let activeLenis = null;

/*=============== SMOOTH SCROLL (LENIS) ===============*/
/* Turns stepped mouse-wheel scrolling into a soft, eased glide.
   `isLocked` pauses page scrolling while a drawer or modal is open. */
export const useSmoothScroll = (isLocked = false) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075, // lower = smoother / floatier
      wheelMultiplier: 0.8, // < 1 = slower scrolling per wheel notch
      anchors: true, // smooth-scroll for #section links
      allowNestedScroll: true, // cart & modals keep their own scrolling
      autoRaf: true,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) return;

    if (isLocked) lenis.stop();
    else lenis.start();
  }, [isLocked]);
};

/*=============== LOCK PAGE SCROLL ===============*/
/* For overlays that live inside a page (e.g. the gallery lightbox) */
export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    activeLenis?.stop();
    document.body.classList.add("cart-open");

    return () => {
      activeLenis?.start();
      document.body.classList.remove("cart-open");
    };
  }, [isLocked]);
};
