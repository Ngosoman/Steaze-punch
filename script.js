document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const location = document.getElementById('location').value;
  const quantity = document.getElementById('quantity').value;

  const message = `Hello Steaze Punch 🍹,%0AMy name is *${name}* and I’d like to order *${quantity}* SP(s).%0A📍 Delivery Location: ${location}%0A📞 Contact: ${phone}`;

  const whatsappNumber = '254706867627'; 
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, '_blank');
});
