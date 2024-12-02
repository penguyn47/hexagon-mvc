function initializeCart() {
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
}

function removeFromCart(button, productId) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    const item = button.closest(".cart-item");
    item.remove();
    
    const cartItemCount = document.getElementById("cart-number-items");

    if (cart.length === 0) {
        updateCartDisplay();
        cartItemCount.innerHTML = "";
        return;
    } else {
        cartItemCount.innerHTML = cart.length;
    }
}

function getProductQuantity(productId) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const product = cart.find(item => item.id === productId);
    return product ? product.quantity : 0;
}


function increaseQuantity(productId, number = 1) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity+= number;
        document.getElementById(`product-${productId}-count`).innerHTML = product.quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        const cartList = document.getElementById("cart-list");
        cartList.style.display = "block";
    }
}

function decreaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const product = cart.find(item => item.id === productId);
    if (product && product.quantity > 1) {
        product.quantity--;
        document.getElementById(`product-${productId}-count`).innerHTML = product.quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}


async function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartList = document.getElementById("cart-list");
    const cartItemCount = document.getElementById("cart-number-items");

    cartList.innerHTML = `<div class="cart-footer">
                            <span>Quick Cart</span>
                            <button onclick="navigateToDetailsCart()">Details</button>
                        </div>
                        <hr>`;

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty.</p>";
        cartItemCount.innerHTML = "";
        return;
    } else {
        cartItemCount.innerHTML = cart.length;
    }

    // Use a variable to accumulate all the cart items first
    let cartItemsHTML = '';
    
    for (const { id: productId, quantity } of cart) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

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

    // After all items are processed, update the cart list in one go
    cartList.innerHTML += cartItemsHTML;
}


function addToCart(productId, number=1) {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart"));

    // Tìm chỉ mục của sản phẩm trong giỏ hàng
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới với số lượng được chỉ định
        cart.push({ id: productId, quantity: number });
        localStorage.setItem("cart", JSON.stringify(cart));
        const cartList = document.getElementById("cart-list");
        cartList.style.display = "block";
        updateCartDisplay();
    } else {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng theo số lượng mới
        increaseQuantity(productId, number);
    }
}


function hideCartOnClickOutside(event) {
    const cartList = document.getElementById("cart-list");
    const cartButton = document.querySelector(".btn-primary");

    // Kiểm tra nếu nhấp bên ngoài cart-list và nút giỏ hàng
    if (!cartList.contains(event.target) && !cartButton.contains(event.target)) {
        cartList.style.display = "none";
        document.removeEventListener("click", hideCartOnClickOutside); // Hủy bỏ sự kiện sau khi ẩn
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

function navigateToDetailsCart() {
    window.location.href = '/cart';
}


initializeCart();
updateCartDisplay();