import { formatPrice } from "../../utils/format.js";

/*=============== ORDER CONFIRMATION ===============*/
const OrderConfirmation = ({ order, isOpen, onClose }) => {
  const totalItems =
    order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const details = order
    ? [
        {
          icon: "ri-shopping-bag-3-line",
          label: "Items",
          value: `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`,
        },
        {
          icon: "ri-bank-card-line",
          label: "Payment",
          value:
            order.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment",
        },
        {
          icon: "ri-money-dollar-circle-line",
          label: "Total",
          value: formatPrice(order.total),
        },
      ]
    : [];

  return (
    <div
      className={`confirmation_overlay ${isOpen ? "show-confirmation" : ""}`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="confirmation_modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        {/* Close */}
        <button
          className="confirmation_close"
          type="button"
          aria-label="Close order confirmation"
          onClick={onClose}
        >
          <i className="ri-close-line"></i>
        </button>

        {/* Success Icon */}
        <div className="confirmation_icon">
          <i className="ri-check-line"></i>
        </div>

        {/* Heading */}
        <span className="confirmation_subtitle">Thank You!</span>

        <h2 className="confirmation_title" id="confirmation-title">
          Order Confirmed
        </h2>

        <p className="confirmation_message">
          Your delicious order has been successfully placed. We&apos;ll prepare
          it with love and care.
        </p>

        {/* Order ID */}
        <div className="confirmation_order_id">
          <span>Order ID</span>
          <strong>{order?.orderId ?? "—"}</strong>
        </div>

        {/* Customer */}
        <div className="confirmation_customer">
          <div className="confirmation_customer_icon">
            <i className="ri-user-3-line"></i>
          </div>

          <div>
            <span>Customer</span>
            <strong>{order?.customer.name ?? "—"}</strong>
          </div>
        </div>

        {/* Order Details */}
        <div className="confirmation_details">
          {details.map(({ icon, label, value }) => (
            <div className="confirmation_detail" key={label}>
              <div className="confirmation_detail_icon">
                <i className={icon}></i>
              </div>

              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="confirmation_address">
          <div className="confirmation_address_icon">
            <i className="ri-map-pin-line"></i>
          </div>

          <div>
            <span>Delivery Address</span>
            <p>
              {order
                ? `${order.customer.address}, ${order.customer.city}`
                : "—"}
            </p>
          </div>
        </div>

        {/* Continue */}
        <button className="confirmation_button" type="button" onClick={onClose}>
          Continue Shopping
          <i className="ri-arrow-right-line"></i>
        </button>

        <p className="confirmation_secure">
          <i className="ri-shield-check-line"></i>
          Order saved securely on this device
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
