import { useState } from "react";

import CheckoutField from "./CheckoutField.jsx";
import PaymentOption from "./PaymentOption.jsx";
import OrderSummary from "./OrderSummary.jsx";

import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { createOrder } from "../../utils/orders.js";
import { hasErrors, validateCheckoutForm } from "../../utils/validation.js";

const emptyForm = { name: "", email: "", phone: "", city: "", address: "" };
const emptyErrors = { name: "", email: "", phone: "", city: "", address: "" };

const fields = [
  {
    name: "name",
    label: "Full Name",
    icon: "ri-user-line",
    type: "text",
    placeholder: "Enter your full name",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email Address",
    icon: "ri-mail-line",
    type: "email",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    icon: "ri-phone-line",
    type: "tel",
    placeholder: "Enter your phone number",
    autoComplete: "tel",
  },
  {
    name: "city",
    label: "City",
    icon: "ri-map-pin-line",
    type: "text",
    placeholder: "Enter your city",
    autoComplete: "address-level2",
  },
  {
    name: "address",
    label: "Delivery Address",
    icon: "ri-home-4-line",
    multiline: true,
    placeholder: "Enter your complete delivery address",
    autoComplete: "street-address",
  },
];

const paymentOptions = [
  {
    value: "cod",
    icon: "ri-hand-coin-line",
    title: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
  },
  {
    value: "card",
    icon: "ri-bank-card-line",
    title: "Card Payment",
    subtitle: "Secure online payment",
  },
];

/*=============== CHECKOUT ===============*/
const Checkout = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors(emptyErrors);
    setPaymentMethod("cod");
  };

  /*=============== PLACE ORDER ===============*/
  const handlePlaceOrder = () => {
    const nextErrors = validateCheckoutForm(form);

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      showToast(
        "Check Your Details",
        "Please fix the highlighted fields.",
        "ri-error-warning-line",
      );
      return;
    }

    if (cart.length === 0) {
      showToast(
        "Cart is Empty",
        "Add some delicious cakes before placing your order.",
        "ri-shopping-bag-3-line",
      );
      return;
    }

    const order = createOrder({ cart, subtotal, form, paymentMethod });

    clearCart({ silent: true });
    resetForm();
    onOrderPlaced(order);

    showToast(
      "Order Placed",
      `Your order ${order.orderId} has been placed successfully.`,
      "ri-checkbox-circle-line",
    );
  };

  return (
    <div
      className={`checkout_overlay ${isOpen ? "show-checkout" : ""}`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className="checkout_modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* Checkout Header */}
        <div className="checkout_header">
          <div>
            <span className="checkout_subtitle">FERARO</span>
            <h2 className="checkout_title" id="checkout-title">
              Checkout
            </h2>
          </div>

          <button
            className="checkout_close"
            type="button"
            aria-label="Close checkout"
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Checkout Content */}
        <div className="checkout_content">
          {/*==================== CUSTOMER DETAILS ====================*/}
          <section className="checkout_section">
            <div className="checkout_section_title">
              <i className="ri-user-3-line"></i>

              <div>
                <h3>Customer Details</h3>
                <p>Enter your information to complete your order.</p>
              </div>
            </div>

            <div className="checkout_form">
              {fields.map((field) => (
                <CheckoutField
                  key={field.name}
                  {...field}
                  value={form[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/*==================== PAYMENT ====================*/}
          <section className="checkout_section">
            <div className="checkout_section_title">
              <i className="ri-bank-card-line"></i>

              <div>
                <h3>Payment Method</h3>
                <p>Choose how you&apos;d like to pay.</p>
              </div>
            </div>

            <div className="checkout_payment">
              {paymentOptions.map((option) => (
                <PaymentOption
                  key={option.value}
                  {...option}
                  checked={paymentMethod === option.value}
                  onChange={setPaymentMethod}
                />
              ))}
            </div>
          </section>

          {/*==================== ORDER SUMMARY ====================*/}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
