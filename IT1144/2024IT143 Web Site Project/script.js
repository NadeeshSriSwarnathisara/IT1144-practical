const menu = [
  { id: 1, name: 'Espresso', desc: 'Rich single shot', price: 400, image: 'espresso.jpg' },
  { id: 2, name: 'Americano', desc: 'Espresso with hot water', price: 530, image: 'americano.jpg' },
  { id: 3, name: 'Cappuccino', desc: 'Espresso with steamed milk and foam', price: 700, image: 'cappuccino.jpg' },
  { id: 4, name: 'Latte', desc: 'Smooth steamed milk with a gentle espresso kick', price: 650, image: 'Unknown2.jpg' },
  { id: 5, name: 'Cold Brew', desc: 'Slow-steeped, bold, and refreshing', price: 550, image: 'Unknown.jpg' },
  { id: 6, name: 'Mocha', desc: 'Chocolate, espresso, and creamy milk', price: 300, image: 'images.jpeg' }
];

let cart = JSON.parse(localStorage.getItem('coffeeCart') || '[]');

function saveCart() {
  localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

function formatPrice(value) {
  return Number(value || 0).toFixed(2);
}

function updateCartCount() {
  const countElement = document.querySelector('#cart-count');
  if (!countElement) return;
  let quantity = 0;
  cart.forEach(item => { quantity += item.qty; });
  countElement.textContent = quantity;
}

function renderMenu() {
  const grid = document.querySelector('#menu-grid');
  if (!grid) return;
  let html = '';
  menu.forEach(item => {
    html += `
      <div class="card">
        <img class="product-img" src="${item.image}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <div class="card-footer">
            <span class="price">Rs ${formatPrice(item.price)}</span>
            <button class="btn add-btn" data-id="${item.id}">Add</button>
          </div>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

function getCartTotal() {
  let total = 0;
  cart.forEach(item => { total += item.price * item.qty; });
  return total;
}

function renderCart() {
  const list = document.querySelector('#cart-items');
  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    let html = '';
    cart.forEach(item => {
      html += `
        <div class="cart-item">
          <span>${item.name} x ${item.qty}</span>
          <strong>Rs ${formatPrice(item.price * item.qty)}</strong>
          <button class="btn remove-btn" data-id="${item.id}">Remove</button>
        </div>
      `;
    });
    list.innerHTML = html;
  }
  const totalElement = document.querySelector('#cart-total');
  if (totalElement) {
    totalElement.textContent = formatPrice(getCartTotal());
  }
  const payButton = document.querySelector('#pay-btn');
  if (payButton) {
    payButton.textContent = `Pay Rs ${formatPrice(getCartTotal())}`;
  }
}

function addToCart(id) {
  const product = menu.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

function hidePayment() {
  const paymentForm = document.querySelector('#payment-form');
  const paymentFooter = document.querySelector('#payment-footer');
  if (paymentForm) paymentForm.classList.add('hidden');
  if (paymentFooter) paymentFooter.classList.add('hidden');
}

function showPayment() {
  const paymentForm = document.querySelector('#payment-form');
  const paymentFooter = document.querySelector('#payment-footer');
  if (paymentForm) paymentForm.classList.remove('hidden');
  if (paymentFooter) paymentFooter.classList.remove('hidden');
}

function showCart() {
  const modal = document.querySelector('#cart-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderCart();
  hidePayment();
}

function closeCart() {
  const modal = document.querySelector('#cart-modal');
  if (!modal) return;
  modal.classList.add('hidden');
}

function clearPaymentInputs() {
  ['card-name', 'customer-address', 'card-number', 'card-expiry', 'card-cvv'].forEach(id => {
    const input = document.querySelector('#' + id);
    if (input) input.value = '';
  });
  hidePayment();
}

function validPayment() {
  const cardName = document.querySelector('#card-name');
  const address = document.querySelector('#customer-address');
  const cardNumber = document.querySelector('#card-number');
  const cardExpiry = document.querySelector('#card-expiry');
  const cardCvv = document.querySelector('#card-cvv');
  if (!cardName || !address || !cardNumber || !cardExpiry || !cardCvv) return false;
  const number = cardNumber.value.replace(/\D/g, '');
  const expiry = /^\d{2}\/\d{2}$/.test(cardExpiry.value);
  const cvv = cardCvv.value.replace(/\D/g, '');
  return cardName.value.trim() && address.value.trim() && number.length >= 12 && expiry && cvv.length >= 3;
}

function hideCartOnHome() {
  if (location.pathname.endsWith('index.html') || location.pathname === '/' || location.href.endsWith('index.html')) {
    const button = document.querySelector('#cart-btn');
    if (button) button.style.display = 'none';
  }
}

const menuGrid = document.querySelector('#menu-grid');
if (menuGrid) {
  menuGrid.addEventListener('click', function(event) {
    const button = event.target.closest('button.add-btn');
    if (button) addToCart(Number(button.dataset.id));
  });
}

const cartItems = document.querySelector('#cart-items');
if (cartItems) {
  cartItems.addEventListener('click', function(event) {
    const button = event.target.closest('button.remove-btn');
    if (button) removeFromCart(Number(button.dataset.id));
  });
}

const cartBtn = document.querySelector('#cart-btn');
if (cartBtn) cartBtn.addEventListener('click', showCart);

const closeBtn = document.querySelector('#close-cart');
if (closeBtn) closeBtn.addEventListener('click', closeCart);

const cartModal = document.querySelector('#cart-modal');
if (cartModal) {
  cartModal.addEventListener('click', function(event) {
    if (event.target === cartModal) closeCart();
  });
}

const checkoutBtn = document.querySelector('#checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty. Add something first.');
      return;
    }
    showPayment();
  });
}

const clearCartBtn = document.querySelector('#clear-cart');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is already empty.');
      return;
    }
    clearCart();
    clearPaymentInputs();
  });
}

const payBtn = document.querySelector('#pay-btn');
if (payBtn) {
  payBtn.addEventListener('click', function() {
    if (!validPayment()) {
      alert('Please enter valid payment details before paying.');
      return;
    }
    alert('Payment successful. Thank you for your order!');
    clearCart();
    clearPaymentInputs();
    closeCart();
  });
}

const cardNumberInput = document.querySelector('#card-number');
if (cardNumberInput) {
  cardNumberInput.addEventListener('input', function(event) {
    const input = event.target;
    input.value = input.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
  });
}

const cardExpiryInput = document.querySelector('#card-expiry');
if (cardExpiryInput) {
  cardExpiryInput.addEventListener('input', function(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    input.value = value;
  });
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Message sent. Thank you for reaching out!');
    contactForm.reset();
  });
}

hideCartOnHome();
renderMenu();
updateCartCount();
renderCart();
