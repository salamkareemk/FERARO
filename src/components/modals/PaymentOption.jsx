/*=============== PAYMENT OPTION ===============*/
const PaymentOption = ({ value, icon, title, subtitle, checked, onChange }) => {
  return (
    <label className={`payment_option ${checked ? "active" : ""}`}>
      <input
        type="radio"
        name="payment"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />

      <span className="payment_icon">
        <i className={icon}></i>
      </span>

      <span className="payment_info">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>

      <span className="payment_check">
        <i className="ri-check-line"></i>
      </span>
    </label>
  );
};

export default PaymentOption;
