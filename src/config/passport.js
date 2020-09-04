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
      try {
        const user = await User.findOne({ email: email }).select({
          password: 1,
        });
        if (!user) {
          return done(null, false, {
            errors: "Email and Password you entered does not exist",
          });
        } else {
          if (!(await user.authenticate(password))) {
            return done(null, false, {
              errors: "Email and Password you entered does not exist.",
            });
          }
        }
        return done(null, user, { response: true });
      } catch (err) {
        return done(null, false);
      }
    }
  )
);

export default passport;
