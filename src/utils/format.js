/* Indian rupees, whole amounts with Indian digit grouping: ₹1,300 / ₹1,00,000 */
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => rupees.format(value);
