const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, schemaValidatior} = require("../middleware.js");





//Index Route : All List of posts
router.get("/", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));



//New Route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("./listings/new.ejs");
});

//Show Route : Detailed Information About List
router.get("/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listingData){
        req.flash("error", "Such Listing Does Not Exists");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listingData});
}));

//Create Route : Add new Listing
router.post("/", isLoggedIn, schemaValidatior, wrapAsync(async(req,res) => {
    const listing1 = new Listing(req.body.Listing);
    listing1.owner = req.user._id;
    await listing1.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

//Edit Route : Edit listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listingData});
}));

//update route
router.put("/:id",isLoggedIn,isOwner, schemaValidatior, wrapAsync(async (req,res) => {
    if(!req.body.Listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success", "Updated Successfully");
    res.redirect(`/listings/${ id }`);
}));



//Delete Route : Delete Listing
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));




// app.get("/testlisting", async(req,res) => {
//     let sampleListing = new listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price: 1200,
//         location:"Kolkata",
//         country:"India" 
//     });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successfull Testing");
// });

// Fallback route for all unmatched paths
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });



module.exports = router;
