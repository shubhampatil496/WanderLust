const express = require("express");
const app  = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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
app.get("/listings", async (req,res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req,res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", async(req,res) => {
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
});

//Edit Route : Edit listing
app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("./listings/edit.ejs", {listingData});
});

app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route : Delete Listing
app.delete("/listing/:id", async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Show Route : Detailed Information About List
app.get("/listings/:id", async (req,res) => {
    let { id } = req.params;
    const listingData = await listing.findById(id);
    res.render("./listings/show.ejs", {listingData});
});


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



app.listen(8080, () => {
    console.log("server is listening on port 8080");
});