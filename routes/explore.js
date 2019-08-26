var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    User = require("../mongoose_models/user"),
    Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment"),
    moment = require("moment");

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
            req.flash("error", err.message)
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
            // !!!Need to modify to reverse date!!!
            options: {sort: {$natural: -1}},
            populate: {
                path: "author.id", 
                select: "avatar"
            }
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
        User.findById(req.user._id, "avatar", function(err, user){
            if(err){
                req.flash("error", "Something went wrong")
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
                    req.flash("error", "Something went wrong")
                    return res.json({
                        redirect: "/explore/"+req.params.id
                    });
                }
                comment.save();
                post.comments.push(comment);
                post.save();
                comment = comment.toObject() // from mongoose document to JavaScript object
                comment.author.avatar = user.avatar;
                comment.date = moment(comment.date).fromNow();
                res.json(comment);
            });
        });
    });
});

router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            req.flash("error", err.message)
            return res.redirect("/explore");
        }
        res.render("explore/edit", {page: "explore", post: post});
    });
});

router.put("/:id", middleware.checkPostOwnership, function(req, res){
    update_obj = {description: req.body.description};
    Post.findByIdAndUpdate(req.params.id, update_obj, function(err, post){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.redirect("/explore/" + req.params.id);
    });
});

router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, post){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/explore");
        }
        Comment.deleteMany({
            _id: {
                $in: post.comments
            }
        }, function(err, comments){
            if(err){
                req.flash("error", err.message);
                return res.redirect("/explore");
            }
            res.redirect("/explore");
        });
    });
});

module.exports = router