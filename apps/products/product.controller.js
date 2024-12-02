const productService = require('./product.service');

const productController = {
    // Lấy danh sách sản phẩm (phân trang)
    async getProducts(req, res) {
        // try {
        //     const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        //     const pageSize = parseInt(req.query.pageSize) || 10; // Số sản phẩm mỗi trang, mặc định là 10

        //     const products = await productService.getProducts(page, pageSize);
        //     res.status(200).json({products}); // Trả về dữ liệu với mã trạng thái 200
        // } catch (error) {
        //     res.status(500).json({ message: error.message });
        // }

        try {
            const { 
                page = 1,
                pageSize = 9,
                category,
                manufacturer,
                minPrice, maxPrice,
                rating,
                q,
                sortBy,
                sortOrder,
            } = req.query;
    
            // Lấy sản phẩm với điều kiện lọc
            const products = await productService.getProducts(
                page,
                pageSize,
                { category, manufacturer, minPrice, maxPrice, rating, q, sortBy, sortOrder }
            );
    
            // Lấy danh mục và nhà sản xuất
            const categories = await productService.getDistinctCategories();
            const manufacturers = await productService.getDistinctManufacturers();
    
            res.json({ products, categories, manufacturers });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy thông tin sản phẩm theo id
    async getProductById(req, res) {
        try {
            const productId = req.params.id; // Lấy id từ URL
            const product = await productService.getProductById(productId);
            res.status(200).json(product); // Trả về sản phẩm tìm được
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    // Tạo sản phẩm mới
    async createProduct(req, res) {
        try {
            const productData = req.body; // Dữ liệu từ body của request
            const newProduct = await productService.createProduct(productData);
            res.status(201).json(newProduct); // Trả về sản phẩm mới với mã trạng thái 201
        } catch (error) {
            res.status(400).json({ message: error.message }); // Lỗi dữ liệu đầu vào
        }
    },

    // Cập nhật thông tin sản phẩm
    async updateProduct(req, res) {
        try {
            const productId = req.params.id; // Lấy id từ URL
            const productData = req.body; // Dữ liệu từ body của request
            const updatedProduct = await productService.updateProduct(productId, productData);
            res.status(200).json(updatedProduct); // Trả về sản phẩm đã cập nhật
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    // Xóa sản phẩm
    async deleteProduct(req, res) {
        try {
            const productId = req.params.id; // Lấy id từ URL
            const result = await productService.deleteProduct(productId);
            res.status(200).json(result); // Trả về kết quả xóa thành công
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    async renderSingleProductPage(req, res) {
        try {
            const productId = req.params.id; // Lấy id từ URL
            const product = await productService.getProductById(productId);
            let relatedProducts = await productService.getRelatedProductsByCategory(productId);
            relatedProducts = relatedProducts.map(product => product.dataValues);
            res.render('singleProduct', {
                currentView: 'products',
                name: req.user?.username,
                profileImg: req.user?.picture,
                product: product.dataValues,
                relatedProducts: relatedProducts,
            })
        } catch (error) {
            res.status(404).json({ message: error.message }); // Nếu không tìm thấy, trả về 404
        }
    },

    async renderMultiProductPage (req, res)  {
        res.render('products', {
            currentView: 'products',
            name: req.user?.username,
            profileImg: req.user?.picture,
        })
    },
};

module.exports = productController;
