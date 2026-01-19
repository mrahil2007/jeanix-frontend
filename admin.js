const API_BASE = "https://jeanix-backends.onrender.com/api/products";

async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const stock = document.getElementById("stock").value;

  if (!name || !price || !image) {
    alert("Please fill all required fields");
    return;
  }

  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, image, stock })
  });

  alert("Product added");
  loadProducts();
}

async function loadProducts() {
  const res = await fetch(API_BASE);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div style="border:1px solid #333;padding:10px;margin-bottom:10px;">
        <strong>${p.name}</strong> – ₹${p.price}
        <br>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </div>
    `;
  });
}

async function deleteProduct(id) {
  await fetch(API_BASE + "/" + id, { method: "DELETE" });
  loadProducts();
}

loadProducts();
