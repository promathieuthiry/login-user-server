const multer = require("multer");
const path = require("path")

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './uploads/'));

    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-login-user-${path.extname(file.originalname)}`);
    },
});

var uploadFile = multer({ storage: storage, limits: { fileSize: 3000000 } });
module.exports = uploadFile;