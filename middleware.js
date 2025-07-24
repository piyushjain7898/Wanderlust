const { cursorTo } = require("readline");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");


 module.exports.isLoggenIn = (req,res,next)=>{
    
    if(! req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be logged in");
        return res.redirect("/login");
    }
    next();
 }

 module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
 }

 module.exports.isOwner = async(req, res, next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)    
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`)
    }
    next();
 }
  module.exports.isReviewAuthor = async(req, res, next)=>{
    const {id , reviewId} = req.params;
    const review = await Review.findById(reviewId)    
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
 }

 module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, message);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, message);
  } else {
    next();
  }
};
