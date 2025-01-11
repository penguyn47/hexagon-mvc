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
                            <small class="rating text-muted ms-2">Rated ${result.rating}/5</small>
                        </div>
                        <!-- Phần Comment -->
                        <p class="comment-text mb-1" style="font-size: 1.25rem;">${result.comment}</p>
                        <small class="text-muted">${new Date(result.updatedAt).toLocaleString()}</small>
                        <!-- Thêm các nút Sửa và Xóa nếu user trùng -->
                        <div class="mt-2">
                            <button class="btn btn-sm btn-warning edit-comment" data-id="${result.id}" data-product-id="${result.productId}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-comment" data-id="${result.id}" data-product-id="${result.productId}">Delete</button>
                        </div>
                        <!-- Thêm phần comment-section ở đây -->
                        <div class="comment-section"></div>
                    </div>
                </div>
            `;
            // Thêm sự kiện cho các nút Edit và Delete của bình luận mới
            newComment.querySelector('.delete-comment').addEventListener('click', async (event) => {
                const reviewId = event.target.getAttribute('data-id');
                const productId = event.target.getAttribute('data-product-id');
                if (confirm('Are you sure you want to delete this comment?')) {
                    try {
                        const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (response.ok) {
                            newComment.remove();
                            alert('Comment deleted successfully!');
                        } else {
                            alert('Failed to delete the comment. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error deleting comment:', error);
                        alert('There was an error with the request. Please try again.');
                    }
                }
            });

            newComment.querySelector('.edit-comment').addEventListener('click', async (event) => {
                const reviewId = event.target.getAttribute('data-id');
                const productId = event.target.getAttribute('data-product-id');
                const reviewElement = event.target.closest('.list-group-item');
                const ratingText = reviewElement.querySelector('.rating').textContent;
                const commentText = reviewElement.querySelector('.comment-text').textContent;
                const rating = ratingText.match(/\d+/)[0];
                const formHtml = `
                    <form id="editCommentForm" style="padding: 10px;" data-review-id="${reviewId}" data-product-id="${productId}">
                        <div class="mb-3">
                            <label for="rating" class="form-label">Rating</label>
                            <select class="form-select" id="rating">
                                <option value="5" ${rating == 5 ? 'selected' : ''}>5 - Excellent</option>
                                <option value="4" ${rating == 4 ? 'selected' : ''}>4 - Very Good</option>
                                <option value="3" ${rating == 3 ? 'selected' : ''}>3 - Good</option>
                                <option value="2" ${rating == 2 ? 'selected' : ''}>2 - Fair</option>
                                <option value="1" ${rating == 1 ? 'selected' : ''}>1 - Poor</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="comment" class="form-label">Comment</label>
                            <textarea class="form-control" id="comment" rows="3" placeholder="Write your comment here...">${commentText}</textarea>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </form>
                `;
                const commentSection = reviewElement.querySelector('.comment-section');
                commentSection.innerHTML = formHtml;
                const editForm = document.getElementById('editCommentForm');
                editForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const newRating = document.getElementById('rating').value;
                    const newComment = document.getElementById('comment').value;
                    try {
                        const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ rating: newRating, comment: newComment })
                        });
                        if (response.ok) {
                            const updatedReview = await response.json();
                            reviewElement.querySelector('.rating').textContent = `Rated ${updatedReview.rating}/5`;
                            reviewElement.querySelector('.text-warning').innerHTML = `${'<i class="fa fa-star"></i>'.repeat(updatedReview.rating)}${'<i class="fa fa-star-o" style="color: gray;"></i>'.repeat(5 - updatedReview.rating)}`;
                            reviewElement.querySelector('.comment-text').textContent = updatedReview.comment;
                            editForm.remove();
                            alert('Comment updated successfully!');
                        } else {
                            alert('Failed to update the comment');
                        }
                    } catch (error) {
                        console.error('Error updating comment:', error);
                        alert('There was an error updating your comment');
                    }
                });
            });

        // Thêm bình luận mới vào danh sách
        const listGroup = document.querySelector(".list-group");
        const nextButton = listGroup.querySelector(".btn-success");
        listGroup.insertBefore(newComment, nextButton.parentElement);

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

document.addEventListener("DOMContentLoaded", () => {
    // Lắng nghe sự kiện click trên các nút Delete
    const deleteButtons = document.querySelectorAll('.delete-comment');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // Lấy id của review và product từ data attribute
            const reviewId = event.target.getAttribute('data-id');
            const productId = event.target.getAttribute('data-product-id');
            
            // Xác nhận hành động xóa
            if (confirm('Are you sure you want to delete this comment?')) {
                try {
                    // Gọi API DELETE với fetch
                    const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    // Kiểm tra xem API có trả về thành công không
                    if (response.ok) {
                        // Nếu xóa thành công, xóa phần tử bình luận khỏi DOM
                        const commentElement = event.target.closest('.list-group-item');
                        commentElement.remove();
                        alert('Comment deleted successfully!');
                    } else {
                        // Nếu có lỗi, thông báo lỗi cho người dùng
                        alert('Failed to delete the comment. Please try again.');
                    }
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    alert('There was an error with the request. Please try again.');
                }
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Lắng nghe sự kiện click trên các nút Edit
    const editButtons = document.querySelectorAll('.edit-comment');
    
    editButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
        
            const reviewId = event.target.getAttribute('data-id');
            const productId = event.target.getAttribute('data-product-id');

            // Lấy bình luận cần chỉnh sửa
            const reviewElement = event.target.closest('.list-group-item'); // Giả sử reviewElement là parent div của mỗi bình luận
            const ratingText = reviewElement.querySelector('.rating').textContent;  // Đoạn text "Rated 4/5"
            const commentText = reviewElement.querySelector('.comment-text').textContent;  // Nội dung bình luận

            // Chuyển rating text thành số
            const rating = ratingText.match(/\d+/)[0];  // Lấy số trong "Rated 4/5"

            // Tạo form dưới bình luận để chỉnh sửa
            const formHtml = `
                <form id="editCommentForm" style="padding: 10px;" data-review-id="${reviewId}" data-product-id="${productId}">
                    <div class="mb-3">
                        <label for="rating" class="form-label">Rating</label>
                        <select class="form-select" id="rating">
                            <option value="5" ${rating == 5 ? 'selected' : ''}>5 - Excellent</option>
                            <option value="4" ${rating == 4 ? 'selected' : ''}>4 - Very Good</option>
                            <option value="3" ${rating == 3 ? 'selected' : ''}>3 - Good</option>
                            <option value="2" ${rating == 2 ? 'selected' : ''}>2 - Fair</option>
                            <option value="1" ${rating == 1 ? 'selected' : ''}>1 - Poor</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="comment" class="form-label">Comment</label>
                        <textarea class="form-control" id="comment" rows="3" placeholder="Write your comment here...">${commentText}</textarea>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            `;

            // Thêm form vào dưới bình luận
            const commentSection = reviewElement.querySelector('.comment-section');

            commentSection.innerHTML = formHtml;  // Thêm form vào khu vực bình luận (có class .comment-section)

            // Lắng nghe sự kiện submit form
            const editForm = document.getElementById('editCommentForm');
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();  // Ngừng hành động submit mặc định

                const newRating = document.getElementById('rating').value;
                const newComment = document.getElementById('comment').value;

                try {
                    // Gửi dữ liệu cập nhật lên server
                    const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ rating: newRating, comment: newComment })
                    });

                    if (response.ok) {
                        // Nếu thành công, cập nhật lại bình luận và rating trên giao diện
                        const updatedReview = await response.json();
                        reviewElement.querySelector('.rating').textContent = `Rated ${updatedReview.rating}/5`;
                        reviewElement.querySelector('.text-warning').innerHTML = `${'<i class="fa fa-star"></i>'.repeat(updatedReview.rating)}${'<i class="fa fa-star-o" style="color: gray;"></i>'.repeat(5 - updatedReview.rating)}`;
                        reviewElement.querySelector('.comment-text').textContent = updatedReview.comment;
                        // Xóa form sau khi cập nhật thành công
                        editForm.remove();
                        // Thông báo thành công
                        alert('Comment updated successfully!');
                    } else {
                        alert('Failed to update the comment');
                    }
                } catch (error) {
                    console.error('Error updating comment:', error);
                    alert('There was an error updating your comment');
                }
            });
        });
    });
});

// Hàm để lấy reviews theo trang
async function fetchReviewsByPage(productId, page) {
    try {
        const response = await fetch(`/api/products/${productId}/${page}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}


// Event listeners cho nút Previous và Next
document.querySelector('.btn-previous').addEventListener('click', async () => {
    const numPageElement = document.getElementById('num-page');
    const productId = window.location.href.split('/').pop();
    let page = parseInt(numPageElement.textContent);    
    if (page > 0) {
        page -= 1;
        const reviews = await fetchReviewsByPage(productId, page);
        if (reviews.length === 0) {
            alert('No more reviews to display.');
            return;
        }

        numPageElement.textContent = page;
        // Cập nhật giao diện với reviews mới
        updateReviewsUI(reviews);
    }
});

document.querySelector('.btn-success').addEventListener('click', async () => {
    const numPageElement = document.getElementById('num-page');
    let page = parseInt(numPageElement.textContent);
    const productId = window.location.href.split('/').pop();    
    const reviews = await fetchReviewsByPage(productId, page + 1);
    if (reviews.length === 0) {
        alert('No more reviews to display.');
        return;
    }
    page += 1;
    numPageElement.textContent = page;
    // Cập nhật giao diện với reviews mới
    updateReviewsUI(reviews);
});

// Hàm để cập nhật giao diện với reviews mới
function updateReviewsUI(reviews) {
    const listGroup = document.querySelector('.list-group');
    // Xóa các bình luận cũ nhưng giữ lại các nút Previous và Next
    const buttons = listGroup.querySelector('.d-flex.justify-content-center.mt-4');
    listGroup.innerHTML = '';
    listGroup.appendChild(buttons);
    const cardBody = document.querySelector(".card-body");
    const currentUserId = cardBody.getAttribute("userID");
    reviews.forEach(review => {
        const newComment = document.createElement('div');
        newComment.classList.add('list-group-item');
        newComment.innerHTML = `
            <div class="d-flex align-items-start">
            <div class="flex-shrink-0">
            <img src=${review.user.url} class="rounded-circle" alt="User Avatar" style="width: 50px; height: 50px; margin-right: 5px; border-radius:50%;object-fit: cover;object-position: center;">
            </div>
            <div class="flex-grow-1 ms-3">
            <h5 class="mb-1">${review.user.username}</h5>
            <div class="mb-2">
            <span class="text-warning">
                ${'<i class="fa fa-star"></i>'.repeat(review.rating)}${'<i class="fa fa-star-o" style="color: gray;"></i>'.repeat(5 - review.rating)}
            </span>
            <small class="rating text-muted ms-2">Rated ${review.rating}/5</small>
            </div>
            <p class="comment-text mb-1" style="font-size: 1.25rem;">${review.comment}</p>
            <small class="text-muted">${new Date(review.updatedAt).toLocaleString()}</small>
            <div class="mt-2">
                <button class="btn btn-sm btn-warning edit-comment" data-id="${review.id}" data-product-id="${review.productId}" ${review.user.id == currentUserId ? '' : 'hidden'}>Edit</button>
                <button class="btn btn-sm btn-danger delete-comment" data-id="${review.id}" data-product-id="${review.productId}" ${review.user.id == currentUserId ? '' : 'hidden'}>Delete</button>
            </div>
            <div class="comment-section"></div>
            </div>
            </div>
        `;
        // Thêm sự kiện cho các nút Edit và Delete của bình luận mới
        newComment.querySelector('.delete-comment').addEventListener('click', async (event) => {
            const reviewId = event.target.getAttribute('data-id');
            const productId = event.target.getAttribute('data-product-id');
            if (confirm('Are you sure you want to delete this comment?')) {
                try {
                    const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        newComment.remove();
                        alert('Comment deleted successfully!');
                    } else {
                        alert('Failed to delete the comment. Please try again.');
                    }
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    alert('There was an error with the request. Please try again.');
                }
            }
        });

        newComment.querySelector('.edit-comment').addEventListener('click', async (event) => {
            const reviewId = event.target.getAttribute('data-id');
            const productId = event.target.getAttribute('data-product-id');
            const reviewElement = event.target.closest('.list-group-item');
            const ratingText = reviewElement.querySelector('.rating').textContent;
            const commentText = reviewElement.querySelector('.comment-text').textContent;
            const rating = ratingText.match(/\d+/)[0];
            const formHtml = `
                <form id="editCommentForm" style="padding: 10px;" data-review-id="${reviewId}" data-product-id="${productId}">
                    <div class="mb-3">
                        <label for="rating" class="form-label">Rating</label>
                        <select class="form-select" id="rating">
                            <option value="5" ${rating == 5 ? 'selected' : ''}>5 - Excellent</option>
                            <option value="4" ${rating == 4 ? 'selected' : ''}>4 - Very Good</option>
                            <option value="3" ${rating == 3 ? 'selected' : ''}>3 - Good</option>
                            <option value="2" ${rating == 2 ? 'selected' : ''}>2 - Fair</option>
                            <option value="1" ${rating == 1 ? 'selected' : ''}>1 - Poor</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="comment" class="form-label">Comment</label>
                        <textarea class="form-control" id="comment" rows="3" placeholder="Write your comment here...">${commentText}</textarea>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            `;
            const commentSection = reviewElement.querySelector('.comment-section');
            commentSection.innerHTML = formHtml;
            const editForm = document.getElementById('editCommentForm');
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newRating = document.getElementById('rating').value;
                const newComment = document.getElementById('comment').value;
                try {
                    const response = await fetch(`/api/reviews/${productId}/${reviewId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ rating: newRating, comment: newComment })
                    });
                    if (response.ok) {
                        const updatedReview = await response.json();
                        reviewElement.querySelector('.rating').textContent = `Rated ${updatedReview.rating}/5`;
                        reviewElement.querySelector('.text-warning').innerHTML = `${'<i class="fa fa-star"></i>'.repeat(updatedReview.rating)}${'<i class="fa fa-star-o" style="color: gray;"></i>'.repeat(5 - updatedReview.rating)}`;
                        reviewElement.querySelector('.comment-text').textContent = updatedReview.comment;
                        editForm.remove();
                        alert('Comment updated successfully!');
                    } else {
                        alert('Failed to update the comment');
                    }
                } catch (error) {
                    console.error('Error updating comment:', error);
                    alert('There was an error updating your comment');
                }
            });
        });
        listGroup.insertBefore(newComment, buttons);
    });
}