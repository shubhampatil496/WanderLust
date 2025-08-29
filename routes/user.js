const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync (async (req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.login(registerdUser,(err) => {
            if(err){
                return next(err)
            }
                req.flash("success", "WelCome to Wanderlust");
                res.redirect("/listings");
        })
       
    } catch(err){
       req.flash("error", err.message); 
       res.redirect("/signup");
    }
}));

//Login Routes
router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash : true,
    }), 
    async(req,res) => {
    req.flash("success", "Login Successfully");
    res.redirect(res.locals.redirectUrl || "/listings");
});

//Logout user

router.get("/logout", (req,res) => {
    req.logOut((err) => {
        if(err){
            next(err)
        }
        req.flash("success","Logout Successfully");
        res.redirect("/listings");
    })
})

module.exports = router;