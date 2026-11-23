import { useFavorites } from "../../context/FavoritesContext.jsx";
import { formatPrice } from "../../utils/format.js";
import { openWhatsAppOrder } from "../../utils/whatsapp.js";

/*=============== FAVOURITES DRAWER ===============*/
/* Same slide-in panel as the cart (reuses the .cart_* styles) */
const FavoritesDrawer = ({ isOpen, onClose }) => {
  const { favorites, toggleFavorite } = useFavorites();

  const showClass = isOpen ? "show-cart" : "";

  return (
    <>
      <div className={`cart_overlay ${showClass}`} onClick={onClose}></div>

      <aside className={`cart_drawer ${showClass}`} aria-label="Favourites">
        <div className="cart_header">
          <h2 className="cart_title">Your Favourites</h2>

          <button
            className="cart_close"
            aria-label="Close favourites"
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="cart_content">
          {favorites.length === 0 ? (
            <div className="cart_empty">
              <i className="ri-heart-line"></i>
              <h3>No favourites yet</h3>
              <p>Tap the heart on any cake to save it here.</p>
            </div>
          ) : (
            favorites.map((product) => (
              <article className="cart_item" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart_item_image"
                />

                <div className="cart_item_data">
                  <h3 className="cart_item_name">{product.name}</h3>

                  {product.price != null && (
                    <p className="cart_item_price">{formatPrice(product.price)}</p>
                  )}

                  <button
                    type="button"
                    className="favorite_buy"
                    onClick={() => openWhatsAppOrder(product)}
                  >
                    Buy
                  </button>
                </div>

                <button
                  type="button"
                  className="cart_remove"
                  aria-label={`Remove ${product.name} from favourites`}
                  onClick={() => toggleFavorite(product)}
                >
                  <i className="ri-heart-fill"></i>
                </button>
              </article>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default FavoritesDrawer;
