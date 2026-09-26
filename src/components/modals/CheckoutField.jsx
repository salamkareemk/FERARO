/*=============== CHECKOUT FIELD ===============*/
const CheckoutField = ({
  name,
  label,
  icon,
  type = "text",
  multiline = false,
  placeholder,
  autoComplete,
  value,
  error,
  onChange,
}) => {
  const id = `checkout-${name}`;

  const inputProps = {
    id,
    name,
    placeholder,
    autoComplete,
    value,
    onChange,
    "aria-invalid": Boolean(error),
  };

  return (
    <div
      className={`checkout_field ${multiline ? "checkout_field_full" : ""}`}
    >
      <label htmlFor={id}>{label}</label>

      <div
        className={[
          "checkout_input",
          multiline && "checkout_textarea",
          error && "checkout_input_error",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <i className={icon}></i>

        {multiline ? (
          <textarea rows="3" {...inputProps}></textarea>
        ) : (
          <input type={type} {...inputProps} />
        )}
      </div>

      <small className="checkout_error">{error}</small>
    </div>
  );
};

export default CheckoutField;
