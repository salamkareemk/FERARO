import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollUp from "./components/layout/ScrollUp.jsx";
import ScrollManager from "./components/layout/ScrollManager.jsx";

import HomePage from "./pages/HomePage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";

import CartDrawer from "./components/cart/CartDrawer.jsx";
import QuickView from "./components/modals/QuickView.jsx";
import Checkout from "./components/modals/Checkout.jsx";
import OrderConfirmation from "./components/modals/OrderConfirmation.jsx";

import ToastContainer from "./components/ui/ToastContainer.jsx";
import Confetti from "./components/ui/Confetti.jsx";

import { useCart } from "./context/CartContext.jsx";
import { useToast } from "./context/ToastContext.jsx";
import { getProductById } from "./data/products.js";
import { useScrollReveal } from "./hooks/useScrollReveal.js";
import { useSmoothScroll } from "./hooks/useSmoothScroll.js";

const App = () => {
  const { cart } = useCart();
  const { showToast } = useToast();
  const { pathname } = useLocation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* Keep the last product / order so content stays visible while closing */
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  /* Lock page scroll while any overlay is open */
  const isOverlayOpen =
    isCartOpen || isCheckoutOpen || isQuickViewOpen || isConfirmationOpen;

  useScrollReveal(pathname);
  useSmoothScroll(isOverlayOpen);

  useEffect(() => {
    document.body.classList.toggle("cart-open", isOverlayOpen);
  }, [isOverlayOpen]);

  /*=============== HANDLERS ===============*/
  const openQuickView = (productId) => {
    const product = getProductById(productId);

    if (!product) return;

    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      showToast(
        "Cart is Empty",
        "Add some delicious cakes before checkout.",
        "ri-shopping-bag-3-line",
      );
      return;
    }

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <Header onCartOpen={() => setIsCartOpen(true)} />

      <ScrollManager />

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage onQuickView={openQuickView} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<HomePage onQuickView={openQuickView} />} />
        </Routes>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={openCheckout}
      />

      <ToastContainer />

      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderConfirmation
        order={confirmedOrder}
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
      />

      <Confetti active={isConfirmationOpen} />

      <Footer />

      <ScrollUp />
    </>
  );
};

export default App;
