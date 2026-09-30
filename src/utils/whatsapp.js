import { formatPrice } from "./format.js";

/*=============== WHATSAPP ORDER ===============*/
/* Shop's WhatsApp number: country code + number, digits only (no +, spaces or dashes) */
export const WHATSAPP_NUMBER = "916282799461";

/* WhatsApp links can't carry file attachments, so the cake photo is sent as
   its public URL - WhatsApp shows it as an image preview in the chat */
export const buildWhatsAppOrderLink = (product, quantity = 1) => {
  const imageUrl = new URL(product.image, window.location.origin).href;

  const message = [
    `Hello! I'd like to buy this cake:`,
    ``,
    `*${product.name}*`,
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(product.price * quantity)}`,
    ``,
    `Photo: ${imageUrl}`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const openWhatsAppOrder = (product, quantity = 1) => {
  window.open(
    buildWhatsAppOrderLink(product, quantity),
    "_blank",
    "noopener,noreferrer",
  );
};
