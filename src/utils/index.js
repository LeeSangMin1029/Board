import moment from "moment";

const utils = {};
utils.asyncWrap = (asyncFn) => {
  return async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

utils.dateFormatting = ({ date, formatString }) => {
  if (!date || !formatString) return "";
  return moment(date).format(formatString);
};

utils.getPageCount = (postLength, limit) => {
  return Math.floor(postLength / limit + (postLength % limit ? 1 : 0));
};

utils.isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

utils.isNotLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
};

utils.noPermission = (req, res) => {
  req.logout();
  res.redirect("/login");
};

export default utils;
