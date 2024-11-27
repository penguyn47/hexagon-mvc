const Product = require('./product.model'); // Đường dẫn tới model Product
const { Op } = require('sequelize');

const productService = {
    // Tạo sản phẩm mới
    async createProduct(productData) {
        try {
            const newProduct = await Product.create(productData); // Tạo sản phẩm
            return newProduct;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    },

    // Lấy thông tin sản phẩm theo id
    async getProductById(productId) {
        try {
            const product = await Product.findByPk(productId); // Tìm sản phẩm theo primary key
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error fetching product: ' + error.message);
        }
    },

    // Lấy danh sách sản phẩm (hỗ trợ phân trang)
    async getProducts(page = 1, pageSize = 9, filters = {}) {
        try {
            const limit = pageSize;
            const offset = (page - 1) * pageSize;
    
            // Tạo điều kiện lọc
            const where = {};
    
            if (filters.category) {
                where.category = filters.category;
            }
            if (filters.manufacturer) {
                where.manufacturer = filters.manufacturer;
            }
            if (filters.minPrice) {
                where.price = { ...where.price, [Op.gte]: filters.minPrice };
            }
            if (filters.maxPrice) {
                where.price = { ...where.price, [Op.lte]: filters.maxPrice };
            }
            if (filters.rating) {
                where.rating = { [Op.gte]: filters.rating };
            }
            if (filters.q) {
                where.productName = { [Op.iLike]: `%${filters.q}%` }; // Tìm kiếm gần đúng
            }


            // Gán giá trị mặc định cho _sortBy và _orderBy
            let _sortBy = 'createdAt'; // Mặc định là sắp xếp theo ngày tạo
            let _orderBy = 'DESC'; // Mặc định là giảm dần

            if (filters.sortBy === 'rating') {
                _sortBy = 'rating';
            } else if (filters.sortBy === 'price') {
                _sortBy = 'price';
            }

            if (filters.sortOrder === 'asc') {
                _orderBy = 'ASC';
            }

            // Truy vấn cơ sở dữ liệu với các điều kiện
            const result = await Product.findAndCountAll({
                where,
                limit,
                offset,
                order: [[_sortBy, _orderBy]], // Sắp xếp dựa trên _sortBy và _orderBy
            });

    
            return {
                totalItems: result.count,
                totalPages: Math.ceil(result.count / pageSize),
                currentPage: parseInt(page),
                products: result.rows,
                filters: filters,
            };
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    },    

    // Cập nhật thông tin sản phẩm
    async updateProduct(productId, productData) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.update(productData); // Cập nhật sản phẩm
            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    },

    // Xóa sản phẩm
    async deleteProduct(productId) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.destroy(); // Xóa sản phẩm
            return { message: 'Product deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    },

    // Lấy các category duy nhất
    async getDistinctCategories() {
        try {
            const categories = await Product.findAll({
                attributes: [[Product.sequelize.fn('DISTINCT', Product.sequelize.col('category')), 'category']],
                raw: true,
            });
            return categories.map(c => c.category);
        } catch (error) {
            console.error('Error fetching distinct categories:', error);
            throw error;
        }
    },

     // Lấy các manufacturer duy nhất
     async getDistinctManufacturers() {
        try {
            const manufacturers = await Product.findAll({
                attributes: [[Product.sequelize.fn('DISTINCT', Product.sequelize.col('manufacturer')), 'manufacturer']],
                raw: true,
            });
            return manufacturers.map(m => m.manufacturer);
        } catch (error) {
            console.error('Error fetching distinct manufacturers:', error);
            throw error;
        }
    },
};

module.exports = productService;
