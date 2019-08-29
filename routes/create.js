var express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    upload = require("../middleware/upload"),
    cloudinary = require("cloudinary").v2;
    transform = require("../transform/transform");


var styleImgModelPath = JSON.parse(fs.readFileSync("./transform/style_img_model_path.json", "utf8"));
transform.init(); // create python process for transforming image
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    res.render("create/stylize", {
        page: "create", 
        styleImgModelPath: styleImgModelPath, 
        showStyle: req.query.style
    });
});

router.post("/", upload.single("selectContent"), async function (req, res, next) {
    var st = new Date();
    if (req.file == null){ // invalid file
        req.flash("error", "Only images (jpg or png) are allowed!");
        res.redirect("/create");
        return
    }
    var model_num = parseInt(req.body.selectStyle);
    var selectModel = styleImgModelPath[model_num].modelPath;
    var selectStyle = styleImgModelPath[model_num].styleImg;
    try{
        var imgData = await transform.transformImage(req.file.path, selectModel);
    } catch(err){
        if (err === "System is busy, please try again later!"){
            req.flash("error", err);
            res.redirect("/create");
        }
        else{
            // Perhaps, Jimp error or python process error
            req.flash("error", "A server error occurred: Unable to process your data")
            console.log(err);
            res.redirect("/create");
        }
        return;
    }
    var md = new Date();
    var transformTime = Math.round((md-st)*1000) / 1000000;
    console.log("Transform Time: " + transformTime);
    var contentImg = "./public/" + imgData.contentImg;
    imgData.selectStyle = selectStyle;
    var resultImg = "./public/" + imgData.resultImg;
    cloudinary.uploader.upload(contentImg, 
                               {folder: "neuralartist/contentImg/"}, 
                               function(err, result) {
        if(err){
            req.flash("error", "A server error occurred: Unable to process your data")
            console.log(err);
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
                    req.flash("error", "A server error occurred: Unable to process your data")
                    console.log(err);
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