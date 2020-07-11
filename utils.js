const moment = require("moment");

// const wrapper = (asyncFn) => {
//   return async (req, res, next) => {
//     try {
//       return await asyncFn(req, res, next);
//     } catch (error) {
//       return next(error);
//     }
//   };
// };

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

const dateFormatting = (dateObject) => {
  const { date, formatString } = dateObject;
  if (date) {
    return moment(date).format(formatString);
  } else {
    return "";
  }
};

// function once(fn, context) {
//   let result;

//   // 최종적으로 return 값은 result가 된다.
//   return function () {
//     if (fn) {
//       // apply는 js의 표준내장객체이다. 자세한 건 더 알아봐야겠다.
//       result = fn.apply(context || this, arguments);
//       fn = null;
//     }

//     return result;
//   };
// }

module.exports = {
  errorHandler: errorHandler,
  dateFormatting: dateFormatting,
  // once: once,
};
