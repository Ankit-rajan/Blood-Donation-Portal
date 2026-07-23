const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let uploadPath = 'uploads/';
        
        if (file.fieldname === 'profileImage') {
            uploadPath += 'profiles';
        } else if (file.fieldname === 'governmentId') {
            uploadPath += 'documents';
        } else if (file.fieldname === 'bloodReport') {
            uploadPath += 'documents';
        }
        
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images and PDF only!');
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Multiple file upload configuration
const uploadFiles = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'bloodReport', maxCount: 1 }
]);

module.exports = { upload, uploadFiles };