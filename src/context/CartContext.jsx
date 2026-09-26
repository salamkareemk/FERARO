import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getProductById } from "../data/products.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage.js";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext(null);

/*=============== CART PROVIDER ===============*/
export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState(() => readJSON(STORAGE_KEYS.cart, []));

  /* Save cart */
  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, cart);
  }, [cart]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce((total, item) => {
    const product = getProductById(item.id);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);

  const notifyRemoved = (productId) => {
    const product = getProductById(productId);

    if (product) {
      showToast(
        "Item Removed",
        `${product.name} removed from your cart.`,
        "ri-delete-bin-line",
      );
    }
  };

  /*=============== ADD TO CART ===============*/
  const addToCart = (productId, quantity = 1) => {
    const product = getProductById(productId);

    if (!product) return null;

    setCart((current) => {
      const existing = current.find((item) => item.id === productId);

      if (existing) {
        return current.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, { id: product.id, quantity }];
    });

    return product;
  };

  /*=============== CHANGE QUANTITY ===============*/
  const changeQuantity = (productId, change) => {
    const item = cart.find((cartItem) => cartItem.id === productId);

    if (!item) return;

    if (item.quantity + change <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((current) =>
      current.map((cartItem) =>
        cartItem.id === productId
          ? { ...cartItem, quantity: cartItem.quantity + change }
          : cartItem,
      ),
    );
  };

  /*=============== REMOVE FROM CART ===============*/
  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
    notifyRemoved(productId);
  };

  /*=============== CLEAR CART ===============*/
  const clearCart = ({ silent = false } = {}) => {
    if (cart.length === 0) return;

    setCart([]);

    if (!silent) {
      showToast(
        "Cart Cleared",
        "All items have been removed from your cart.",
        "ri-delete-bin-line",
      );
    }
  };

  const value = useMemo(
    () => ({
      cart,
      totalItems,
      subtotal,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
