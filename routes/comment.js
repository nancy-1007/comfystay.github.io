let express = require("express"),
    router = express.Router({ mergeParams: true });
let Comment = require("../models/comment"),
    Camp = require("../models/campground"),
    middleware = require("../middleware/index");


//=============================COMMENT ROUTE====================================

//NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("newcomment", { campgrounds: campgrounds });
        }
    })

});

//COMMENT ADDING
router.post("/", middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, campgrounds) => {
        if (err) {
            res.render("campgrounds/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {

                if (err) {
                    console.log("there is an error")
                    console.log(err);
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    campgrounds.comments.push(comment);

                    campgrounds.save()
                    res.redirect("/campgrounds/" + campgrounds.id);
                }
            })
        }
    })
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.commentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("editComment", { campground_id: req.params.id, comment: foundComment })
        }
    })
})

//UPDATE ROUTE
router.put("/:comment_id", middleware.commentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



//DELETE ROUTE
router.delete("/:comment_id", middleware.commentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})



module.exports = router;