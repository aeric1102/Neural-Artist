function convertImage(img_path, new_img_path){
    // Convert to jpg and resize
    return new Promise(resolve => {
        Jimp.read(img_path).then(img => {
            if (img_path === new_img_path 
                && img.bitmap.width <= IMAGE_MAX_SIZE
                && img.bitmap.height <= IMAGE_MAX_SIZE){
                // No need to resize or conversion
                resolve();
            }
            var new_width = Math.min(IMAGE_MAX_SIZE, img.bitmap.width);
            var new_height = Math.min(IMAGE_MAX_SIZE, img.bitmap.height);
            // The large edge should be bounded by IMAGE_MAX_SIZE
            if (img.bitmap.width > img.bitmap.height){
                var new_height = Math.round(img.bitmap.height/img.bitmap.width*new_width);
            }
            else{
                var new_width = Math.round(img.bitmap.width/img.bitmap.height*new_height);
            }
            img.resize(new_width, new_height).write(new_img_path); // save
            if (img_path !== new_img_path){
                fs.unlinkSync(img_path);
            }
            resolve();
        },
        err => {
            throw err;
        });
    });
}

async function transformImage(file_path, selectStyle){
    var port = await createPythonPromise;
    var st = new Date()
    var pathObj = path.parse(file_path);
    var filename = pathObj.name + pathObj.ext;
    if (pathObj.ext !== ".jpg"){
        filename = pathObj.name + ".jpg";
    }
    var new_file_path = path.join(pathObj.dir, pathObj.name) + ".jpg";
    await convertImage(file_path, new_file_path);
    var home_input = {
        contentImgPath: "./data/contents/" + filename,
        selectStyle: selectStyle,
        resultImgPath:  "./data/outputs/" + filename
    }
    
    var client = new net.Socket();
    client.connect(port, '127.0.0.1', function() {
        console.log("Start transform");
        var py_input = (
            "./transform/models/" + selectStyle + "$" +
            "./public/data/contents/" + filename + "$" +
            "./public/data/outputs/" + filename
        )
        client.write(py_input);
    });
    client.on('data', function(data) {
        console.log(data.toString('ascii'));
        client.destroy(); // kill client after server's response
    });
    var promise = new Promise(resolve => {
        client.on('error', function(data) {
            console.log("Connection Refused");
            home_input.resultImgPath = "error";
            resolve(home_input)
        });
        client.on('close', function() {
            var request_time = Math.round((new Date()-st)*1000) / 1000000
            console.log("Request Time: " + request_time);
            resolve(home_input)
        });
    })
    return promise
}

function createPythonProcess(){
    const spawn = require("child_process").spawn;
    const transform = spawn("python", ["./transform/transform.py"]);
    var promise = new Promise(resolve => {
        transform.stdout.on("data", function(data){
            console.log(data.toString());
            if (data.toString().includes("Python start listening on port ")){
                resolve(parseInt(data.toString().substr(31)));
            }
        });
        transform.stderr.on("data", function(data){
            console.log(data.toString());
        });
        transform.on("close", function(code){
            console.log("child exit with " + code);
            resolve(-1)
        });
    });
    return promise
}

var path = require('path'),
    Jimp = require("jimp"),
    fs = require("fs"),
    net = require('net');

var IMAGE_MAX_SIZE = 1024;  // max(width, height)
var createPythonPromise = createPythonProcess();
module.exports = transformImage;