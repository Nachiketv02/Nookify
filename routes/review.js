const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Model/listing.js");
const Review = require("../Model/review.js");
const { validateReview, isLoggedin, isreviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//review
//post review route
router.post("/", validateReview,isLoggedin,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedin,isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;