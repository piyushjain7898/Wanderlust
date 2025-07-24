const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
.get(usersController.renderSignup )
.post( wrapAsync(usersController.signUp));

router.route("/login")
.get(usersController.renderLogin)
.post(saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, successFlash: "Welcome back to wandurlust",  }),
  usersController.login
);

router.get("/logout", usersController.logout);

module.exports = router;
