syncCartAdd = async (productId, quantity=1) => {
    try {
        const response = await fetch("/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity }), // Gửi productId trong body
        });

        if (!response.ok) {
            throw new Error("Failed to add product to cart.");
        }

        const result = await response.json();
        console.log("Product added to cart:", result);
        return result; // Trả về kết quả từ server
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        throw error; // Throw lại lỗi để xử lý bên ngoài (nếu cần)
    }
};

syncCartRemove = async (productId) => {
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to remove product from cart.");
        }

        const result = await response.json();
        console.log("Product removed from cart:", result);
        return result; // Trả về kết quả từ server
    } catch (error) {
        console.error("Error removing product from cart:", error.message);
        throw error; // Throw lại lỗi để xử lý bên ngoài (nếu cần)
    }
};

syncCartUpdate = async (productId, quantity) => {
    try {
        // Kiểm tra trước khi gửi yêu cầu
        if (quantity < 1) {
            throw new Error("Quantity must be at least 1.");
        }

        // Gửi yêu cầu cập nhật giỏ hàng
        const response = await fetch("/api/cart/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity }), // Gửi productId và quantity trong body
        });

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            throw new Error("Failed to update product quantity in cart.");
        }

        // Xử lý kết quả từ server
        const result = await response.json();
        console.log("Cart updated successfully:", result);

        return result; // Trả về kết quả từ server
    } catch (error) {
        console.error("Error updating cart:", error.message);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};
