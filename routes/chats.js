var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    User = require("../mongoose_models/user"),
    Chat = require("../mongoose_models/chat");

var MessagesCount = 100;

router.get("/", function(req, res){
    res.render("chats/index", {page: "chats"});
});

router.get("/messages", function(req, res){
    Chat.find({}, null, {limit: MessagesCount, sort: {"date": -1}})
        .populate("author.id", "avatar")
        .exec(function(err, chats){
            if(err){
                console.log(err);
                return res.json({"error": true});
            }
            res.json(chats.reverse());
    });
});

module.exports = router