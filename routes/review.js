const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/Review.js")
const {reviewValidatior} = require("../middleware.js")




//Reviews Post Route
router.post("/",reviewValidatior, wrapAsync(async (req,res) => {
    let listingData = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listingData.reviews.push(newReview);

    await newReview.save();
    await listingData.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${ listingData.id }`);
}));

//Reviews Delete Route
router.delete("/:reviewId",wrapAsync(async (req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}))


module.exports = router;