// Initialize cart if not present
function initializeCart() {
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
}

// Helper function to get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

// Helper function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Remove item from cart
function removeFromCart(button, productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    const item = button.closest(".cart-item");
    item.remove();

    updateCartDisplay();
    syncCartRemove && syncCartRemove(productId);
}

// Get product quantity from cart
function getProductQuantity(productId) {
    const cart = getCart();
    const product = cart.find(item => item.id === productId);
    return product ? product.quantity : 0;
}

// Increase product quantity in cart
function increaseQuantity(productId, number = 1) {
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += number;
        updateCartItemQuantity(productId);
        saveCart(cart);

        updateCartDisplay();
        syncCartAdd && syncCartAdd(productId, number);
    }
}

// Decrease product quantity in cart
function decreaseQuantity(productId) {
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    if (product && product.quantity > 1) {
        product.quantity--;
        updateCartItemQuantity(productId);
        saveCart(cart);

        updateCartDisplay();
        syncCartUpdate && syncCartUpdate(productId, product.quantity);
    }
}

// Update quantity in the UI
function updateCartItemQuantity(productId) {
    const product = getCart().find(item => item.id === productId);
    if (product) {
        document.getElementById(`product-${productId}-count`).innerHTML = product.quantity;
    }
}

// Update cart display with smooth transitions
async function updateCartDisplay() {
    const cart = getCart();
    const cartList = document.getElementById("cart-list");
    const cartItemCount = document.getElementById("cart-number-items");

    cartList.innerHTML = `
        <div class="cart-footer">
            <span>Quick Cart</span>
            <button onclick="navigateToDetailsCart()">Details</button>
        </div>
        <hr>`;

    if (cart.length === 0) {
        cartList.innerHTML += "<p>Your cart is empty.</p>";
        cartItemCount.innerHTML = "";
        return;
    } else {
        cartItemCount.innerHTML = cart.length;
    }

    let cartItemsHTML = '';

    // Loop through cart and fetch product data
    for (const { id: productId, quantity } of cart) {
        try {
            const product = await getProductData(productId);
            cartItemsHTML += `
                <div class="cart-item">
                    <img src="${product.url}" alt="${product.productName}">
                    <div class="item-details">
                        <p>${product.productName}</p>
                        <span class="stock-info">(Stock: ${product.stock_quanity})</span>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button onclick="decreaseQuantity(${productId})">-</button>
                            <div id="product-${productId}-count">${quantity}</div>
                            <button onclick="increaseQuantity(${productId})">+</button>
                        </div>
                        <button class="delete-btn" onclick="removeFromCart(this,${productId})">X</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Failed to fetch product with ID ${productId}:`, error);
        }
    }

    // After processing all items, update the cart list
    cartList.innerHTML += cartItemsHTML;

    // Ensure the cart is displayed after updating the items (don't hide cart after update)
    if (!cartList.classList.contains('show')) {
        cartList.classList.add('show');
    }
}

// Fetch product data (cached version)
let productCache = {};  // Caching product data
async function getProductData(productId) {
    if (productCache[productId]) {
        return productCache[productId];
    }

    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    productCache[productId] = product;
    return product;
}

// Add product to cart or increase quantity if already in cart
function addToCart(productId, number = 1) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        cart.push({ id: productId, quantity: number });
        saveCart(cart);
        updateCartDisplay();
    } else {
        increaseQuantity(productId, number);
    }

    syncCartAdd && syncCartAdd(productId, number);
}

// Hide cart on click outside
function hideCartOnClickOutside(event) {
    const cartList = document.getElementById("cart-list");
    const cartButton = document.querySelector(".btn-primary");

    if (!cartList.contains(event.target) && !cartButton.contains(event.target)) {
        cartList.classList.remove('show');
        document.removeEventListener("click", hideCartOnClickOutside); // Remove event listener
    }
}

function toggleCartList() {
    const cartList = document.getElementById("cart-list");
    const isVisible = cartList.style.display === "block";

    // Ẩn hoặc hiện giỏ hàng
    cartList.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
        // Thêm sự kiện click bên ngoài khi hiển thị
        document.addEventListener("click", hideCartOnClickOutside);
    } else {
        // Xóa sự kiện nếu giỏ hàng đã ẩn
        document.removeEventListener("click", hideCartOnClickOutside);
    }
}

// Navigate to detailed cart page
function navigateToDetailsCart() {
    window.location.href = '/cart';
}

// Initialize and update cart on page load
initializeCart();
updateCartDisplay();
