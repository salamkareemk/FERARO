import { getProductById } from "../data/products.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage.js";

export const DELIVERY_FEE = 5;

/*=============== CREATE ORDER ===============*/
export const createOrder = ({ cart, subtotal, form, paymentMethod }) => {
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;

  const order = {
    orderId: `DLZ-${Date.now().toString().slice(-8)}`,

    customer: {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
    },

    paymentMethod,

    items: cart
      .map((item) => {
        const product = getProductById(item.id);

        if (!product) return null;

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
        };
      })
      .filter(Boolean),

    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,

    status: "Order Placed",
    createdAt: new Date().toISOString(),
  };

  /* Save latest order + order history */
  writeJSON(STORAGE_KEYS.lastOrder, order);
  writeJSON(STORAGE_KEYS.orders, [
    ...readJSON(STORAGE_KEYS.orders, []),
    order,
  ]);

  return order;
};
