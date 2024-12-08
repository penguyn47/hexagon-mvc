document.getElementById("commentForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn chặn reload trang

    // Lấy dữ liệu từ form
    const cardBody = document.querySelector(".card-body");
    const productId = cardBody.getAttribute("ProductId");
    const userId = cardBody.getAttribute("userID");
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    // Tạo payload cho API
    const payload = {
        productId: productId,
        userId: userId,
        rating: rating,
        comment: comment
    };

    try {
        // Gửi dữ liệu đến API
        const response = await fetch(`/api/reviews/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            
            // Tạo phần tử HTML mới cho bình luận
            const newComment = document.createElement("div");
            newComment.classList.add("list-group-item");
            newComment.innerHTML = `
                <div class="d-flex align-items-start">
                    <!-- Avatar -->
                    <div class="flex-shrink-0">
                        <img src=${result.user.url} class="rounded-circle" alt="User Avatar" style="width: 50px; height: 50px; margin-right: 5px; border-radius:50%;object-fit: cover;object-position: center;">
                    </div>
                    <!-- Nội dung bình luận -->
                    <div class="flex-grow-1 ms-3">
                        <h5 class="mb-1">${result.user.username}</h5>
                        <!-- Phần Rating -->
                        <div class="mb-2">
                            <span class="text-warning">
                                ${'<i class="fa fa-star"></i>'.repeat(result.rating)}${'<i class="fa fa-star-o" style="color: gray;"></i>'.repeat(5 - result.rating)}
                            </span>
                            <small class="text-muted ms-2">Rated ${result.rating}/5</small>
                        </div>
                        <!-- Phần Comment -->
                        <p class="mb-1">${result.comment}</p>
                        <small class="text-muted">${new Date(result.updatedAt).toLocaleString()}</small>
                    </div>
                </div>
            `;

        // Thêm bình luận mới vào danh sách
        document.querySelector(".list-group").append(newComment);

        // Xóa nội dung form sau khi gửi thành công
        document.getElementById("commentForm").reset();
        } else {
            const errorData = await response.json();
            alert("Failed to add comment: " + errorData.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while adding the comment.");
    }
});
