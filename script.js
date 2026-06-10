const selectedProducts = [];

const PRODUCT_PRICES = new Map([
  ['Mango-Melon 5L', 2150],
  ['Pineapple-Mint 5L', 2150],
  ['Sweet-Ginger 5L', 1550],
  ['Sweet-Ginger 500ml', 170],
  ['Mango-Melon 500ml', 240],
  ['Pineapple-Mint 500ml', 240],
  ['Apple-Punch 500ml', 240],
  ['Sweet-Ginger 300ml', 130],
  ['Mango-Melon 300ml', 130],
  ['Pineapple-Mint 300ml', 130],
  ['Apple-Punch 300ml', 130],
]);

const productInput = document.getElementById('product');
const addProductBtn = document.getElementById('addProductBtn');
const selectedProductsContainer = document.getElementById('selectedProducts');
const quantityInput = document.getElementById('quantity');
const orderTotal = document.getElementById('orderTotal');
const orderSummaryNote = document.getElementById('orderSummaryNote');
const orderForm = document.getElementById('orderForm');

function formatCurrency(amount) {
  return `KSH ${amount.toLocaleString('en-KE')}`;
}

function getProductPrice(productName) {
  return PRODUCT_PRICES.get(productName.trim()) ?? null;
}

function calculateEstimate() {
  const quantity = Math.max(1, Number.parseInt(quantityInput?.value, 10) || 1);
  const pricedProducts = selectedProducts.filter((product) => getProductPrice(product) !== null);
  const unpricedProducts = selectedProducts.filter((product) => getProductPrice(product) === null);
  const unitTotal = pricedProducts.reduce((sum, product) => sum + getProductPrice(product), 0);
  const total = unitTotal * quantity;

  return {
    quantity,
    unitTotal,
    total,
    unpricedProducts,
  };
}

function renderOrderSummary() {
  if (!orderTotal || !orderSummaryNote) {
    return;
  }

  const { quantity, unitTotal, total, unpricedProducts } = calculateEstimate();

  if (!selectedProducts.length) {
    orderTotal.textContent = formatCurrency(0);
    orderSummaryNote.textContent = 'Add products to see your running total before submitting.';
    return;
  }

  if (unpricedProducts.length) {
    orderTotal.textContent = formatCurrency(total);
    orderSummaryNote.textContent = `Quantity ${quantity}. Some custom items have no price yet: ${unpricedProducts.join(', ')}.`;
    return;
  }

  orderTotal.textContent = formatCurrency(total);
  orderSummaryNote.textContent = `Quantity ${quantity} x ${formatCurrency(unitTotal)} per order.`;
}

function renderSelectedProducts() {
  if (!selectedProductsContainer) {
    return;
  }

  selectedProductsContainer.innerHTML = selectedProducts
    .map((product, index) => `
      <span class="product-chip">
        <span>${product}</span>
        <span class="product-chip-price">${getProductPrice(product) !== null ? formatCurrency(getProductPrice(product)) : 'Price on request'}</span>
        <button type="button" class="remove-product" data-index="${index}">×</button>
      </span>`)
    .join('');

  renderOrderSummary();
}

function addProduct(productName) {
  const value = productName.trim();
  if (!value) return;
  if (selectedProducts.includes(value)) return;
  selectedProducts.push(value);

  if (productInput) {
    productInput.value = '';
  }

  renderSelectedProducts();
}

if (orderForm && productInput && addProductBtn && selectedProductsContainer && quantityInput && orderTotal && orderSummaryNote) {
  const params = new URLSearchParams(window.location.search);
  const initialProduct = params.get('product');

  if (initialProduct) {
    addProduct(decodeURIComponent(initialProduct));
  } else {
    renderSelectedProducts();
  }

  addProductBtn.addEventListener('click', function () {
    addProduct(productInput.value);
  });

  productInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addProduct(productInput.value);
    }
  });

  selectedProductsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-product')) {
      const index = Number(event.target.dataset.index);
      selectedProducts.splice(index, 1);
      renderSelectedProducts();
    }
  });

  quantityInput.addEventListener('input', renderOrderSummary);

  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const typedProduct = productInput.value.trim();

    if (typedProduct) {
      addProduct(typedProduct);
    }

    if (!selectedProducts.length) {
      alert('Please add at least one product before submitting your order.');
      return;
    }

    const { total, quantity, unpricedProducts } = calculateEstimate();
    const productsList = selectedProducts.join(', ');

    const priceNote = unpricedProducts.length
      ? `Some items have no price yet: ${unpricedProducts.join(', ')}.`
      : `Estimated total: ${formatCurrency(total)}.`;

    const message = `Hello Steaze Punch 🍹,\nMy name is ${name} and I’d like to order ${quantity} product(s): ${productsList}.\n${priceNote}\n📍 Delivery Location: ${location}\n📞 Contact: ${phone}`;

    const whatsappNumber = '254706867627';
    const url = `https://wa.me/${whatsappNumber}?${new URLSearchParams({ text: message }).toString()}`;

    window.open(url, '_blank');
  });

  renderOrderSummary();
}