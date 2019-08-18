var express = require("express"),
    router = express.Router(),
    upload = require("../middleware/upload"),
    transformImage = require("../transform/transform");


router.get("/", function(req, res){
    res.render("home", {contentImgPath: "./stylesheets/image-placeholder.jpg", 
        selectStyle: "wave", resultImgPath: "#"});
});

router.post("/", upload.single("selectContent"), async function (req, res, next) {
    home_input = await transformImage(req.file.path, req.body.selectStyle);
    res.render("home", home_input);
})

module.exports = router;