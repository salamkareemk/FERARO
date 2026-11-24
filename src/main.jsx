import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

/*=============== VENDOR CSS ===============*/
import "remixicon/fonts/remixicon.css";
import "swiper/css/bundle";

/*=============== CSS ===============*/
import "./styles/styles.css";

import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CakesProvider } from "./context/CakesContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CakesProvider>
          <CartProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </CartProvider>
        </CakesProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
