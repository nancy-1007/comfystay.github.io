let express = require("express"),
    router = express(),
    User = require("../models/user"),
    passport = require("passport"),
    LocalStratergy = require("passport-local");

// INDEX ROUTE
router.get("/", (req, res) => {
    res.render("landing")
});

//==============AUTH ROUTES===============
//SIGN UP
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Hi " + user.username + ", Welcome to the campgrounds page")
            console.log(user.username);
            res.redirect("/campgrounds")
        })
    });
});

//LOGIN ROUTE
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), () => {
})

//LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("warning", "You have logged out");
    res.redirect("/");
});

module.exports = router;