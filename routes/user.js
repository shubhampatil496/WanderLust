const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//render signup form
router.get("/signup", userController.renderSignupForm);

//Signup route
router.post("/signup", wrapAsync(userController.signup));

//render login form
router.get("/login", userController.renderLoginForm);

//login route
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//Logout user
router.get("/logout", userController.logout);

module.exports = router;
