
const products = [
  {
    name: "Levi's Ethan Nappa",
    price: 37,
    tipo: "calzado",
    image: "https://res.cloudinary.com/dfd8iteps/image/upload/v1754350217/Levis02_ksx0a1.png",
    description: "Cómodos y modernos para vestir casual "
  },
  {
    name: "Camiseta JS",
    price: 30,
    tipo: "ropa",
    image: "https://res.cloudinary.com/dfd8iteps/image/upload/v1754351086/Camiseta_JS_cdxeio.jpg",
    description: "Camiseta con diseño JavaScript ideal para devs."
  },
  {
    name: "Gorra React",
    price: 25,
    tipo: "accesorio",
    image: "https://res.cloudinary.com/dfd8iteps/image/upload/v1754351086/Gorra_JS_bbgfbx.jpg",
    description: "Gorra ligera con logo de React."
  },
  {
    name: "Sudadera HTML",
    price: 40,
    tipo: "ropa",
    image: "https://res.cloudinary.com/dfd8iteps/image/upload/v1754351087/Sudadera_tboxxw.png",
    description: "Sudadera con estilo HTML5 para programadores."
  }
];

const cart = [];

const storeDiv = document.getElementById("store");
const cartItemsEl = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const clearCartBtn = document.getElementById("clearCartBtn");
const toast = document.getElementById("toast");
const cartCounter = document.getElementById("cart-counter");
const cartIcon = document.getElementById("cart-icon");
const cartPanel = document.getElementById("cart");

function renderStore() {
  storeDiv.innerHTML = "";

  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 5px; margin-bottom: 8px;" />
      <h4>${getIcon(product.tipo)} ${product.name}</h4>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
    `;

    const button = document.createElement("button");
    button.textContent = "Agregar al carrito";
    button.onclick = () => addToCart(index);

    div.appendChild(button);
    storeDiv.appendChild(div);
  });
}

function addToCart(index) {
  const product = products[index];
  const found = cart.find(item => item.name === product.name);

  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${getIcon(product.tipo)} ${product.name} agregado al carrito`, product.tipo);
  actualizarTituloCarrito();
  actualizarContadorIcono();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} = $${item.price * item.quantity}
      <button class="remove-btn" data-index="${i}">❌</button>
    `;
    cartItemsEl.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `Total: $${total}`;

  document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1)[0];
    renderCart();
    showToast(`${getIcon(removed.tipo)} ${removed.name} eliminado del carrito ❌`, removed.tipo);
    actualizarTituloCarrito();
    actualizarContadorIcono();
  }
}

clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
  showToast("Carrito vaciado 🧹", "default");
  actualizarTituloCarrito();
  actualizarContadorIcono();
});

function getIcon(tipo) {
  switch (tipo) {
    case "ropa": return "👕";
    case "calzado": return "👟";
    case "accesorio": return "🧢";
    default: return "🛒";
  }
}

function getColor(tipo) {
  switch (tipo) {
    case "ropa": return "#3498db";
    case "calzado": return "#27ae60";
    case "accesorio": return "#9b59b6";
    default: return "#333";
  }
}

function showToast(message, tipo) {
  toast.textContent = message;
  toast.style.backgroundColor = getColor(tipo);
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 1500);
}

function actualizarTituloCarrito() {
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = "Cantidad de productos: " + cart.reduce((acc, p) => acc + p.quantity, 0);
  }
}

function actualizarContadorIcono() {
  if (cartCounter) {
    cartCounter.textContent = cart.reduce((acc, p) => acc + p.quantity, 0);
  }
}

if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    cartPanel.classList.toggle("hidden");
  });
}

document.getElementById("cart-icon-container").addEventListener("click", () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.classList.toggle("active");
});




// Inicializar
renderStore();
actualizarTituloCarrito();
actualizarContadorIcono();







