/*=============== LOCAL STORAGE KEYS ===============*/
export const STORAGE_KEYS = {
  cart: "delizia-cart",
  lastOrder: "delizia-last-order",
  orders: "delizia-orders",
};

export const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked - the app keeps working in memory
  }
};
