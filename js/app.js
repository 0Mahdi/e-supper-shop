const arr = [];

const loadProducts = (url) => {
   fetch(url)
      .then((res) => res.json())
      .then((data) => {
         arr.push(...data); // Use spread operator to push individual items
         showProducts(data);
      });
};

loadProducts('https://fakestoreapi.com/products');

const showProducts = (products) => {
   setInnerText('total_products', products.length);

   document.getElementById("all-products").innerHTML = "";

   const allProducts = products.slice(0, 20);
   for (const product of allProducts) {
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `
         <div class="single-product">
            <div>
               <img class="product-image" src=${product.image}></img>
            </div>
            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <h2>Price: $ ${product.price}</h2>
            <button onclick="showProductDetails(${product.id})" id="details-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-secondary mb-2 rounded-1 mt-1">Details</button>
            <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success border-0 w-100 rounded-0 bg-main py-2">Add to cart</button>
         </div>`;
      document.getElementById('all-products').appendChild(div);
   }
};

let count = 0;

const addToCart = (id, price) => {
   count = count + 1;
   updatePrice('price', price);
   updateTaxAndCharge();
   document.getElementById('total-Products').innerText = count;
   updateTotal();
};

const showProductDetails = (product_id) => {
   fetch(`https://fakestoreapi.com/products/${product_id}`)
      .then((res) => res.json())
      .then((data) => showProductDetailsInModal(data));
};

const showProductDetailsInModal = (product_details) => {
   console.log(product_details)
   setInnerText('exampleModalLabel', product_details.title);
   setInnerText('product_id', product_details.id);
   setInnerText('modal_body', product_details.description);

   const ratingValue = parseFloat(product_details.rating.rate);
   const ratingCount = product_details.rating.count;

   setInnerText('rating', ratingValue.toFixed(1)); // Display rating with one decimal place
   setInnerText('rating-count', ratingCount);
};


const getInputValue = (id) => {
   const element = document.getElementById(id).innerText;
   return parseFloat(element);
};

const updatePrice = (id, value) => {
   const convertedOldPrice = getInputValue(id);
   const convertPrice = parseFloat(value);
   const total = convertedOldPrice + convertPrice;
   document.getElementById(id).innerText = total.toFixed(2);
};

const setInnerText = (id, value, decimalPlaces = 0) => {
   const roundedValue = Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
   document.getElementById(id).innerText = roundedValue.toFixed(decimalPlaces);
};

const updateTaxAndCharge = () => {
   const priceConverted = getInputValue('price');
   let deliveryCharge = 20;
   let totalTax = priceConverted * 0.2;

   if (priceConverted > 200) {
      deliveryCharge = 30;
      totalTax = priceConverted * 0.2;
   }
   if (priceConverted > 400) {
      deliveryCharge = 50;
      totalTax = priceConverted * 0.3;
   }
   if (priceConverted > 500) {
      deliveryCharge = 60;
      totalTax = priceConverted * 0.4;
   }

   setInnerText('delivery-charge', deliveryCharge);
   setInnerText('total-tax', totalTax);
};

const updateTotal = () => {
   const price = getInputValue('price');
   const deliveryCharge = getInputValue('delivery-charge');
   const totalTax = getInputValue('total-tax');
   const grandTotal = price + deliveryCharge + totalTax;
   document.getElementById('total').innerText = grandTotal.toFixed(2);
};

document.getElementById("search-btn").addEventListener("click", function () {
   const inputField = document.getElementById("input-value").value;
   const searchedProducts = arr.filter(p => p.category.startsWith(inputField));
   showProducts(searchedProducts);
});