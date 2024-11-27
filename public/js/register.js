document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form reload trang

    // Lấy giá trị từ các trường input
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const password = document.getElementById("password").value.trim();
    const repassword = document.getElementById("repassword").value.trim();

    const alertContainer = document.getElementById("alert-container");

    // Hàm hiển thị alert
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

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (password.length < 6){
        showAlert("danger", "Password must be longer than 6 characters");
        return;
    }

    if (password !== repassword) {
        showAlert("danger", "Passwords do not match!");
        return;
    }

    // Tạo object dữ liệu đăng ký
    const data = {
        username,
        email,
        firstName,
        lastName,
        password
    };

    try {
        // Gửi yêu cầu POST đến API backend
        const response = await fetch("/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Kiểm tra phản hồi từ server
        if (response.ok) {
            const result = await response.json();
            showAlert("success", "Registration successful!");
            console.log(result); // Xem phản hồi từ server

            // Chuyển hướng đến trang login nếu cần
            setTimeout(() => {
                window.location.href = "/users/login";
            }, 2000);
        } else {
            const error = await response.json();
            showAlert("danger", `${error.message}`);
        }
    } catch (err) {
        console.error("Error during registration:", err);
        showAlert("danger", "Something went wrong. Please try again later.");
    }
});
