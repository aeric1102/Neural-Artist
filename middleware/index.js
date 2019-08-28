var Post = require("../mongoose_models/post"),
    Comment = require("../mongoose_models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.isLoggedInAjax = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.json({
        redirect: "/login"
    });
}


middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, post){
            if(err){
                req.flash("error", "A server error occurred: Unable to process your request")
                console.log(err);
                return res.redirect("/explore/" + req.params.id);
            }
            if(post.author.id.equals(req.user._id) || req.user.isAdmin){
                return next();
            } 
            req.flash("error", "You don't have permission.");
            return res.redirect("/explore/" + req.params.id);
        });
        return;
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err){
                req.flash("error", "A server error occurred: Unable to process your request")
                console.log(err);
                return res.redirect("/explore/" + req.params.id);
            }
            if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                return next();
            } 
            req.flash("error", "You don't have permission.");
            return res.redirect("/explore/" + req.params.id);
        });
        return;
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}


middlewareObj.checkProfileOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user._id.equals(req.params.id)){
            return next();
        }
        req.flash("error", "You don't have permission.");
        return res.redirect("/users/" + req.params.id);
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnershipAjax = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err){
                req.flash("error", "A server error occurred: Unable to process your request")
                console.log(err);
                return res.json({
                    redirect: "/explore/" + req.params.id
                });
            }
            if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                return next();
            } 
            req.flash("error", "You don't have permission.");
            return res.json({
                redirect: "/explore/" + req.params.id
            });
        });
        return;
    }
    req.flash("error", "Please login first!");
    res.json({
        redirect: "/login"
    });
}

module.exports = middlewareObj;