const express = require('express');
const router = express.Router();
const { uploadPhoto, resizeAndUploadImage } = require('./middlewares/imageUploadMiddleware');


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

router.get('/admin', (req, res) => {
    res.render('admin', {
        currentView: 'admin',
        name: req.user?.username,
        profileImg: req.user?.picture,
    })
})



router.post('/profileImg', uploadPhoto.array('profileImg', 1), resizeAndUploadImage, (req, res) => {
    if (!req.imageUrl) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ message: 'Upload success', imageUrl: req.imageUrl });
});

module.exports = router;