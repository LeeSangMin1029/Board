import User from "../models/User";
import utils from "../utils";

const renderRegisterForm = (req, res) => {
  return res.render("users/register");
};

const createUser = utils.asyncWrap(async (req, res) => {
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
    return res.json({ errors: utils.errorHandler(err) });
  }
});

const renderUser = utils.asyncWrap(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.object_id }).lean();
    const payload = { ...user };
    payload.createdAt = utils.dateFormatting({
      date: payload.createdAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    });
    payload.updatedAt = utils.dateFormatting({
      date: payload.updatedAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    });
    return res.render("users/show", { user: payload });
  } catch (err) {
    return res.send(err);
  }
});

const renderEditUser = utils.asyncWrap(async (req, res) => {
  // 아이디, 이름, 이메일, 사진, 생성날짜, 수정날짜, 비밀번호 입력창 띄우기
  try {
    const user = await User.findOne({ _id: req.params.object_id }).lean();
    return res.render("users/edit", { user: user });
  } catch (err) {
    return res.send(err);
  }
});

const updateUser = utils.asyncWrap(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.object_id }).select(
      "password"
    );
    user.originalPassword = user.password;
    user.password = req.body.newPassword ? req.body.newPassword : user.password;
    for (const p in req.body) user[p] = req.body[p];
    await user.save();
    return res.json({ redirect: true });
  } catch (err) {
    console.error(err);
    return res.json({ errors: utils.errorHandler(err) });
  }
});

export {
  renderUser,
  renderEditUser,
  renderRegisterForm,
  createUser,
  updateUser,
};