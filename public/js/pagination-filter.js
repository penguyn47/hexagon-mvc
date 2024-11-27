let sortBy = 'latest'; // Mặc định sắp xếp theo 'latest'
let sortOrder = 'asc'; // Mặc định là tăng dần

const fetchProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`/products/api?${params}`);

        const data = await response.json();

        console.log(data);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.pushState(null, '', newUrl);

        // Populate categories and manufacturers
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = `<option value="">Select Category</option>`;
        data.categories.forEach(category => {
            if (category == data.products.filters.category) {
                categorySelect.innerHTML += `<option value="${category}" selected>${category}</option>`;
            } else {
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            }
        });

        // Update results
        document.getElementById('sectionTitle').innerHTML = '';
        document.getElementById('sectionDescription').innerHTML = '';
        if(data.products.filters.q){
            document.getElementById('sectionTitle').innerHTML = `Search for "${data.products.filters.q}" with filters`;
            document.getElementById('sectionDescription').innerHTML = `Found ${data.products.products.length} products`;
        }

        // Populate ratings
        const ratingSelect = document.getElementById('rating');
        if(data.products.filters.rating){
            ratingSelect.value = data.products.filters.rating;
        }

        // Populate search
        const searchQuery = document.getElementById('search-query');
        if(data.products.filters.q){
            searchQuery.value = data.products.filters.q;
        }

        const manufacturerSelect = document.getElementById('manufacturer');
        manufacturerSelect.innerHTML = `<option value="">Select Manufacturer</option>`;
        data.manufacturers.forEach(manufacturer => {
            if (manufacturer == data.products.filters.manufacturer) {
                manufacturerSelect.innerHTML += `<option value="${manufacturer}" selected>${manufacturer}</option>`;
            } else {
                manufacturerSelect.innerHTML += `<option value="${manufacturer}">${manufacturer}</option>`;
            }
        });

        // Populate products
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        data.products.products.forEach(product => {
            productList.innerHTML += `
                <div class="col-lg-4">
                    <div class="item">
                        <div class="thumb">
                            <div class="hover-content">
                                <ul>
                                    <li><a href="/products/${product.id}"><i class="fa fa-eye"></i></a></li>
                                    <li><a href="/products/${product.id}"><i class="fa fa-star"></i></a></li>
                                    <li><a href="/products/${product.id}"><i class="fa fa-shopping-cart"></i></a></li>
                                </ul>
                            </div>
                            <img style="height: 300px; object-fit: cover;" src="${product.url}" alt="${product.productName}">
                        </div>
                        <div class="down-content">
                            <h4>${product.productName}</h4>
                            <span>$${product.price}</span>
                            <ul class="stars">
                                ${'<li><i class="fa fa-star"></i></li>'.repeat(product.rating)}
                            </ul>
                        </div>
                    </div>
                </div>`;
        });

        // Populate pagination with the desired format
        const pagination = document.getElementById('pagination-top');
        const pagination2 = document.getElementById('pagination-bot');
        pagination.innerHTML = '';
        pagination2.innerHTML = '';

        const totalPages = data.products.totalPages;
        const currentPage = data.products.currentPage;

        // Nút "Previous"
        pagination.innerHTML += `
            <a href="#" data-page="${currentPage - 1}" 
            class="prev ${currentPage === 1 ? 'disabled' : ''}">Previous</a>`;
        pagination2.innerHTML += `
            <a href="#" data-page="${currentPage - 1}" 
            class="prev ${currentPage === 1 ? 'disabled' : ''}">Previous</a>`;

        // Trang đầu tiên
        pagination.innerHTML += `<a href="#" data-page="1" class="${currentPage === 1 ? 'active' : ''}">1</a>`;
        pagination2.innerHTML += `<a href="#" data-page="1" class="${currentPage === 1 ? 'active' : ''}">1</a>`;

        // Nếu cần hiển thị "..."
        if (currentPage > 3) {
            pagination.innerHTML += `<span class="dots">...</span>`;
            pagination2.innerHTML += `<span class="dots">...</span>`;
        }

        // Hiển thị trang hiện tại và lân cận
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pagination.innerHTML += `<a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
            pagination2.innerHTML += `<a href="#" data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }

        // Nếu cần hiển thị "..."
        if (currentPage < totalPages - 2) {
            pagination.innerHTML += `<span class="dots">...</span>`;
            pagination2.innerHTML += `<span class="dots">...</span>`;
        }

        // Trang cuối cùng
        if (totalPages > 1) {
            pagination.innerHTML += `<a href="#" data-page="${totalPages}" class="${currentPage === totalPages ? 'active' : ''}">${totalPages}</a>`;
            pagination2.innerHTML += `<a href="#" data-page="${totalPages}" class="${currentPage === totalPages ? 'active' : ''}">${totalPages}</a>`;
        }

        // Nút "Next"
        pagination.innerHTML += `
            <a href="#" data-page="${currentPage + 1}" 
            class="next ${currentPage === totalPages ? 'disabled' : ''}">Next</a>`;
        pagination2.innerHTML += `
            <a href="#" data-page="${currentPage + 1}" 
            class="next ${currentPage === totalPages ? 'disabled' : ''}">Next</a>`;



        // Add event listener for pagination
        document.querySelectorAll('#pagination-top a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                fetchProducts({ ...filters, page });
            });
        });
        document.querySelectorAll('#pagination-bot a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                fetchProducts({ ...filters, page });
            });
        });

        document.getElementById('apply-filters').onclick = (e) => {
            e.preventDefault();
            filters = { ...filters,
                page: 1,
                category: document.getElementById('category').value,
                manufacturer: document.getElementById('manufacturer').value,
                minPrice: document.getElementById('min-price').value,
                maxPrice: document.getElementById('max-price').value,
                rating: document.getElementById('rating').value,
                q: document.getElementById('search-query').value,
            };
            fetchProducts(filters);
        };

        function setActiveButton(activeButton) {
            // Lấy tất cả các nút trong nhóm
            const buttons = document.querySelectorAll('#sort-latest, #sort-price, #sort-rating');
            buttons.forEach(button => button.classList.remove('active')); // Loại bỏ class 'active' khỏi tất cả
            activeButton.classList.add('active'); // Thêm class 'active' vào nút được bấm
        }

        // Xử lý chọn loại sắp xếp
        document.getElementById('sort-latest').onclick = (e) => {
            e.preventDefault();
            sortBy = 'latest';
            setActiveButton(e.target);
            fetchProducts({...filters, sortBy, sortOrder});
        };

        document.getElementById('sort-price').onclick = (e) => {
            e.preventDefault();
            sortBy = 'price';
            setActiveButton(e.target);
            fetchProducts({...filters, sortBy, sortOrder});
        };

        document.getElementById('sort-rating').onclick = (e) => {
            e.preventDefault();
            sortBy = 'rating';
            setActiveButton(e.target);
            fetchProducts({...filters, sortBy, sortOrder});
        };

        document.getElementById('toggle-sort-order').onclick = (e) => {
            e.preventDefault();
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            e.target.textContent = sortOrder === 'asc' ? 'Ascending' : 'Descending';
            fetchProducts({...filters, sortBy, sortOrder});
        };

    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Fetch products on page load
fetchProducts({pageSize: 9});