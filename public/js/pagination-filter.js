    let sortBy = 'latest'; // Mặc định sắp xếp theo 'latest'
    let sortOrder = 'desc'; // Mặc định là tăng dần

    const updateFiltersUI = (filters, data) => {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = `<option value="">Select Category</option>`;
        data.categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category}" ${category === filters.category ? 'selected' : ''}>${category}</option>`;
        });

        const ratingSelect = document.getElementById('rating');
        ratingSelect.value = filters.rating || '';

        const searchQuery = document.getElementById('search-query');
        searchQuery.value = filters.q || '';

        const manufacturerSelect = document.getElementById('manufacturer');
        manufacturerSelect.innerHTML = `<option value="">Select Manufacturer</option>`;
        data.manufacturers.forEach(manufacturer => {
            manufacturerSelect.innerHTML += `<option value="${manufacturer}" ${manufacturer === filters.manufacturer ? 'selected' : ''}>${manufacturer}</option>`;
        });
    };

    const updateProductsUI = (products) => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        products.products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'col-lg-4';
            div.innerHTML = `
                <div class="item">
                    <div class="thumb">
                        <div class="hover-content">
                            <ul>
                                <li><a href="/products/${product.id}"><i class="fa fa-eye"></i></a></li>
                                <li><a href="javascript:void(0);" onclick="addToCart(${product.id})"><i class="fa fa-shopping-cart"></i></a></li>
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
                </div>`;
            fragment.appendChild(div);
        });
        productList.appendChild(fragment);

        const sectionTitle = document.getElementById('sectionTitle');
        const sectionDescription = document.getElementById('sectionDescription');
        if (products.filters.q) {
            sectionTitle.innerHTML = `Search for "${products.filters.q}" with filters`;
            sectionDescription.innerHTML = `Found ${products.products.length} products`;
        } else {
            sectionTitle.innerHTML = '';
            sectionDescription.innerHTML = '';
        }
    };

    const updatePaginationUI = (paginationData) => {
        const pagination = document.getElementById('pagination-top');
        const pagination2 = document.getElementById('pagination-bot');
        pagination.innerHTML = '';
        pagination2.innerHTML = '';

        const { totalPages, currentPage } = paginationData;

        const createPaginationButton = (page, label, isActive, isDisabled) => {
            return `<a href="#" data-page="${page}" class="${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}">${label}</a>`;
        };

        pagination.innerHTML += createPaginationButton(currentPage - 1, 'Previous', false, currentPage === 1);
        pagination2.innerHTML += createPaginationButton(currentPage - 1, 'Previous', false, currentPage === 1);

        pagination.innerHTML += createPaginationButton(1, '1', currentPage === 1, false);
        pagination2.innerHTML += createPaginationButton(1, '1', currentPage === 1, false);

        if (currentPage > 3) {
            pagination.innerHTML += '<span class="dots">...</span>';
            pagination2.innerHTML += '<span class="dots">...</span>';
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pagination.innerHTML += createPaginationButton(i, i, currentPage === i, false);
            pagination2.innerHTML += createPaginationButton(i, i, currentPage === i, false);
        }

        if (currentPage < totalPages - 2) {
            pagination.innerHTML += '<span class="dots">...</span>';
            pagination2.innerHTML += '<span class="dots">...</span>';
        }

        if (totalPages > 1) {
            pagination.innerHTML += createPaginationButton(totalPages, totalPages, currentPage === totalPages, false);
            pagination2.innerHTML += createPaginationButton(totalPages, totalPages, currentPage === totalPages, false);
        }

        pagination.innerHTML += createPaginationButton(currentPage + 1, 'Next', false, currentPage === totalPages);
        pagination2.innerHTML += createPaginationButton(currentPage + 1, 'Next', false, currentPage === totalPages);

        const addPaginationListeners = (paginationElement) => {
            paginationElement.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = parseInt(link.getAttribute('data-page'));
                    console.log(page);
                    const filters = getCurrentFilters();
                    if (!isNaN(page)) {
                        fetchProducts({ ...filters, page });
                    }
                });
            });
        };

        addPaginationListeners(pagination);
        addPaginationListeners(pagination2);
    };

    const fetchProducts = async (filters = {}) => {
        try {
            document.getElementById('products-loader').style.visibility = 'visible';

            const params = new URLSearchParams(filters).toString();
            console.log(params);
            const response = await fetch(`/api/products?${params}`);
            const data = await response.json();

            const newUrl = `${window.location.pathname}?${params}`;
            history.pushState(null, '', newUrl);

            updateFiltersUI(filters, data);
            updateProductsUI(data.products);
            updatePaginationUI(data.products);

        } catch (error) {
            console.error('Error fetching products:', error);
            document.getElementById('error-message').innerText = 'Failed to fetch products. Please try again later.';
        } finally {
            document.getElementById('products-loader').style.visibility = "hidden";
        }
    };

    const __url = new URL(window.location.href);
    const __params = new URLSearchParams(__url.search);

    const __paramsObject = { pageSize: 9 };
    __params.forEach((value, key) => {
        __paramsObject[key] = value;
    });

    // Fetch products on page load
    fetchProducts(__paramsObject);

    // Apply filters
    const applyFiltersButton = document.getElementById('apply-filters');
    applyFiltersButton.addEventListener('click', (e) => {
        e.preventDefault();
        const filters = getCurrentFilters();
        document.querySelectorAll('#sort-latest, #sort-price, #sort-rating').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelectorAll('#sort-latest').forEach(button => {
            button.classList.add('active');
        });
        const sortOrderDiv = document.getElementById('toggle-sort-order');
        sortOrder = 'desc';
        sortOrderDiv.textContent = 'Descending';
        sortBy = 'latest';
        fetchProducts(filters);
    });

    // Sorting logic
const setActiveButton = (activeButton) => {
    document.querySelectorAll('#sort-latest, #sort-price, #sort-rating').forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
};

document.getElementById('sort-latest').addEventListener('click', (e) => {
    e.preventDefault();
    sortBy = 'latest';
    setActiveButton(e.target);
    const filters = getCurrentFilters(); // Get current filters from UI
    fetchProducts({ ...filters, sortBy, sortOrder });
});

document.getElementById('sort-price').addEventListener('click', (e) => {
    e.preventDefault();
    sortBy = 'price';
    setActiveButton(e.target);
    const filters = getCurrentFilters(); // Get current filters from UI
    fetchProducts({ ...filters, sortBy, sortOrder });
});

document.getElementById('sort-rating').addEventListener('click', (e) => {
    e.preventDefault();
    sortBy = 'rating';
    setActiveButton(e.target);
    const filters = getCurrentFilters(); // Get current filters from UI
    fetchProducts({ ...filters, sortBy, sortOrder });
});

document.getElementById('toggle-sort-order').addEventListener('click', (e) => {
    e.preventDefault();
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    e.target.textContent = sortOrder === 'asc' ? 'Ascending' : 'Descending';
    const filters = getCurrentFilters(); // Get current filters from UI
    fetchProducts({ ...filters, sortBy, sortOrder });
});

// Function to get current filters from the UI
const getCurrentFilters = () => {
    return {
        pageSize: 9,
        page: 1,
        category: document.getElementById('category').value,
        manufacturer: document.getElementById('manufacturer').value,
        minPrice: document.getElementById('min-price').value,
        maxPrice: document.getElementById('max-price').value,
        rating: document.getElementById('rating').value,
        q: document.getElementById('search-query').value,
    };
};
