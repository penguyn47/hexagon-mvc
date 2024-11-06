const express = require('express');
const router = express.Router();

const productRoutes = require('../routes/products')
const userRoutes = require('../routes/users');

// Routing 
router.get('/', (req, res) => {
    res.render('home');
});

router.use('/products', productRoutes);
router.use('/users', userRoutes);


router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/account', (req, res) => {
    res.render('account', {
        layout: 'account_nsigned'
    })
})

module.exports = router;