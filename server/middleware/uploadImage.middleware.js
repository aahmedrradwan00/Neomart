const multer = require('multer');
const diskStorage = multer.diskStorage;

const imageUpload = () => {
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            return cb(null, true);
        } else {
            return cb(new Error('Only images are allowed!', { cause: 400 }), false);
        }
    };
    return multer({ storage: diskStorage({}),  multerFilter });
};

module.exports = imageUpload;