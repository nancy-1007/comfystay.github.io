let mongoose = require("mongoose");

let campSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("campground", campSchema);
