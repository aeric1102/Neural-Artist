var express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    upload = require("../middleware/upload"),
    cloudinary = require("cloudinary").v2;
    transformImage = require("../transform/transform");

var defaultImgData = {
    page: "create",
    stateMessage: "none",
    contentImgPath: "/stylesheets/image-placeholder.jpg", 
    selectStyle: "wave", 
    resultImgPath: "#"
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    var imgData = req.flash("imgData")[0];
    if (!imgData){
        res.render("create/stylize", defaultImgData);
    }
    else{
        res.render("create/stylize", imgData);   
    };
});

router.post("/", upload.single("selectContent"), async function (req, res, next) {
    if (req.file == null){ // invalid file
        req.flash("imgData", {
            page: "create",
            stateMessage: "Only images (jpg or png) are allowed!",
            contentImgPath: "/stylesheets/image-placeholder.jpg",
            selectStyle: "wave",
            resultImgPath: "#"
        });
        res.redirect("/create");
        return
    }
    var imgData = await transformImage(req.file.path, req.body.selectStyle);
    if (imgData.stateMessage !== "success"){
        req.flash("imgData", imgData)
        res.redirect("/create");
    }
    else{
        contentImgPath = "./public/" + imgData.contentImgPath
        resultImgPath = "./public/" + imgData.resultImgPath
        cloudinary.uploader.upload(contentImgPath, {folder: "neuralartist/contentImg/"}, 
            function(err, result) {
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/create");
                }
                imgData.contentImgPath = result.secure_url
                fs.unlink(contentImgPath, err => {
                    if(err){
                        console.log("delete file error");
                    }
                });
                cloudinary.uploader.upload(resultImgPath, {folder: "neuralartist/resultImg/"}, 
                    function(err, result) {
                        if(err){
                            req.flash("error", err.message);
                            return res.redirect("/create");
                        }
                        imgData.resultImgPath = result.secure_url
                        fs.unlink(resultImgPath, err => {
                            if(err){
                                console.log("delete file error");
                            }
                        });
                        req.flash("imgData", imgData)
                        res.redirect("/explore/new");
                });
        });
    }
})

module.exports = router;