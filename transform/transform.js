function convertImage(filePath){
    // Convert to jpg and resize
    return new Promise((resolve, reject) => {
        var pathObj = path.parse(filePath);
        var filename = pathObj.name + ".jpg";
        var newFilePath = path.join(pathObj.dir, filename);
        Jimp.read(filePath)
            .then(img => {
                if (filePath === newFilePath 
                    && img.bitmap.width <= IMAGE_MAX_SIZE
                    && img.bitmap.height <= IMAGE_MAX_SIZE){
                    // No need to resize or converse
                    resolve(filename);
                    return;
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
                if (filePath !== newFilePath){
                    fs.unlinkSync(filePath, err =>{
                        if(err){
                            console.log("delete file error");
                        }
                    });
                }
                //resize then save
                img.resize(newWidth, newHeight).write(newFilePath, () =>{
                    resolve(filename);
                });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });   
    });
}

async function transformImage(filePath, selectStyle){
    try{
        var port = await createPythonPromise;
    } catch(e){
        return Promise.reject(e)
    }
    try{
        var filename = await convertImage(filePath);
    } catch(e){
        return Promise.reject(e)
    }
    var imgData = {
        contentImg: "./data/contents/" + filename,
        selectStyle: selectStyle,
        resultImg:  "./data/outputs/" + filename
    }
    
    var client = new net.Socket();
    client.connect(port, '127.0.0.1', function() {
        console.log("Start transform");
        var pyInput = (
            "./transform/models/" + selectStyle + "/$" +
            "./public/data/contents/" + filename + "$" +
            "./public/data/outputs/" + filename
        )
        client.write(pyInput);
    });
    client.on('data', function(data) {
        console.log(data.toString('ascii'));
        client.destroy(); // kill client after server's response
    });
    var promise = new Promise((resolve, reject) => {
        client.on('error', function(data) {
            console.log("Connection Refused");
            reject("System is busy, please try again later!");
        });
        client.on('close', function() {
            resolve(imgData)
        });
    })
    return promise
}

function createPythonProcess(){
    const spawn = require("child_process").spawn;
    const transform = spawn("python", ["./transform/transform.py"]);
    var promise = new Promise((resolve, reject) => {
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
            console.log("python process exit with " + code);
            reject(new Error("python process exit with " + code));
        });
    });
    return promise
}

function init(){
    createPythonPromise = createPythonProcess();
    if (!fs.existsSync("./public/data/contents")){
        fs.mkdirSync("./public/data/contents");
    }

    if (!fs.existsSync("./public/data/outputs")){
        fs.mkdirSync("./public/data/outputs");
    }
}

var path = require('path'),
    Jimp = require("jimp"),
    fs = require("fs"),
    net = require('net');

var IMAGE_MAX_SIZE = 1024;  // max(width, height)
var createPythonPromise;
module.exports = {init: init, transformImage: transformImage, convertImage: convertImage};