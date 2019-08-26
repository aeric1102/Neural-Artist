var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: "/stylesheets/avatar-placeholder.jpg"},
    name: String,
    email: String,
    bio: String,
    date: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);