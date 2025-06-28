const express = require("express");
const app  = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


main()
.then(() => {
    console.log("Connect Successfully");
})
.catch(err => {
    console.log(err);
});

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get("/", (req,res) => {
    res.send("working");
});

//Index Route : All List of posts
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", wrapAsync(async(req,res) => {
    const {title,description,image,price,location,country} = req.body;
    const listing1 = new listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country
    });
    await listing1.save();
    res.redirect("/listings");
}));

//Edit Route : Edit listing
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("./listings/edit.ejs", {listingData});
}));

app.put("/listings/:_id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route : Delete Listing
app.delete("/listings/:_id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Show Route : Detailed Information About List
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listingData = await listing.findById(id);
    res.render("./listings/show.ejs", {listingData});
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

// Global error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});