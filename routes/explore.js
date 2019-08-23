var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment");

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    Post.find({}, function(err, posts){
        if(err){
            req.flash("error", err.message)
            return res.redirect("back");
        }
        res.render("explore/index", {page: "explore", posts: posts});
    })
});

router.get("/new", function(req, res){
    req.session.current_url = req.originalUrl;
    // When a user create an image,
    // the data will be recorderd in the session. 
    // So, when the user goes to other pages, the data won't lose.
    // If the user recreate the data, it will be refreshed.
    var imgData = req.flash("imgData")[0]
    if (!imgData){
        if (typeof(req.session.imgData) !== "undefined" && req.session.imgData){
            res.render("explore/new", req.session.imgData);
        }
        else{
            res.redirect("/create");
        }
    }
    else{
        // new data come from create.js
        imgData.page = "explore";
        req.session.imgData = imgData;
        res.render("explore/new", imgData);
    }
});

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
            req.flash("error", err.message)
            return res.redirect("/explore");
        }
        res.redirect("/explore");
    });
});

router.get("/:id", function(req, res){
    req.session.current_url = req.originalUrl;
    Post.findById(req.params.id).populate("comments").exec(function(err, post){
        if(err){
            req.flash("error", "Unable to find the page")
            return res.redirect("/explore");
        }
        res.render("explore/show", {page: "explore", post: post});
    });
});



router.post("/:id", middleware.isLoggedInAjax, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            req.flash("error", "Unable to find the page")
            return res.json({
                redirect: "/explore/"+req.params.id
            });
        }
        var comment = {
            text: req.body.comment,
            author:{
                id: req.user._id,
                username: req.user.username
            }
        }
        Comment.create(comment, function(err, comment){
            if(err){
                console.log(err);
                req.flash("error", "Something went wrong")
                return res.json({
                    redirect: "/explore/"+req.params.id
                });
            }
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            post.comments.push(comment);
            post.save();
            res.json(comment);
        });
    });
});

module.exports = router