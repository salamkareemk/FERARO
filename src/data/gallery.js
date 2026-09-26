import { products } from "./products.js";

import homeCake1 from "../assets/img/home-cake-1.png";
import homeCake2 from "../assets/img/home-cake-2.png";
import homeCake3 from "../assets/img/home-cake-3.png";
import homeCake4 from "../assets/img/home-cake-4.png";
import newCake1 from "../assets/img/new-cake-1.png";
import newCake2 from "../assets/img/new-cake-2.png";
import newCake3 from "../assets/img/new-cake-3.png";
import newCake4 from "../assets/img/new-cake-4.png";
import newCake5 from "../assets/img/new-cake-5.png";
import cupcake1 from "../assets/img/about-cupcake-1.png";
import cupcake2 from "../assets/img/about-cupcake-2.png";
import cupcake3 from "../assets/img/about-cupcake-3.png";

/*=============== CAKE GALLERY ===============*/
/* `shape` sets the tile proportions in the masonry grid:
   wide = landscape photo, tall = portrait photo, square = square photo */

const signature = [
  { image: homeCake1, name: "Strawberry Drip Cake" },
  { image: homeCake2, name: "Caramel Nut Cake" },
  { image: homeCake3, name: "White Chocolate Vanilla Cake" },
  { image: homeCake4, name: "Chocolate Truffle Cake" },
].map((item) => ({ ...item, collection: "Signature", shape: "wide" }));

const newCreations = [
  { image: newCake1, name: "Premium Chocolate Cake" },
  { image: newCake2, name: "Premium Vanilla Cake" },
  { image: newCake3, name: "Premium Cherry Cake" },
  { image: newCake4, name: "Premium Blueberry Cake" },
  { image: newCake5, name: "Premium Raspberry Cake" },
].map((item) => ({ ...item, collection: "New Creations", shape: "square" }));

const cupcakes = [
  { image: cupcake1, name: "Strawberry Swirl Cupcake" },
  { image: cupcake2, name: "Choc-Chip Cream Cupcake" },
  { image: cupcake3, name: "Lemon Berry Cupcake" },
].map((item) => ({ ...item, collection: "Cupcakes & Treats", shape: "tall" }));

const menuCakes = products.map(({ image, name, category }) => ({
  image,
  name,
  collection: category === "Others" ? "Cupcakes & Treats" : category,
  shape: "square",
}));

/* Interleave collections so the "All" view mixes shapes and colours */
const interleave = (...lists) => {
  const result = [];
  const longest = Math.max(...lists.map((list) => list.length));

  for (let index = 0; index < longest; index++) {
    lists.forEach((list) => list[index] && result.push(list[index]));
  }

  return result;
};

export const galleryItems = interleave(
  signature,
  newCreations,
  menuCakes.slice(0, 8),
  cupcakes,
  menuCakes.slice(8),
).map((item, index) => ({ ...item, id: `gallery-${index + 1}` }));

export const galleryCollections = [
  "All",
  "Signature",
  "New Creations",
  "Strawberry",
  "Vanilla",
  "Chocolate",
  "Dried fruit",
  "Cupcakes & Treats",
];
