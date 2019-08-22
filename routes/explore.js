var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Post = require("../mongoose_models/post");


router.get("/", function(req, res){
    Post.find({}, function(err, posts){
        if(err){
            return console.log(err); 
        }
        res.render("explore/index", {page: "explore", posts: posts});
    })
});

router.get("/new", function(req, res){
    var imgData = req.flash("imgData")[0]
    if (!imgData){
        res.redirect("/");
    }
    else{
        imgData.page = "explore";
        res.render("explore/new", imgData);
    }
});
// test
// router.get("/new", function(req, res){
//     res.render("explore/new", {
//             page: "explore",
//             stateMessage: "success",
//             contentImgPath: "/data/contents/1565956857186.jpg",
//             selectStyle: "wave",
//             resultImgPath: "/data/outputs/1565956857186.jpg"
//     });
// });

router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var post = {
        contentImg: req.body.contentImgPath,
        selectStyle: req.body.selectStyle,
        resultImg: req.body.resultImgPath,
        description: req.body.description,
        author: author
    }
    Post.create(post, function(err, post){
        if(err){
            return console.log(err);
        }
        res.redirect("/explore");
    });
});

router.get("/:id", function(req, res){
    res.render("explore/show", {page: "explore"});
});

module.exports = router