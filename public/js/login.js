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
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    } catch (err) {
        console.error("Error during registration:", err);
        showAlert("danger", "Something went wrong. Please try again later.");
    }
});
