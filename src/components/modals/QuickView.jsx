import { useEffect, useState } from "react";

import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPrice } from "../../utils/format.js";

/*=============== QUICK VIEW MODAL ===============*/
const QuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  /* Reset quantity every time the modal opens */
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  const handleAdd = () => {
    if (!product) return;

    const added = addToCart(product.id, quantity);

    if (!added) return;

    showToast(
      "Added to Cart",
      `${added.name} × ${quantity} added to your cart.`,
      "ri-shopping-bag-3-line",
    );

    onClose();
  };

  return (
    <div
      className={`quick_view_overlay ${isOpen ? "show-modal" : ""}`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="quick_view_modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-name"
      >
        <button
          className="quick_view_close"
          type="button"
          aria-label="Close quick view"
          onClick={onClose}
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="quick_view_images">
          {product && (
            <img
              src={product.image}
              alt={product.name}
              className="quick_view_img"
            />
          )}
        </div>

        <div className="quick_view_data">
          <span className="quick_view_category">{product?.category}</span>

          <h2 className="quick_view_name" id="quick-view-name">
            {product?.name}
          </h2>

          <p className="quick_view_description">
            {product?.description ??
              "Freshly prepared with premium ingredients and crafted with care."}
          </p>

          <p className="quick_view_price">
            {product && formatPrice(product.price)}
          </p>

          <div className="quick_view_actions">
            <div className="quick_view_quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
              >
                <i className="ri-subtract-line"></i>
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((qty) => qty + 1)}
              >
                <i className="ri-add-line"></i>
              </button>
            </div>

            <button className="quick_view_add" type="button" onClick={handleAdd}>
              Add to Cart
              <i className="ri-shopping-bag-3-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
