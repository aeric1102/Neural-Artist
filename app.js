var express = require("express"),
    app = express();

var homeRoutes = require("./routes/home");



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/", homeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("server started");
});