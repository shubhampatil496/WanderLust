const Listing = require("../models/listing.js");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeCoordinates = (listingPayload) => {
  if (!listingPayload || !listingPayload.coordinates) return listingPayload;

  const lat = Number(listingPayload.coordinates.lat);
  const lng = Number(listingPayload.coordinates.lng);
  const hasValidCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

  if (!hasValidCoordinates) {
    delete listingPayload.coordinates;
    return listingPayload;
  }

  listingPayload.coordinates = { lat, lng };
  return listingPayload;
};

module.exports.index = async (req, res) => {
  const searchQuery = (req.query.q || "").trim();
  let allListings = [];
  let notFound = false;

  if (searchQuery) {
    const exactTitleRegex = new RegExp(`^${escapeRegex(searchQuery)}$`, "i");
    const exactMatchListing = await Listing.findOne({ title: exactTitleRegex });

    if (exactMatchListing) {
      return res.redirect(`/listings/${exactMatchListing._id}`);
    }

    notFound = true;
  } else {
    allListings = await Listing.find({});
  }

  res.render("./listings/index.ejs", { allListings, searchQuery, notFound });
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

module.exports.searchSuggestions = async (req, res) => {
  const query = (req.query.q || "").trim();

  if (!query) {
    return res.json([]);
  }

  const searchRegex = new RegExp(escapeRegex(query), "i");
  const listings = await Listing.find({
    $or: [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
    ],
  })
    .select("title location country")
    .limit(8);

  const suggestions = listings.map((listing) => ({
    id: listing._id,
    title: listing.title,
    location: listing.location,
    country: listing.country,
  }));

  res.json(suggestions);
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const listingPayload = normalizeCoordinates(req.body.Listing);

  const listing1 = new Listing(listingPayload);
  listing1.owner = req.user._id;
  listing1.image = {url, filename};
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
  const listingPayload = normalizeCoordinates(req.body.Listing);
  let listing = await Listing.findByIdAndUpdate(id, { ...listingPayload });

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
