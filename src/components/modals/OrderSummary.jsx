import { getProductById } from "../../data/products.js";
import { formatPrice } from "../../utils/format.js";
import { DELIVERY_FEE } from "../../utils/orders.js";

/*=============== ORDER SUMMARY ===============*/
const OrderSummary = ({ cart, subtotal, onPlaceOrder }) => {
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <aside className="checkout_summary">
      <div className="checkout_summary_header">
        <div>
          <span>Your Cart</span>
          <h3>Order Summary</h3>
        </div>

        <i className="ri-shopping-bag-3-line"></i>
      </div>

      {/* Checkout Items */}
      <div className="checkout_items">
        {cart.length === 0 ? (
          <div className="checkout_empty">
            <i className="ri-shopping-bag-3-line"></i>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          cart.map((item) => {
            const product = getProductById(item.id);

            if (!product) return null;

            return (
              <article className="checkout_item" key={item.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="checkout_item_image"
                />

                <div className="checkout_item_data">
                  <h4 className="checkout_item_name">{product.name}</h4>
                  <p className="checkout_item_meta">Qty: {item.quantity}</p>
                </div>

                <strong className="checkout_item_price">
                  {formatPrice(product.price * item.quantity)}
                </strong>
              </article>
            );
          })
        )}
      </div>

      {/* Order Totals */}
      <div className="checkout_totals">
        <div className="checkout_total_row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>

        <div className="checkout_total_row">
          <span>Delivery Fee</span>
          <strong>{formatPrice(deliveryFee)}</strong>
        </div>

        <div className="checkout_divider"></div>

        <div className="checkout_total_row checkout_grand_total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>

      {/* Place Order */}
      <button
        className="checkout_place_order"
        type="button"
        onClick={onPlaceOrder}
      >
        <span>Place Order</span>
        <i className="ri-arrow-right-line"></i>
      </button>

      <p className="checkout_secure">
        <i className="ri-shield-check-line"></i>
        Secure checkout
      </p>
    </aside>
  );
};

export default OrderSummary;
