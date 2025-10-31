const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listingData = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listingData) {
    req.flash("error", "Such Listing Does Not Exists");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listingData });
};

module.exports.createListing = async (req, res, next) => {
  // let url = req.file;
  // let filename = req.file.filename;

  const listing1 = new Listing(req.body.Listing);
  listing1.owner = req.user._id;
  // listing1.image = {url, filename};
  await listing1.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listingData = await Listing.findById(id);
  if(!listingData){
    req.flash("error", "Listing does  not exixts");
    res.redirect("/listings");
  }
  let originalImageUrl = listingData.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listingData, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.Listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
  }

  req.flash("success", "Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
