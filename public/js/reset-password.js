document
  .getElementById("reset-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form reload trang

    // Lấy giá trị từ các trường input
    const token = document.getElementById("token").value.trim();
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

    // Tạo object dữ liệu quên mật khẩu
    const data = {
      token,
      password
    };

    try {
      // Gửi yêu cầu POST đến API backend
      const response = await fetch("/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      });

  if (response.ok) {
    // Phản hồi thành công, giả định JSON
    const result = await response.json();
    showAlert("success", result.message);
  setTimeout(() => {
    window.location.href = "/users/login";
  }, 2000); // Chờ 2 giây trước khi chuyển hướng
  } else {
    // Xử lý phản hồi lỗi
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await response.json(); // Nếu là JSON hợp lệ
      showAlert("danger", error.message || "Error resetting password");
    } else {
      // Nếu không phải JSON
      const errorText = await response.text();
      showAlert("danger", errorText || "Unknown error occurred");
    }
  }
    } catch (err) {
      showAlert("danger", "Something went wrong. Please try again later.");
    }
  });
