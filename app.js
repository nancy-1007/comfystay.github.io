let express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Camp = require("./models/campground"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStratergy = require("passport-local");
let flash = require('connect-flash')
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

// seedDb = require("./seeds"); // seeds database

// CALLIING ROUTES
let campgroundroutes = require("./routes/campgroundrestful"),
    commentRoutes = require("./routes/comment"),
    landingRoutes = require("./routes/landing");


// CONNECTING MONGOOSE
mongoose.connect("mongodb://localhost/camp_app_2", { useNewUrlParser: true }, { useUnifiedTopology: true })
// mongoose.connect("mongodb+srv://nancy:clas@mate10@comfystay.irisv.mongodb.net/nancy?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ etended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method")) //METHOD OVERRIDE

//SESSION
app.use(require("express-session")({
    secret: "shark are dangerous",
    resave: false,
    saveUninitialized: false
}));
//FLASH MESSAGE
app.use(flash())

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//CURRENT USER
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.warning = req.flash("warning");
    res.locals.success = req.flash("success");
    next();
});

//USING ROUTES
app.use("/campgrounds", campgroundroutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(landingRoutes)


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStratergy(User.authenticate()));

// app.listen(2001, () => {
//     console.log("someone has started the server '2001'")
// }); 
app.listen(port);
