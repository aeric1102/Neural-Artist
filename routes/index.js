var express = require("express"),
    router = express.Router(),
    User = require("../mongoose_models/user"),
    passport = require("passport");


router.get("/", function(req, res){
    res.redirect("/create");
});

router.get("/register", function(req, res){
    res.render("register", {page: "register"});
})

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        })
    });
})

router.get("/login", function(req, res){
    res.render("login", {page: "login"});
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;