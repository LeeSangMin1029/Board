import User from "../models/User";
import utils from "../utils";

const renderRegisterForm = (req, res, next) => {
  try {
    return res.render("users/register");
  } catch (err) {
    return next(err);
  }
};

const createUser = utils.asyncWrap(async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    await user.save();
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const renderUser = utils.asyncWrap(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.object_id }).lean();
    const payload = { ...user };
    payload.createdAt = utils.dateFormatting({
      date: payload.createdAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    });
    if (typeof payload.updatedAt !== "undefined") {
      payload.updatedAt = utils.dateFormatting({
        date: payload.updatedAt,
        formatString: "YYYY-MM-DD HH:mm:ss",
      });
    }
    return res.render("users/show", { user: payload });
  } catch (err) {
    return next(err);
  }
});

const renderEditUser = utils.asyncWrap(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.object_id }).lean();
    return res.render("users/edit", { user: user });
  } catch (err) {
    return next(err);
  }
});

const updateUser = utils.asyncWrap(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.object_id }).select(
      "password"
    );
    user.originalPassword = user.password;
    user.password = req.body.newPassword ? req.body.newPassword : user.password;
    user.updatedAt = Date.now();
    for (const p in req.body) user[p] = req.body[p];
    await user.save();
    return res.json({ response: { success: true } });
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

export {
  renderUser,
  renderEditUser,
  renderRegisterForm,
  createUser,
  updateUser,
};
