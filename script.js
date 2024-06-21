// Добавляем обработчик события touchstart для предотвращения масштабирования страницы на мобильных устройствах
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);

// Добавляем обработчик события gesturestart для предотвращения масштабирования страницы на мобильных устройствах
document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
}, false);

// Получаем файл .env и извлекаем из него переменные окружения
fetch('.env')
  .then(response => response.text())
  .then(envFile => {
    const envVars = {};
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      envVars[key] = value;
    });

    const telegramToken = envVars.TOKEN;
    const chatId = envVars.GROUP_ID;
    console.log(`Токен Telegram: ${telegramToken}`);
    console.log(`ID чата: ${chatId}`);


// Получаем файл products.json и извлекаем из него данные о продуктах
fetch('products.json')
.then(response => response.json())
.then(data => {
  const productsData = data.products;
  const tabs = document.querySelectorAll('.tab');
  const productsContainer = document.getElementById('products');
  const cartButton = document.getElementById('cart-button');
  const cartCount = document.getElementById('cart-count');
  const cartItems = [];
  const cartModal = document.getElementById('cart-modal');
  const cartCloseButton = document.querySelector('#cart-modal .close');
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');

  // Добавляем обработчик события click для кнопки закрытия модального окна корзины
  cartCloseButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  // Функция отображения продуктов
  function displayProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(product => {
      const productElement = `
        
        <div class="product" data-title="${product.title}">
          <img src="${product.image}" alt="${product.title}">
          <div class="title">${product.title}</div>
          <div class="buttons">
            <button class="add-to-cart">В заявку</button>
            <button class="view-details">Подробнее</button>
            
  
</div>
          </div>
        </div>
      `;
      productsContainer.innerHTML += productElement;
    });

    const detailsButtons = document.querySelectorAll('.view-details');
    const closeButton = document.querySelector('.close');

    // Добавляем обработчики события click для кнопок просмотра деталей продукта
    detailsButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = productsData.find(p => p.title === button.closest('.product').querySelector('.title').textContent);
        showProductModal(product);
      });
    });

    // Добавляем обработчик события click для кнопки закрытия модального окна продукта
    closeButton.addEventListener('click', () => {
      const modal = document.getElementById('product-modal');
      modal.style.display = 'none';
    });

    // Добавляем обработчики события click для кнопок добавления продукта в корзину
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const product = productsData.find(p => p.title === button.closest('.product').querySelector('.title').textContent);
        addToCart(product);
      });
    });
  }

  // Функция отображения модального окна продукта
  function showProductModal(product) {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';

    // Отображаем текст описания продукта
    modal.querySelector('.modal-description').innerHTML = product.details;

    // Отображаем изображение продукта
    const imageElement = document.createElement('img');
    imageElement.src = product.image;
    modal.querySelector('.modal-image').innerHTML = '';
    modal.querySelector('.modal-image').appendChild(imageElement);
  }

  // Функция добавления продукта в корзину
  function addToCart(product) {
  const index = cartItems.findIndex(item => item.title === product.title);

  if (index === -1) {
    cartItems.push({...product, quantity: 1, image: product.image });
  } else {
    cartItems[index].quantity = cartItems[index].quantity + 1;
  }

  updateCart();


  const productCard = document.querySelector(`.product[data-title="${product.title}"]`);
  let quantityElement;

  if (productCard) {
    quantityElement = productCard.querySelector('.quantity');
    if (!quantityElement) {
      quantityElement = document.createElement('span');
      quantityElement.className = 'quantity';
      productCard.querySelector('.buttons').appendChild(quantityElement);
    }


    quantityElement.textContent = `x ${cartItems.find(item => item.title === product.title).quantity}`;
  }



}

  // Функция обновления корзины
  function updateCart() {
    const uniqueProducts = [...new Set(cartItems.map(item => item.title))];
    cartCount.textContent = uniqueProducts.length;
  }

  // Функция отображения модального окна корзины
  function displayCartModal() {
    if (cartItems.length > 0) {
      cartModal.style.display = 'flex';

      const cartList = document.getElementById('cart-list');
      cartList.innerHTML = '';

      cartItems.forEach(item => {
        const cartItem = `
          <li>
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
              <span>${item.title} x ${item.quantity}</span>
              <button class="update-quantity" data-product-title="${item.title}">+</button>
              <button class="remove-from-cart" data-product-title="${item.title}">-</button>
            </div>
          </li>
        `;
        cartList.innerHTML += cartItem;
      });

      // Добавляем обработчики события click для кнопок обновления количества продукта в корзине
      const updateQuantityButtons = document.querySelectorAll('.update-quantity');
      updateQuantityButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productTitle = button.dataset.productTitle;
          const index = cartItems.findIndex(item => item.title === productTitle);
          cartItems[index].quantity++;
          updateCart();
          displayCartModal();


          const productCard = document.querySelector(`.product[data-title="${productTitle}"]`);
          if (productCard) {
            const quantityElement = productCard.querySelector('.quantity');
            if (quantityElement) {
              quantityElement.textContent = `x ${cartItems[index].quantity}`;
            }
          }
        });
      });

      // Добавляем обработчики события click для кнопок удаления продукта из корзины
      const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
      removeFromCartButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productTitle = button.dataset.productTitle;
          const index = cartItems.findIndex(item => item.title === productTitle);
          if (cartItems[index].quantity === 1) {
            cartItems.splice(index, 1);
            const cartListItem = document.querySelector(`[data-product-title="${productTitle}"]`).closest('li');
            cartListItem.remove();
            updateCart();

            const productCard = document.querySelector(`.product[data-title="${productTitle}"]`);
            if (productCard) {
              const quantityElement = productCard.querySelector('.quantity');
              if (quantityElement) {
                quantityElement.remove();
              }
            }
          } else {
            cartItems[index].quantity--;
            updateCart();
            displayCartModal();


            const productCard = document.querySelector(`.product[data-title="${productTitle}"]`);
            if (productCard) {
              const quantityElement = productCard.querySelector('.quantity');
              if (quantityElement) {
                quantityElement.textContent = `x ${cartItems[index].quantity}`;
              }
            }
          }
        });
      });
    }
  }



  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab.active');
      activeTab.classList.remove('active');

      tab.classList.add('active');

      const category = tab.dataset.tab;
      let products;

      if (category === 'all') {
        products = productsData;
      } else {
        products = productsData.filter(product => product.category === category);
      }

      displayProducts(products);
    });
  });


  tabs[0].classList.add('active');

  // Вызов дисплея с начальным окном
  displayProducts(productsData);

  cartButton.addEventListener('click', displayCartModal);

  searchButton.addEventListener('click', searchProducts);

const cartCheckout = document.getElementById('cart-checkout');
const statusText = document.getElementById('status-text');
cartCheckout.addEventListener('click', () => {

  
  statusText.style.display = 'inline';
    const productsList = cartItems.map(item => `❇️ ${item.title} x ${item.quantity} шт`).join('\n');
    const place = 'Затон 1'; // replace with the actual place from the database
    const date = new Date();
    const dateString = `${date.toLocaleDateString()}`;
    const timeString = `${date.toLocaleTimeString()}`;

    const messageText = `📅Дата: ${dateString}
🕰Время: ${timeString}
📍Место: ${place}
🛒Список продукции:
${productsList}`;
console.log(`Токен Telegram: ${telegramToken}`);
    fetch(`https://api.telegram.org/bot${encodeURIComponent(telegramToken)}/sendMessage`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText

      })

    })
    .then(response => response.json())
  });


function searchProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = productsData.filter(product => {
      const title = product.title.toLowerCase();
      return title.includes(searchTerm);
    });
    displayProducts(filteredProducts);
  }
});

});


