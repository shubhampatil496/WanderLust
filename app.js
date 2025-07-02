const express = require("express");
const app  = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/Review.js")


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

const reviewValidatior = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

//Index Route : All List of posts
app.get("/listings", schemaValidatior, wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

//Show Route : Detailed Information About List
app.get("/listings/:id", schemaValidatior, wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", {listingData});
}));

//New Route
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", schemaValidatior, wrapAsync(async(req,res) => {
    const {title,description,image,price,location,country} = req.body;
    const listing1 = new Listing({
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
app.get("/listings/:id/edit", schemaValidatior, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listingData});
}));

app.put("/listings/:id", schemaValidatior, wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${ id }`);
}));

//Delete Route : Delete Listing
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
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


//Reviews Route
app.post("/listings/:id/reviews",reviewValidatior, wrapAsync(async (req,res) => {
    let listingData = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listingData.reviews.push(newReview);

    await newReview.save();
    await listingData.save();

    res.redirect(`/listings/${ listingData.id }`);
}));

// Global error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs",{message});
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});