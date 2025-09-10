const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, schemaValidatior} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


//Index Route : All List of posts
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route : Detailed Information About List
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route : Add new Listing
router.post("/", isLoggedIn, schemaValidatior, wrapAsync(listingController.createListing));

//Edit Route : Edit listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner, schemaValidatior, wrapAsync(listingController.updateListing));

//Delete Route : Delete Listing
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;


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




