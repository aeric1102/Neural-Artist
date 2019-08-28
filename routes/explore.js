var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    cloudinary = require("cloudinary").v2,
    User = require("../mongoose_models/user"),
    Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment");

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    req.session.current_url = req.originalUrl;
    Post.find({}, null, {limit: 10000, sort: {"date": -1}}, function(err, posts){
        if(err){
            req.flash("error", "A server error occurred: Unable to find the page")
            console.log(err);
            return res.redirect("back");
        }
        res.render("explore/index", {page: "explore", posts: posts});
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var post = req.body.post;
    post.description = req.body.description;
    post.author = author;
    Post.create(post, function(err, post){
        if(err){
            req.flash("error", "A server error occurred: Unable to create your post")
            console.log(err);
            return res.redirect("/explore");
        }
        // Successfully post, 
        // remove stored data created by users.
        delete req.session.post
        res.redirect("/explore");
    });
});

router.get("/new", function(req, res){
    req.session.current_url = req.originalUrl;
    // When a user create an image,
    // the data will be recorderd in the session. 
    // So, when the user goes to other pages, the data won't lose.
    // When the user post the data, it will be deleted.
    var post = req.flash("imgData")[0]
    console.log(post);
    if (!post){
        if (typeof(req.session.post) !== "undefined" && req.session.post){
            res.render("explore/new", {page: "explore", post: req.session.post});
        }
        else{
            res.redirect("/create");
        }
    }
    else{
        // new data come from create.js
        req.session.post = post;
        res.render("explore/new", {page: "explore", post: post});
    }
});

router.get("/:id", function(req, res){
    req.session.current_url = req.originalUrl;
    Post.findById(req.params.id).
        populate("author.id", "avatar").
        populate({
            path: "comments",
            options: {sort: {"date": -1}},
            populate: {
                path: "author.id", 
                select: "avatar"
            }
        }).
        exec(function(err, post){
            if(err){
                req.flash("error", "A server error occurred: Unable to find the page")
                console.log(err);
                return res.redirect("/explore");
            }
            res.render("explore/show", {page: "explore", post: post});
        });
});

router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            req.flash("error", "A server error occurred: Unable to find the page")
            return res.redirect("/explore");
        }
        res.render("explore/edit", {page: "explore", post: post});
    });
});

router.put("/:id", middleware.checkPostOwnership, function(req, res){
    update_obj = {description: req.body.description};
    Post.findByIdAndUpdate(req.params.id, update_obj, function(err, post){
        if(err){
            req.flash("error", "A server error occurred: Unable to update your post");
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("/explore/" + req.params.id);
    });
});

router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, post){
        if(err){
            req.flash("error", "A server error occurred: Unable to delete your post");
            console.log(err);
            return res.redirect("/explore");
        }
        Comment.deleteMany({
            _id: {
                $in: post.comments
            }
        }, function(err, comments){
            if(err){
                console.log(err);
                return res.redirect("/explore");
            }
            //Delete image from cloudinary
            var contentImgPublicId = post.contentImg.substring(
                post.contentImg.indexOf("neuralartist/")).slice(0, -4); // trim .jpg
            var resultImgPublicId = post.resultImg.substring(
                post.resultImg.indexOf("neuralartist/")).slice(0, -4); // trim .jpg
            cloudinary.uploader.destroy(contentImgPublicId, function(err, result) {
                if(err){
                    console.log(err)
                }
            });
            cloudinary.uploader.destroy(resultImgPublicId, function(err, result) {
                if(err){
                    console.log(err)
                }
            });
            res.redirect("/explore");
        });
    });
});

module.exports = router