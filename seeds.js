let mongoose = require("mongoose");
let Campground = require("./models/campground");
let Comment = require("./models/comment.js");


let data = [
    {
        name: "snowy mountains",
        image: "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2017/09/130.jpg",
        description: "mountains covered in snow gives u peace",
    }, {
        name: "camping ",
        image: "https://live.staticflickr.com/1769/42796467962_0ab387ee29_n.jpg",
        description: "Located in Hundar, The Mountain Camps provides accommodation with free WiFi. There is a seating and/or dining area in some units. A buffet breakfast is available every morning at the property. Guests can grab a bite to eat in the on-site restaurant, which serves Indian cuisine and also offers Vegetarian options. Both a bicycle rental service and a car rental service are available at the campsit"
    }


]

const seedsDB = () => {
    Campground.remove({}, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            Comment.remove({});
            console.log("removed campground");
        }
    });
    data.forEach((seed) => {
        Campground.create(seed, (err, camp) => {
            if (err) {
                console.log(err)

            } else {
                Comment.create({
                    text: "these are so beautiful mountains",
                    author: "miraz"
                }, (err, comment) => {
                    if (err) {
                        console.log(err);
                    } else {
                        camp.comments.push(comment);
                        camp.save();
                        // console.log(comment);
                    }
                })
            }
        })
    })

}

module.exports = seedsDB;
