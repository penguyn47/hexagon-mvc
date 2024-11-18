const express = require('express');
const router = express.Router();

const productRoutes = require('../routes/products');

const userAPIRoutes = require('../api/userAPI');
const productAPIRoutes = require('../api/productAPI')

// Routing 
router.get('/', (req, res) => {
    res.render('home', {
        page: 'home'
    });
});

// APIs
router.use('/api/products', productAPIRoutes);
router.use('/api/users', userAPIRoutes);


router.get('/about', (req, res) => {
    res.render('about', {
        page: 'about'
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        page: 'contact'
    });
});

router.use('/products', productRoutes);

router.get('/account', (req, res) => {
    res.render('account', {
        layout: 'account_nsigned'
    })
});

module.exports = router;