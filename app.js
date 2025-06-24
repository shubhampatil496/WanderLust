const express = require("express");
const app  = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");


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
app.use(express.static(path.join(__dirname, "public")));
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