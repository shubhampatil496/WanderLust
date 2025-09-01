const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

//Schema Validation Using joi server, side validation 
const schemaValidatior = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

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
        res.redirect("/listings");
    }
    console.log(listingData)
    res.render("./listings/show.ejs", {listingData});
}));


router.post("/", schemaValidatior, wrapAsync(async(req,res) => {
    const listing1 = new Listing(req.body.Listing);
    await listing1.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

//Edit Route : Edit listing
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listingData});
}));

router.put("/:id",isLoggedIn, schemaValidatior, wrapAsync(async (req,res) => {
    if(!req.body.Listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success", "Updated Successfully");
    res.redirect(`/listings/${ id }`);
}));



//Delete Route : Delete Listing
router.delete("/:id",isLoggedIn, wrapAsync(async (req,res) => {
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
