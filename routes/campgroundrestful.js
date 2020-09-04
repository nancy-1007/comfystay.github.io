let express = require("express");
let router = express(),
    Camp = require("../models/campground"),
    middleware = require("../middleware/index");

// INDEX ROUTE -- show all campgrounds
// ------------------------------------
router.get("/", (req, res) => {
    Camp.find({}, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.render("campgrounds", { campgrounds: camp, currentUser: req.user });
        }
    });
});

// CREATE ROUTE -- add new campgrounds to the db
// ---------------------------------------------
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: name, image: image, price: price, description: desc, author: author };

    Camp.create(newCampground, (err, camp) => {
        if (err) {
            console.log("error in post", +err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// NEW ROUTE -- show form to create new campground
//  ----------------------------------------------
router.get("/add", middleware.isLoggedIn, (req, res) => {
    res.render("addcampgrounds")
});

//SHOW ROUTE -- shows more info about a particalur campground
//-----------------------------------------------------------
router.get("/:id", (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCampgrounds) => {
        if (err) {
            res.redirect("/");
            req.flash("error", "Oops!!!,something went wrong");
            console.log(err)

        } else {
            res.render("shows", { campgrounds: foundCampgrounds })
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.campOwnership, (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { campgrounds: camp })
        }
    })
})

//UPDATE ROUTE
router.put("/:id", middleware.campOwnership, (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body.campgrounds, (err, updatedcamp) => {
        if (err) {
            console.log(err);
            res.redirect("/")
        } else {

            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //     Camp.findById(req.params.id, (err, foundcamp) => {
    //         if (err) {
    //             console.log(err)
    //             res.redirect("/campgrounds");
    //         } else {
    //             foundcamp.update(req.body.campgrounds, (err, updatecamp) => {
    //                 console.log(updatecamp);
    //                 res.redirect("/campgrounds/" + req.params.id);
    //             })
    //         } })
});

//DESTROY ROUTE 
router.delete("/:id", middleware.campOwnership, (req, res) => {
    Camp.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds");
        }
    })
});
module.exports = router;