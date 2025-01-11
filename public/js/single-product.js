const updateTotal = () => {
    const price = document.getElementById('price').innerHTML;
    const total = document.getElementById('total-price');
    const quantity = document.getElementById('quantity').value;

    total.innerHTML = `Total: $${(parseFloat(price.replace("$", ""), 10)*quantity).toFixed(2)}`;
}

document.querySelectorAll('.minus').forEach(button => {
    button.addEventListener('click', function() {
        const quantityInput = this.nextElementSibling;
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
        }
        updateTotal();
    });
});

document.querySelectorAll('.plus').forEach(button => {
    button.addEventListener('click', function() {
        const quantityInput = this.previousElementSibling;
        let currentQuantity = parseInt(quantityInput.value);
        quantityInput.value = currentQuantity + 1;
        updateTotal();
    });
});

function OnClickAdd(productId) {
    const quantityInput = document.querySelector('input[name="quantity"]');
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
}

document.getElementById('quantity').onchange = () => {
    updateTotal();
}