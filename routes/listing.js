const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggenIn, isOwner, validateListing } = require("../middleware.js");

const { cloudinary, storage } = require("../cloudCofig.js");
const multer = require("multer");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(validateListing, wrapAsync(listingController.index))
  .post(
    isLoggenIn,
    upload.single("listings[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// create listing route (render new form)
router.get("/new", isLoggenIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(validateListing, wrapAsync(listingController.showListing))
  .put(
    isLoggenIn,
    isOwner,
    upload.single("listings[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggenIn, isOwner, wrapAsync(listingController.destroyListing));

// edit  route
router.get(
  "/:id/edit",
  isLoggenIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
