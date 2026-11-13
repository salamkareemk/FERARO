import chocolateTruffleDrip from "../assets/img/new/chocolate-truffle-drip.png";
import cocomelonRainbow from "../assets/img/new/cocomelon-rainbow.png";
import teddyAndMoon from "../assets/img/new/teddy-and-moon.png";
import purpleButterfly from "../assets/img/new/purple-butterfly.png";
import pinkButterfly from "../assets/img/new/pink-butterfly.png";
import momToBe from "../assets/img/new/mom-to-be.png";
import homeCake1 from "../assets/img/home-cake-1.png";
import homeCake3 from "../assets/img/home-cake-3.png";
import homeCake4 from "../assets/img/home-cake-4.png";

/*=============== CUSTOMIZED CAKES GALLERY ===============*/
/* Order matters: the masonry grid fills column by column
   (see .custom_grid in styles.css for each tile's height) */
export const customCakes = [
  { image: purpleButterfly, occasion: "Birthday" },
  { image: homeCake1, occasion: "Anniversary" }, // Rainbow
  { image: momToBe, occasion: "Baby Shower" },
  { image: teddyAndMoon, occasion: "Wedding" },
  { image: pinkButterfly, occasion: "Engagement" },
  { image: homeCake3, occasion: "Graduation" }, // White German Nuts Choco Chip
  { image: cocomelonRainbow, occasion: "Kids' Party" },
  { image: homeCake4, occasion: "Corporate" }, // Milk Vancho
  { image: chocolateTruffleDrip, occasion: "Holidays" },
];
