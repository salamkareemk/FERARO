import { formatPrice } from "../../utils/format.js";
import { openWhatsAppOrder } from "../../utils/whatsapp.js";

/*=============== PRODUCT CARD ===============*/
const ProductCard = ({ product, onQuickView }) => {
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
        onClick={() => onQuickView(product)}
      >
        <img src={product.image} alt={product.name} />
      </button>

      <h3 className="menu_card-name">{product.name}</h3>

      <p className="menu_card-description">{product.description}</p>

      <p className="menu_card-price">{formatPrice(product.price)}</p>

      <button
        type="button"
        className="menu_card-add"
        onClick={() => openWhatsAppOrder(product)}
      >
        Buy
      </button>
    </article>
  );
};

export default ProductCard;
