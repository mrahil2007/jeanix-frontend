const API_URL = "https://jeanix-backends.onrender.com/api/products";


async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <a href="product.html?id=${p._id}" class="product-link">
          <img src="${p.image}" alt="${p.name}">
        </a>

        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <p class="delivery">🚚 Free Delivery | COD Available</p>
      <a href="product.html?id=${p._id}" class="size-cta">
      Select Size
      </a>


      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load products:", err);
  }
}


let cart = JSON.parse(localStorage.getItem("cart")) || [];


function addToCart(id, name, price, image, size = "N/A") {
  const existingItem = cart.find(
    item => item.id === id && item.size === size
  );

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      size,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}



function updateCartCount() {
  const count = cart.reduce((sum, item) => {
    return sum + Number(item.qty || 0);
  }, 0);

  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    countSpan.innerText = count;
  }
}


document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  addToCart(
    btn.dataset.id,
    btn.dataset.name,
    btn.dataset.price,
    btn.dataset.image
  );
});


document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
});
