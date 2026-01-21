

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let selectedSize = null;

async function loadProduct() {
  const container = document.getElementById("product-detail");

  if (!productId || !container) {
    container.innerHTML = "<p>Invalid product</p>";
    return;
  }

  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    const product = products.find(p => p._id === productId);
    if (!product) {
      container.innerHTML = "<p>Product not found</p>";
      return;
    }

    container.innerHTML = `
      <div class="product-wrapper">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-info">
          <h1>${product.name}</h1>
          <p class="price">₹${product.price}</p>
          <p>Slim Fit • Premium Denim • Comfortable Wear</p>

          <!-- SIZE SELECTOR -->
          <div class="size-selector">
            <p>Select Size:</p>
            <div class="sizes">
              <button class="size-btn" data-size="28">28</button>
              <button class="size-btn" data-size="30">30</button>
              <button class="size-btn" data-size="32">32</button>
              <button class="size-btn" data-size="34">34</button>
              <button class="size-btn" data-size="36">36</button>
            </div>
          </div>

          <!-- SIZE CHART -->
          <p class="size-help">
            <a href="#" id="openSizeChart">📏 View Size Chart</a>
          </p>

          <div id="sizeChartModal" class="modal hidden">
            <div class="modal-content">
              <span id="closeSizeChart" class="close">&times;</span>
              <h3>JEANIX Size Chart (inches)</h3>
              <table>
                <tr><th>Size</th><th>Waist</th></tr>
                <tr><td>28</td><td>28–29</td></tr>
                <tr><td>30</td><td>30–31</td></tr>
                <tr><td>32</td><td>32–33</td></tr>
                <tr><td>34</td><td>34–35</td></tr>
                <tr><td>36</td><td>36–37</td></tr>
              </table>
            </div>
          </div>

          <button id="addToCartBtn" class="primary-btn" disabled>
            Add to Cart
          </button>

          <button id="buyNowBtn" class="secondary-btn" disabled>
            Buy on WhatsApp
          </button>
        </div>
      </div>
    `;

    
    const stickyBar = document.getElementById("sticky-bar");
    const stickyPrice = document.getElementById("sticky-price");

    if (stickyBar && window.innerWidth <= 768) {
      stickyBar.classList.remove("hidden");
      stickyPrice.innerText = `₹${product.price}`;
    }

    attachEvents(product);

  } catch (err) {
    console.error("Product load failed", err);
    container.innerHTML = "<p>Error loading product</p>";
  }
}

function attachEvents(product) {
  const sizeButtons = document.querySelectorAll(".size-btn");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const buyNowBtn = document.getElementById("buyNowBtn");

  const stickyAddBtn = document.getElementById("sticky-add-btn");
  const stickyBuyBtn = document.getElementById("sticky-buy-btn");

  
  addToCartBtn.disabled = true;
  buyNowBtn.disabled = true;
  if (stickyAddBtn) stickyAddBtn.disabled = true;
  if (stickyBuyBtn) stickyBuyBtn.disabled = true;

 
  sizeButtons.forEach(btn => {
    btn.onclick = () => {
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedSize = btn.dataset.size;

     
      addToCartBtn.disabled = false;
      buyNowBtn.disabled = false;
      if (stickyAddBtn) stickyAddBtn.disabled = false;
      if (stickyBuyBtn) stickyBuyBtn.disabled = false;
    };
  });

  
  addToCartBtn.onclick = () => {
    if (!selectedSize) return;

    addToCart(
      product._id,
      product.name,
      product.price,
      product.image,
      selectedSize
    );

    alert(`Added size ${selectedSize} to cart 🛒`);
  };

  if (stickyAddBtn) {
    stickyAddBtn.onclick = addToCartBtn.onclick;
  }

  
  buyNowBtn.onclick = () => {
    if (!selectedSize) return;

    const msg = `
JEANIX Order
Product: ${product.name}
Size: ${selectedSize}
Price: ₹${product.price}
    `;

    window.open(
      "https://wa.me/919717706407?text=" + encodeURIComponent(msg),
      "_blank"
    );
  };

  if (stickyBuyBtn) {
    stickyBuyBtn.onclick = buyNowBtn.onclick;
  }

  
  document.getElementById("openSizeChart").onclick = e => {
    e.preventDefault();
    document.getElementById("sizeChartModal").classList.remove("hidden");
  };

  document.getElementById("closeSizeChart").onclick = () => {
    document.getElementById("sizeChartModal").classList.add("hidden");
  };
}

document.addEventListener("DOMContentLoaded", loadProduct);
