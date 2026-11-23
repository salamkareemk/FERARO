import { useFavorites } from "../../context/FavoritesContext.jsx";
import { formatPrice } from "../../utils/format.js";
import { openWhatsAppOrder } from "../../utils/whatsapp.js";

/*=============== PRODUCT CARD ===============*/
const ProductCard = ({ product, onQuickView }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(product.id);

  return (
    <article className="menu_card">
      {/* Long-dash rounded border, drawn with SVG so the dashes are long */}
      <svg className="menu_card-frame" aria-hidden="true">
        <rect />
      </svg>

      <button
        type="button"
        className={`menu_card-favorite ${saved ? "is-favorite" : ""}`}
        aria-label={saved ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
        aria-pressed={saved}
        onClick={() => toggleFavorite(product)}
      >
        <i className={saved ? "ri-heart-fill" : "ri-heart-line"}></i>
      </button>

      <button
        type="button"
        className="menu_card-image"
        aria-label={`Quick view ${product.name}`}
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          style={product.zoom ? { "--zoom": product.zoom } : undefined}
        />
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
