import belgiumChocolate from "../assets/img/menu/belgium-chocolate.png";
import chocoCaramel from "../assets/img/menu/choco-caramel.png";
import chocoSpanish from "../assets/img/menu/choco-spanish.png";
import milkCrunchy from "../assets/img/menu/milk-crunchy.png";
import milkVancho from "../assets/img/menu/milk-vancho.png";
import almondBubble from "../assets/img/menu/almond-bubble.png";
import whiteGermanNuts from "../assets/img/menu/white-german-nuts.png";
import whiteGermanNutsChocoChip from "../assets/img/menu/white-german-nuts-choco-chip.png";
import redVelvet from "../assets/img/menu/red-velvet.png";
import whiteTruffle from "../assets/img/menu/white-truffle.png";
import redBee from "../assets/img/menu/red-bee.png";
import freshFruitCake from "../assets/img/menu/fresh-fruit-cake.png";
import rainbow from "../assets/img/menu/rainbow.png";

/*=============== PRODUCT DATA ===============*/
/* Menu tabs, in display order */
export const categories = ["Chocolate", "Nuts", "Classic", "Fruit & Fun"];

/* `zoom` (optional): shows a photo larger on the menu card when the cake
   looks small in its frame. Prices are in Indian rupees. */
export const products = [
  // Chocolate
  {
    id: "belgium-chocolate",
    name: "Belgium Chocolate",
    description: "Glossy Belgian chocolate glaze with white chocolate curls and a crunchy nut-coated side.",
    price: 1200,
    category: "Chocolate",
    image: belgiumChocolate,
  },
  {
    id: "choco-caramel",
    name: "Choco Caramel",
    description: "Rich dark chocolate cake with a golden caramel top and chocolate pearls.",
    price: 1000,
    category: "Chocolate",
    image: chocoCaramel,
  },
  {
    id: "choco-spanish",
    name: "Choco Spanish",
    description: "Caramel and white cream stripes over a crunchy chocolate-nut side.",
    price: 1200,
    category: "Chocolate",
    image: chocoSpanish,
  },
  {
    id: "milk-crunchy",
    name: "Milk Crunchy",
    description: "Milk chocolate glaze with a white chocolate drizzle and a crunchy nut coating.",
    price: 1100,
    category: "Chocolate",
    image: milkCrunchy,
  },
  {
    id: "milk-vancho",
    name: "Milk Vancho",
    description: "Milk chocolate web design with chocolate petals and a piped cream base.",
    price: 1000,
    category: "Chocolate",
    image: milkVancho,
  },

  // Nuts
  {
    id: "almond-bubble",
    name: "Almond Bubble",
    description: "Cocoa-dusted cream topped with almond bubbles and toasted almond sides.",
    price: 1100,
    category: "Nuts",
    image: almondBubble,
  },
  {
    id: "white-german-nuts",
    name: "White German Nuts",
    description: "White cream with chocolate swirls, wrapped in toasted almond flakes.",
    price: 1100,
    category: "Nuts",
    image: whiteGermanNuts,
  },
  {
    id: "white-german-nuts-choco-chip",
    name: "White German Nuts Choco Chip",
    description: "White chocolate cream with chocolate chips and crunchy nuts around the side.",
    price: 1100,
    category: "Nuts",
    image: whiteGermanNutsChocoChip,
  },

  // Classic
  {
    id: "red-velvet",
    name: "Red Velvet",
    description: "Classic red velvet sponge with smooth white cream and red velvet crumbs.",
    price: 950,
    category: "Classic",
    image: redVelvet,
  },
  {
    id: "white-truffle",
    name: "White Truffle",
    description: "Smooth white truffle cream with chocolate art and white chocolate pearls.",
    price: 950,
    category: "Classic",
    image: whiteTruffle,
  },
  {
    id: "red-bee",
    name: "Red Bee",
    description: "White cream cake with a bright red glaze drizzle and chocolate fans.",
    price: 1100,
    category: "Classic",
    image: redBee,
    zoom: 1.2, // wide photo - looks small in the square card frame
  },

  // Fruit & Fun
  {
    id: "fresh-fruit-cake",
    name: "Fresh Fruit Cake",
    description: "Cream cake crowned with fresh kiwi, strawberries, mango and berries.",
    price: 1300,
    category: "Fruit & Fun",
    image: freshFruitCake,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Rainbow sprinkle top with soft vanilla cream and colourful sides.",
    price: 1300,
    category: "Fruit & Fun",
    image: rainbow,
    zoom: 1.15, // tall topper makes the cake itself look small
  },
];

/*=============== PRODUCT HELPERS ===============*/
export const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};
