import CartItem from "./CartItem.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { getProductById } from "../../data/products.js";
import { formatPrice } from "../../utils/format.js";

/*=============== CART DRAWER ===============*/
const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { cart, subtotal, clearCart } = useCart();

  const showClass = isOpen ? "show-cart" : "";

  return (
    <>
      <div className={`cart_overlay ${showClass}`} onClick={onClose}></div>

      <aside className={`cart_drawer ${showClass}`}>
        <div className="cart_header">
          <h2 className="cart_title">Your Cart</h2>

          <button
            className="cart_close"
            aria-label="Close shopping cart"
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="cart_content">
          {cart.length === 0 ? (
            <div className="cart_empty">
              <i className="ri-shopping-bag-3-line"></i>
              <h3>Your cart is empty</h3>
              <p>Add some delicious cakes to your cart!</p>
            </div>
          ) : (
            cart.map((item) => {
              const product = getProductById(item.id);

              if (!product) return null;

              return (
                <CartItem
                  key={item.id}
                  product={product}
                  quantity={item.quantity}
                />
              );
            })
          )}
        </div>

        <div className="cart_footer">
          <div className="cart_total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <button className="cart_checkout" onClick={onCheckout}>
            Checkout
            <i className="ri-arrow-right-line"></i>
          </button>

          <button
            className="cart_clear"
            disabled={cart.length === 0}
            onClick={() => clearCart()}
          >
            <i className="ri-delete-bin-line"></i>
            Clear Cart
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
