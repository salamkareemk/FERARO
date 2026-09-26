import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPrice } from "../../utils/format.js";

/*=============== PRODUCT CARD ===============*/
const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    const added = addToCart(product.id);

    if (!added) return;

    showToast(
      "Added to Cart",
      `${added.name} added to your cart.`,
      "ri-shopping-bag-3-line",
    );
  };

  return (
    <article className="menu_card">
      {/* Long-dash rounded border, drawn with SVG so the dashes are long */}
      <svg className="menu_card-frame" aria-hidden="true">
        <rect />
      </svg>

      <button
        type="button"
        className="menu_card-image"
        aria-label={`Quick view ${product.name}`}
        onClick={() => onQuickView(product.id)}
      >
        <img src={product.image} alt={product.name} />
      </button>

      <h3 className="menu_card-name">{product.name}</h3>

      <p className="menu_card-description">{product.description}</p>

      <p className="menu_card-price">{formatPrice(product.price)}</p>

      <button
        type="button"
        className="menu_card-add"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </article>
  );
};

export default ProductCard;
