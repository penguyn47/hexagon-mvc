function showAlert(type, message) {
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
}

// Lấy thông tin giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hàm tạo HTML cho một sản phẩm trong giỏ hàng
async function renderCartItems() {
    const cartItemsArea = document.querySelector('.cart-items-area');
    cartItemsArea.innerHTML = ''; // Clear existing items

    if(cart.length == 0){
        cartItemsArea.innerHTML = `<h1>No products.</h1>
                                    <hr>
                                    <a href="/">Go back to home</a>`;
    }
    
    // Duyệt qua từng item trong giỏ hàng
    for (const item of cart) {
        const productId = item.id;
        const quantity = item.quantity;

        // Gọi API để lấy thông tin sản phẩm (tên, mô tả, giá)
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        const productName = product.productName || "Product Name"; // Tên sản phẩm
        const productDescription = product.description || "A brief description of the product."; // Mô tả sản phẩm
        const productPrice = product.price || 0; // Giá sản phẩm

        // Tạo dòng HTML cho sản phẩm trong giỏ hàng
        const cartItemHtml = `
            <div class="row cart-item align-items-center">
                <div class="col-4">
                    <img src="${product.url}" alt="Product Image" class="img-fluid">
                </div>
                <div class="col-4">
                    <h5>${productName}</h5>
                    <p class="text-muted">${productDescription}</p>
                </div>
                <div class="col-4 text-end">
                    <p class="cart-price">$${productPrice.toFixed(2)}</p>
                </div>
                <div class="col-4"></div>
                <div class="col-4">
                    <div class="quantity-box">
                        <button class="product-quantity__btn-minus">-</button>
                        <input type="text" readonly inputmode="numeric" pattern="^[1-9][0-9]*$" class="no-spinners" value="${quantity}">
                        <button class="product-quantity__btn-plus">+</button>
                    </div>
                </div>
                <div class="col-4 text-end">
                    <button class="cart-remove" data-id="${productId}">Delete</button>
                </div>
            </div>
        `;

        // Thêm dòng HTML vào giỏ hàng
        cartItemsArea.insertAdjacentHTML('beforeend', cartItemHtml);
    }
}

// Hàm xử lý sự kiện khi thay đổi số lượng hoặc xóa sản phẩm
function handleCartActions() {
    document.querySelectorAll('.product-quantity__btn-plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('.quantity-box').querySelector('input');
            let quantity = parseInt(input.value, 10);
            input.value = ++quantity;
            updateCart();
            updateTotal();
        });
    });

    document.querySelectorAll('.product-quantity__btn-minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('.quantity-box').querySelector('input');
            let quantity = parseInt(input.value, 10);
            if (quantity > 1) {
                input.value = --quantity;
            }
            updateCart();
            updateTotal();
        });
    });

    document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id, 10);
            removeFromCart(productId);
        });
    });
}

// Hàm cập nhật lại giỏ hàng
function updateCart() {
    const cartItems = [];
    document.querySelectorAll('.quantity-box input').forEach(input => {
        const productId = parseInt(input.closest('.cart-item').querySelector('.cart-remove').dataset.id, 10);
        const quantity = parseInt(input.value, 10);
        cartItems.push({ id: productId, quantity });
        if (syncCartUpdate) syncCartUpdate(productId, quantity);
    });
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Hàm xóa sản phẩm khỏi giỏ hàng
async function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    await renderCartItems();
    handleCartActions();
    updateTotal();
    if (syncCartRemove) syncCartRemove(productId);
    showAlert("success", "Removed product from cart!");
}

// Hàm tính tổng tiền giỏ hàng
async function updateTotal() {
    let total = 0;
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Duyệt qua tất cả các sản phẩm trong giỏ hàng
    for (const item of cart) {
        const productId = item.id;
        const quantity = item.quantity;

        // Lấy thông tin sản phẩm từ API
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        const productPrice = product.price || 0; // Lấy giá sản phẩm

        // Cộng dồn vào tổng tiền
        total += productPrice * quantity;
    }

    // Cập nhật tổng tiền vào DOM sau khi tất cả giá trị được tính
    const cartTotalElement = document.querySelector('.cart-total');
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}




// Gọi hàm để render giỏ hàng và xử lý sự kiện
(async () => {
    await renderCartItems();
    await handleCartActions();
    updateTotal();
}) ();


document.getElementById('checkoutButton').addEventListener('click', async () => {
    // Lấy thông tin địa chỉ giao hàng
    const shippingAddress = document.querySelector('textarea').value.trim();

    // Lấy phương thức thanh toán được chọn
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.id;

    // Kiểm tra dữ liệu đầu vào
    if (!shippingAddress) {
        showAlert("danger","Please type in shipping address");
        return;
    }
    if (!paymentMethod) {
        showAlert("danger","Please choose your payment method");
        return;
    }

    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống.');
        return;
    }

    try {
        // Lấy thông tin sản phẩm và chuẩn bị orderItems
        const orderItems = [];
        let totalCost = 0;

        for (const item of cart) {
            // Gọi API để lấy thông tin sản phẩm từ ID
            const response = await fetch(`/api/products/${item.id}`);
            if (!response.ok) throw new Error('Không thể lấy thông tin sản phẩm');
            const product = await response.json();

            // Tính giá trị của sản phẩm và thêm vào orderItems
            const productCost = product.price * item.quantity;
            totalCost += productCost;

            orderItems.push({
                productId: item.id,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            });
        }

        // Chuẩn bị dữ liệu đơn hàng
        const orderData = {
            paymentMethod: paymentMethod,
            shippingAddress: shippingAddress,
            orderStatus: 'pending',
            totalCost: totalCost,
        };

        // Gửi yêu cầu tạo đơn hàng đến API
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderData, orderItems }),
        });

        if (!response.ok) throw new Error('Không thể tạo đơn hàng');

        const order = await response.json();

        // Hiển thị thông báo và xóa giỏ hàng
        alert('Đơn hàng của bạn đã được tạo thành công!');
        localStorage.removeItem('cart');

        await fetch("/api/cart/clear", {method: "DELETE"});

        // Chuyển hướng nếu cần
        window.location.href = '/';
    } catch (error) {
        console.error('Lỗi khi xử lý thanh toán:', error);
        alert('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.');
    }
});
