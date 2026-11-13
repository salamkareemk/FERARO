import { products } from "./products.js";

import homeCake1 from "../assets/img/home-cake-1.png";
import homeCake2 from "../assets/img/home-cake-2.png";
import homeCake3 from "../assets/img/home-cake-3.png";
import homeCake4 from "../assets/img/home-cake-4.png";

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
  { image: homeCake1, name: "Rainbow", occasion: "Anniversary" },
  { image: homeCake2, name: "Red Velvet", occasion: "Baby Shower" },
  { image: homeCake3, name: "White German Nuts Choco Chip", occasion: "Graduation" },
  { image: homeCake4, name: "Milk Vancho", occasion: "Corporate" },
].map((item) => ({ ...item, shape: "wide" }));

/* Occasion for each menu cake, keyed by product name */
const menuOccasions = {
  "Belgium Chocolate": "Birthday",
  "Choco Caramel": "Anniversary",
  "Choco Spanish": "Corporate",
  "Milk Crunchy": "Graduation",
  "Almond Bubble": "Holidays",
  "White German Nuts": "Wedding",
  "White Truffle": "Engagement",
  "Red Bee": "Baby Shower",
  "Fresh Fruit Cake": "Kids' Party",
};

/* Menu cakes not already shown above as signature photos (same cake) */
const signatureNames = new Set(signature.map(({ name }) => name));

const menuCakes = products
  .filter(({ name }) => !signatureNames.has(name))
  .map(({ image, name }) => ({
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

export const galleryItems = interleave(signature, menuCakes).map((item, index) => ({ ...item, id: `gallery-${index + 1}` }));
