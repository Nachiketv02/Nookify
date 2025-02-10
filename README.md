# Nookify

Nookify is a web application for listing and booking properties. This README provides an overview of the available endpoints and their functionalities.

## Table of Contents

- Endpoints
  - Listings
  - Reviews
  - Users
  - Admin
  - Booking
- Authentication
  - Endpoints
  - Middleware
  - Configuration
  - User Model
- Example Requests

## Endpoints

### Listings

- **GET /listings**: Retrieve all listings.
- **GET /listings/new**: Render form to create a new listing.
- **POST /listings**: Create a new listing.
- **GET /listings/:id**: Retrieve a specific listing by ID.
- **GET /listings/:id/edit**: Render form to edit a listing.
- **PUT /listings/:id**: Update a specific listing by ID.
- **DELETE /listings/:id**: Delete a specific listing by ID.
- **GET /listings/search**: Search for listings by query.

### Reviews

- **POST /listings/:id/reviews**: Create a new review for a listing.
- **DELETE /listings/:id/reviews/:reviewId**: Delete a specific review by ID.

### Users

- **GET /signup**: Render signup form.
- **POST /signup**: Register a new user.
- **GET /login**: Render login form.
- **POST /login**: Log in a user.
- **GET /logout**: Log out the current user.

### Admin

- **GET /admin/dashboard**: Admin dashboard with statistics.
- **GET /admin/listings**: Manage listings.
- **GET /admin/listings/new**: Render form to create a new listing.
- **POST /admin/listings**: Create a new listing.
- **GET /admin/listings/:id/edit**: Render form to edit a listing.
- **PUT /admin/listings/:id**: Update a specific listing by ID.
- **DELETE /admin/listings/:id**: Delete a specific listing by ID.
- **GET /admin/bookings**: Manage bookings.
- **GET /admin/users**: Manage users.

### Booking

- **GET /listings/:id/booking**: Render booking form for a listing.
- **POST /book**: Create a new booking.

## Authentication

### Endpoints

#### User Signup

- **GET /signup**: Render the signup form.
- **POST /signup**: Register a new user.

#### User Login

- **GET /login**: Render the login form.
- **POST /login**: Log in a user.

#### User Logout

- **GET /logout**: Log out the current user.

### Middleware

#### `isLoggedin`

This middleware checks if a user is logged in before allowing access to certain routes.

```js
// filepath: routes/review.js
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

