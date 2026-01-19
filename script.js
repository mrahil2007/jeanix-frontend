const API_URL = "https://jeanix-backends.onrender.com/api/products";

// ================= LOAD PRODUCTS =================
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
        <a href="product.html?id=${p._id}">
        <img src="${p.image}" alt="${p.name}">
        </a>
          <h3>${p.name}</h3>

        <p>₹${p.price}</p>
        <button 
          class="add-to-cart"
          data-id="${p._id}"
          data-name="${p.name}"
          data-price="${p.price}"
          data-image="${p.image}">
          Add to Cart
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load products", err);
  }
}

// ================= CART STATE =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= ADD TO CART =================
function addToCart(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price: Number(price),
      image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🛒");
}

// ================= UPDATE CART COUNT =================
function updateCartCount() {
  const count = cart.reduce(
    (sum, item) => sum + (Number(item.qty) || 0),
    0
  );

  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    countSpan.innerText = count;
  }
}

// ================= EVENT DELEGATION =================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const btn = e.target;

    addToCart(
      btn.dataset.id,
      btn.dataset.name,
      Number(btn.dataset.price),
      btn.dataset.image
    );
  }
});

// ================= INIT =================
loadProducts();
updateCartCount();
