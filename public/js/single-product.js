
document.querySelectorAll('.minus').forEach(button => {
    button.addEventListener('click', function() {
        const quantityInput = this.nextElementSibling;
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
        }
    });
});

document.querySelectorAll('.plus').forEach(button => {
    button.addEventListener('click', function() {
        const quantityInput = this.previousElementSibling;
        let currentQuantity = parseInt(quantityInput.value);
        quantityInput.value = currentQuantity + 1;
    });
});

function OnClickAdd(productId) {
    const quantityInput = document.querySelector('input[name="quantity"]');
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
}
