import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

/*=============== SCROLL REVEAL ANIMATION ===============*/
const reveals = [
  [`.home_title`, { origin: "top" }],
  [`.home_description`, { delay: 600, origin: "top" }],
  [`.home_actions`, { delay: 900, origin: "top" }],
  [`.home_controls`, { delay: 1100, origin: "top" }],
  [`.home_base`, { delay: 900 }],
  [`.home_swiper`, { delay: 1200, origin: "top" }],
  [`.home_blob`, { delay: 1500, scale: 0 }],
  [`.home_data img`, { delay: 2100, distance: 0, interval: 200, scale: 0 }],
  [
    `.home_leaf-1, .home_leaf-2, .home_sticker-3, .home_sticker-4`,
    { delay: 2400, distance: 0, interval: 200, scale: 0 },
  ],

  [`.menu_header`, {}],
  [`.menu_tab`, { delay: 600, interval: 80 }],
  [`.menu_swiper`, { delay: 900 }],
  [`.menu_arrows`, { delay: 1100 }],

  [`.custom_header`, {}],
  [`.custom_tile`, { delay: 500, interval: 90, distance: "30px" }],
  [`.custom_more`, { delay: 900 }],

  [`.outlets_header`, {}],
  /* Reveal the whole row - cards off to the side of the swipe row
     never count as on screen, so per-card reveals would stay hidden */
  [`.outlets_list`, { delay: 400 }],
  [`.outlets_dots`, { delay: 600 }],

  [`.gallery_header`, { origin: "top" }],
  [`.gallery_tabs`, { delay: 300 }],

  [`.order_title`, {}],
  [`.order_description`, { delay: 300 }],
  [`.order_buttons`, { delay: 500 }],
  [`.order_outlets-link`, { delay: 650 }],
  [`.order_visual`, { delay: 400, origin: "right", distance: "80px" }],

  [`.ft_top`, {}],
  [`.ft_brand`, { delay: 200, distance: "80px" }],
];

/* Re-runs when the page changes so the new page gets its animations */
export const useScrollReveal = (pageKey) => {
  useEffect(() => {
    const sr = ScrollReveal({
      origin: "bottom",
      distance: "60px",
      duration: 1500,
      delay: 300,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    });

    reveals.forEach(([selector, options]) => sr.reveal(selector, options));

    return () => sr.destroy();
  }, [pageKey]);
};
