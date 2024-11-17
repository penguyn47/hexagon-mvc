const express = require('express');
const router = express.Router();

const productRoutes = require('../routes/products')
const userRoutes = require('../routes/users');

const productAPIRoutes = require('../api/productAPI')

const productController = require('../controllers/productController')

// Routing 
router.get('/', (req, res) => {
    res.render('home');
});

// APIs
router.use('/api/products', productAPIRoutes);
router.use('/users', userRoutes);


router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.use('/products', productRoutes);

router.get('/account', (req, res) => {
    res.render('account', {
        layout: 'account_nsigned'
    })
});

module.exports = router;