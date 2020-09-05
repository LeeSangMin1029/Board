import passport from "../config/passport";
import utils from "../utils";

const renderHome = utils.asyncWrap(async (req, res, next) => {
  try {
    return res.render("home/main");
  } catch (err) {
    return next(err);
  }
});

const renderLoginForm = utils.asyncWrap(async (req, res, next) => {
  try {
    return res.render("home/login");
  } catch (err) {
    return next(err);
  }
});

const userLogin = (req, res) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.json({ errors: err });
    }
    const errors = {};
    const { email, password } = req.body;
    if (!user) {
      if (email === "") errors.email = "Email is required!";
      if (password === "") errors.password = "Password is required!";
      else {
        errors.global = info.errors;
      }
      return res.json({ errors: errors });
    }
    return req.login(user, (err) => {
      if (err) {
        return res.json({ errors: err });
      }
      return res.json({ response: true });
    });
  })(req, res);
};

const userLogout = (req, res) => {
  req.logout();
  return res.redirect("/");
};

export { renderHome, renderLoginForm, userLogin, userLogout };
