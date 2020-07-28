import passport from "../config/passport.js";
import * as util from "../utils.js";

const renderHome = util.asyncWrap(async (req, res) => {
  return res.render("home/main");
});

const renderLoginForm = util.asyncWrap(async (req, res) => {
  return res.render("home/login");
});

const userLogin = (req, res) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.json(err);
    }
    const errors = {};
    errors.email = !req.body.email
      ? { message: "email is required!" }
      : undefined;
    errors.password = !req.body.password
      ? { message: "password is required!" }
      : undefined;
    if (
      typeof errors.email !== "undefined" ||
      typeof errors.password !== "undefined"
    ) {
      return res.json({ errors: errors });
    }

    if (
      !(Object.keys(info.errors).length === 0 && info.constructor === Object)
    ) {
      return res.json({ errors: info.errors });
    }
    return req.login(user, (err) => {
      if (err) {
        return res.json(err);
      }
      return res.json({ redirect: true });
    });
  })(req, res);
};

const userLogout = (req, res) => {
  req.logout();
  return res.redirect("/");
};

export { renderHome, renderLoginForm, userLogin, userLogout };
