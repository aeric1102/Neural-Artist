function transform_image(img_path, new_img_path){
    Jimp.read(img_path, function(err, img){
        if (err) throw err;
        var new_width = Math.min(1024, img.bitmap.width)
        var new_height = Math.round(img.bitmap.height/img.bitmap.width*new_width)
        img.resize(new_width, new_height).write(new_img_path); // save
        fs.unlinkSync(img_path);
    });
}

function cretae_process(){
    const spawn = require("child_process").spawn;
    const transform = spawn("python", ["./transform/transform.py"]);
    transform.stdout.on("data", function(data){
        console.log(data.toString());
    });
    transform.stderr.on("data", function(data){
        console.log(data.toString());
    });
    transform.on("close", function(code){
        console.log("child exit with " + code);
    });
}


var express = require("express"),
    router = express.Router(),
    upload = require("../middleware/upload"),
    path = require('path'),
    Jimp = require("jimp"),
    fs = require("fs"),
    net = require('net');

cretae_process()

router.get("/", function(req, res){
    res.render("home", {contentImgPath: "./stylesheets/image-placeholder.jpg", 
        selectStyle: "wave", resultImgPath: "#"});
});



router.post("/", upload.single("selectContent"), function (req, res, next) {
    //console.log(req.file);
    var pathObj = path.parse(req.file.path);
    var filename = req.file.filename;
    if (pathObj.ext !== ".jpg"){
        filename = pathObj.name + ".jpg"
        new_file_path = path.join(pathObj.dir, pathObj.name) + ".jpg";
        transform_image(req.file.path, new_file_path);
    }
    var home_input = {
        contentImgPath: "./data/contents/" + filename,
        selectStyle: req.body.selectStyle,
        resultImgPath:  "./data/outputs/" + filename
    }
    
    input = (
        "./transform/models/" + req.body.selectStyle + "$" +
        "./public/data/contents/" + filename + "$" +
        "./public/data/outputs/" + filename
    )
    var client = new net.Socket();
    client.connect(9527, '127.0.0.1', function() {
        console.log("Start transform");
        client.write(input);
    });

    client.on('error', function(data) {
        console.log("Connection Refused");
        home_input.resultImgPath = "error";
        res.render("home", home_input);
    });

    client.on('data', function(data) {
        console.log(data.toString('ascii'));
        client.destroy(); // kill client after server's response
    });

    client.on('close', function() {
        res.render("home", home_input);
    });

})

module.exports = router;