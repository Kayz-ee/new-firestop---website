/ Permanent Unsplash image URLs
const PRODUCTS = [
  {
    id: "dp6kg",
    title: "6kg ABC Dry Powder Extinguisher",
    price: 65000,
    img: "https://images.unsplash.com/photo-1607706189992-eae5786267a3",
    blurb: "Versatile ABC protection for offices & shops."
  },
  {
    id: "co25kg",
    title: "5kg CO₂ Extinguisher",
    price: 78000,
    img: "https://images.unsplash.com/photo-1590752431744-0371b39a69f8",
    blurb: "Ideal for electrical rooms & server areas."
  },
  {
    id: "foam9l",
    title: "9L Foam (AFFF) Extinguisher",
    price: 72000,
    img: "https://images.unsplash.com/photo-1597007194770-7a4ee02a5c2e",
    blurb: "For Class A/B fires—paper, cloth, flammable liquids."
  },
  {
    id: "water9l",
    title: "9L Water Extinguisher",
    price: 55000,
    img: "https://images.unsplash.com/photo-1622597463709-9e5b84ef9e09",
    blurb: "Eco-friendly option for Class A fires."
  },
  {
    id: "wallmount",
    title: "Universal Wall Mount Bracket",
    price: 7500,
    img: "https://images.unsplash.com/photo-1606813907296-5f6e1a3a6d5a",
    blurb: "Heavy-duty bracket for 6–9kg cylinders."
  }
];

// Shortcuts
const $ = (q) => document.querySelector(q);
const grid = $("#productGrid");
const count = $("#cartCount");
const cartEl = $("#cart");
const itemsEl = $("#cartItems");
const totalEl = $("#cartTotal");
const openCartBtn = $("#openCart");
const closeCartBtn = $("#closeCart");
const nav = $("#nav");
const hamburger = $("#hamburger");
const year = $("#year");
year.textContent = new Date().getFullYear();

// Render product cards
function formatNaira(n) {
  return n.toLocaleString("en-NG");
}
function card(p) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <div class="card__body">
      <h3>${p.title}</h3>
      <p class="muted">${p.blurb}</p>
      <div class="price">₦${formatNaira(p.price)}</div>
      <button class="btn" data-add="${p.id}">Add to Cart</button>
    </div>`;
  return el;
}
PRODUCTS.forEach(p => grid.appendChild(card(p)));

// Cart state
const cart = JSON.parse(localStorage.getItem("firestop_cart") || "[]");
function save() { localStorage.setItem("firestop_cart", JSON.stringify(cart)); }
function sum() { return cart.reduce((a, i) => a + i.price * i.qty, 0); }
function qty() { return cart.reduce((a, i) => a + i.qty, 0); }

// Redraw cart UI
function redraw() {
  itemsEl.innerHTML = cart.length ? "" : "<p class='muted'>Your cart is empty.</p>";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart__row";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div>
        <div><strong>${item.title}</strong></div>
        <small class="muted">₦${formatNaira(item.price)} × ${item.qty}</small>
      </div>
      <div>
        <button data-dec="${item.id}">−</button>
        <button data-inc="${item.id}">+</button>
        <button data-rem="${item.id}">✕</button>
      </div>`;
    itemsEl.appendChild(row);
  });
  totalEl.textContent = formatNaira(sum());
  count.textContent = qty();
}
redraw();

// Add to cart
grid.addEventListener("click", e => {
  const id = e.target.dataset.add;
  if (!id) return;
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  save(); redraw(); cartEl.classList.add("open");
});

// Cart item actions
itemsEl.addEventListener("click", e => {
  const inc = e.target.dataset.inc,
        dec = e.target.dataset.dec,
        rem = e.target.dataset.rem;
  if (inc) { const it = cart.find(x => x.id === inc); it.qty++; }
  if (dec) { const it = cart.find(x => x.id === dec); it.qty = Math.max(1, it.qty - 1); }
  if (rem) { const i = cart.findIndex(x => x.id === rem); cart.splice(i, 1); }
  save(); redraw();
});

// Open/close cart
openCartBtn.addEventListener("click", () => cartEl.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartEl.classList.remove("open"));

// Mobile nav
hamburger.addEventListener("click", () => nav.classList.toggle("open"));

// Contact form validation
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get("name")?.trim(),
        email = fd.get("email")?.trim(),
        msg = fd.get("message")?.trim();
  const out = $("#formMsg");
  if (!name || !email || !msg) {
    out.textContent = "Please fill all fields.";
    out.style.color = "crimson";
    return;
  }
  out.textContent = "Thanks! We’ll reply shortly.";
  out.style.color = "green";
  e.target.reset();
});
