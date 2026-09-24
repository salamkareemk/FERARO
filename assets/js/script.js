/*=============== PRODUCT DATA ===============*/
const products = [
  // Strawberry
  {
    id: "strawberry-1",
    name: "Strawberry Shortcake",
    price: 9.99,
    category: "Strawberry",
    image: "./assets/img/product-strawberry-1.png",
  },
  {
    id: "strawberry-2",
    name: "Fresh Strawberry Cream",
    price: 11.99,
    category: "Strawberry",
    image: "./assets/img/product-strawberry-2.png",
  },
  {
    id: "strawberry-3",
    name: "Strawberry Delight Cake",
    price: 12.99,
    category: "Strawberry",
    image: "./assets/img/product-strawberry-3.png",
  },

  // Vanilla
  {
    id: "vanilla-1",
    name: "Classic Vanilla Bean Cake",
    price: 15.99,
    category: "Vanilla",
    image: "./assets/img/product-vanilla-1.png",
  },
  {
    id: "vanilla-2",
    name: "Vanilla Buttercream Cake",
    price: 13.99,
    category: "Vanilla",
    image: "./assets/img/product-vanilla-2.png",
  },
  {
    id: "vanilla-3",
    name: "Soft Vanilla Sponge Cake",
    price: 10.99,
    category: "Vanilla",
    image: "./assets/img/product-vanilla-3.png",
  },

  // Chocolate
  {
    id: "chocolate-1",
    name: "Chocolate Fudge Cake",
    price: 17.99,
    category: "Chocolate",
    image: "./assets/img/product-chocolate-1.png",
  },
  {
    id: "chocolate-2",
    name: "Dark Chocolate Velvet Cake",
    price: 18.99,
    category: "Chocolate",
    image: "./assets/img/product-chocolate-2.png",
  },
  {
    id: "chocolate-3",
    name: "Triple Chocolate Cake",
    price: 20.99,
    category: "Chocolate",
    image: "./assets/img/product-chocolate-3.png",
  },

  // Dried Fruit
  {
    id: "dried-fruit-1",
    name: "Peanut And Banana Cake",
    price: 19.99,
    category: "Dried fruit",
    image: "./assets/img/product-dried-fruit-1.png",
  },
  {
    id: "dried-fruit-2",
    name: "Filled Walnut Cake",
    price: 14.99,
    category: "Dried fruit",
    image: "./assets/img/product-dried-fruit-2.png",
  },
  {
    id: "dried-fruit-3",
    name: "Glazed Pecan Cake",
    price: 17.99,
    category: "Dried fruit",
    image: "./assets/img/product-dried-fruit-3.png",
  },

  // Others
  {
    id: "others-1",
    name: "Chocolate Brownie",
    price: 7.99,
    category: "Others",
    image: "./assets/img/product-others-1.png",
  },
  {
    id: "others-2",
    name: "Cream Cupcake",
    price: 9.99,
    category: "Others",
    image: "./assets/img/product-others-2.png",
  },
  {
    id: "others-3",
    name: "Lemon Cake",
    price: 11.99,
    category: "Others",
    image: "./assets/img/product-others-3.png",
  },
];

/*=============== PRODUCT HELPERS ===============*/

const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

const getCartSubtotal = () => {
  return cart.reduce((total, item) => {
    const product = getProductById(item.id);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
};

/*=============== CART ELEMENTS ===============*/

const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartContent = document.getElementById("cart-content");
const cartTotal = document.getElementById("cart-total");
const cartClear = document.getElementById("cart-clear");
const cartCheckout = document.getElementById("cart-checkout");

/*=============== TOAST ===============*/

const toastContainer = document.getElementById("toast-container");

const showToast = (title, message, icon = "ri-check-line") => {
  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = `
    <div class="toast_icon">
      <i class="${icon}"></i>
    </div>

    <div class="toast_content">
      <h3 class="toast_title">${title}</h3>
      <p class="toast_message">${message}</p>
    </div>

    <button
      class="toast_close"
      type="button"
      aria-label="Close notification"
    >
      <i class="ri-close-line"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  toast
    .querySelector(".toast_close")
    .addEventListener("click", () => toast.remove());

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

/*=============== QUICK VIEW ELEMENTS ===============*/

const quickViewOverlay = document.getElementById("quick-view-overlay");
const quickViewClose = document.getElementById("quick-view-close");
const quickViewImage = document.getElementById("quick-view-image");
const quickViewCategory = document.getElementById("quick-view-category");
const quickViewName = document.getElementById("quick-view-name");
const quickViewDescription = document.getElementById("quick-view-description");
const quickViewPrice = document.getElementById("quick-view-price");
const quickViewMinus = document.getElementById("quick-view-minus");
const quickViewPlus = document.getElementById("quick-view-plus");
const quickViewQuantity = document.getElementById("quick-view-quantity");
const quickViewAdd = document.getElementById("quick-view-add");

/*=============== QUICK VIEW STATE ===============*/

let quickViewProduct = null;
let quickViewQty = 1;

/*=============== CART STATE ===============*/

let cart = JSON.parse(localStorage.getItem("delizia-cart")) || [];

/*=============== SAVE CART ===============*/

const saveCart = () => {
  localStorage.setItem("delizia-cart", JSON.stringify(cart));
};

/*=============== CART DRAWER ===============*/

const openCart = () => {
  cartDrawer.classList.add("show-cart");
  cartOverlay.classList.add("show-cart");
  document.body.classList.add("cart-open");
};

const closeCart = () => {
  cartDrawer.classList.remove("show-cart");
  cartOverlay.classList.remove("show-cart");
  document.body.classList.remove("cart-open");
};

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/*=============== UPDATE CART COUNT ===============*/

const updateCartCount = () => {
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartCount.textContent = totalItems;

  cartCount.classList.remove("bump");

  void cartCount.offsetWidth;

  cartCount.classList.add("bump");
};

/*=============== ADD TO CART ===============*/

const addProductToCart = (productId, quantity = 1) => {
  const product = getProductById(productId);

  if (!product) return null;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      quantity,
    });
  }

  saveCart();
  updateCartCount();
  renderCart();

  return product;
};

const addToCart = (productId) => {
  const product = addProductToCart(productId);

  if (!product) return;

  openCart();

  showToast(
    "Added to Cart",
    `${product.name} added to your cart.`,
    "ri-shopping-bag-3-line",
  );
};

/*=============== CHANGE QUANTITY ===============*/

const changeQuantity = (productId, change) => {
  const item = cart.find((item) => item.id === productId);

  if (!item) return;

  const product = getProductById(productId);

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);

    saveCart();
    updateCartCount();
    renderCart();

    if (product) {
      showToast(
        "Item Removed",
        `${product.name} removed from your cart.`,
        "ri-delete-bin-line",
      );
    }

    return;
  }

  saveCart();
  updateCartCount();
  renderCart();
};

/*=============== REMOVE FROM CART ===============*/

const removeFromCart = (productId) => {
  const product = getProductById(productId);

  cart = cart.filter((item) => item.id !== productId);

  saveCart();
  updateCartCount();
  renderCart();

  if (product) {
    showToast(
      "Item Removed",
      `${product.name} removed from your cart.`,
      "ri-delete-bin-line",
    );
  }
};

/*=============== CLEAR CART ===============*/

const clearCart = () => {
  if (cart.length === 0) return;

  cart = [];

  saveCart();
  updateCartCount();
  renderCart();

  showToast(
    "Cart Cleared",
    "All items have been removed from your cart.",
    "ri-delete-bin-line",
  );
};

/*=============== RENDER CART ===============*/

const renderCart = () => {
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="cart_empty">
        <i class="ri-shopping-bag-3-line"></i>
        <h3>Your cart is empty</h3>
        <p>Add some delicious cakes to your cart!</p>
      </div>
    `;

    cartTotal.textContent = "$0.00";
    cartClear.disabled = true;

    return;
  }

  cartClear.disabled = false;

  cartContent.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.id);

      if (!product) return "";

      return `
        <article class="cart_item">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="cart_item_image"
          />

          <div class="cart_item_data">
            <h3 class="cart_item_name">${product.name}</h3>

            <p class="cart_item_price">
              $${product.price.toFixed(2)}
            </p>

            <div class="cart_quantity">
              <button
                type="button"
                class="quantity_minus"
                data-id="${product.id}"
                aria-label="Decrease quantity"
              >
                <i class="ri-subtract-line"></i>
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                class="quantity_plus"
                data-id="${product.id}"
                aria-label="Increase quantity"
              >
                <i class="ri-add-line"></i>
              </button>
            </div>
          </div>

          <button
            type="button"
            class="cart_remove"
            data-id="${product.id}"
            aria-label="Remove ${product.name}"
          >
            <i class="ri-delete-bin-line"></i>
          </button>
        </article>
      `;
    })
    .join("");

  cartTotal.textContent = `$${getCartSubtotal().toFixed(2)}`;
};

/*=============== CART ITEM ACTIONS ===============*/

cartContent.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  const productId = button.dataset.id;

  if (!productId) return;

  if (button.classList.contains("quantity_plus")) {
    changeQuantity(productId, 1);
  }

  if (button.classList.contains("quantity_minus")) {
    changeQuantity(productId, -1);
  }

  if (button.classList.contains("cart_remove")) {
    removeFromCart(productId);
  }
});

cartClear.addEventListener("click", clearCart);

/*=============== CHECKOUT ELEMENTS ===============*/

const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutClose = document.getElementById("checkout-close");
const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutDelivery = document.getElementById("checkout-delivery");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutPlaceOrder = document.getElementById("checkout-place-order");

const checkoutName = document.getElementById("checkout-name");
const checkoutEmail = document.getElementById("checkout-email");
const checkoutPhone = document.getElementById("checkout-phone");
const checkoutCity = document.getElementById("checkout-city");
const checkoutAddress = document.getElementById("checkout-address");

/*=============== CHECKOUT ERROR ELEMENTS ===============*/

const checkoutNameError = document.getElementById("checkout-name-error");
const checkoutEmailError = document.getElementById("checkout-email-error");
const checkoutPhoneError = document.getElementById("checkout-phone-error");
const checkoutCityError = document.getElementById("checkout-city-error");
const checkoutAddressError = document.getElementById("checkout-address-error");

/*=============== PAYMENT OPTIONS ===============*/

const paymentOptions = document.querySelectorAll(".payment_option");

/*=============== RENDER CHECKOUT ===============*/

const renderCheckout = () => {
  const subtotal = getCartSubtotal();
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="checkout_empty">
        <i class="ri-shopping-bag-3-line"></i>
        <p>Your cart is empty.</p>
      </div>
    `;
  } else {
    checkoutItems.innerHTML = cart
      .map((item) => {
        const product = getProductById(item.id);

        if (!product) return "";

        const itemTotal = product.price * item.quantity;

        return `
          <article class="checkout_item">
            <img
              src="${product.image}"
              alt="${product.name}"
              class="checkout_item_image"
            />

            <div class="checkout_item_data">
              <h4 class="checkout_item_name">
                ${product.name}
              </h4>

              <p class="checkout_item_meta">
                Qty: ${item.quantity}
              </p>
            </div>

            <strong class="checkout_item_price">
              $${itemTotal.toFixed(2)}
            </strong>
          </article>
        `;
      })
      .join("");
  }

  checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  checkoutDelivery.textContent = `$${deliveryFee.toFixed(2)}`;
  checkoutTotal.textContent = `$${total.toFixed(2)}`;
};

/*=============== OPEN CHECKOUT ===============*/

const openCheckout = () => {
  if (cart.length === 0) {
    showToast(
      "Cart is Empty",
      "Add some delicious cakes before checkout.",
      "ri-shopping-bag-3-line",
    );

    return;
  }

  renderCheckout();
  closeCart();

  checkoutOverlay.classList.add("show-checkout");
  document.body.classList.add("cart-open");
};

/*=============== CLOSE CHECKOUT ===============*/

const closeCheckout = () => {
  checkoutOverlay.classList.remove("show-checkout");
  document.body.classList.remove("cart-open");
};

/*=============== CHECKOUT EVENTS ===============*/

cartCheckout.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", (event) => {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

/*=============== PAYMENT EVENTS ===============*/

paymentOptions.forEach((option) => {
  const radio = option.querySelector('input[type="radio"]');

  radio.addEventListener("change", () => {
    paymentOptions.forEach((item) => {
      item.classList.remove("active");
    });

    option.classList.add("active");
  });
});

/*=============== CHECKOUT VALIDATION ===============*/

const showCheckoutError = (input, errorElement, message) => {
  input.closest(".checkout_input").classList.add("checkout_input_error");
  errorElement.textContent = message;
};

const clearCheckoutError = (input, errorElement) => {
  input.closest(".checkout_input").classList.remove("checkout_input_error");
  errorElement.textContent = "";
};

const validateCheckoutForm = () => {
  let isValid = true;

  /* Full Name */
  const name = checkoutName.value.trim();

  if (!name) {
    showCheckoutError(
      checkoutName,
      checkoutNameError,
      "Please enter your full name.",
    );
    isValid = false;
  } else if (name.length < 3) {
    showCheckoutError(
      checkoutName,
      checkoutNameError,
      "Name must be at least 3 characters.",
    );
    isValid = false;
  } else {
    clearCheckoutError(checkoutName, checkoutNameError);
  }

  /* Email */
  const email = checkoutEmail.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showCheckoutError(
      checkoutEmail,
      checkoutEmailError,
      "Please enter your email address.",
    );
    isValid = false;
  } else if (!emailPattern.test(email)) {
    showCheckoutError(
      checkoutEmail,
      checkoutEmailError,
      "Please enter a valid email address.",
    );
    isValid = false;
  } else {
    clearCheckoutError(checkoutEmail, checkoutEmailError);
  }

  /* Phone */
  const phone = checkoutPhone.value.trim();
  const phonePattern = /^[0-9+\-\s()]{7,20}$/;

  if (!phone) {
    showCheckoutError(
      checkoutPhone,
      checkoutPhoneError,
      "Please enter your phone number.",
    );
    isValid = false;
  } else if (!phonePattern.test(phone)) {
    showCheckoutError(
      checkoutPhone,
      checkoutPhoneError,
      "Please enter a valid phone number.",
    );
    isValid = false;
  } else {
    clearCheckoutError(checkoutPhone, checkoutPhoneError);
  }

  /* City */
  const city = checkoutCity.value.trim();

  if (!city) {
    showCheckoutError(
      checkoutCity,
      checkoutCityError,
      "Please enter your city.",
    );
    isValid = false;
  } else if (city.length < 2) {
    showCheckoutError(
      checkoutCity,
      checkoutCityError,
      "Please enter a valid city.",
    );
    isValid = false;
  } else {
    clearCheckoutError(checkoutCity, checkoutCityError);
  }

  /* Address */
  const address = checkoutAddress.value.trim();

  if (!address) {
    showCheckoutError(
      checkoutAddress,
      checkoutAddressError,
      "Please enter your delivery address.",
    );
    isValid = false;
  } else if (address.length < 10) {
    showCheckoutError(
      checkoutAddress,
      checkoutAddressError,
      "Please enter your complete address.",
    );
    isValid = false;
  } else {
    clearCheckoutError(checkoutAddress, checkoutAddressError);
  }

  return isValid;
};

/*=============== CLEAR CHECKOUT FORM ===============*/

const clearCheckoutForm = () => {
  checkoutName.value = "";
  checkoutEmail.value = "";
  checkoutPhone.value = "";
  checkoutCity.value = "";
  checkoutAddress.value = "";

  const fields = [
    [checkoutName, checkoutNameError],
    [checkoutEmail, checkoutEmailError],
    [checkoutPhone, checkoutPhoneError],
    [checkoutCity, checkoutCityError],
    [checkoutAddress, checkoutAddressError],
  ];

  fields.forEach(([input, error]) => {
    clearCheckoutError(input, error);
  });

  const codOption = document.querySelector(
    '.payment_option input[value="cod"]',
  );

  if (codOption) {
    codOption.checked = true;

    paymentOptions.forEach((option) => {
      option.classList.remove("active");
    });

    codOption.closest(".payment_option").classList.add("active");
  }
};

/*=============== CREATE ORDER ===============*/

const createOrder = () => {
  if (cart.length === 0) {
    showToast(
      "Cart is Empty",
      "Add some delicious cakes before placing your order.",
      "ri-shopping-bag-3-line",
    );

    return;
  }

  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked',
  );

  const subtotal = getCartSubtotal();
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;
  const orderId = `DLZ-${Date.now().toString().slice(-8)}`;

  const order = {
    orderId,

    customer: {
      name: checkoutName.value.trim(),
      email: checkoutEmail.value.trim(),
      phone: checkoutPhone.value.trim(),
      city: checkoutCity.value.trim(),
      address: checkoutAddress.value.trim(),
    },

    paymentMethod: selectedPayment ? selectedPayment.value : "cod",

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
    total,

    status: "Order Placed",
    createdAt: new Date().toISOString(),
  };

  /* Save Latest Order */
  localStorage.setItem("delizia-last-order", JSON.stringify(order));

  /* Save Order History */
  const orders = JSON.parse(localStorage.getItem("delizia-orders")) || [];

  orders.push(order);

  localStorage.setItem("delizia-orders", JSON.stringify(orders));

  /* Clear Cart */
  cart = [];

  saveCart();
  updateCartCount();
  renderCart();

  /* Reset Checkout */
  clearCheckoutForm();

  /* Close Checkout */
  closeCheckout();

  /* Show Confirmation */
  showOrderConfirmation();

  /* Success Toast */
  showToast(
    "Order Placed",
    `Your order ${orderId} has been placed successfully.`,
    "ri-checkbox-circle-line",
  );

  console.log("Order Created:", order);
};

/*=============== PLACE ORDER EVENT ===============*/

checkoutPlaceOrder.addEventListener("click", () => {
  if (!validateCheckoutForm()) {
    showToast(
      "Check Your Details",
      "Please fix the highlighted fields.",
      "ri-error-warning-line",
    );

    return;
  }

  createOrder();
});

/*=============== ORDER CONFIRMATION ELEMENTS ===============*/

const confirmationOverlay = document.getElementById("confirmation-overlay");
const confirmationClose = document.getElementById("confirmation-close");
const confirmationButton = document.getElementById("confirmation-button");
const confirmationOrderId = document.getElementById("confirmation-order-id");
const confirmationCustomerName = document.getElementById(
  "confirmation-customer-name",
);
const confirmationItems = document.getElementById("confirmation-items");
const confirmationPayment = document.getElementById("confirmation-payment");
const confirmationTotal = document.getElementById("confirmation-total");
const confirmationAddress = document.getElementById("confirmation-address");
const confettiContainer = document.getElementById("confetti-container");

/*=============== CONFETTI ===============*/

const confettiColors = [
  "var(--first-color)",
  "#f7c948",
  "#ff7aa2",
  "#8ecae6",
  "#90be6d",
  "#c77dff",
];

const createConfetti = () => {
  confettiContainer.innerHTML = "";

  const confettiCount = 90;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("span");

    confetti.className = "confetti";

    const size = Math.random() * 5 + 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 1.2;
    const duration = Math.random() * 1.5 + 3;
    const x = (Math.random() - 0.5) * 300;

    const randomColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];

    confetti.style.backgroundColor = randomColor;
    confetti.style.left = `${left}%`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 1.5}px`;
    confetti.style.animationDelay = `${delay}s`;
    confetti.style.animationDuration = `${duration}s`;
    confetti.style.setProperty("--confetti-x", `${x}px`);

    if (Math.random() > 0.5) {
      confetti.style.borderRadius = "50%";
    }

    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 5500);
};

/*=============== SHOW CONFIRMATION ===============*/

const showOrderConfirmation = () => {
  const order = JSON.parse(localStorage.getItem("delizia-last-order"));

  if (!order) return;

  confirmationOrderId.textContent = order.orderId;
  confirmationCustomerName.textContent = order.customer.name;

  const totalItems = order.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  confirmationItems.textContent = `${totalItems} ${totalItems === 1 ? "Item" : "Items"}`;

  confirmationPayment.textContent =
    order.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment";

  confirmationTotal.textContent = `$${order.total.toFixed(2)}`;

  confirmationAddress.textContent = `${order.customer.address}, ${order.customer.city}`;

  confirmationOverlay.classList.add("show-confirmation");
  document.body.classList.add("cart-open");

  createConfetti();
};

/*=============== CLOSE CONFIRMATION ===============*/

const closeOrderConfirmation = () => {
  confirmationOverlay.classList.remove("show-confirmation");
  document.body.classList.remove("cart-open");

  confettiContainer.innerHTML = "";
};

/*=============== CONFIRMATION EVENTS ===============*/

confirmationClose.addEventListener("click", closeOrderConfirmation);

confirmationOverlay.addEventListener("click", (event) => {
  if (event.target === confirmationOverlay) {
    closeOrderConfirmation();
  }
});

confirmationButton.addEventListener("click", closeOrderConfirmation);

/*=============== QUICK VIEW ===============*/

const openQuickView = (productId) => {
  const product = getProductById(productId);

  if (!product) return;

  quickViewProduct = product;
  quickViewQty = 1;

  quickViewImage.src = product.image;
  quickViewImage.alt = product.name;
  quickViewCategory.textContent = product.category;
  quickViewName.textContent = product.name;
  quickViewPrice.textContent = `$${product.price.toFixed(2)}`;
  quickViewQuantity.textContent = quickViewQty;

  quickViewOverlay.classList.add("show-modal");
  document.body.classList.add("cart-open");
};

const closeQuickView = () => {
  quickViewOverlay.classList.remove("show-modal");
  document.body.classList.remove("cart-open");

  quickViewProduct = null;
  quickViewQty = 1;
};

quickViewClose.addEventListener("click", closeQuickView);

quickViewOverlay.addEventListener("click", (event) => {
  if (event.target === quickViewOverlay) {
    closeQuickView();
  }
});

/*=============== QUICK VIEW QUANTITY ===============*/

quickViewMinus.addEventListener("click", () => {
  if (quickViewQty <= 1) return;

  quickViewQty -= 1;
  quickViewQuantity.textContent = quickViewQty;
});

quickViewPlus.addEventListener("click", () => {
  quickViewQty += 1;
  quickViewQuantity.textContent = quickViewQty;
});

/*=============== QUICK VIEW ADD TO CART ===============*/

quickViewAdd.addEventListener("click", () => {
  if (!quickViewProduct) return;

  const product = addProductToCart(quickViewProduct.id, quickViewQty);

  if (!product) return;

  showToast(
    "Added to Cart",
    `${product.name} × ${quickViewQty} added to your cart.`,
    "ri-shopping-bag-3-line",
  );

  closeQuickView();
});

/*=============== PRODUCT QUICK VIEW BUTTON ===============*/

const productBuyButtons = document.querySelectorAll(".product_buy");

productBuyButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const productCard = button.closest(".product_card");

    if (!productCard) return;

    const productId = productCard.dataset.productId;

    if (!productId) return;

    openQuickView(productId);
  });
});

/*=============== MOBILE MENU ===============*/

const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MOBILE MENU ===============*/

const navLink = document.querySelectorAll(".nav_link");

navLink.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
});

/*=============== HOME SWIPER ===============*/

const swiperHome = new Swiper(".home_swiper", {
  loop: true,
  grabCursor: true,
  speed: 800,

  effect: "creative",

  creativeEffect: {
    prev: {
      translate: ["-120%", 0, -500],
      rotate: [0, 0, -45],
      opacity: 0,
    },

    next: {
      translate: ["120%", 0, -500],
      rotate: [0, 0, 45],
      opacity: 0,
    },
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

/*=============== CHANGE HEADER STYLES ===============*/

const scrollHeader = () => {
  const header = document.getElementById("header");

  if (window.scrollY >= 50) {
    header.classList.add("scroll-header");
  } else {
    header.classList.remove("scroll-header");
  }
};

window.addEventListener("scroll", scrollHeader);

/*=============== PRODUCTS SWIPER ===============*/

const swiperTabs = new Swiper(".product_tabs", {
  slidesPerView: "auto",
});

const swiperProducts = new Swiper(".product_content", {
  loop: true,
  spaceBetween: 32,

  thumbs: {
    swiper: swiperTabs,
  },
});

/*=============== NEW SWIPER ===============*/

const swiperNew = new Swiper(".new_swiper", {
  loop: true,
  grabCursor: true,
  centeredSlides: "auto",
  slidesPerView: "auto",
  speed: 600,

  effect: "creative",

  creativeEffect: {
    limitProgress: 2,

    prev: {
      translate: ["-32%", 0, 0],
      scale: 0.58,
    },

    next: {
      translate: ["32%", 0, 0],
      scale: 0.58,
    },
  },

  navigation: {
    nextEl: ".new .swiper-button-next",
    prevEl: ".new .swiper-button-prev",
  },

  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
});

/*=============== SHOW SCROLL UP ===============*/

const scrollUp = () => {
  const scrollUpButton = document.getElementById("scroll-up");

  if (window.scrollY >= 350) {
    scrollUpButton.classList.add("show-scroll");
  } else {
    scrollUpButton.classList.remove("show-scroll");
  }
};

window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const id = section.id;
    const top = section.offsetTop - 50;
    const height = section.offsetHeight;
    const link = document.querySelector(`.nav_menu a[href*="${id}"]`);

    if (!link) return;

    link.classList.toggle(
      "active-link",
      scrollY > top && scrollY <= top + height,
    );
  });
};

window.addEventListener("scroll", scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/

const sr = ScrollReveal({
  origin: "bottom",
  distance: "60px",
  duration: 1500,
  delay: 300,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
});

sr.reveal(`.home_title`, { origin: "top" });

sr.reveal(`.home_description`, {
  delay: 600,
  origin: "top",
});

sr.reveal(`.home_data .button`, {
  delay: 900,
  distance: 0,
  scale: 0,
  origin: "top",
});

sr.reveal(`.home_base`, { delay: 900 });

sr.reveal(`.home_swiper`, {
  delay: 1200,
  origin: "top",
});

sr.reveal(`.home_blob`, {
  delay: 1500,
  scale: 0,
});

sr.reveal(`.home_data img`, {
  delay: 2100,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.home_leaf-1, .home_leaf-2, .home_sticker-3, .home_sticker-4`, {
  delay: 2400,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.about_cupcake-1, .about_cupcake-2`, {
  rotate: {
    x: 0,
    y: 0,
    z: 120,
  },
});

sr.reveal(`.about_data .section_title`, {
  delay: 900,
});

sr.reveal(`.about_description`, {
  delay: 1200,
});

sr.reveal(`.about_data .button`, {
  delay: 1500,
  distance: 0,
  scale: 0,
});

sr.reveal(`.about_blob`, {
  delay: 1800,
  origin: "right",
});

sr.reveal(`.about_img`, {
  delay: 2100,
  origin: "left",
});

sr.reveal(`.about_leaf, .about_cupcake-3`, {
  delay: 2700,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.about_data img`, {
  delay: 3000,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.product .section_title`);

sr.reveal(`.product_button`, {
  delay: 600,
  interval: 100,
});

sr.reveal(`.product_content`, {
  delay: 900,
});

sr.reveal(`.new_data .section_title`);

sr.reveal(`.new_description`, {
  delay: 600,
});

sr.reveal(`.new_data .button`, {
  delay: 900,
});

sr.reveal(`.new_swiper`, {
  delay: 1200,
});

sr.reveal(`.new_leaf-1, .new_leaf-2, .new_leaf-3`, {
  delay: 1500,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.new_titles`, {
  delay: 1800,
  scale: 0,
});

sr.reveal(`.contact_content .section_title`);

sr.reveal(`.contact_info`, {
  delay: 600,
  interval: 100,
});

sr.reveal(`.contact_map`, {
  delay: 900,
  origin: "top",
});

sr.reveal(`.contact_data img`, {
  delay: 1500,
  distance: 0,
  interval: 200,
  scale: 0,
});

sr.reveal(`.footer_container`);

sr.reveal(`.footer_leaf-1, .footer_leaf-2`, {
  delay: 600,
  interval: 200,
});

sr.reveal(`.footer_blob`, {
  delay: 600,
});

/*=============== INITIALIZE CART ===============*/

renderCart();
updateCartCount();
