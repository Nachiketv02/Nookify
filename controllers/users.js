const User = require("../Model/user.js");

//render singup form
module.exports.randerSingUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

//singup
module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Nookify!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//login
module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to nookify!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
