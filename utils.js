import moment from "moment";

const asyncWrap = (asyncFn) => {
  return async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

// title : message, body : message의 꼴로 만드는 함수
const errorHandler = (errors) => {
  const parsed = {};
  if (errors.name == "ValidationError") {
    for (const name in errors.errors) {
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

const dateFormatting = ({ date, formatString }) => {
  return moment(date).format(formatString);
};

const getPageCount = (postLength, limit) => {
  return Math.floor(postLength / limit + (postLength % limit ? 1 : 0));
};

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

const noPermission = (req, res) => {
  req.logout();
  res.redirect("/login");
};

export {
  errorHandler,
  dateFormatting,
  getPageCount,
  asyncWrap,
  isLogged,
  noPermission,
};
