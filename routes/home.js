function transform_image(img_path, new_img_path){
    Jimp.read(img_path, function(err, img){
        if (err) throw err;
        var new_width = Math.min(1024, img.bitmap.width)
        var new_height = Math.round(img.bitmap.height/img.bitmap.width*new_width)
        img.resize(new_width, new_height).write(new_img_path); // save
        fs.unlinkSync(img_path);
    });
}


var express = require("express"),
    router = express.Router(),
    upload = require("../middleware/upload"),
    path = require('path'),
    Jimp = require("jimp"),
    fs = require("fs");


var contentImgPath = "#";
var resultImgPath = "#";
router.get("/", function(req, res){
    res.render("home", {contentImgPath: contentImgPath, resultImgPath: resultImgPath});
});

router.post("/upload", upload.single("selectContent"), function (req, res, next) {
    //console.log(req.file);
    var pathObj = path.parse(req.file.path);
    var filename = req.file.filename;
    if (pathObj.ext !== ".jpg"){
        filename = pathObj.name + ".jpg"
        new_file_path = path.join(pathObj.dir, pathObj.name) + ".jpg";
        transform_image(req.file.path, new_file_path);
    }
    contentImgPath = "data/contents/" + filename;
    var args = [
        "./evaluate.py",
        "--checkpoint",
        "./models/" + req.body.selectStyle + ".ckpt",
        "--in-path",
        "../public/data/contents/" + filename,
        "--out-path",
        "../public/data/outputs/" + filename
    ]
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", args, {cwd:"./fast-style-transfer-master/"});
    pythonProcess.stdout.on("data", function(data){
        // Do something with the data returned from python script
        //res.send(data.toString());
        console.log(data.toString());
    });
    pythonProcess.stderr.on("data", function(data){
        // Do something with the data returned from python script
        //res.send(data.toString());
        console.log(data.toString());
    });
    pythonProcess.on("close", function(code){
        // Do something with the data returned from python script
        //res.send(data.toString());
        resultImgPath =  "./data/outputs/" + filename;
        console.log("child exit with" + code);
        res.redirect("/");
    });
})

module.exports = router;