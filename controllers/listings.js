const Listing = require("../Model/listing.js");
const mbxGoecoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGoecoding({ accessToken: mapToken });

//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

//new listing
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//show listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

//createlisting
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listings.location,
      limit: 2,
    }).send();
    
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listings);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geomatry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//edit listing
module.exports.randerEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};

//update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Upadated!!");
  res.redirect(`/listings/${id}`);
};

//delete listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
