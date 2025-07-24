const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const { reviewSchema } = require("../schema.js");
const { validateReview, isLoggenIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");


// Reviews routes
router.post(
  "/",isLoggenIn,
  validateReview,
  wrapAsync(reviewController.reviewRoute)
);
// delete review route
router.delete(
  "/:reviewId", isLoggenIn, isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);
// Export the router
module.exports = router;
