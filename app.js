if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app  = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.render("listing"); // homepage
});




const dbUrl=process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("Connect Successfully");
})
.catch(err => {
    console.log(err);
});

async function main() {
    mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter : 24 * 3600,
});

store.on("error", () => {

})

//Session Options : 
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge : 1000 * 60 * 60 * 24 * 3,
        httpOnly : true
    }
};


//Use Sessions : 
app.use(session(sessionOptions));
//use Flash : 
app.use(flash());

//Iniialize Passport for Authentication : 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"myusername"
//     });
//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// });

//Create Flash : 
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);


// Global error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs",{message});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});