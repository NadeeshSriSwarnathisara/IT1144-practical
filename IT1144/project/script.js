const menu = [
  { id: 1, name: 'Espresso', desc: 'Rich single shot', price: 400.00, image: 'espresso.jpg' },
  { id: 2, name: 'Americano', desc: 'Espresso + hot water', price: 530.00, image: 'americano.jpg' },
  { id: 3, name: 'Cappuccino', desc: 'Espresso, steamed milk, foam', price: 700.00, image: 'cappuccino.jpg' },
  { id: 4, name: 'Latte', desc: 'Smooth steamed milk', price: 650.00, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60&auto=format&fit=crop' },
  { id: 5, name: 'Cold Brew', desc: 'Slow steeped, bold', price: 550.00, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=60&auto=format&fit=crop' },
  { id: 6, name: 'Mocha', desc: 'Chocolate and espresso', price: 300.00, image: 'Unknown.jpg' }
];

const menuGrid = document.getElementById('menu-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout');
const paymentForm = document.getElementById('payment-form');
const paymentFooter = document.getElementById('payment-footer');
const payBtn = document.getElementById('pay-btn');
const cardName = document.getElementById('card-name');
const customerAddress = document.getElementById('customer-address');
const cardNumber = document.getElementById('card-number');
const cardExpiry = document.getElementById('card-expiry');
const cardCvv = document.getElementById('card-cvv');

let cart = [];

// ===== FORM UTILITIES =====
function formatPrice(value) {
  return value.toFixed(2);
}

function formatCardNumber(value) {
  return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiryDate(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
}

function showFieldError(fieldId, errorMessage) {
  const errorEl = document.getElementById(fieldId + '-error');
  const fieldWrapper = document.getElementById(fieldId).parentElement;
  
  if (errorEl && errorMessage) {
    errorEl.textContent = errorMessage;
    fieldWrapper.classList.add('error');
    fieldWrapper.classList.remove('success');
  } else if (errorEl) {
    errorEl.textContent = '';
    fieldWrapper.classList.remove('error');
  }
}

function clearFieldError(fieldId) {
  const errorEl = document.getElementById(fieldId + '-error');
  const fieldElement = document.getElementById(fieldId);
  if (!fieldElement) return;
  
  const fieldWrapper = fieldElement.parentElement;
  
  if (errorEl) {
    errorEl.textContent = '';
  }
  fieldWrapper.classList.remove('error');
  fieldWrapper.classList.remove('success');
}

// ===== CART MANAGEMENT =====
function saveCart() {
  localStorage.setItem('coffee_cart', JSON.stringify(cart));
}

function loadCart() {
  try {
    const saved = localStorage.getItem('coffee_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (error) {
    cart = [];
  }
}

function updateCartCount() {
  if (!cartCount) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
}

function renderMenu() {
  if (!menuGrid) return;
  menuGrid.innerHTML = '';

  menu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img class="product-img" src="${item.image}" alt="${item.name}" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="price">Rs ${formatPrice(item.price)}</span>
          <button class="btn add-btn" data-id="${item.id}">Add</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

function addToCart(id) {
  const item = menu.find(product => product.id === id);
  if (!item) return;

  const cartItem = cart.find(product => product.id === id);
  if (cartItem) {
    cartItem.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }

  saveCart();
  updateCartCount();
}

function renderCart() {
  if (!cartItemsEl) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalText = formatPrice(total);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    if (paymentForm) paymentForm.classList.add('hidden');
    if (payBtn) payBtn.textContent = 'Pay Rs 0.00';
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) cartTotalEl.textContent = '0.00';
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(item => `<div class="cart-item"><span>${item.name} × ${item.qty}</span><strong>Rs ${formatPrice(item.price * item.qty)}</strong></div>`)
    .join('');

  const cartTotalEl = document.getElementById('cart-total');
  if (cartTotalEl) cartTotalEl.textContent = totalText;
  if (payBtn) payBtn.textContent = `Pay Rs ${totalText}`;
}

function openCart() {
  if (!cartModal) return;
  cartModal.classList.remove('hidden');
  renderCart();
  
  if (paymentForm) paymentForm.classList.add('hidden');
  if (paymentFooter) paymentFooter.classList.add('hidden');
}

function closeCartModal() {
  if (!cartModal) return;
  cartModal.classList.add('hidden');
  
  if (paymentForm) paymentForm.classList.add('hidden');
  if (paymentFooter) paymentFooter.classList.add('hidden');
}

// ===== INPUT FORMATTING =====
if (cardNumber) {
  cardNumber.addEventListener('input', (e) => {
    e.target.value = formatCardNumber(e.target.value);
    clearFieldError('card-number');
  });
}

if (cardExpiry) {
  cardExpiry.addEventListener('input', (e) => {
    e.target.value = formatExpiryDate(e.target.value);
    clearFieldError('card-expiry');
  });
}

if (cardCvv) {
  cardCvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    clearFieldError('card-cvv');
  });
}

if (cardName) {
  cardName.addEventListener('input', () => clearFieldError('card-name'));
}

if (customerAddress) {
  customerAddress.addEventListener('input', () => clearFieldError('customer-address'));
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    
    let isValid = true;
    
    // Validate name
    if (!nameInput.value.trim()) {
      showFieldError('contact-name', 'Please enter your name');
      isValid = false;
    } else {
      clearFieldError('contact-name');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showFieldError('contact-email', 'Please enter your email');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      showFieldError('contact-email', 'Please enter a valid email');
      isValid = false;
    } else {
      clearFieldError('contact-email');
    }
    
    // Validate message
    if (!messageInput.value.trim()) {
      showFieldError('contact-message', 'Please enter a message');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showFieldError('contact-message', 'Message must be at least 10 characters');
      isValid = false;
    } else {
      clearFieldError('contact-message');
    }
    
    if (isValid) {
      // Show success message
      alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
      contactForm.reset();
      clearFieldError('contact-name');
      clearFieldError('contact-email');
      clearFieldError('contact-message');
    }
  });
  
  // Clear errors on input
  const contactInputs = contactForm.querySelectorAll('input, textarea');
  contactInputs.forEach(input => {
    input.addEventListener('focus', () => {
      clearFieldError(input.id);
    });
  });
}

// ===== CART & CHECKOUT =====
menuGrid && document.body.addEventListener('click', event => {
  const button = event.target.closest('button.add-btn');
  if (button) {
    addToCart(Number(button.dataset.id));
  }
});

cartBtn && cartBtn.addEventListener('click', () => {
  updateCartCount();
  openCart();
});

closeCart && closeCart.addEventListener('click', closeCartModal);

cartModal && cartModal.addEventListener('click', event => {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

checkoutBtn && checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  // Clear previous errors
  clearFieldError('card-name');
  clearFieldError('customer-address');
  clearFieldError('card-number');
  clearFieldError('card-expiry');
  clearFieldError('card-cvv');
  
  // Reset form fields
  if (cardName) cardName.value = '';
  if (customerAddress) customerAddress.value = '';
  if (cardNumber) cardNumber.value = '';
  if (cardExpiry) cardExpiry.value = '';
  if (cardCvv) cardCvv.value = '';

  if (paymentForm) {
    paymentForm.classList.remove('hidden');
  }

  if (paymentFooter) {
    paymentFooter.classList.remove('hidden');
  }

  if (payBtn) {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    payBtn.textContent = `Pay Rs ${formatPrice(total)}`;
  }
});

const clearCartBtn = document.getElementById('clear-cart');
clearCartBtn && clearCartBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is already empty.');
    return;
  }
  
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
  }
});

function clearPaymentForm() {
  if (paymentForm) paymentForm.classList.add('hidden');
  if (paymentFooter) paymentFooter.classList.add('hidden');
  if (cardName) cardName.value = '';
  if (customerAddress) customerAddress.value = '';
  if (cardNumber) cardNumber.value = '';
  if (cardExpiry) cardExpiry.value = '';
  if (cardCvv) cardCvv.value = '';
  
  clearFieldError('card-name');
  clearFieldError('customer-address');
  clearFieldError('card-number');
  clearFieldError('card-expiry');
  clearFieldError('card-cvv');
}

function validatePayment() {
  let isValid = true;
  
  if (!cardName || !customerAddress || !cardNumber || !cardExpiry || !cardCvv) {
    return false;
  }
  
  // Validate cardholder name
  if (!cardName.value.trim()) {
    showFieldError('card-name', 'Please enter cardholder name');
    isValid = false;
  } else {
    clearFieldError('card-name');
  }
  
  // Validate address
  if (!customerAddress.value.trim()) {
    showFieldError('customer-address', 'Please enter delivery address');
    isValid = false;
  } else {
    clearFieldError('customer-address');
  }
  
  // Validate card number (12-19 digits)
  const cardNumberDigits = cardNumber.value.replace(/\s+/g, '');
  if (cardNumberDigits.length < 12) {
    showFieldError('card-number', 'Card number must be at least 12 digits');
    isValid = false;
  } else if (cardNumberDigits.length > 19) {
    showFieldError('card-number', 'Card number is too long');
    isValid = false;
  } else {
    clearFieldError('card-number');
  }
  
  // Validate expiry (MM/YY format)
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
    showFieldError('card-expiry', 'Expiry must be in MM/YY format');
    isValid = false;
  } else {
    clearFieldError('card-expiry');
  }
  
  // Validate CVV (3-4 digits)
  if (cardCvv.value.length < 3 || cardCvv.value.length > 4) {
    showFieldError('card-cvv', 'CVV must be 3 or 4 digits');
    isValid = false;
  } else {
    clearFieldError('card-cvv');
  }
  
  return isValid;
}

payBtn && payBtn.addEventListener('click', () => {
  if (!validatePayment()) {
    return;
  }

  alert('Payment successful. Thank you! Your order is placed.');
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  clearPaymentForm();
  closeCartModal();
});

loadCart();
renderMenu();
updateCartCount();
renderCart();
