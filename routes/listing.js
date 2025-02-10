const express = require("express");
const router = express.Router();
const Listing = require("../Model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//Index Route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedin, listingController.renderNewForm);

//search
router.get("/search", async (req, res) => {
  const { query } = req.query;
  
  try {
    // Find listings that match the search term in title, location, or country
    const listings = await Listing.find({
      $or: [
        { title: new RegExp(query, "i") },
        { location: new RegExp(query, "i") },
        { country: new RegExp(query, "i") }
      ]
    });
    
    // Render the search results page with the listings
    res.render("listings/searchResults", { listings, query });
  } catch (error) {
    req.flash("error", "Error occurred while searching. Please try again.");
    res.redirect("/listings");
  }
});


//show Route
router.get("/:id", wrapAsync(listingController.showListing));

//create new route
router.post(
  "/",
  /*validateListing,*/ isLoggedin,
  upload.single("listings[image]"),
  wrapAsync(listingController.createListing)
);


//edit
router.get(
  "/:id/edit",
  isLoggedin,
  wrapAsync(listingController.randerEditForm)
);

//update
router.put(
  "/:id",
  /*validateListing,*/ isLoggedin,
  isOwner,
  upload.single("listings[image]"),
  wrapAsync(listingController.updateListing)
);

//delete
router.delete("/:id", isLoggedin, wrapAsync(listingController.destroyListing));

module.exports = router;
