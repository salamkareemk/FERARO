import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage.js";
import { useToast } from "./ToastContext.jsx";

const FavoritesContext = createContext(null);

/*=============== FAVOURITES PROVIDER ===============*/
/* Stores a small snapshot of each cake (not just its id), so favourites
   still show correctly for cakes that come from the admin dashboard */
export const FavoritesProvider = ({ children }) => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(() =>
    readJSON(STORAGE_KEYS.favorites, []),
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      setFavorites((current) => current.filter((item) => item.id !== product.id));
      showToast(
        "Removed from Favourites",
        `${product.name} removed from your favourites.`,
        "ri-heart-line",
      );
      return;
    }

    const { id, name, image, price, description } = product;

    setFavorites((current) => [...current, { id, name, image, price, description }]);
    showToast(
      "Added to Favourites",
      `${product.name} saved to your favourites.`,
      "ri-heart-fill",
    );
  };

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
