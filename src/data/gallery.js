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
   wide = landscape photo, tall = portrait photo, square = square photo
   `occasion` sets which filter tab the photo appears under */

export const galleryOccasions = [
  "All",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Wedding",
  "Engagement",
  "Graduation",
  "Kids' Party",
  "Corporate",
  "Holidays",
];

const signature = [
  { image: homeCake1, name: "Strawberry Drip Cake", occasion: "Anniversary" },
  { image: homeCake2, name: "Caramel Nut Cake", occasion: "Baby Shower" },
  { image: homeCake3, name: "White Chocolate Vanilla Cake", occasion: "Graduation" },
  { image: homeCake4, name: "Chocolate Truffle Cake", occasion: "Corporate" },
].map((item) => ({ ...item, shape: "wide" }));

const newCreations = [
  { image: newCake1, name: "Premium Chocolate Cake", occasion: "Birthday" },
  { image: newCake2, name: "Premium Vanilla Cake", occasion: "Kids' Party" },
  { image: newCake3, name: "Premium Cherry Cake", occasion: "Engagement" },
  { image: newCake4, name: "Premium Blueberry Cake", occasion: "Wedding" },
  { image: newCake5, name: "Premium Raspberry Cake", occasion: "Holidays" },
].map((item) => ({ ...item, shape: "square" }));

const cupcakes = [
  { image: cupcake1, name: "Strawberry Swirl Cupcake", occasion: "Baby Shower" },
  { image: cupcake2, name: "Choc-Chip Cream Cupcake", occasion: "Kids' Party" },
  { image: cupcake3, name: "Lemon Berry Cupcake", occasion: "Engagement" },
].map((item) => ({ ...item, shape: "tall" }));

/* Occasion for each menu cake, keyed by product name */
const menuOccasions = {
  "Strawberry Shortcake": "Holidays",
  "Fresh Strawberry Cream": "Anniversary",
  "Strawberry Delight Cake": "Engagement",
  "Classic Vanilla Bean Cake": "Wedding",
  "Vanilla Buttercream Cake": "Wedding",
  "Soft Vanilla Sponge Cake": "Baby Shower",
  "Chocolate Fudge Cake": "Birthday",
  "Dark Chocolate Velvet Cake": "Anniversary",
  "Triple Chocolate Cake": "Birthday",
  "Peanut And Banana Cake": "Holidays",
  "Filled Walnut Cake": "Graduation",
  "Glazed Pecan Cake": "Corporate",
  "Chocolate Brownie": "Corporate",
  "Cream Cupcake": "Kids' Party",
  "Lemon Cake": "Graduation",
};

const menuCakes = products.map(({ image, name }) => ({
  image,
  name,
  occasion: menuOccasions[name] ?? "Birthday",
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
