var express = require("express"),
    router = express.Router({mergeParams: true}),
    middleware = require("../middleware"),
    User = require("../mongoose_models/user"),
    Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment"),
    moment = require("moment");



router.post("/", middleware.isLoggedInAjax, function(req, res){
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
                post.comments.push(comment._id);
                post.save();
                comment = comment.toObject() // from mongoose document to JavaScript object
                comment.author.avatar = user.avatar;
                comment.date = moment(comment.date).fromNow();
                comment.post_id = req.params.id;
                res.json(comment);
            });
        });
    });
});


router.delete("/:commentId", middleware.checkCommentOwnershipAjax, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            req.flash("error", "Something went wrong");
            return res.json({
                redirect: "/explore/"+req.params.id
            });
        }
        Post.findByIdAndUpdate(req.params.id, {
            $pull: {
                comments: comment._id
            }
        }, function(err, post){
            if(err){
                console.log(err);
            }
            return res.json({success: true});
        })
    });
});

module.exports = router