const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        currentView: 'home',
        name: req.user?.username,
        profileImg: req.user?.picture,
    });
})

router.get('/about', (req, res) => {
    res.render('about', {
        currentView: 'about',
        name: req.user?.username,
        profileImg: req.user?.picture,
    })
})

router.get('/contact', (req, res) => {
    res.render('contact', {
        currentView: 'contact',
        name: req.user?.username,
        profileImg: req.user?.picture,
    })
})

module.exports = router;