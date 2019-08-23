function convertImage(imgPath, newImgPath){
    // Convert to jpg and resize
    return new Promise(resolve => {
        Jimp.read(imgPath)
            .then(img => {
                if (imgPath === newImgPath 
                    && img.bitmap.width <= IMAGE_MAX_SIZE
                    && img.bitmap.height <= IMAGE_MAX_SIZE){
                    // No need to resize or conversion
                    resolve();
                }
                var newWidth = Math.min(IMAGE_MAX_SIZE, img.bitmap.width);
                var newHeight = Math.min(IMAGE_MAX_SIZE, img.bitmap.height);
                // The large edge should be bounded by IMAGE_MAX_SIZE
                if (img.bitmap.width > img.bitmap.height){
                    var newHeight = Math.round(img.bitmap.height/img.bitmap.width*newWidth);
                }
                else{
                    var newWidth = Math.round(img.bitmap.width/img.bitmap.height*newHeight);
                }
                img.resize(newWidth, newHeight).write(newImgPath); // save
                if (imgPath !== newImgPath){
                    fs.unlink(imgPath, err =>{
                        if(err){
                            console.log("delete file error");
                        }
                    });
                }
                resolve();
            })
            .catch(err => {
                console.error(err);
            });   
    });
}

async function transformImage(filePath, selectStyle){
    var port = await createPythonPromise;
    var st = new Date()
    var pathObj = path.parse(filePath);
    var filename = pathObj.name + pathObj.ext;
    if (pathObj.ext !== ".jpg"){
        filename = pathObj.name + ".jpg";
    }
    var newFilePath = path.join(pathObj.dir, pathObj.name) + ".jpg";
    await convertImage(filePath, newFilePath);
    var output = {
        page: "create",
        contentImgPath: "./data/contents/" + filename,
        selectStyle: selectStyle,
        resultImgPath:  "./data/outputs/" + filename
    }
    
    var client = new net.Socket();
    client.connect(port, '127.0.0.1', function() {
        console.log("Start transform");
        var pyInput = (
            "./transform/models/" + selectStyle + "$" +
            "./public/data/contents/" + filename + "$" +
            "./public/data/outputs/" + filename
        )
        client.write(pyInput);
    });
    client.on('data', function(data) {
        console.log(data.toString('ascii'));
        client.destroy(); // kill client after server's response
    });
    var promise = new Promise(resolve => {
        client.on('error', function(data) {
            console.log("Connection Refused");
            output.stateMessage = "System is busy, please try again later!";
            resolve(output)
        });
        client.on('close', function() {
            var requestTime = Math.round((new Date()-st)*1000) / 1000000
            console.log("Request Time: " + requestTime);
            output.stateMessage = "success";
            resolve(output)
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

if (!fs.existsSync("./public/data/contents")){
    fs.mkdirSync("./public/data/contents");
}

if (!fs.existsSync("./public/data/outputs")){
    fs.mkdirSync("./public/data/outputs");
}

var IMAGE_MAX_SIZE = 1024;  // max(width, height)
var createPythonPromise = createPythonProcess();
module.exports = transformImage;