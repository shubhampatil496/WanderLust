const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//Signup Router.route
router
  .route("/signup")
  //render signup form
  .get(userController.renderSignupForm)
  //Signup route
  .post(wrapAsync(userController.signup));
//

//login router.route
router
  .route("/login")
  //render login form
  .get(userController.renderLoginForm)
  //login route
  .post(
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
