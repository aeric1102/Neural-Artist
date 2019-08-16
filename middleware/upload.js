var multer  = require("multer"),
    path = require("path");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/data/contents/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

var upload = multer({storage: storage});
module.exports = upload;