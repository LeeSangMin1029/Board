import passport from "passport";
import passLocal from "passport-local";
import User from "../models/User";

passport.serializeUser(function (user, done) {
  return done(null, user._id);
});

// request 요청시 매번 호출한다.
passport.deserializeUser(async function (object_id, done) {
  try {
    const user = await User.findOne({ _id: object_id });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(
  "local",
  new passLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      let user;
      let errors = {};
      try {
        user = await User.findOne({ email: email }).select({
          password: 1,
        });
        if (!user) {
          errors.email = { message: "Invalid email" };
        } else {
          if (!(await user.authenticate(password))) {
            errors.password = { message: "Invalid password" };
          }
        }
        return done(null, user, { errors: errors });
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

export default passport;
