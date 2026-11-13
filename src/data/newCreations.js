import chocolateTruffleDrip from "../assets/img/new/chocolate-truffle-drip.png";
import cocomelonRainbow from "../assets/img/new/cocomelon-rainbow.png";
import teddyAndMoon from "../assets/img/new/teddy-and-moon.png";
import purpleButterfly from "../assets/img/new/purple-butterfly.png";
import pinkButterfly from "../assets/img/new/pink-butterfly.png";
import momToBe from "../assets/img/new/mom-to-be.png";

import { products } from "./products.js";

/*=============== NEW CREATIONS (built-in slides) ===============*/
/* Customised cakes first, then every cake on the menu (same photos and
   names as the menu, so they aren't downloaded twice) */
const customised = [
  { image: chocolateTruffleDrip, name: "Chocolate Truffle Drip" },
  { image: cocomelonRainbow, name: "Cocomelon Rainbow" },
  { image: teddyAndMoon, name: "Teddy & Moon" },
  { image: purpleButterfly, name: "Purple Butterfly" },
  { image: pinkButterfly, name: "Pink Butterfly" },
  { image: momToBe, name: "Mom To Be" },
];

const menuCakes = products.map(({ image, name }) => ({ image, name }));

export const newCreations = [...customised, ...menuCakes];
