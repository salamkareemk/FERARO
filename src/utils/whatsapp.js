import { useSyncExternalStore } from "react";

import { outlets } from "../data/outlets.js";
import { formatPrice } from "./format.js";

/*=============== WHATSAPP NUMBER ===============*/
/* Used when location is denied/unavailable, or no branch has its own number.
   Country code + number, digits only (no +, spaces or dashes) */
export const DEFAULT_WHATSAPP_NUMBER = "916282799461";

/* Kept for older imports - always the fallback number */
export const WHATSAPP_NUMBER = DEFAULT_WHATSAPP_NUMBER;

/* The branch every WhatsApp button currently points to.
   status: "idle" | "locating" | "nearest" | "default" */
let state = {
  number: DEFAULT_WHATSAPP_NUMBER,
  outlet: null,
  status: "idle",
};

const listeners = new Set();

const setState = (next) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/* Components that render WhatsApp links/numbers call this so they update
   as soon as the nearest branch is found */
export const useWhatsAppBranch = () =>
  useSyncExternalStore(subscribe, () => state, () => state);

export const getWhatsAppNumber = () => state.number;

/* +91 62827 99461 */
export const formatPhone = (number) =>
  `+${number.slice(0, 2)} ${number.slice(2, 7)} ${number.slice(7)}`;

export const whatsappLink = (message, number = state.number) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/*=============== NEAREST BRANCH ===============*/
/* Straight-line distance in km between two lat/lng points (haversine) */
const distanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* Nearest outlet that has its own WhatsApp number, or null */
export const findNearestOutlet = (latitude, longitude) => {
  let nearest = null;

  for (const outlet of outlets) {
    if (!outlet.whatsapp) continue;

    const [lat, lng] = outlet.coords.split(",").map(Number);
    const distance = distanceKm(latitude, longitude, lat, lng);

    if (!nearest || distance < nearest.distance) {
      nearest = { ...outlet, distance };
    }
  }

  return nearest;
};

const fallBackToDefault = () =>
  setState({ number: DEFAULT_WHATSAPP_NUMBER, outlet: null, status: "default" });

/* Asks for location once per page load and switches every WhatsApp button
   to the nearest branch. Geolocation only works on https (and localhost). */
export const locateNearestBranch = () => {
  if (state.status !== "idle") return;

  if (
    typeof navigator === "undefined" ||
    !navigator.geolocation ||
    !window.isSecureContext ||
    !outlets.some((outlet) => outlet.whatsapp)
  ) {
    fallBackToDefault();
    return;
  }

  setState({ status: "locating" });

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const outlet = findNearestOutlet(coords.latitude, coords.longitude);

      if (!outlet) {
        fallBackToDefault();
        return;
      }

      setState({ number: outlet.whatsapp, outlet, status: "nearest" });
    },
    /* Denied, timed out or position unavailable */
    fallBackToDefault,
    {
      enableHighAccuracy: false, // town-level is enough, and faster on phones
      timeout: 15000,
      maximumAge: 30 * 60 * 1000, // reuse a fix from the last 30 minutes
    },
  );
};

/*=============== WHATSAPP MESSAGES ===============*/
const orderMessage = (product, quantity = 1) =>
  [
    `Hello! I'd like to buy this cake:`,
    ``,
    `*${product.name}*`,
    `Quantity: ${quantity}`,
    product.price != null ? `Price: ${formatPrice(product.price * quantity)}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

/* Gallery cakes have no fixed price - ask about the selected design instead */
const enquiryMessage = (cake) =>
  [
    `Hello! I'd like to order this cake from your gallery:`,
    ``,
    `*${cake.name}*`,
    cake.occasion ? `Occasion: ${cake.occasion}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

/*=============== OUTLET PICKER ===============*/
/* Every Buy button asks the customer which outlet to order from first.
   The picker (components/modals/OutletPicker.jsx) reads this request. */
let pickerRequest = null; // { cake, message } | null
const pickerListeners = new Set();

const setPickerRequest = (next) => {
  pickerRequest = next;
  pickerListeners.forEach((listener) => listener());
};

export const useOutletPicker = () =>
  useSyncExternalStore(
    (listener) => {
      pickerListeners.add(listener);
      return () => pickerListeners.delete(listener);
    },
    () => pickerRequest,
    () => pickerRequest,
  );

export const closeOutletPicker = () => setPickerRequest(null);

/* Opens WhatsApp for the chosen outlet, naming it in the message */
export const orderFromOutlet = (outlet) => {
  if (!pickerRequest) return;

  const number = outlet.whatsapp ?? DEFAULT_WHATSAPP_NUMBER;
  const message = `${pickerRequest.message}\n\nOutlet: ${outlet.name}`;

  window.open(whatsappLink(message, number), "_blank", "noopener,noreferrer");
  closeOutletPicker();
};

/* Product cards, quick view, favourites */
export const openWhatsAppOrder = (product, quantity = 1) =>
  setPickerRequest({ cake: product, message: orderMessage(product, quantity) });

/* Gallery cards and lightbox */
export const openWhatsAppEnquiry = (cake) =>
  setPickerRequest({ cake, message: enquiryMessage(cake) });
