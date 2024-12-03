document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form reload trang

    // Lấy giá trị từ các trường input
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const alertContainer = document.getElementById("alert-container");

    // Hàm hiển thị alert
    alertContainer.innerHTML = "";
    function showAlert(type, message) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
    }

    // Tạo object dữ liệu đăng nhập
    const data = {
        username,
        password
    };

    try {
        // Gửi yêu cầu POST đến API backend
        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if(response.ok == false){
            showAlert("danger", resData.message);
        } else {
            showAlert("success", resData.message + "\nRedirecting...");

            // Lấy dữ liệu giỏ hàng từ localStorage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Gửi từng sản phẩm trong giỏ hàng lên server
            const addItemsToCart = async () => {
                try {
                    for (const item of cart) {
                        const response = await fetch("/api/cart/add", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                productId: item.id,
                                quantity: item.quantity,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error(`Failed to add item with productId ${item.productId}`);
                        }

                        const data = await response.json();
                        console.log(`Added product ${item.productId} to cart:`, data);
                    }
                } catch (error) {
                    console.error("Error adding items to cart:", error);
                }
            };

            // Gọi hàm thêm sản phẩm vào giỏ hàng
            await addItemsToCart();
            fetch("/api/cart", {
                method: "GET",
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch cart items.");
                }
                return response.json();
            })
            .then(data => {
                // Chuyển đổi data thành mảng các đối tượng { productId, quantity }
                const cartItems = data.map(item => ({
                    id: item.productId,
                    quantity: item.quantity,
                }));
        
                // Lưu cartItems vào localStorage
                localStorage.setItem("cart", JSON.stringify(cartItems));
            })
            .catch(error => {
                console.error("Error fetching cart items:", error);
            });
            

            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    } catch (err) {
        console.error("Error during registration:", err);
        showAlert("danger", "Something went wrong. Please try again later.");
    }
});
