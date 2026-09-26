/*=============== FERARO OUTLETS ===============*/
/* `mapLink`: the outlet's Google Maps link (opens directions)
   `coords`: exact pin location (lat,lng) for the small map preview -
             coordinates always pin the right spot, address searches don't
   `image`: optional storefront photo - when set, it replaces the map preview
            (e.g. import cheruvathurPhoto from "../assets/img/outlet-cheruvathur.jpg") */

const mapEmbed = (coords) =>
  `https://maps.google.com/maps?q=${coords}&z=16&output=embed`;

export const outlets = [
  {
    id: "cheruvathur",
    name: "Feraro Cheruvathur",
    address: ["NH Cheruvathur, near E Planet,", "Cheruvathur, Kerala 671313"],
    mapLink: "https://maps.app.goo.gl/y1PnTREi8xdgQiYZ8",
    coords: "12.2142903,75.1625697",
  },
  {
    id: "uppala",
    name: "Feraro Uppala",
    address: ["NH Uppala,", "Uppala, Kerala 671322"],
    mapLink: "https://maps.app.goo.gl/GpHwaVvHmR799Wa98",
    coords: "12.6749238,74.9086992",
  },
  {
    id: "trikaripur",
    name: "Feraro Trikaripur",
    address: [
      "Munnavir Nagar, near Munnavir Education Complex,",
      "North Thrikkaripur, Kerala 671310",
    ],
    mapLink: "https://maps.app.goo.gl/JNpWvKDpFxQHbH2h9",
    coords: "12.138948,75.1770044",
  },
  {
    id: "mulleria",
    name: "Feraro Mulleria",
    address: ["Feraro Ice Creams & Pastries,", "Mulleria, Kerala 671543"],
    mapLink: "https://maps.app.goo.gl/Gf2huU1WhJjdJo2Z7",
    coords: "12.5513204,75.1640361",
  },
  {
    id: "badiadka",
    name: "Feraro Badiadka",
    address: ["Cherkala - Kalladka Rd,", "Badiyadka, Kerala 671551"],
    mapLink: "https://maps.app.goo.gl/s21mWXAwp65UZ25u6",
    coords: "12.5887144,75.0735679",
  },
].map((outlet) => ({ ...outlet, mapEmbed: mapEmbed(outlet.coords) }));

/* "View All" - every Feraro outlet on Google Maps */
export const allOutletsLink =
  "https://www.google.com/maps/search/Feraro+Kasaragod+Kerala";
