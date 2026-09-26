/*=============== CHECKOUT VALIDATION ===============*/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

const validators = {
  name: (value) => {
    if (!value) return "Please enter your full name.";
    if (value.length < 3) return "Name must be at least 3 characters.";
    return "";
  },

  email: (value) => {
    if (!value) return "Please enter your email address.";
    if (!emailPattern.test(value)) return "Please enter a valid email address.";
    return "";
  },

  phone: (value) => {
    if (!value) return "Please enter your phone number.";
    if (!phonePattern.test(value)) return "Please enter a valid phone number.";
    return "";
  },

  city: (value) => {
    if (!value) return "Please enter your city.";
    if (value.length < 2) return "Please enter a valid city.";
    return "";
  },

  address: (value) => {
    if (!value) return "Please enter your delivery address.";
    if (value.length < 10) return "Please enter your complete address.";
    return "";
  },
};

/* Returns an object of field -> error message ("" when valid) */
export const validateCheckoutForm = (form) => {
  return Object.fromEntries(
    Object.entries(validators).map(([field, validate]) => [
      field,
      validate(form[field].trim()),
    ]),
  );
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
