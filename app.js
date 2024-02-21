let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let total = document.querySelector('.total');
let products = [];
let cart = [];

const addInputField = () => {
    // Create input field
    const inputField = document.createElement('input');
    inputField.type = 'number'; // Set input type as number
    inputField.value = 0; // Set initial value
    inputField.id = 'incrementInput'; // Assign an ID for reference

    // Create increment button
    const incrementButton = document.createElement('button');
    incrementButton.textContent = 'Increment';
    incrementButton.addEventListener('click', function() {
        const userInput = document.getElementById('incrementInput');
        let currentValue = parseInt(userInput.value);
        currentValue++;
        userInput.value = currentValue;
    });

    // Add input field and button to the container
    container.appendChild(inputField);
    container.appendChild(incrementButton);
}; 

function displayAmount() {
    // Retrieve the value entered by the user
    var userInput = document.getElementById('amountInput').value;

    // Use the userInput variable for further operations or display
    console.log("User entered: " + userInput); // Log the value to the console

    // Example: Display the value in an alert
    alert("User entered: " + userInput);
}


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
    reloadCard();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;

        })
    }
    iconCartSpan.innerText = totalQuantity;
    
}

function reloadCard() {
    listCartHTML.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    cart.forEach((cartItem) => {
        // Find the corresponding product
        let product = products.find(p => p.id == cartItem.product_id);
        if (product) {
            totalPrice += product.price * cartItem.quantity;
            count += cartItem.quantity;

            let newDiv = document.createElement('div');
            newDiv.innerHTML = `
                <div><img src="image/${product.image}"/></div>
                <div>${product.name}</div>
                <div>$${(product.price * cartItem.quantity).toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity('${cartItem.product_id}', ${cartItem.quantity - 1})">-</button>
                    <div class="count">${cartItem.quantity}</div>
                    <button onclick="changeQuantity('${cartItem.product_id}', ${cartItem.quantity + 1})">+</button>
                </div>`;
            listCartHTML.appendChild(newDiv);
        }
    });

    total.innerText = totalPrice.toLocaleString();
    iconCartSpan.innerText = count;

    // Save the total cart value to local storage
    localStorage.setItem('totalCartValue', totalPrice);
}



listCartHTML.addEventListener('click', (event) => {
    let targetElement = event.target;

    // Check if the clicked element is a quantity change button
    if (targetElement.classList.contains('minus') || targetElement.classList.contains('plus')) {
        let productDiv = targetElement.closest('.item'); // Get the closest parent with the class 'item'
        let product_id = productDiv.dataset.id; // Retrieve the product ID from the data attribute

        let type = targetElement.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((item) => item.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity++;
        } else if (type === 'minus' && cart[positionItemInCart].quantity > 1) {
            cart[positionItemInCart].quantity--;
        } else if (type === 'minus' && cart[positionItemInCart].quantity === 1) {
            cart.splice(positionItemInCart, 1); // Remove the item from the cart if its quantity goes to 0
        }

        addCartToHTML(); // Update the cart display
        addCartToMemory(); // Update the cart in local storage
        reloadCard(); // Update the total
        localStorage.setItem('totalCartValue', totalCartValue);
    }
};

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
    addInputField();
    reloadCard();
}
initApp();

$ = function(id) {
    return document.getElementById(id);
  }
  
  var show = function(id) {
      $(id).style.display ='block';
  }
  var hide = function(id) {
      $(id).style.display ='none';
  }




