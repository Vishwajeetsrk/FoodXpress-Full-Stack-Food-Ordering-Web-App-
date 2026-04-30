const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "pizza",
    restaurant: "Pizza Corner",
    rating: 4.5,
    delivery: "20-25 min",
    price: 299,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900"
  },
  {
    id: 2,
    name: "Cheese Burst Burger",
    category: "burger",
    restaurant: "Burger House",
    rating: 4.3,
    delivery: "15-20 min",
    price: 179,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    category: "indian",
    restaurant: "Spice Haven",
    rating: 4.7,
    delivery: "25-30 min",
    price: 249,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900"
  },
  {
    id: 4,
    name: "Gulab Jamun",
    category: "dessert",
    restaurant: "Sweet Bite",
    rating: 4.6,
    delivery: "10-15 min",
    price: 99,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=900"
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    category: "pizza",
    restaurant: "Domino Style",
    rating: 4.4,
    delivery: "18-22 min",
    price: 349,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900"
  },
  {
    id: 6,
    name: "Veg Thali",
    category: "indian",
    restaurant: "Royal Kitchen",
    rating: 4.2,
    delivery: "30-35 min",
    price: 199,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900"
  }
];

let cart = JSON.parse(localStorage.getItem("fx_cart")) || [];

const restaurantGrid = document.getElementById("restaurantGrid");
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const checkoutModal = document.getElementById("checkoutModal");

function money(v) {
  return `₹${Number(v).toLocaleString("en-IN")}`;
}

function getFilteredItems() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return menuItems.filter(item => {
    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      item.restaurant.toLowerCase().includes(query);

    const matchesCategory = category === "all" || item.category === category;

    return matchesQuery && matchesCategory;
  });
}

function renderRestaurants(items) {
  const uniqueRestaurants = [...new Map(items.map(i => [i.restaurant, i])).values()];

  restaurantGrid.innerHTML = uniqueRestaurants.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <span class="badge">${item.category.toUpperCase()}</span>
        <h4>${item.restaurant}</h4>
        <div class="meta">
          <span>⭐ ${item.rating}</span>
          <span>${item.delivery}</span>
        </div>
        <div class="meta">
          <span>Top-rated restaurant</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderMenu(items) {
  menuGrid.innerHTML = items.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <span class="badge">${item.restaurant}</span>
        <h4>${item.name}</h4>
        <div class="meta">
          <span>⭐ ${item.rating}</span>
          <span>${item.delivery}</span>
        </div>
        <div class="meta">
          <span class="price">${money(item.price)}</span>
        </div>
        <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function saveCart() {
  localStorage.setItem("fx_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const item = menuItems.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function increaseQty(id) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += 1;
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartTotal.textContent = total.toLocaleString("en-IN");
  cartCount.textContent = count;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color:#6b7280;">Your cart is empty.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-top">
        <div>
          <h4>${item.name}</h4>
          <p style="color:#6b7280;">${item.restaurant}</p>
        </div>
        <strong>${money(item.price * item.qty)}</strong>
      </div>

      <div class="cart-controls">
        <button onclick="decreaseQty(${item.id})">−</button>
        <span><strong>${item.qty}</strong></span>
        <button onclick="increaseQty(${item.id})">+</button>
        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join("");
}

function toggleCart() {
  cartDrawer.classList.toggle("open");
}

function openCart() {
  cartDrawer.classList.add("open");
}

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  checkoutModal.classList.add("open");
}

function closeCheckout() {
  checkoutModal.classList.remove("open");
}

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  alert("Order placed successfully! 🎉");
  cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  toggleCart();
});

searchInput.addEventListener("input", () => {
  const filtered = getFilteredItems();
  renderRestaurants(filtered);
  renderMenu(filtered);
});

categoryFilter.addEventListener("change", () => {
  const filtered = getFilteredItems();
  renderRestaurants(filtered);
  renderMenu(filtered);
});

document.addEventListener("click", (e) => {
  if (e.target === checkoutModal) closeCheckout();
});

renderRestaurants(menuItems);
renderMenu(menuItems);
renderCart();
