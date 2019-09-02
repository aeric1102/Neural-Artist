var express = require("express"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    User = require("./mongoose_models/user"),
    app = express(),
    http = require("http").createServer(app),
    io = require("socket.io")(http);

require("dotenv").config();

// Routing
var indexRoutes = require("./routes/index"),
    createRoutes = require("./routes/create"),
    exploreRoutes = require("./routes/explore"),
    commentsRoutes = require("./routes/comments"),
    usersRoutes = require("./routes/users"),
    chatsRoutes = require("./routes/chats");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

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
app.use("/explore/:id/comments", commentsRoutes);
app.use("/users/:id", usersRoutes);
app.use("/chats", chatsRoutes);





var Chat = require("./mongoose_models/chat");
io.on("connection", function(socket){
    // console.log("a user connected to chatting room");
    socket.on("disconnect", function() {
        //console.log("a user disconnected from the chatting room");
    });
    socket.on("message", function(message){
        socket.broadcast.emit("received", message);
        var author = message.author 
        var chat = {
            text: message.text,
            author: {
                id: (author.id) ? author.id._id : null,
                username: author.username
            }
        }
        Chat.create(chat, function(err, chat){
            if(err){
                console.log(err);
            }
        });
    });
});



const port = process.env.PORT || 3000;
http.listen(port, function(){
    console.log("server started");
});