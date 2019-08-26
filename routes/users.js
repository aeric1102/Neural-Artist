var express = require("express"),
    router = express.Router({mergeParams: true}),
    middleware = require("../middleware"),
    User = require("../mongoose_models/user"),
    Post = require("../mongoose_models/post"),
    fs = require("fs"),
    upload = require("../middleware/upload"),
    cloudinary = require("cloudinary").v2,
    convertImage = require("../transform/transform").convertImage;

// user profile
router.get("/", function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.redirect("back");
        }
        Post.find().where("author.id").equals(user._id).exec(function(err, posts){
            if(err){
                req.flash("error", err.message)
                return res.redirect("back");
            }
            res.render("users/show", {page: "profile", user: user, posts:posts});
        });
    });
});

router.get("/edit", middleware.checkProfileOwnership, function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.redirect("back");
        }
        res.render("users/edit", {page: "profile", user: user});
    });
});


router.put("/", middleware.checkProfileOwnership, 
           upload.single("avatar"), async function(req, res){
    if (req.file == null){ // no image file
        User.findByIdAndUpdate(req.params.id, req.body.user, function(err, post){
            if(err){
                req.flash("error", err.message);
                return res.redirect("/users/" + req.params.id);
            }
            return res.redirect("/users/" + req.params.id);
        });
        return;
    }
    // process image file, then update database
    var filename = await convertImage(req.file.path);
    var filepath = "./public/data/contents/" + filename;
    cloudinary.uploader.upload(filepath, 
                               {folder: "neuralartist/avatar/"}, 
                               function(err, result){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/users/" + req.params.id);
        }
        fs.unlink(filepath, err => {
            if(err){
                console.log("delete file error");
            }
        });
        update_user = req.body.user;
        update_user.avatar = result.secure_url;
        // Complete upload image to cloud, 
        // start to save data in database.
        User.findByIdAndUpdate(req.params.id, update_user, function(err, post){
            if(err){
                req.flash("error", err.message);
                return res.redirect("/users/" + req.params.id);
            }
            res.redirect("/users/" + req.params.id);
        });
    });
});
module.exports = router;