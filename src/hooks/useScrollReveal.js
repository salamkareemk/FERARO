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

  [`.about_cupcake-1, .about_cupcake-2`, { rotate: { x: 0, y: 0, z: 120 } }],
  [`.about_data .section_title`, { delay: 900 }],
  [`.about_description`, { delay: 1200 }],
  [`.about_data .button`, { delay: 1500, distance: 0, scale: 0 }],
  [`.about_blob`, { delay: 1800, origin: "right" }],
  [`.about_img`, { delay: 2100, origin: "left" }],
  [
    `.about_leaf, .about_cupcake-3`,
    { delay: 2700, distance: 0, interval: 200, scale: 0 },
  ],
  [`.about_data img`, { delay: 3000, distance: 0, interval: 200, scale: 0 }],

  [`.menu_header`, {}],
  [`.menu_tab`, { delay: 600, interval: 80 }],
  [`.menu_swiper`, { delay: 900 }],
  [`.menu_arrows`, { delay: 1100 }],

  [`.new_data .section_title`, {}],
  [`.new_description`, { delay: 600 }],
  [`.new_data .button`, { delay: 900 }],
  [`.new_swiper`, { delay: 1200 }],
  [
    `.new_leaf-1, .new_leaf-2, .new_leaf-3`,
    { delay: 1500, distance: 0, interval: 200, scale: 0 },
  ],
  [`.new_titles`, { delay: 1800, scale: 0 }],

  [`.custom_header`, {}],
  [`.custom_tile`, { delay: 500, interval: 90, distance: "30px" }],
  [`.custom_more`, { delay: 900 }],

  [`.outlets_header`, {}],
  [`.outlets_card`, { delay: 400, interval: 120 }],

  [`.gallery_header`, { origin: "top" }],
  [`.gallery_tabs`, { delay: 300 }],

  [`.contact_content .section_title`, {}],
  [`.contact_info`, { delay: 600, interval: 100 }],
  [`.contact_map`, { delay: 900, origin: "top" }],
  [`.contact_data img`, { delay: 1500, distance: 0, interval: 200, scale: 0 }],

  [`.footer_container`, {}],
  [`.footer_leaf-1, .footer_leaf-2`, { delay: 600, interval: 200 }],
  [`.footer_blob`, { delay: 600 }],
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
