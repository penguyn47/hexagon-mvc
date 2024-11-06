const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'products',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: uuidv4(),
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;