const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GridFsStorage } = require('multer-gridfs-storage');
const config = require('../config/config');
const url = config.mongoose.url;

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url,
    file: (req, file) => {
        return {
            bucketName: 'files'
        };
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
});

// Set multer storage engine to the newly created object
const upload = multer({ storage });

module.exports = upload;

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const dir = `public/uploaded/image`
//         const pathExist = fs.existsSync(dir);
//         if (!pathExist) {
//             return fs.mkdirSync(dir, { recursive: true })
//         }
//         return cb(null, dir)
//     },
    // filename: function (req, file, cb) {
    //     cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    // },
// });

// var upload = multer({
//     storage: storage, preservePath: true, limits: { fileSize: 1024 * 1024 },
//     fileFilter: function (req, file, callback) {

//         if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg') {
//             req.fileValidationError = "Invalid file type";
//             return callback(new Error('Invalid file type, file must be png, jpg or jpeg'), false);
//         }
//         callback(null, true);
//     },
// });

// module.exports = upload;