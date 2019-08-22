var express = require("express"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    User = require("./mongoose_models/user"),
    app = express();

require("dotenv").config()

// Routing
var indexRoutes = require("./routes/index"),
    createRoutes = require("./routes/create"),
    exploreRoutes = require("./routes/explore");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport config
app.use(session({
    secret: "Being a Artist",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    next();
})


app.use("/", indexRoutes);
app.use("/create", createRoutes);
app.use("/explore", exploreRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("server started");
});