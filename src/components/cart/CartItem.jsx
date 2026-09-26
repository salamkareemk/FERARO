import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../utils/format.js";

/*=============== CART ITEM ===============*/
const CartItem = ({ product, quantity }) => {
  const { changeQuantity, removeFromCart } = useCart();

  return (
    <article className="cart_item">
      <img src={product.image} alt={product.name} className="cart_item_image" />

      <div className="cart_item_data">
        <h3 className="cart_item_name">{product.name}</h3>

        <p className="cart_item_price">{formatPrice(product.price)}</p>

        <div className="cart_quantity">
          <button
            type="button"
            className="quantity_minus"
            aria-label="Decrease quantity"
            onClick={() => changeQuantity(product.id, -1)}
          >
            <i className="ri-subtract-line"></i>
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            className="quantity_plus"
            aria-label="Increase quantity"
            onClick={() => changeQuantity(product.id, 1)}
          >
            <i className="ri-add-line"></i>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="cart_remove"
        aria-label={`Remove ${product.name}`}
        onClick={() => removeFromCart(product.id)}
      >
        <i className="ri-delete-bin-line"></i>
      </button>
    </article>
  );
};

export default CartItem;
