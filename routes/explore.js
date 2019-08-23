var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment");

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    // !!!Need to modify to reverse date!!!
    Post.find({}, null, {sort: {$natural: -1}}, function(err, posts){
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
    // When the user post the data, it will be deleted.
    var imgData = req.flash("imgData")[0]
    if (!imgData){
        if (typeof(req.session.imgData) !== "undefined" && req.session.imgData){
            res.render("explore/new", {page: "explore", imgData: req.session.imgData});
        }
        else{
            res.redirect("/create");
        }
    }
    else{
        // new data come from create.js
        req.session.imgData = imgData;
        res.render("explore/new", {page: "explore", imgData: imgData});
    }
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var post = {
        contentImg: req.body.contentImg,
        selectStyle: req.body.selectStyle,
        resultImg: req.body.resultImg,
        description: req.body.description,
        author: author
    }
    Post.create(post, function(err, post){
        if(err){
            req.flash("error", err.message)
            return res.redirect("/explore");
        }
        // Successfully post, 
        // remove stored data created by users.
        delete req.session.imgData
        res.redirect("/explore");
    });
});

router.get("/:id", function(req, res){
    req.session.current_url = req.originalUrl;
    Post.findById(req.params.id).
        populate({
            path: "comments",
            // !!!Need to modify to reverse date!!!
            options: {sort: {$natural: -1}}
        }).
        exec(function(err, post){
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