const Listing = require("./Model/listing.js");
const Review = require("./Model/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");

//to check user is login or not passport's isAuthenticated method is use
module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the property!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMSG = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMSG)
    }
    else{
        next();
    } 
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMSG = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMSG)
    }
    else{
        next();
    }
};

module.exports.isreviewAuthor = async (req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you did't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to check if the user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
    req.flash("error", "You do not have permission to access this page");
    res.redirect("/");
  };
  