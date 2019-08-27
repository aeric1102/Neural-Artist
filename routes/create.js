var express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    upload = require("../middleware/upload"),
    cloudinary = require("cloudinary").v2;
    transform = require("../transform/transform");

transform.init(); // create python process for transforming image
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    res.render("create/stylize", {page: "create"});
});

router.post("/", upload.single("selectContent"), async function (req, res, next) {
    var st = new Date();
    if (req.file == null){ // invalid file
        req.flash("error", "Only images (jpg or png) are allowed!");
        res.redirect("/create");
        return
    }
    try{
        var imgData = await transform.transformImage(req.file.path, req.body.selectStyle);
    } catch(e){
        if (e === "System is busy, please try again later!"){
            req.flash("error", e);
            res.redirect("/create");
        }
        else{
            // Perhaps, Jimp error or python process error
            req.flash("error", "Sorry, something went wrong.");
            res.redirect("/create");
        }
        return;
    }
    var md = new Date();
    var transformTime = Math.round((md-st)*1000) / 1000000;
    console.log("Transform Time: " + transformTime);
    contentImg = "./public/" + imgData.contentImg
    resultImg = "./public/" + imgData.resultImg
    cloudinary.uploader.upload(contentImg, 
                               {folder: "neuralartist/contentImg/"}, 
                               function(err, result) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/create");
        }
        imgData.contentImg = result.secure_url
        fs.unlink(contentImg, err => {
            if(err){
                console.log("delete file error");
            }
        });
        cloudinary.uploader.upload(resultImg, {folder: "neuralartist/resultImg/"}, 
            function(err, result) {
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/create");
                }
                imgData.resultImg = result.secure_url
                fs.unlink(resultImg, err => {
                    if(err){
                        console.log("delete file error");
                    }
                });
                req.flash("imgData", imgData)
                var requestTime = Math.round((new Date()-st)*1000) / 1000000;
                console.log("Success. Request Time: " + requestTime);
                res.redirect("/explore/new");
        });
    });
})

module.exports = router;