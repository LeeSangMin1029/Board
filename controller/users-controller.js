import User from "../models/User.js";
import * as util from "../utils.js";

const renderUsers = util.asyncWrap(async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.render("users/index", { users: users });
  } catch (err) {
    return res.send(err);
  }
});

const renderRegisterForm = (req, res) => {
  return res.render("users/register");
};

const createUser = util.asyncWrap(async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    await user.save();
    return res.json({ redirect: true });
  } catch (err) {
    return res.json({ errors: util.errorHandler(err) });
  }
});

export { getUsers, renderRegisterForm, createUser };
