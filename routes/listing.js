const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, schemaValidatior } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//Router.route = Chaining of all methods
router
  .route("/")
  //Index Route : All List of posts
  .get(wrapAsync(listingController.index))
  //Create Route : Add new Listing
  .post(
    isLoggedIn,
    schemaValidatior,
    wrapAsync(listingController.createListing)
  );
//End
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
//
router
  .route("/:id")
  //Show Route : Detailed Information About List
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    schemaValidatior,
    wrapAsync(listingController.updateListing)
  )
  //Delete Route : Delete Listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route : Edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

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
