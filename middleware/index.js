let middlewareObj = {},
    Camp = require("../models/campground"),
    Comment = require("../models/comment")

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You have to SIGNUP first");
    res.redirect("/register");
};

middlewareObj.campOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, (err, camp) => {
            if (err) {
                req.flash("error", "Something went wrong")
                res.redirect("/")
            } else {
                if (camp.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("warning", "You can't do that")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("warning", "You have to be loggedin to do that");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

middlewareObj.commentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("/");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You can't do that")
                    res.redirect('/campgrounds/' + req.params.id);
                }
            }
        })
    } else {
        req.flash("warning", "You have to be logged in to do that");
        res.render("login")
    }
}


module.exports = middlewareObj
