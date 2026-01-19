const API_URL = "https://jeanix-backends.onrender.com/api/products";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let product = null;

async function loadProduct() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    product = products.find(p => p._id === productId);

    if (!product) {
      document.body.innerHTML = "<h2 style='color:white'>Product not found</h2>";
      return;
    }

    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = `₹${product.price}`;

  } catch (err) {
    console.error("Failed to load product", err);
  }
}

document.getElementById("add-to-cart").addEventListener("click", () => {
  const qty = Number(document.getElementById("qty").value);

  const existing = cart.find(item => item.id === product._id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart 🛒");
});

document.getElementById("buy-now").addEventListener("click", () => {
  const qty = Number(document.getElementById("qty").value);
  const total = product.price * qty;

  const message = `
🛒 JEANIX Order

${product.name}
Qty: ${qty}
Price: ₹${product.price}
Total: ₹${total}

Delivery Address:
Phone:
`;

  const phone = "919717706407";
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

loadProduct();
