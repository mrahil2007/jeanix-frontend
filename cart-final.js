document.addEventListener("DOMContentLoaded", function () {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  const buyBtn = document.getElementById("buy-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

 
  function updateHeaderCartCount() {
    const count = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const countSpan = document.getElementById("cart-count");
    if (countSpan) {
      countSpan.innerText = count;
    }
  }

  
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
        <p>Price: ₹${item.price}</p>
        <p><strong>Size:</strong> ${item.size}</p>
        <p>Qty: ${item.qty}</p>
    
        <button data-index="${index}" class="inc">+</button>
        <button data-index="${index}" class="dec">-</button>
        <button data-index="${index}" class="remove">Remove</button>
      </div>
    `;
    

      cartItemsDiv.appendChild(div);
    });

    totalDiv.innerText = `Total: ₹${total}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartCount();
  }

  
  cartItemsDiv.addEventListener("click", function (e) {
    const btn = e.target;
    if (!btn.dataset.index) return;
  
    const index = Number(btn.dataset.index);
  
    if (btn.classList.contains("inc")) {
      cart[index].qty += 1;
    } 
    else if (btn.classList.contains("dec")) {
      cart[index].qty > 1
        ? cart[index].qty--
        : cart.splice(index, 1);
    } 
    else if (btn.classList.contains("remove")) {
      cart.splice(index, 1);
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
  

  
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

      const phoneNumber = "919717706407"; 

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappURL, "_blank");
    });
  }

  
  renderCart();
});
