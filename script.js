const selectedProducts = [];

const productInput = document.getElementById('product');
const addProductBtn = document.getElementById('addProductBtn');
const selectedProductsContainer = document.getElementById('selectedProducts');

function renderSelectedProducts() {
  selectedProductsContainer.innerHTML = selectedProducts
    .map((product, index) => `
      <span class="product-chip">
        ${product}
        <button type="button" class="remove-product" data-index="${index}">×</button>
      </span>`
    )
    .join('');
}

function addInitialProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const initialProduct = params.get('product');
  if (initialProduct) {
    addProduct(decodeURIComponent(initialProduct));
  }
}

addInitialProductFromQuery();

function addProduct(productName) {
  const value = productName.trim();
  if (!value) return;
  if (selectedProducts.includes(value)) return;
  selectedProducts.push(value);
  productInput.value = '';
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

document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const location = document.getElementById('location').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const typedProduct = productInput.value.trim();

  if (typedProduct) {
    addProduct(typedProduct);
  }

  if (!selectedProducts.length) {
    alert('Please add at least one product before submitting your order.');
    return;
  }

  const productsList = selectedProducts.join(', ');

  const message = `Hello Steaze Punch 🍹,%0AMy name is *${encodeURIComponent(name)}* and I’d like to order *${quantity}* product(s): ${encodeURIComponent(productsList)}.%0A📍 Delivery Location: ${encodeURIComponent(location)}%0A📞 Contact: ${encodeURIComponent(phone)}`;

  const whatsappNumber = '254706867627';
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, '_blank');
});
