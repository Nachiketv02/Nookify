const express = require("express");
const router = express.Router();
const Listing = require("../Model/listing");
const Booking = require("../Model/booking");
const User = require("../Model/user");

const { isAdmin } = require("../middleware");

// Dashboard
router.get("/dashboard", isAdmin, async (req, res) => {
  const totalListings = await Listing.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalUsers = await User.countDocuments();

  res.render("admin/dashboard", {
    totalListings,
    totalBookings,
    totalUsers,
  });
});

// Manage Listings
router.get("/listings", isAdmin, async (req, res) => {
  const listings = await Listing.find();
  res.render("admin/listings", { listings });
});

router.get("/listings/new", isAdmin, (req, res) => {
  res.render("admin/newListing");
});

router.post("/listings", isAdmin, async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  req.flash("success", "Listing added successfully");
  res.redirect("/admin/listings");
});

router.get("/listings/:id/edit", isAdmin, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("admin/editListing", { listing });
});

router.put("/listings/:id", isAdmin, async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body);
  req.flash("success", "Listing updated successfully");
  res.redirect("/admin/listings");
});

router.delete("/listings/:id", isAdmin, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/admin/listings");
});

// Manage Bookings
router.get("/bookings", isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("listingP") 
      .populate("author");

    res.render("admin/bookings", { bookings });
  } catch (error) {
    req.flash("error", "Error fetching bookings");
    res.redirect("/admin/dashboard");
  }
});


// Manage Users
router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find();
  res.render("admin/users", { users });
});

module.exports = router;
