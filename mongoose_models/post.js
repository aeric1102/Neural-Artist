var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    contentImg: String,
    selectStyle: String,
    resultImg: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        avatar: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Post", postSchema);