import { products } from "./products.js";

import homeCake1 from "../assets/img/home-cake-1.png";
import homeCake2 from "../assets/img/home-cake-2.png";
import homeCake3 from "../assets/img/home-cake-3.png";
import homeCake4 from "../assets/img/home-cake-4.png";

import crownToppedRedVelvet from "../assets/img/gallery/crown-topped-red-velvet.webp";
import mintGoldBoyOrGirl from "../assets/img/gallery/mint-gold-boy-or-girl.webp";
import glossyBlackGold from "../assets/img/gallery/glossy-black-gold.webp";
import justEngaged from "../assets/img/gallery/just-engaged.webp";
import mintOmbreBirthday from "../assets/img/gallery/mint-ombre-birthday.webp";
import momToBeCakeWithBooties from "../assets/img/gallery/mom-to-be-cake-with-booties.png";
import pastelMintEngagement from "../assets/img/gallery/pastel-mint-engagement.webp";
import rainbowCar5thBirthday from "../assets/img/gallery/rainbow-car-5th-birthday.webp";
import blueGoldCelebration from "../assets/img/gallery/blue-gold-celebration.webp";
import spiderManBirthday from "../assets/img/gallery/spider-man-birthday.webp";

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

/* Customised cake photos. They get their own id prefix so the ids of the
   photos above stay the same. */
const customised = [
  { image: crownToppedRedVelvet, name: "Crown-Topped Red Velvet Birthday Cake", occasion: "Birthday", shape: "tall" },
  { image: mintGoldBoyOrGirl, name: "Elegant Mint and Gold Boy or Girl Cake", occasion: "Baby Shower", shape: "tall" },
  { image: glossyBlackGold, name: "Glossy Black Birthday Cake with Gold Accents", occasion: "Birthday", shape: "tall" },
  { image: justEngaged, name: "Just Engaged Celebration Cake", occasion: "Engagement", shape: "tall" },
  { image: mintOmbreBirthday, name: "Mint Ombre Birthday Cake", occasion: "Birthday", shape: "tall" },
  { image: momToBeCakeWithBooties, name: "Mom To Be Cake with Booties", occasion: "Baby Shower", shape: "square" },
  { image: pastelMintEngagement, name: "Pastel Mint Engagement Cake with Gold Topper", occasion: "Engagement", shape: "tall" },
  { image: rainbowCar5thBirthday, name: "Rainbow Car-Themed 5th Birthday Cake", occasion: "Kids' Party", shape: "tall" },
  { image: blueGoldCelebration, name: "Blue and Gold Celebration Cake", occasion: "Birthday", shape: "tall" },
  { image: spiderManBirthday, name: "Spider-Man Birthday Cake", occasion: "Kids' Party", shape: "tall" },
].map((item, index) => ({ ...item, id: `gallery-custom-${index + 1}` }));

const classics = interleave(signature, menuCakes).map((item, index) => ({ ...item, id: `gallery-${index + 1}` }));

/* Customised cakes lead, mixed in with the classics so the grid alternates
   tall, wide and square tiles */
export const galleryItems = interleave(customised, classics);
