var multer  = require("multer"),
    path = require("path");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/data/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(null, false);
    }
    cb(null, true);
};
var limits = {
    fileSize: 20 * 1024 * 1024 // 20MB
};


var upload = multer({storage: storage, fileFilter: imageFilter, limits: limits});
module.exports = upload;
