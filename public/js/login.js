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

        // Kiểm tra phản hồi từ server
        if (response.ok) {
            console.log(response);
            if (response.redirected){
                window.location.href = response.url;
            }
        } else {
            if (response.status == 401){
                showAlert("danger","Username and password is not matched");
            }
        }
    } catch (err) {
        console.error("Error during registration:", err);
        showAlert("danger", "Something went wrong. Please try again later.");
    }
});
