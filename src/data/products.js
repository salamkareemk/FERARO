import strawberry1 from "../assets/img/product-strawberry-1.png";
import strawberry2 from "../assets/img/product-strawberry-2.png";
import strawberry3 from "../assets/img/product-strawberry-3.png";
import vanilla1 from "../assets/img/product-vanilla-1.png";
import vanilla2 from "../assets/img/product-vanilla-2.png";
import vanilla3 from "../assets/img/product-vanilla-3.png";
import chocolate1 from "../assets/img/product-chocolate-1.png";
import chocolate2 from "../assets/img/product-chocolate-2.png";
import chocolate3 from "../assets/img/product-chocolate-3.png";
import driedFruit1 from "../assets/img/product-dried-fruit-1.png";
import driedFruit2 from "../assets/img/product-dried-fruit-2.png";
import driedFruit3 from "../assets/img/product-dried-fruit-3.png";
import others1 from "../assets/img/product-others-1.png";
import others2 from "../assets/img/product-others-2.png";
import others3 from "../assets/img/product-others-3.png";

/*=============== PRODUCT DATA ===============*/
export const categories = [
  "Strawberry",
  "Vanilla",
  "Chocolate",
  "Dried fruit",
  "Others",
];

export const products = [
  // Strawberry
  {
    id: "strawberry-1",
    name: "Strawberry Shortcake",
    description: "Layers of light sponge, fresh strawberries and whipped vanilla cream.",
    price: 9.99,
    category: "Strawberry",
    image: strawberry1,
  },
  {
    id: "strawberry-2",
    name: "Fresh Strawberry Cream",
    description: "Pink strawberry glaze over soft sponge and silky strawberry cream.",
    price: 11.99,
    category: "Strawberry",
    image: strawberry2,
  },
  {
    id: "strawberry-3",
    name: "Strawberry Delight Cake",
    description: "Strawberry mousse layers with chocolate curls and fresh berries.",
    price: 12.99,
    category: "Strawberry",
    image: strawberry3,
  },

  // Vanilla
  {
    id: "vanilla-1",
    name: "Classic Vanilla Bean Cake",
    description: "Madagascar vanilla sponge with smooth vanilla bean buttercream.",
    price: 15.99,
    category: "Vanilla",
    image: vanilla1,
  },
  {
    id: "vanilla-2",
    name: "Vanilla Buttercream Cake",
    description: "Buttery vanilla layers finished with a rich, creamy frosting.",
    price: 13.99,
    category: "Vanilla",
    image: vanilla2,
  },
  {
    id: "vanilla-3",
    name: "Soft Vanilla Sponge Cake",
    description: "A light, airy vanilla sponge that melts in your mouth.",
    price: 10.99,
    category: "Vanilla",
    image: vanilla3,
  },

  // Chocolate
  {
    id: "chocolate-1",
    name: "Chocolate Fudge Cake",
    description: "Dense chocolate cake smothered in a glossy fudge ganache.",
    price: 17.99,
    category: "Chocolate",
    image: chocolate1,
  },
  {
    id: "chocolate-2",
    name: "Dark Chocolate Velvet Cake",
    description: "Velvety dark chocolate layers with bittersweet cocoa cream.",
    price: 18.99,
    category: "Chocolate",
    image: chocolate2,
  },
  {
    id: "chocolate-3",
    name: "Triple Chocolate Cake",
    description: "Milk, dark and white chocolate in one decadent cake.",
    price: 20.99,
    category: "Chocolate",
    image: chocolate3,
  },

  // Dried Fruit
  {
    id: "dried-fruit-1",
    name: "Peanut And Banana Cake",
    description: "Moist banana cake topped with caramel and toasted peanuts.",
    price: 19.99,
    category: "Dried fruit",
    image: driedFruit1,
  },
  {
    id: "dried-fruit-2",
    name: "Filled Walnut Cake",
    description: "Walnut sponge filled with honey cream and crunchy nuts.",
    price: 14.99,
    category: "Dried fruit",
    image: driedFruit2,
  },
  {
    id: "dried-fruit-3",
    name: "Glazed Pecan Cake",
    description: "Caramel-glazed cake crowned with toasted pecans.",
    price: 17.99,
    category: "Dried fruit",
    image: driedFruit3,
  },

  // Others
  {
    id: "others-1",
    name: "Chocolate Brownie",
    description: "Fudgy chocolate brownie with a crackly, shiny top.",
    price: 7.99,
    category: "Others",
    image: others1,
  },
  {
    id: "others-2",
    name: "Cream Cupcake",
    description: "Soft vanilla cupcake swirled with light buttercream.",
    price: 9.99,
    category: "Others",
    image: others2,
  },
  {
    id: "others-3",
    name: "Lemon Cake",
    description: "Zesty lemon sponge with a sweet citrus glaze.",
    price: 11.99,
    category: "Others",
    image: others3,
  },
];

/*=============== PRODUCT HELPERS ===============*/
export const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};
