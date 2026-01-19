document.addEventListener("DOMContentLoaded", function () {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  const buyBtn = document.getElementById("buy-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ===== UPDATE HEADER CART COUNT =====
  function updateHeaderCartCount() {
    const count = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const countSpan = document.getElementById("cart-count");
    if (countSpan) {
      countSpan.innerText = count;
    }
  }

  // ===== RENDER CART =====
  function renderCart() {
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
      totalDiv.innerText = "";
      localStorage.setItem("cart", JSON.stringify(cart));
      updateHeaderCartCount();
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
          <p>Qty: ${item.qty}</p>
          <button data-index="${index}" class="inc">+</button>
          <button data-index="${index}" class="dec">-</button>
          <button data-id="${item.id}" class="remove">Remove</button>
        </div>
      `;

      cartItemsDiv.appendChild(div);
    });

    totalDiv.innerText = `Total: ₹${total}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartCount();
  }

  // ===== CART BUTTON ACTIONS =====
  cartItemsDiv.addEventListener("click", function (e) {

    if (e.target.classList.contains("inc")) {
      const i = e.target.dataset.index;
      cart[i].qty += 1;
    }

    else if (e.target.classList.contains("dec")) {
      const i = e.target.dataset.index;
      cart[i].qty > 1 ? cart[i].qty-- : cart.splice(i, 1);
    }

    else if (e.target.classList.contains("remove")) {
      const id = e.target.dataset.id;
      cart = cart.filter(item => item.id !== id);
    }

    renderCart();
  });

  // ===== WHATSAPP BUY NOW =====
  if (buyBtn) {
    buyBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        alert("Your cart is empty");
        return;
      }

      let message = "🛒 *JEANIX Order*%0A%0A";
      let total = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        message += `${index + 1}. ${item.name}%0A`;
        message += `Qty: ${item.qty}%0A`;
        message += `Price: ₹${item.price}%0A`;
        message += `Subtotal: ₹${itemTotal}%0A%0A`;
      });

      message += `*Total Amount:* ₹${total}%0A%0A`;
      message += "📍 Delivery Address:%0A";
      message += "📞 Phone Number:%0A";

      const phoneNumber = "919717706407"; // your WhatsApp number

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappURL, "_blank");
    });
  }

  // ===== INIT =====
  renderCart();
});
