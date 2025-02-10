if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Model/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("./schema.js");
// const Review = require("./Model/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js")
const calculateTotalPrice = require('./utils/calculatePrice.js');
const Booking = require("./Model/booking.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const searchRoute = require("./routes/listing.js");
const adminRoutes = require("./routes/admin");

app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//mongo
const MONGO_URL = "mongodb://127.0.0.1:27017/nookify";
main().then(() => {
    console.log("Database connection successful!!!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


//session
const sessionoption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};
app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);
app.use("/listings", listingsRoute);
app.use("/admin", adminRoutes);

//booking
app.get("/listings/:id/booking",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("booking/book.ejs",{listing});
});

app.post('/book', async (req, res) => {
    const { listingId, checkIn, checkOut, mobile, adult, child } = req.body;

    // Validate mobile
    if (!mobile) {
        req.flash("error", "Mobile number is required");
        return res.redirect(`/listings/${listingId}/booking`);
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        req.flash("error", "Invalid check-in or check-out date");
        return res.redirect(`/listings/${listingId}/booking`);
    }

    if (checkOutDate <= checkInDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/listings/${listingId}/booking`);
    }

    try {
        // Find listing by ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect(`/listings/${listingId}/booking`);
        }

        // Check if the property is already booked for the given dates
        const conflictingBooking = await Booking.findOne({
            listingP: listingId,
            $or: [
                { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
            ]
        });

        if (conflictingBooking) {
            req.flash("error", "Property is already booked for the selected dates");
            return res.redirect(`/listings/${listingId}/booking`);
        }

        // Calculate the total price using your utility function
        const totalPrice = calculateTotalPrice(listing.price, checkInDate, checkOutDate);

        if (isNaN(totalPrice) || totalPrice < 0) {
            req.flash("error", "Invalid total price calculation");
            return res.redirect(`/listings/${listingId}/booking`);
        }

        // Save the booking
        const booking = new Booking({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            mobile,
            adult,
            child,
            totalPrice,
            listingP: listingId,
            author: req.user._id // Assuming the user is logged in
        });

        let bookInfo = await booking.save();
        // res.redirect(`/listings/${listingId}`);
        res.render('booking/showbook.ejs',{bookInfo});
        req.flash("success", "Booking successful!");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect(`/listings/${listingId}/booking`);
    }
});


app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next) => {
    let {statusCode=500 , message="Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("err.ejs", {message});
});

app.listen(8080 , () => {
    console.log("Server connected!!");
});